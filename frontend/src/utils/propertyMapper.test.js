import { mapPropertyData } from './propertyMapper';

const fullRaw = {
    id: 1,
    L_ListingID: 'LIST123',
    L_DisplayId: 'MLS123',
    L_Status: 'Active',
    StandardStatus: 'Pending',
    L_SystemPrice: 500000,
    PreviousListPrice: 550000,
    L_Address: '123 Main St',
    L_AddressStreet: 'Main St',
    L_City: 'Los Angeles',
    L_State: 'CA',
    L_Zip: '90001',
    SubdivisionName: 'Sunrise Hills',
    LM_char10_70: 'Backup Sub',
    LMD_MP_Latitude: 34.05,
    LMD_MP_Longitude: -118.25,
    L_Keyword2: 3,
    LM_Dec_3: 2.5,
    LM_Int2_3: 1800,
    LotSizeAcres: 0.25,
    L_Keyword5: 2,
    YearBuilt: 1990,
    L_Type_: 'SingleFamilyResidence',
    L_Remarks: 'Beautiful home with ocean views.',
    L_Photos: '["photo1.jpg","photo2.jpg"]',
    PhotoCount: 2,
    ListAgentFullName: 'John Doe',
    LO1_OrganizationName: 'Realty Corp',
    up_date: '2024-01-01',
};

describe('mapPropertyData', () => {
    test('returns null for null input', () => {
        expect(mapPropertyData(null)).toBeNull();
    });

    test('returns null for undefined input', () => {
        expect(mapPropertyData(undefined)).toBeNull();
    });

    test('maps id and listing identifiers correctly', () => {
        const result = mapPropertyData(fullRaw);
        expect(result.id).toBe(1);
        expect(result.listingId).toBe('LIST123');
        expect(result.mlsNumber).toBe('MLS123');
    });

    test('prefers L_Status over StandardStatus', () => {
        const result = mapPropertyData(fullRaw);
        expect(result.status).toBe('Active');
    });

    test('falls back to StandardStatus when L_Status is absent', () => {
        const result = mapPropertyData({ StandardStatus: 'Pending' });
        expect(result.status).toBe('Pending');
    });

    test('maps price and displayPrice correctly', () => {
        const result = mapPropertyData(fullRaw);
        expect(result.price).toBe(500000);
        expect(result.displayPrice).toBe('$500,000');
    });

    test('sets price to 0 when L_SystemPrice is absent', () => {
        const result = mapPropertyData({});
        expect(result.price).toBe(0);
    });

    test('sets displayPrice to "Price Not Listed" when L_SystemPrice is absent', () => {
        const result = mapPropertyData({});
        expect(result.displayPrice).toBe('Price Not Listed');
    });

    test('maps previousPrice', () => {
        const result = mapPropertyData(fullRaw);
        expect(result.previousPrice).toBe(550000);
    });

    test('maps all location fields', () => {
        const result = mapPropertyData(fullRaw);
        expect(result.address).toBe('123 Main St');
        expect(result.street).toBe('Main St');
        expect(result.city).toBe('Los Angeles');
        expect(result.state).toBe('CA');
        expect(result.zip).toBe('90001');
        expect(result.lat).toBe(34.05);
        expect(result.lng).toBe(-118.25);
    });

    test('prefers SubdivisionName over LM_char10_70', () => {
        const result = mapPropertyData(fullRaw);
        expect(result.subdivision).toBe('Sunrise Hills');
    });

    test('falls back to LM_char10_70 when SubdivisionName is absent', () => {
        const result = mapPropertyData({ LM_char10_70: 'LakeView' });
        expect(result.subdivision).toBe('LakeView');
    });

    test('maps property specs', () => {
        const result = mapPropertyData(fullRaw);
        expect(result.beds).toBe(3);
        expect(result.baths).toBe(2.5);
        expect(result.sqft).toBe(1800);
        expect(result.lotSize).toBe(0.25);
        expect(result.garageSpaces).toBe(2);
        expect(result.yearBuilt).toBe(1990);
    });

    test('maps propertyType and remarks', () => {
        const result = mapPropertyData(fullRaw);
        expect(result.propertyType).toBe('SingleFamilyResidence');
        expect(result.remarks).toBe('Beautiful home with ocean views.');
    });

    test('parses photos and sets images, photoCount, and mainImage', () => {
        const result = mapPropertyData(fullRaw);
        expect(result.images).toEqual(['photo1.jpg', 'photo2.jpg']);
        expect(result.photoCount).toBe(2);
        expect(result.mainImage).toBe('photo1.jpg');
    });

    test('sets images to empty array and mainImage to undefined when no photos', () => {
        const result = mapPropertyData({ L_Photos: null });
        expect(result.images).toEqual([]);
        expect(result.mainImage).toBeUndefined();
    });

    test('sets photoCount to 0 when PhotoCount is absent', () => {
        const result = mapPropertyData({});
        expect(result.photoCount).toBe(0);
    });

    test('prefers ListAgentFullName over LA1 first/last name', () => {
        const result = mapPropertyData(fullRaw);
        expect(result.agentName).toBe('John Doe');
    });

    test('builds agentName from LA1_UserFirstName and LA1_UserLastName when ListAgentFullName is absent', () => {
        const result = mapPropertyData({ LA1_UserFirstName: 'Jane', LA1_UserLastName: 'Smith' });
        expect(result.agentName).toBe('Jane Smith');
    });

    test('maps officeName and updatedAt', () => {
        const result = mapPropertyData(fullRaw);
        expect(result.officeName).toBe('Realty Corp');
        expect(result.updatedAt).toBe('2024-01-01');
    });

    test('handles empty raw object without throwing', () => {
        const result = mapPropertyData({});
        expect(result).not.toBeNull();
        expect(result.price).toBe(0);
        expect(result.displayPrice).toBe('Price Not Listed');
        expect(result.images).toEqual([]);
        expect(result.photoCount).toBe(0);
    });
});
