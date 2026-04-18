import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PropertyCard from './PropertyCard';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const baseProperty = {
    L_ListingID: 'LIST123',
    L_Address: '123 Main St',
    L_City: 'Los Angeles',
    L_State: 'CA',
    L_SystemPrice: 750000,
    L_Keyword2: 3,
    LM_Dec_3: 2,
    LM_Int2_3: 1500,
    L_Photos: '["https://example.com/photo.jpg"]',
};

const renderCard = (overrides = {}) =>
    render(
        <MemoryRouter>
            <PropertyCard property={{ ...baseProperty, ...overrides }} />
        </MemoryRouter>
    );

describe('PropertyCard', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        localStorage.clear();
    });

    test('renders price, address, city/state', () => {
        renderCard();
        expect(screen.getByText(/750,000/)).toBeInTheDocument();
        expect(screen.getByText('123 Main St')).toBeInTheDocument();
        expect(screen.getByText('Los Angeles, CA')).toBeInTheDocument();
    });

    test('renders beds and baths', () => {
        renderCard();
        expect(screen.getByText(/3 beds/)).toBeInTheDocument();
        expect(screen.getByText(/2 baths/)).toBeInTheDocument();
    });

    test('renders sqft when LM_Int2_3 is present', () => {
        renderCard();
        expect(screen.getByText(/1,500 sqft/)).toBeInTheDocument();
    });

    test('does not render sqft when LM_Int2_3 is absent', () => {
        renderCard({ LM_Int2_3: null });
        expect(screen.queryByText(/sqft/)).not.toBeInTheDocument();
    });

    test('renders cover photo when L_Photos contains a valid URL', () => {
        renderCard();
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
        expect(img).toHaveAttribute('alt', '123 Main St');
    });

    test('renders no-image placeholder when L_Photos is null', () => {
        renderCard({ L_Photos: null });
        expect(screen.getByText('No image available')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    test('renders no-image placeholder when L_Photos is empty JSON array', () => {
        renderCard({ L_Photos: '[]' });
        expect(screen.getByText('No image available')).toBeInTheDocument();
    });

    test('navigates to property detail page on card click', () => {
        renderCard();
        fireEvent.click(screen.getByText('123 Main St'));
        expect(mockNavigate).toHaveBeenCalledWith('/property/LIST123');
    });

    test('renders unfavorited heart button by default', () => {
        renderCard();
        const btn = screen.getByLabelText('Favorite');
        expect(btn).not.toHaveClass('active');
        expect(btn).toHaveTextContent('🤍');
    });

    test('renders favorited heart after toggling', () => {
        renderCard();
        const btn = screen.getByLabelText('Favorite');
        fireEvent.click(btn);
        expect(btn).toHaveClass('active');
        expect(btn).toHaveTextContent('❤️');
    });

    test('clicking the favorite button does not trigger navigation', () => {
        renderCard();
        fireEvent.click(screen.getByLabelText('Favorite'));
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('toggling favorite twice returns to unfavorited state', () => {
        renderCard();
        const btn = screen.getByLabelText('Favorite');
        fireEvent.click(btn);
        fireEvent.click(btn);
        expect(btn).not.toHaveClass('active');
        expect(btn).toHaveTextContent('🤍');
    });
});
