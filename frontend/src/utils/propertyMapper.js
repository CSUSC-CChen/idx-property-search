import { safeParsePhotos } from './PhotoUtils';

/**
 * The "Full Vision" Mapper
 * Integrates your SQL schema, Trestle Metadata, and Photo Utility.
 */
export const mapPropertyData = (raw) => {
    if (!raw) return null;

    return {
        // IDs & Status
        id: raw.id,
        listingId: raw.L_ListingID,
        mlsNumber: raw.L_DisplayId,
        status: raw.L_Status || raw.StandardStatus,

        // Financials (Mapped from your Search Price column)
        price: raw.L_SystemPrice || 0,
        displayPrice: raw.L_SystemPrice
            ? `$${raw.L_SystemPrice.toLocaleString()}`
            : "Price Not Listed",
        previousPrice: raw.PreviousListPrice,

        // Location (Using your specific L_ columns)
        address: raw.L_Address,
        street: raw.L_AddressStreet,
        city: raw.L_City,
        state: raw.L_State,
        zip: raw.L_Zip,
        subdivision: raw.SubdivisionName || raw.LM_char10_70,
        lat: raw.LMD_MP_Latitude,
        lng: raw.LMD_MP_Longitude,

        // Essential Specs (Mapping the cryptic LM/Keyword keys)
        beds: raw.L_Keyword2,           // From SQL: # Beds
        baths: raw.LM_Dec_3,            // From SQL: # Baths
        sqft: raw.LM_Int2_3,            // From SQL: Apx Fin SQFT
        lotSize: raw.LotSizeAcres,      // From SQL: Lot Size Acres
        garageSpaces: raw.L_Keyword5,   // From SQL: Garage Capacity
        yearBuilt: raw.YearBuilt,

        // Features & Media
        propertyType: raw.L_Type_,
        remarks: raw.L_Remarks,

        // --- PHOTO PARSING INTEGRATION ---
        images: safeParsePhotos(raw.L_Photos),
        photoCount: raw.PhotoCount || 0,
        mainImage: safeParsePhotos(raw.L_Photos)[0],

        // Agent Info
        agentName: raw.ListAgentFullName || `${raw.LA1_UserFirstName} ${raw.LA1_UserLastName}`,
        officeName: raw.LO1_OrganizationName,

        // System Timestamps
        updatedAt: raw.up_date,
    };
};