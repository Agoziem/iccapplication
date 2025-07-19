import React, { useState, useEffect } from "react";
import CardFilter from "../Card/CardFilter";
import "./recentActivity.css";
import RecentActivityItem from "./RecentActivityItem";

interface ActivityItem {
  _id: string;
  time: string;
  color: string;
  content: string;
  highlight: string;
}

const RecentActivity: React.FC = () => {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<string>("Today");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (filter: string): void => {
    setFilter(filter);
  };

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/recentactiviy");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
      console.log(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading activities...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-muted">Unable to load recent activities</p>
              <small className="text-danger">{error}</small>
            </div>
          ) : items && items.length > 0 ? (
            items.map((item) => (
              <RecentActivityItem key={item._id} item={item} />
            ))
          ) : (
            <div className="text-center">
              <p className="text-muted">No recent activities</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
