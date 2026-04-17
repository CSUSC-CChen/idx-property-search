import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';
describe('Pagination', () => {
    test('renders pagination controls', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

        // Use /text/i to match substrings and ignore case
        expect(screen.getByText(/Previous/i)).toBeInTheDocument();
        expect(screen.getByText(/Next/i)).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });
    test('disables Previous button on first page', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
        const prevButton = screen.getByText('← Previous');
        expect(prevButton).toBeDisabled();
    });
    test('disables Next button on last page', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);
        const nextButton = screen.getByText('Next →');
        expect(nextButton).toBeDisabled();
    });
    test('calls onPageChange when Next is clicked', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange}/>);
        const nextButton = screen.getByText('Next →');
        fireEvent.click(nextButton);
        expect(onPageChange).toHaveBeenCalledWith(3);
    });
    test('calls onPageChange when Previous is clicked', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
        const prevButton = screen.getByText('← Previous');
        fireEvent.click(prevButton);
        expect(onPageChange).toHaveBeenCalledWith(2);
    });
    test('calls onPageChange when page number is clicked', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
        const page3Button = screen.getByText('3');
        fireEvent.click(page3Button);
        expect(onPageChange).toHaveBeenCalledWith(3);
    });
    test('highlights current page', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
        const page3Button = screen.getByText('3');
        expect(page3Button).toHaveClass('active');
    });
    test('does not render when totalPages is 1', () => {
        const onPageChange = jest.fn();
        const { container } = render(
            <Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    test('shows all page numbers when totalPages is 7 or fewer', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={1} totalPages={7} onPageChange={onPageChange} />);
        for (let i = 1; i <= 7; i++) {
            expect(screen.getByText(String(i))).toBeInTheDocument();
        }
        expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    test('shows leading pages and ellipsis when currentPage <= 4 and totalPages > 7', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={2} totalPages={20} onPageChange={onPageChange} />);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
        expect(screen.getByText('...')).toBeInTheDocument();
    });

    test('shows trailing pages and ellipsis when currentPage is near the last page', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={18} totalPages={20} onPageChange={onPageChange} />);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('16')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
        expect(screen.getByText('...')).toBeInTheDocument();
    });

    test('shows middle window with two ellipsis when currentPage is in the middle', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={10} totalPages={20} onPageChange={onPageChange} />);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('9')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('11')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
        expect(screen.getAllByText('...')).toHaveLength(2);
    });

    test('handlePrevious guard: does not call onPageChange when canGoPrev is false', () => {
        const onPageChange = jest.fn();
        const { container } = render(
            <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
        );
        const prevButton = container.querySelectorAll('.pagination-btn')[0];
        prevButton.removeAttribute('disabled');
        fireEvent.click(prevButton);
        expect(onPageChange).not.toHaveBeenCalled();
    });

    test('handleNext guard: does not call onPageChange when canGoNext is false', () => {
        const onPageChange = jest.fn();
        const { container } = render(
            <Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />
        );
        const nextButton = container.querySelectorAll('.pagination-btn')[1];
        nextButton.removeAttribute('disabled');
        fireEvent.click(nextButton);
        expect(onPageChange).not.toHaveBeenCalled();
    });
});