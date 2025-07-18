"use client";
import React, { useState } from "react";
import "./card.css";
import CardFilter from "./CardFilter";
const HorizontalCard = ({ cardspan, iconcolor, cardtitle, icon, cardbody, loading }) => {
  // const [filter, setFilter] = useState("Today");
  // const handleFilterChange = (filter) => {
  //   setFilter(filter);
  // };

  return (
    <div
      className={`card info-card
        ${iconcolor}
      `}
    >
      <div className="card-body">
        <div className="">
          <h6 className="pt-2">{cardtitle}</h6>
          {/* <CardFilter filterChange={handleFilterChange} /> */}
          <hr />
        </div>

        <div className="d-flex align-items-center mt-2">
          <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
            <i className={icon}></i>
          </div>
          <div className="ps-3">
            <h4>{cardbody || 0}</h4>
            <span className="card-small text-muted small pt-2 ps-1">
              {cardspan}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCard;
