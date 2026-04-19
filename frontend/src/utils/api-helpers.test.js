import { buildQueryString, handleApiError } from './api-helpers';

describe('buildQueryString', () => {
    test('returns empty string for empty params object', () => {
        expect(buildQueryString({})).toBe('');
    });

    test('builds query string from valid params', () => {
        const result = buildQueryString({ city: 'LA', limit: 20 });
        expect(result).toContain('city=LA');
        expect(result).toContain('limit=20');
    });

    test('excludes null values', () => {
        const result = buildQueryString({ city: null, limit: 20 });
        expect(result).not.toContain('city');
        expect(result).toContain('limit=20');
    });

    test('excludes undefined values', () => {
        const result = buildQueryString({ city: undefined, limit: 20 });
        expect(result).not.toContain('city');
    });

    test('excludes empty string values', () => {
        const result = buildQueryString({ city: '', limit: 20 });
        expect(result).not.toContain('city');
    });

    test('includes zero as a valid value', () => {
        const result = buildQueryString({ offset: 0, limit: 20 });
        expect(result).toContain('offset=0');
    });

    test('includes multiple valid params', () => {
        const result = buildQueryString({ a: '1', b: '2', c: '3' });
        expect(result).toContain('a=1');
        expect(result).toContain('b=2');
        expect(result).toContain('c=3');
    });

    test('filters multiple empty values while keeping valid ones', () => {
        const result = buildQueryString({ city: null, zip: '', beds: 3 });
        expect(result).not.toContain('city');
        expect(result).not.toContain('zip');
        expect(result).toContain('beds=3');
    });
});

describe('handleApiError', () => {
    test('returns error.message when present', () => {
        const error = new Error('Network error');
        expect(handleApiError(error)).toBe('Network error');
    });

    test('returns default fallback when error has no message', () => {
        expect(handleApiError({})).toBe('An error occurred');
    });

    test('uses custom fallback message when provided', () => {
        expect(handleApiError({}, 'Custom fallback')).toBe('Custom fallback');
    });

    test('returns error.message over the custom fallback', () => {
        const error = new Error('Specific error');
        expect(handleApiError(error, 'Fallback')).toBe('Specific error');
    });
});
