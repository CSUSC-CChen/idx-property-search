import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListingsPage from './ListingsPage';
import { fetchProperties } from '../api/client';

jest.mock('../api/client');

jest.mock('../components/PropertyCard', () =>
    function MockPropertyCard({ property }) {
        return <div data-testid="property-card">{property.L_ListingID}</div>;
    }
);

jest.mock('../components/Pagination', () =>
    function MockPagination({ currentPage, onPageChange }) {
        return (
            <div data-testid="pagination">
                <button onClick={() => onPageChange(currentPage + 1)}>Next Page</button>
            </div>
        );
    }
);

jest.mock('../components/PropertyFilters', () =>
    function MockPropertyFilters({ onSearch }) {
        return (
            <div data-testid="property-filters">
                <button onClick={() => onSearch({ L_City: 'LA' })}>Filter Search</button>
            </div>
        );
    }
);

const renderPage = () =>
    render(
        <MemoryRouter>
            <ListingsPage />
        </MemoryRouter>
    );

const mockResults = (count, total) => ({
    results: Array.from({ length: count }, (_, i) => ({ L_ListingID: `P${i}` })),
    total,
});

describe('ListingsPage', () => {
    beforeEach(() => {
        jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('shows loading state while fetching', () => {
        fetchProperties.mockReturnValue(new Promise(() => {}));
        renderPage();
        expect(screen.getByText('Loading properties...')).toBeInTheDocument();
    });

    test('hides loading after fetch completes', async () => {
        fetchProperties.mockResolvedValue(mockResults(0, 0));
        renderPage();
        await waitFor(() => {
            expect(screen.queryByText('Loading properties...')).not.toBeInTheDocument();
        });
    });

    test('shows error message on fetch failure', async () => {
        fetchProperties.mockRejectedValue(new Error('Network failure'));
        renderPage();
        await waitFor(() => {
            expect(screen.getByText('Failed to load properties. Please try again.')).toBeInTheDocument();
        });
    });

    test('does not show results summary while loading', () => {
        fetchProperties.mockReturnValue(new Promise(() => {}));
        renderPage();
        expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    });

    test('does not show results summary when there is an error', async () => {
        fetchProperties.mockRejectedValue(new Error('err'));
        renderPage();
        await waitFor(() => screen.getByText(/Failed to load/));
        expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    });

    test('shows "No properties found" when results array is empty', async () => {
        fetchProperties.mockResolvedValue(mockResults(0, 0));
        renderPage();
        await waitFor(() => {
            expect(screen.getByText('No properties found.')).toBeInTheDocument();
        });
    });

    test('renders a PropertyCard for each result', async () => {
        fetchProperties.mockResolvedValue(mockResults(3, 3));
        renderPage();
        await waitFor(() => {
            expect(screen.getAllByTestId('property-card')).toHaveLength(3);
        });
    });

    test('shows results summary with correct range', async () => {
        fetchProperties.mockResolvedValue(mockResults(20, 100));
        renderPage();
        await waitFor(() => {
            expect(screen.getByText(/Showing/)).toBeInTheDocument();
            expect(screen.getByText(/100/)).toBeInTheDocument();
        });
    });

    test('renders Pagination when results are present', async () => {
        fetchProperties.mockResolvedValue(mockResults(20, 100));
        renderPage();
        await waitFor(() => {
            expect(screen.getByTestId('pagination')).toBeInTheDocument();
        });
    });

    test('does not render Pagination when results are empty', async () => {
        fetchProperties.mockResolvedValue(mockResults(0, 0));
        renderPage();
        await waitFor(() => {
            expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
        });
    });

    test('scrolls to top when changing page', async () => {
        fetchProperties.mockResolvedValue(mockResults(20, 100));
        renderPage();
        await waitFor(() => screen.getByTestId('pagination'));
        fetchProperties.mockResolvedValue(mockResults(20, 100));
        fireEvent.click(screen.getByText('Next Page'));
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    test('re-fetches with new filters when onSearch is called', async () => {
        fetchProperties.mockResolvedValue(mockResults(0, 0));
        renderPage();
        await waitFor(() => screen.getByTestId('property-filters'));

        fetchProperties.mockResolvedValue(mockResults(1, 1));
        fireEvent.click(screen.getByText('Filter Search'));

        await waitFor(() => {
            expect(fetchProperties).toHaveBeenCalledWith(
                expect.objectContaining({ L_City: 'LA', offset: 0 })
            );
        });
    });

    test('does not show sort order dropdown when no sort field is selected', async () => {
        fetchProperties.mockResolvedValue(mockResults(0, 0));
        renderPage();
        await waitFor(() => screen.getByLabelText('Sort by:'));
        expect(screen.queryByText('Ascending')).not.toBeInTheDocument();
    });

    test('shows Price labels in sort order dropdown when sortBy is price', async () => {
        fetchProperties.mockResolvedValue(mockResults(0, 0));
        renderPage();
        await waitFor(() => screen.getByLabelText('Sort by:'));

        fetchProperties.mockResolvedValue(mockResults(0, 0));
        fireEvent.change(screen.getByLabelText('Sort by:'), { target: { value: 'price' } });

        expect(screen.getByText('Price: Low to High')).toBeInTheDocument();
        expect(screen.getByText('Price: High to Low')).toBeInTheDocument();
    });

    test('shows Ascending/Descending labels for non-price sort fields', async () => {
        fetchProperties.mockResolvedValue(mockResults(0, 0));
        renderPage();
        await waitFor(() => screen.getByLabelText('Sort by:'));

        fetchProperties.mockResolvedValue(mockResults(0, 0));
        fireEvent.change(screen.getByLabelText('Sort by:'), { target: { value: 'size' } });

        expect(screen.getByText('Ascending')).toBeInTheDocument();
        expect(screen.getByText('Descending')).toBeInTheDocument();
    });

    test('includes sortBy and sortOrder in fetch params when sort field is set', async () => {
        fetchProperties.mockResolvedValue(mockResults(0, 0));
        renderPage();
        await waitFor(() => screen.getByLabelText('Sort by:'));

        fetchProperties.mockResolvedValue(mockResults(0, 0));
        fireEvent.change(screen.getByLabelText('Sort by:'), { target: { value: 'price' } });

        await waitFor(() => {
            expect(fetchProperties).toHaveBeenCalledWith(
                expect.objectContaining({ sortBy: 'price', sortOrder: 'DESC' })
            );
        });
    });

    test('omits sortBy from params when no sort field is selected', async () => {
        fetchProperties.mockResolvedValue(mockResults(0, 0));
        renderPage();
        await waitFor(() => {
            const lastCall = fetchProperties.mock.calls[fetchProperties.mock.calls.length - 1][0];
            expect(lastCall).not.toHaveProperty('sortBy');
        });
    });

    test('changing sort order re-fetches with new order', async () => {
        fetchProperties.mockResolvedValue(mockResults(0, 0));
        renderPage();
        await waitFor(() => screen.getByLabelText('Sort by:'));

        fetchProperties.mockResolvedValue(mockResults(0, 0));
        fireEvent.change(screen.getByLabelText('Sort by:'), { target: { value: 'price' } });
        await waitFor(() => screen.getByText('Price: High to Low'));

        fetchProperties.mockResolvedValue(mockResults(0, 0));
        fireEvent.change(screen.getByDisplayValue('Price: High to Low'), { target: { value: 'ASC' } });

        await waitFor(() => {
            expect(fetchProperties).toHaveBeenCalledWith(
                expect.objectContaining({ sortOrder: 'ASC' })
            );
        });
    });
});
