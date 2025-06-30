import React from 'react';
import Icon from 'components/AppIcon';

const SearchFilter = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  regionFilter,
  setRegionFilter,
  sortBy,
  setSortBy,
  isLoading,
  handleSearch,
  resetFilters
}) => {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-md mb-12">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="search" className="form-label">Search Resources</label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for schemes, guides, resources..."
                className="form-input pl-10 pr-4 py-3 w-full"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Search" size={18} className="text-text-secondary" />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
            >
              <option value="all">All Categories</option>
              <option value="subsidy">Subsidies</option>
              <option value="certification">Certification</option>
              <option value="insurance">Insurance</option>
              <option value="seasonal">Seasonal</option>
              <option value="sustainable">Sustainable</option>
              <option value="weather">Weather</option>
              <option value="pdf">PDF Guides</option>
              <option value="video">Videos</option>
              <option value="infographic">Infographics</option>
              <option value="policy">Policy</option>
              <option value="market">Market</option>
              <option value="event">Events</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="w-full md:w-48">
            <label htmlFor="region" className="form-label">Region</label>
            <select
              id="region"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Regions</option>
              <option value="national">National</option>
              <option value="north">North India</option>
              <option value="south">South India</option>
              <option value="east">East India</option>
              <option value="west">West India</option>
              <option value="central">Central India</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto">
            <button 
              type="submit" 
              className="btn-primary w-full md:w-auto flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Icon name="Search" size={18} />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-text-primary">Sort by:</span>
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={() => setSortBy('relevance')}
                className={`px-3 py-1 text-sm rounded-full transition-smooth ${sortBy === 'relevance' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:bg-accent'}`}
              >
                Relevance
              </button>
              <button 
                type="button"
                onClick={() => setSortBy('date')}
                className={`px-3 py-1 text-sm rounded-full transition-smooth ${sortBy === 'date' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:bg-accent'}`}
              >
                Latest
              </button>
              <button 
                type="button"
                onClick={() => setSortBy('engagement')}
                className={`px-3 py-1 text-sm rounded-full transition-smooth ${sortBy === 'engagement' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:bg-accent'}`}
              >
                Most Viewed
              </button>
            </div>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <button 
              type="button" 
              onClick={resetFilters}
              className="text-sm text-primary hover:text-secondary transition-smooth flex items-center space-x-1"
            >
              <Icon name="RefreshCw" size={14} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchFilter;