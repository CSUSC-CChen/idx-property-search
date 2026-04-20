import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PropertyDetailPage from './PropertyDetailPage';
import { fetchPropertyDetail, fetchOpenHouses } from '../api/client';

jest.mock('../api/client');

const renderWithId = (id = '123') =>
    render(
        <MemoryRouter initialEntries={[`/property/${id}`]}>
            <Routes>
                <Route path="/property/:id" element={<PropertyDetailPage />} />
            </Routes>
        </MemoryRouter>
    );

const baseProperty = {
    L_ListingID: 'LIST123',
    L_SystemPrice: 750000,
    L_Address: '123 Main St',
    L_City: 'Los Angeles',
    L_State: 'CA',
    L_Zip: '90001',
    L_Keyword2: 3,
    LM_Dec_3: 2,
    LM_Int2_3: 1500,
    L_Type_: 'SingleFamilyResidence',
    L_Remarks: 'Beautiful home.',
    L_Photos: ['https://example.com/photo.jpg'],
};

describe('PropertyDetailPage', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('shows loading state while fetching', () => {
        fetchPropertyDetail.mockReturnValue(new Promise(() => {}));
        fetchOpenHouses.mockReturnValue(new Promise(() => {}));
        renderWithId();
        expect(screen.getByText('Loading property details...')).toBeInTheDocument();
    });

    test('renders price, address, and location after successful fetch', async () => {
        fetchPropertyDetail.mockResolvedValue(baseProperty);
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText(/750,000/)).toBeInTheDocument();
            expect(screen.getByText('123 Main St')).toBeInTheDocument();
            expect(screen.getByText('Los Angeles, CA 90001')).toBeInTheDocument();
        });
    });

    test('renders beds and baths stats', async () => {
        fetchPropertyDetail.mockResolvedValue(baseProperty);
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('3')).toBeInTheDocument();
            expect(screen.getByText('Bedrooms')).toBeInTheDocument();
            expect(screen.getByText('Bathrooms')).toBeInTheDocument();
        });
    });

    test('renders sqft stat when LM_Int2_3 is present', async () => {
        fetchPropertyDetail.mockResolvedValue(baseProperty);
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('1,500')).toBeInTheDocument();
            expect(screen.getByText('Sq Ft')).toBeInTheDocument();
        });
    });

    test('omits sqft stat when LM_Int2_3 is absent', async () => {
        fetchPropertyDetail.mockResolvedValue({ ...baseProperty, LM_Int2_3: null });
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.queryByText('Sq Ft')).not.toBeInTheDocument();
        });
    });

    test('renders property type with PascalCase formatting', async () => {
        fetchPropertyDetail.mockResolvedValue(baseProperty);
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('Single Family Residence')).toBeInTheDocument();
        });
    });

    test('omits type section when L_Type_ is absent', async () => {
        fetchPropertyDetail.mockResolvedValue({ ...baseProperty, L_Type_: null });
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.queryByText('Type:')).not.toBeInTheDocument();
        });
    });

    test('renders description when L_Remarks is present', async () => {
        fetchPropertyDetail.mockResolvedValue(baseProperty);
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('Beautiful home.')).toBeInTheDocument();
        });
    });

    test('omits description section when L_Remarks is absent', async () => {
        fetchPropertyDetail.mockResolvedValue({ ...baseProperty, L_Remarks: null });
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.queryByText('Description')).not.toBeInTheDocument();
        });
    });

    test('shows no-image placeholder when L_Photos is null', async () => {
        fetchPropertyDetail.mockResolvedValue({ ...baseProperty, L_Photos: null });
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('No image available')).toBeInTheDocument();
        });
    });

    test('shows open house date and time when openhouses is non-empty', async () => {
        fetchPropertyDetail.mockResolvedValue(baseProperty);
        fetchOpenHouses.mockResolvedValue({
            openhouses: [
                { OpenHouseDate: '2024-05-15T00:00:00', OH_StartTime: '10:00 AM', OH_EndTime: '12:00 PM' },
            ],
        });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('10:00 AM - 12:00 PM')).toBeInTheDocument();
        });
    });

    test('shows "No open houses scheduled" when openhouses is empty', async () => {
        fetchPropertyDetail.mockResolvedValue(baseProperty);
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('No open houses scheduled')).toBeInTheDocument();
        });
    });

    test('shows error message when fetch fails with an Error', async () => {
        fetchPropertyDetail.mockRejectedValue(new Error('Property not found'));
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('Property not found')).toBeInTheDocument();
        });
    });

    test('shows default error message when error has no message property', async () => {
        fetchPropertyDetail.mockRejectedValue({});
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('Failed to load property details')).toBeInTheDocument();
        });
    });

    test('shows Back to Listings button in error state', async () => {
        fetchPropertyDetail.mockRejectedValue(new Error('err'));
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Back to Listings/i })).toBeInTheDocument();
        });
    });

    test('Back to Listings button navigates to "/"', async () => {
        fetchPropertyDetail.mockRejectedValue(new Error('err'));
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true,
        });
        renderWithId();
        await waitFor(() => screen.getByRole('button', { name: /Back to Listings/i }));
        fireEvent.click(screen.getByRole('button', { name: /Back to Listings/i }));
        expect(window.location.href).toBe('/');
    });

    test('handles missing openhouses key in response gracefully', async () => {
        fetchPropertyDetail.mockResolvedValue(baseProperty);
        fetchOpenHouses.mockResolvedValue({});
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('No open houses scheduled')).toBeInTheDocument();
        });
    });

    test('renders nothing when fetchPropertyDetail resolves to null', async () => {
        fetchPropertyDetail.mockResolvedValue(null);
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        const { container } = renderWithId();
        await waitFor(() => {
            expect(screen.queryByText('Loading property details...')).not.toBeInTheDocument();
        });
        expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
        expect(container.querySelector('.property-detail-page')).not.toBeInTheDocument();
    });

    test('back arrow button calls window.history.back', async () => {
        const backMock = jest.fn();
        Object.defineProperty(window, 'history', { value: { back: backMock }, writable: true });
        fetchPropertyDetail.mockResolvedValue(baseProperty);
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => screen.getByText('← Back to Listings'));
        fireEvent.click(screen.getByText('← Back to Listings'));
        expect(backMock).toHaveBeenCalled();
    });

    test('shows no-image placeholder when L_Photos is null', async () => {
        fetchPropertyDetail.mockResolvedValue({ ...baseProperty, L_Photos: null });
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('No image available')).toBeInTheDocument();
        });
    });

    test('shows no-image placeholder when L_Photos is invalid JSON', async () => {
        // UPDATED: Testing the 'catch' block in safeParsePhotos
        fetchPropertyDetail.mockResolvedValue({
            ...baseProperty,
            L_Photos: 'not-a-json-string',
        });
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('No image available')).toBeInTheDocument();
        });
    });

    test('shows no-image placeholder when L_Photos is an empty JSON array', async () => {
        fetchPropertyDetail.mockResolvedValue({
            ...baseProperty,
            L_Photos: '[]',
        });
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });
        renderWithId();
        await waitFor(() => {
            expect(screen.getByText('No image available')).toBeInTheDocument();
        });
    });
    test('handles L_Photos as a JSON string correctly', async () => {
        const photoUrl = 'https://example.com/json-photo.jpg';
        fetchPropertyDetail.mockResolvedValue({
            ...baseProperty,
            L_Photos: JSON.stringify([photoUrl])
        });
        fetchOpenHouses.mockResolvedValue({ openhouses: [] });

        renderWithId();

        await waitFor(() => {
            const img = screen.getByRole('img');
            expect(img).toHaveAttribute('src', photoUrl);
        });
    });
});
