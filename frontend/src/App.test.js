import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./pages/ListingsPage', () => () => <div>Mock Listings Page</div>);
jest.mock('./pages/PropertyDetailPage', () => () => <div>Mock Property Detail Page</div>);

describe('App', () => {
    afterEach(() => {
        window.history.pushState({}, '', '/');
    });

    test('renders the listings page at the root path', () => {
        render(<App />);
        expect(screen.getByText('Mock Listings Page')).toBeInTheDocument();
    });

    test('renders the property detail page at /property/:id', () => {
        window.history.pushState({}, '', '/property/123');
        render(<App />);
        expect(screen.getByText('Mock Property Detail Page')).toBeInTheDocument();
    });

    test('wraps content in the App div container', () => {
        const { container } = render(<App />);
        expect(container.querySelector('.App')).toBeInTheDocument();
    });
});