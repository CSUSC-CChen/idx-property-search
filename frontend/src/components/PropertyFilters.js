import React, { useState } from 'react';
import './PropertyFilters.css';

function PropertyFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    L_City: '',
    L_Zip: '',
    minPrice: '',
    maxPrice: '',
    L_Keyword2: '',
    LM_Dec_3: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build clean filter object (remove empty values)
    const cleanFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].toString().trim() !== '') {
        cleanFilters[key] = filters[key].toString().trim();
      }
    });

    onSearch(cleanFilters);
  };

  const handleClear = () => {
    setFilters({
      L_City: '',
      L_Zip: '',
      minPrice: '',
      maxPrice: '',
      L_Keyword2: '',
      LM_Dec_3: ''
    });
    onSearch({});
  };

  return (
      <form className="property-filters" onSubmit={handleSubmit}>
        <div className="filter-row">
          <div className="filter-group">
            <label>City</label>
            <input
                type="text"
                name="L_City"
                value={filters.L_City}
                onChange={handleChange}
                placeholder="e.g. Los Angeles"
            />
          </div>

          <div className="filter-group">
            <label>ZIP Code</label>
            <input
                type="text"
                name="L_Zip"
                value={filters.L_Zip}
                onChange={handleChange}
                placeholder="e.g. 90210"
            />
          </div>

          <div className="filter-group">
            <label>Min Price</label>
            <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="$0"
            />
          </div>

          <div className="filter-group">
            <label>Max Price</label>
            <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="No max"
            />
          </div>

          <div className="filter-group">
            <label>Beds</label>
            <select name="L_Keyword2" value={filters.L_Keyword2} onChange={handleChange}>
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Baths</label>
            <select name="LM_Dec_3" value={filters.LM_Dec_3} onChange={handleChange}>
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button type="submit" className="btn-primary">Search</button>
          <button type="button" onClick={handleClear} className="btn-secondary">
            Clear Filters
          </button>
        </div>
      </form>
  );
}

export default PropertyFilters;