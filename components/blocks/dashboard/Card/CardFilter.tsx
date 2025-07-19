import React, { MouseEvent } from 'react';

interface CardFilterProps {
  filterChange: (filter: string) => void;
}

const CardFilter: React.FC<CardFilterProps> = ({ filterChange }) => {
  const handleFilterClick = (e: MouseEvent<HTMLAnchorElement>, filter: string): void => {
    e.preventDefault();
    filterChange(filter);
  };

  return (
    <div className="filter">
      <a className="icon" href="#" data-bs-toggle="dropdown">
        <i className="bi bi-three-dots"></i>
      </a>
      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
        <li className="dropdown-header text-start">
          <h6>Filter</h6>
        </li>
        <li>
          <a 
            className="dropdown-item" 
            href="#"
            onClick={(e) => handleFilterClick(e, 'Today')}
          >
            Today
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="#"
            onClick={(e) => handleFilterClick(e, 'This Month')}
          >
            This Month
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="#"
            onClick={(e) => handleFilterClick(e, 'This Year')}
          >
            This Year
          </a>
        </li>
      </ul>
    </div>
  );
};

export default CardFilter;
