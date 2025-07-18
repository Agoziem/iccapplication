import React from "react";
import { TiArrowBack, TiArrowForward } from "react-icons/ti";

/**
 * @param {{ currentPage: string; totalPages: number; handlePageChange: any; }} param0
 */
const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <div className="d-flex align-items-center justify-content-center gap-3 mt-3 my-4">
      <div className="text-primary">
        Page
        <span className="fw-bold mx-2">
        {currentPage}
        </span>
        of
        <span className="fw-bold mx-2">
          {totalPages}
        </span>
      </div>
      {parseInt(currentPage) > 1 && (
        <div
          className="d-inline-flex align-items-center justify-content-center py-2"
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
        >
          <TiArrowBack
            className="text-primary"
            onClick={() => handlePageChange(parseInt(currentPage) - 1)}
          />
        </div>
      )}
      {Array.from({ length: totalPages }, (_, index) => (
        <div
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`${
            parseInt(currentPage) === index + 1
              ? "text-light badge bg-secondary py-2 px-2"
              : "text-primary"
          }`}
          style={{ cursor: "pointer" }}
        >
          {index + 1}
        </div>
      ))}
      {parseInt(currentPage) < totalPages && (
        <div
          className="d-inline-flex align-items-center justify-content-center py-2"
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
        >
          <TiArrowForward
            className="text-primary"
            onClick={() => handlePageChange(parseInt(currentPage) + 1)}
          />
        </div>
      )}
    </div>
  );
};

export default Pagination;
