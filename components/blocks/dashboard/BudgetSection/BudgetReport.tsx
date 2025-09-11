import React, { useState } from 'react';
import CardFilter from "../Card/CardFilter";
import BudgetChart from './BudgetChart';

function BudgetReport() {
  const [filter, setFilter] = useState('Today');
  const handleFilterChange = filter => {
    setFilter(filter);
  };

  return (
    <div className="card">
      <div className="d-flex justify-content-end pe-4 pt-3">
        <CardFilter filterChange={handleFilterChange} />
      </div>

      <div className="card-body pb-0">
        <h5 className="card-title pb-3">
          Budget Report <span>| {filter}</span>
        </h5>
        <BudgetChart />
      </div>
    </div>
  );
}

export default BudgetReport;
