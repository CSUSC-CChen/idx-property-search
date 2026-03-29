import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Property Listings react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Property Listings/i);
  expect(linkElement).toBeInTheDocument();
});