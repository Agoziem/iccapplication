"use client";
import { useEffect, useState } from "react";

export default function ApexChart({ data }) {
  const [Chart, setChart] = useState(null);

  useEffect(() => {
    import("react-apexcharts")
      .then((mod) => {
        setChart(() => mod.default);
      })
      .catch((error) =>
        console.error("Error loading react-apexcharts:", error)
      );
  }, []);

  if (!Chart) {
    // Optionally render a loading state or null while the component is loading
    return (
      <div className="spinner-border text-primary m-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }
  

  return (
    <Chart
      options={data.options}
      series={data.series}
      type={data.options.chart.type}
      height={data.options.chart.height}
    />
  );
}
