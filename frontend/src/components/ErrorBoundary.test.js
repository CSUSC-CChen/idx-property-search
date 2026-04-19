import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = ({ shouldThrow }) => {
    if (shouldThrow) {
        throw new Error('Test render error');
    }
    return <div>Normal child content</div>;
};

describe('ErrorBoundary', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders children when no error occurs', () => {
        render(
            <ErrorBoundary>
                <div>Child content</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('Child content')).toBeInTheDocument();
        expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    test('renders error UI when a child throws', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText(/We're sorry for the inconvenience/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Refresh Page/i })).toBeInTheDocument();
    });

    test('does not render children when in error state', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow />
            </ErrorBoundary>
        );
        expect(screen.queryByText('Normal child content')).not.toBeInTheDocument();
    });

    test('calls console.error when catching a render error', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow />
            </ErrorBoundary>
        );
        expect(console.error).toHaveBeenCalledWith(
            'Error caught by boundary:',
            expect.any(Error),
            expect.anything()
        );
    });

    test('calls window.location.reload when Refresh Page is clicked', () => {
        const reloadMock = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true,
        });

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByRole('button', { name: /Refresh Page/i }));
        expect(reloadMock).toHaveBeenCalledTimes(1);
    });

    test('renders multiple children when no error', () => {
        render(
            <ErrorBoundary>
                <span>First</span>
                <span>Second</span>
            </ErrorBoundary>
        );
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
    });
});
