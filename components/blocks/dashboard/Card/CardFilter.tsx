import React, { useCallback } from 'react';

interface CardFilterProps {
  filterChange: (filter: string) => void;
}

const CardFilter: React.FC<CardFilterProps> = React.memo(({ filterChange }) => {
  // Memoized filter handlers
  const handleTodayFilter = useCallback(() => {
    filterChange('Today');
  }, [filterChange]);

  const handleMonthFilter = useCallback(() => {
    filterChange('This Month');
  }, [filterChange]);

  const handleYearFilter = useCallback(() => {
    filterChange('This Year');
  }, [filterChange]);

  return (
    <div className="filter">
      <button
        type="button"
        className="btn btn-link icon p-0 border-0"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Filter options"
      >
        <i className="bi bi-three-dots" aria-hidden="true"></i>
      </button>
      
      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
        <li className="dropdown-header text-start">
          <h6 className="mb-0">Filter</h6>
        </li>
        
        <li>
          <button
            type="button"
            className="dropdown-item"
            onClick={handleTodayFilter}
          >
            <i className="bi bi-calendar-day me-2" aria-hidden="true"></i>
            Today
          </button>
        </li>
        
        <li>
          <button
            type="button"
            className="dropdown-item"
            onClick={handleMonthFilter}
          >
            <i className="bi bi-calendar-month me-2" aria-hidden="true"></i>
            This Month
          </button>
        </li>
        
        <li>
          <button
            type="button"
            className="dropdown-item"
            onClick={handleYearFilter}
          >
            <i className="bi bi-calendar-range me-2" aria-hidden="true"></i>
            This Year
          </button>
        </li>
      </ul>
    </div>
  );
});

CardFilter.displayName = "CardFilter";

export default CardFilter;
