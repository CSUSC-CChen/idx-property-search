import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import PropertyFilters from '../components/PropertyFilters';
import './ListingsPage.css';
import Pagination from '../components/Pagination';
import PropertyCard from '../components/PropertyCard';

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        setError(null);
        const offset = (currentPage - 1) * itemsPerPage;

        const params = {
          ...filters,
          limit: itemsPerPage,
          offset,
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

    loadProperties();
  }, [filters, currentPage, sortBy, sortOrder, itemsPerPage]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleSortFieldChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
      <div className="listings-page">
        <h1>Property Listings</h1>
        <PropertyFilters onSearch={handleSearch} />
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
        {loading && <div className="loading">Loading properties...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
            <>
              {properties.length === 0 ? (
                  <div className="no-results">No properties found.</div>
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

export default ListingsPage;