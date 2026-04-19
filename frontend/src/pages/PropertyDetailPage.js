import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'; // Removed useNavigate
import { fetchPropertyDetail, fetchOpenHouses } from '../api/client';
import './PropertyDetailPage.css';
import { safeParsePhotos } from '../utils/PhotoUtils';

function PropertyDetailPage() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [openHouses, setOpenHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatPascalCase = useCallback((text) => {
        /* istanbul ignore next */
        if (!text) return "";
        return text.replace(/([A-Z])/g, ' $1').trim();
    }, []);

    useEffect(() => {
        async function loadPropertyData() {
            try {
                setLoading(true);
                setError(null);
                const [propertyData, openHousesData] = await Promise.all([
                    fetchPropertyDetail(id),
                    fetchOpenHouses(id)
                ]);
                setProperty(propertyData);
                setOpenHouses(openHousesData.openhouses || []);
            } catch (err) {
                setError(err.message || 'Failed to load property details');
            } finally {
                setLoading(false);
            }
        }
        loadPropertyData();
    }, [id]);

    if (loading) return <div className="loading">Loading property details...</div>;
    if (error) return (
        <div className="error-container">
            <div className="error">{error}</div>
            <button onClick={() => window.location.href = '/'} className="btn-back">Back to Listings</button>
        </div>
    );
    if (!property) return null;

    // Manual photo parsing since safeParsePhotos was flagged as unused/external
    const photos = safeParsePhotos(property.L_Photos);
    const coverPhoto = photos[0] || null;

    return (
        <div className="property-detail-page">
            <button onClick={() => window.history.back()} className="btn-back">← Back to Listings</button>
            <div className="property-header">
                <h1>${property.L_SystemPrice?.toLocaleString()}</h1>
                <p className="property-address">{property.L_Address}</p>
                <p className="property-location">
                    {property.L_City}, {property.L_State} {property.L_Zip}
                </p>
            </div>
            <div className="property-image-main">
                {coverPhoto ? (
                    <img src={coverPhoto} alt={property.L_Address} />
                ) : (
                    <div className="no-image">No image available</div>
                )}
            </div>
            <div className="property-content">
                <div className="property-main">
                    <div className="property-stats">
                        <div className="stat">
                            <div className="stat-value">{property.L_Keyword2}</div>
                            <div className="stat-label">Bedrooms</div>
                        </div>
                        <div className="stat">
                            <div className="stat-value">{property.LM_Dec_3}</div>
                            <div className="stat-label">Bathrooms</div>
                        </div>
                        {property.LM_Int2_3 && (
                            <div className="stat">
                                <div className="stat-value">{property.LM_Int2_3.toLocaleString()}</div>
                                <div className="stat-label">Sq Ft</div>
                            </div>
                        )}
                    </div>
                    <div className="property-section">
                        <h2>Property Details</h2>
                        <div className="detail-grid">
                            {property.L_Type_ && (
                                <div className="detail-item">
                                    <span className="detail-label">Type:</span>
                                    <span className="detail-value">{formatPascalCase(property.L_Type_)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {property.L_Remarks && (
                        <div className="property-section">
                            <h2>Description</h2>
                            <p className="property-description">{property.L_Remarks}</p>
                        </div>
                    )}
                </div>
                <div className="property-sidebar">
                    <div className="open-houses-section">
                        <h3>Open Houses</h3>
                        {openHouses.length > 0 ? (
                            <div className="open-houses-list">
                                {openHouses.map((oh, index) => (
                                    <div key={index} className="open-house-item">
                                        <div className="oh-date">{new Date(oh.OpenHouseDate).toLocaleDateString()}</div>
                                        <div className="oh-time">{oh.OH_StartTime} - {oh.OH_EndTime}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-open-houses">No open houses scheduled</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyDetailPage;