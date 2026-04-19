import reportWebVitals from './reportWebVitals';

describe('reportWebVitals', () => {
    test('does nothing when called with no argument', () => {
        expect(() => reportWebVitals()).not.toThrow();
    });

    test('does nothing when called with a non-function argument', () => {
        expect(() => reportWebVitals('not a function')).not.toThrow();
    });

    test('does nothing when called with null', () => {
        expect(() => reportWebVitals(null)).not.toThrow();
    });

    test('invokes the function-callback branch without throwing', () => {
        const callback = jest.fn();
        expect(() => reportWebVitals(callback)).not.toThrow();
    });
});
