"use client";

import React, { useMemo } from "react";
import "./card.css";

interface HorizontalCardProps {
  cardspan: string;
  iconcolor: string;
  cardtitle: string;
  icon: string;
  cardbody: string | number;
  loading?: boolean;
}

const HorizontalCard: React.FC<HorizontalCardProps> = React.memo(
  ({ cardspan, iconcolor, cardtitle, icon, cardbody, loading = false }) => {
    // Memoized formatted body value
    const formattedBody = useMemo(() => {
      if (loading) return "...";
      if (typeof cardbody === "number") {
        return new Intl.NumberFormat("en-US").format(cardbody);
      }
      return cardbody || "0";
    }, [cardbody, loading]);

    // Memoized card classes
    const cardClasses = useMemo(
      () => `card info-card ${iconcolor}`.trim(),
      [iconcolor]
    );

    return (
      <div
        className={cardClasses}
        role="region"
        aria-label={`${cardtitle} statistics`}
      >
        <div className="card-body">
          <div className="card-header-section">
            <h6
              className="pt-2 mb-2 fw-semibold"
              id={`card-title-${cardtitle.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {cardtitle}
            </h6>
            <hr className="my-2" />
          </div>

          <div className="d-flex align-items-center mt-2">
            <div
              className="card-icon rounded-circle d-flex align-items-center justify-content-center"
              role="img"
              aria-label={`${cardtitle} icon`}
            >
              {loading ? (
                <div
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <i
                  className={icon}
                  aria-hidden="true"
                  style={{ fontSize: "1.5rem" }}
                />
              )}
            </div>

            <div className="ps-3 flex-grow-1">
              <h4
                className="mb-1 fw-bold"
                aria-describedby={`card-title-${cardtitle
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
              >
                {formattedBody}
              </h4>

              <span className="card-small text-muted small pt-1 d-block line-clamp-1">
                {cardspan}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

HorizontalCard.displayName = "HorizontalCard";

export default HorizontalCard;
