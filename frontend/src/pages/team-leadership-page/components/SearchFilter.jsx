import React from 'react';
import Icon from 'components/AppIcon';

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  selectedDepartment, 
  onDepartmentChange, 
  departments 
}) => {
  return (
    <div className="bg-surface rounded-lg shadow-base border border-border p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="form-label">
            Search Team Members
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={18} className="text-text-secondary" />
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search by name, role, or description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>

        {/* Department Filter */}
        <div className="lg:w-64">
          <label htmlFor="department" className="form-label">
            Filter by Department
          </label>
          <div className="relative">
            <select
              id="department"
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="form-input appearance-none pr-10"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Icon name="ChevronDown" size={18} className="text-text-secondary" />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedDepartment !== 'all') && (
          <div className="flex items-end">
            <button
              onClick={() => {
                onSearchChange('');
                onDepartmentChange('all');
              }}
              className="btn-outline flex items-center space-x-2 h-12"
            >
              <Icon name="X" size={16} />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-text-secondary">
          {searchTerm || selectedDepartment !== 'all' ? (
            <>
              Showing filtered results
              {searchTerm && (
                <span> for "<strong>{searchTerm}</strong>"</span>
              )}
              {selectedDepartment !== 'all' && (
                <span> in <strong>{departments.find(d => d.value === selectedDepartment)?.label}</strong></span>
              )}
            </>
          ) : (
            'Showing all team members'
          )}
        </p>
      </div>
    </div>
  );
};

export default SearchFilter;