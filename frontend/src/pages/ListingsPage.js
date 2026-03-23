import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import PropertyFilters from '../components/PropertyFilters';
import './ListingsPage.css';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { safeParsePhotos } from '../utils/PhotoUtils.js';

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // New Sorting State
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('DESC'); // Default to Newest/Highest first

  // Add sortBy and sortOrder to the dependency array
  useEffect(() => {
    loadProperties();
  }, [filters, currentPage, sortBy, sortOrder]);

  async function loadProperties() {
    try {
      setLoading(true);
      setError(null);
      const offset = (currentPage - 1) * itemsPerPage;

      const params = {
        ...filters,
        limit: itemsPerPage,
        offset,
        // Only send sorting params if a field is selected
        ...(sortBy && { sortBy, sortOrder })
      };

      const data = await fetchProperties(params);
      setProperties(data.results);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  // New Handlers for Sorting
  const handleSortFieldChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to page 1 on sort change
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to page 1 on sort change
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
      <div className="listings-page">
        <h1>Property Listings</h1>

        <PropertyFilters onSearch={handleSearch} />

        {/* --- START OF SORT CONTROLS --- */}
        <div className="sort-container">
          <div className="sort-controls">
            <label htmlFor="sortBy">Sort by:</label>
            <select id="sortBy" value={sortBy} onChange={handleSortFieldChange}>
              <option value="">Default (Newest)</option>
              <option value="price">Price</option>
              <option value="date">Date Listed</option>
              <option value="size">Square Footage</option>
              <option value="beds">Bedrooms</option>
            </select>

            {sortBy && (
                <select value={sortOrder} onChange={handleSortOrderChange}>
                  {/* Conditional labeling based on what we are sorting */}
                  <option value="ASC">
                    {sortBy === 'price' ? 'Price: Low to High' : 'Ascending'}
                  </option>
                  <option value="DESC">
                    {sortBy === 'price' ? 'Price: High to Low' : 'Descending'}
                  </option>
                </select>
            )}
          </div>

          {!loading && !error && (
              <p className="results-summary">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-
                {Math.min(currentPage * itemsPerPage, total)} of {total.toLocaleString()} properties
              </p>
          )}
        </div>
        {/* --- END OF SORT CONTROLS --- */}

        {loading && <div className="loading">Loading properties...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
            <>
              {properties.length === 0 ? (
                  <div className="no-results">
                    No properties found matching your criteria. Try adjusting your filters.
                  </div>
              ) : (
                  <>
                    <div className="property-grid">
                      {properties.map(property => (
                          <PropertyCard key={property.L_ListingID} property={property} />
                      ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                  </>
              )}
            </>
        )}
      </div>
  );
}

// PropertyCard stays the same as your version
function PropertyCard({ property }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/property/${property.L_ListingID}`);
  };

  const photos = safeParsePhotos(property.L_Photos);
  const coverPhoto = photos[0] || null;

  return (
      <div className="property-card" onClick={handleClick}>
        <div className="property-image">
          {coverPhoto ? (
              <img src={coverPhoto} alt={property.L_Address} />
          ) : (
              <div className="no-image">No image available</div>
          )}
        </div>

        <div className="property-info">
          <div className="price">${property.L_SystemPrice?.toLocaleString()}</div>
          <div className="address">{property.L_Address}</div>
          <div className="city">{property.L_City}, {property.L_State} {property.L_Zip}</div>

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

export default ListingsPage;