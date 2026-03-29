import React from 'react';
import { useNavigate } from 'react-router-dom';
import { safeParsePhotos } from '../utils/PhotoUtils';
import { useFavorites } from '../hooks/useFavorites';
import './PropertyCard.css'; // Move card styles here

function PropertyCard({ property }) {
    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useFavorites();

    // Check if THIS specific property is favorited
    const favorite = isFavorite(property.L_ListingID);

    const handleCardClick = () => {
        navigate(`/property/${property.L_ListingID}`);
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // CRITICAL: Prevents navigation when clicking the heart
        toggleFavorite(property.L_ListingID);
    };

    const photos = safeParsePhotos(property.L_Photos);
    const coverPhoto = photos[0] || null;

    return (
        <div className="property-card" onClick={handleCardClick}>
            <div className="property-image">
                {coverPhoto ? (
                    <img src={coverPhoto} alt={property.L_Address} />
                ) : (
                    <div className="no-image">No image available</div>
                )}

                {/* The Heart Button */}
                <button
                    className={`favorite-btn ${favorite ? 'active' : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label="Favorite"
                >
                    {favorite ? '❤️' : '🤍'}
                </button>
            </div>

            <div className="property-info">
                <div className="price">${property.L_SystemPrice?.toLocaleString()}</div>
                <div className="address">{property.L_Address}</div>
                <div className="city">{property.L_City}, {property.L_State}</div>

                <div className="property-details">
                    <span>{property.L_Keyword2} beds</span>
                    <span>•</span>
                    <span>{property.LM_Dec_3} baths</span>
                    {property.LM_Int2_3 && (
                        <>
                            <span>•</span>
                            <span>{property.LM_Int2_3.toLocaleString()} sqft</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PropertyCard;