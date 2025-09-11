import React, { useState } from 'react';
import WebTrafficChart from './WebTrafficChart';
import CardFilter from "../Card/CardFilter";

function WebTraffic() {
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
          Website Traffic <span>| {filter}</span>
        </h5>
        <WebTrafficChart />
      </div>
    </div>
  );
}

export default WebTraffic;
