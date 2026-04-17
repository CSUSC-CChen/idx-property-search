import { safeParsePhotos } from './PhotoUtils';

describe('safeParsePhotos', () => {
    test('returns empty array for null', () => {
        expect(safeParsePhotos(null)).toEqual([]);
    });

    test('returns empty array for undefined', () => {
        expect(safeParsePhotos(undefined)).toEqual([]);
    });

    test('returns empty array for empty string', () => {
        expect(safeParsePhotos('')).toEqual([]);
    });

    test('returns empty array for non-string number', () => {
        expect(safeParsePhotos(42)).toEqual([]);
    });

    test('returns empty array for non-string object', () => {
        expect(safeParsePhotos({})).toEqual([]);
    });

    test('returns empty array for non-string array', () => {
        expect(safeParsePhotos(['photo.jpg'])).toEqual([]);
    });

    test('parses valid JSON array string', () => {
        expect(safeParsePhotos('["photo1.jpg","photo2.jpg"]')).toEqual(['photo1.jpg', 'photo2.jpg']);
    });

    test('returns empty array for invalid JSON string', () => {
        expect(safeParsePhotos('not-valid-json')).toEqual([]);
    });

    test('returns empty array when parsed JSON is an object, not an array', () => {
        expect(safeParsePhotos('{"url":"photo.jpg"}')).toEqual([]);
    });

    test('returns empty array when parsed JSON is a string', () => {
        expect(safeParsePhotos('"just a string"')).toEqual([]);
    });

    test('returns empty array when parsed JSON is null', () => {
        expect(safeParsePhotos('null')).toEqual([]);
    });

    test('returns empty array when parsed JSON is a number', () => {
        expect(safeParsePhotos('42')).toEqual([]);
    });

    test('returns empty array for valid empty JSON array', () => {
        expect(safeParsePhotos('[]')).toEqual([]);
    });

    test('returns single-element array', () => {
        expect(safeParsePhotos('["photo.jpg"]')).toEqual(['photo.jpg']);
    });
});
