import { renderHook, act, waitFor } from '@testing-library/react';
import { useFavorites } from './useFavorites';

describe('useFavorites', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('initializes with empty favorites when localStorage is empty', () => {
        const { result } = renderHook(() => useFavorites());
        expect(result.current.favorites).toEqual([]);
    });

    test('loads saved favorites from localStorage on mount', async () => {
        localStorage.setItem('favoriteProperties', JSON.stringify(['123', '456']));
        const { result } = renderHook(() => useFavorites());
        await waitFor(() => {
            expect(result.current.favorites).toEqual(['123', '456']);
        });
    });

    test('adds a property to favorites via toggleFavorite', () => {
        const { result } = renderHook(() => useFavorites());
        act(() => {
            result.current.toggleFavorite('ABC');
        });
        expect(result.current.favorites).toContain('ABC');
    });

    test('removes a property when toggleFavorite is called for an existing favorite', () => {
        const { result } = renderHook(() => useFavorites());
        act(() => {
            result.current.toggleFavorite('ABC');
        });
        act(() => {
            result.current.toggleFavorite('ABC');
        });
        expect(result.current.favorites).not.toContain('ABC');
    });

    test('persists added favorites to localStorage', () => {
        const { result } = renderHook(() => useFavorites());
        act(() => {
            result.current.toggleFavorite('XYZ');
        });
        expect(localStorage.getItem('favoriteProperties')).toBe(JSON.stringify(['XYZ']));
    });

    test('persists removal to localStorage after toggling off', () => {
        const { result } = renderHook(() => useFavorites());
        act(() => {
            result.current.toggleFavorite('XYZ');
        });
        act(() => {
            result.current.toggleFavorite('XYZ');
        });
        expect(localStorage.getItem('favoriteProperties')).toBe(JSON.stringify([]));
    });

    test('can add multiple distinct favorites', () => {
        const { result } = renderHook(() => useFavorites());
        act(() => { result.current.toggleFavorite('A'); });
        act(() => { result.current.toggleFavorite('B'); });
        expect(result.current.favorites).toContain('A');
        expect(result.current.favorites).toContain('B');
    });

    test('isFavorite returns true for a favorited property', () => {
        const { result } = renderHook(() => useFavorites());
        act(() => {
            result.current.toggleFavorite('123');
        });
        expect(result.current.isFavorite('123')).toBe(true);
    });

    test('isFavorite returns false for a property that is not favorited', () => {
        const { result } = renderHook(() => useFavorites());
        expect(result.current.isFavorite('999')).toBe(false);
    });

    test('isFavorite returns false after a property is removed', () => {
        const { result } = renderHook(() => useFavorites());
        act(() => {
            result.current.toggleFavorite('123');
        });
        act(() => {
            result.current.toggleFavorite('123');
        });
        expect(result.current.isFavorite('123')).toBe(false);
    });

    test('handles invalid JSON in localStorage gracefully and logs error', () => {
        localStorage.setItem('favoriteProperties', 'not-valid-json');
        const { result } = renderHook(() => useFavorites());
        expect(result.current.favorites).toEqual([]);
        expect(console.error).toHaveBeenCalledWith(
            'Failed to parse favorites',
            expect.any(Error)
        );
    });
});
