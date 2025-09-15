import React, { useState, useEffect } from "react";
import CardFilter from "../Card/CardFilter";
import "./recentActivity.css";
import RecentActivityItem from "./RecentActivityItem";

function RecentActivity() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("Today");
  const handleFilterChange = (filter: string) => {
    setFilter(filter);
  };

  // you need intall the json server to run the backend api
  // npm i json-server -g
  // once installed globally, run the following code in terminal
  // json-server --watch --port 4000 ./api/info.json
  const fetchData = () => {
    fetch("http://localhost:4000/recentactiviy")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
      })
      .catch((e) => console.log(e.message));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card">
      <div className="d-flex justify-content-end pe-4 pt-3">
        <CardFilter filterChange={handleFilterChange} />
      </div>

      <div className="card-body px-3">
        <h5 className="card-title pb-3">
          Recent Activity <span>| {filter}</span>
        </h5>

        <div className="activity">
          {items &&
            items.length > 0 &&
            items.map((item: any) => (
              <RecentActivityItem key={item.id} item={item} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default RecentActivity;
