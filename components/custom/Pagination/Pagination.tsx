import React from "react";
import { TiArrowBack, TiArrowForward } from "react-icons/ti";

interface PaginationProps {
  currentPage: number | string;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, handlePageChange }: PaginationProps) => {
  const currentPageNum = typeof currentPage === 'string' ? parseInt(currentPage) : currentPage;

  const handlePrevPage = () => {
    handlePageChange(currentPageNum - 1);
  };

  const handleNextPage = () => {
    handlePageChange(currentPageNum + 1);
  };

  const handlePageClick = (page: number) => {
    handlePageChange(page);
  };

  return (
    <div className="d-flex align-items-center justify-content-center gap-3 mt-3 my-4">
      <div className="text-primary">
        Page
        <span className="fw-bold mx-2">
          {currentPageNum}
        </span>
        of
        <span className="fw-bold mx-2">
          {totalPages}
        </span>
      </div>
      {currentPageNum > 1 && (
        <div
          className="d-inline-flex align-items-center justify-content-center py-2"
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
        >
          <TiArrowBack
            className="text-primary"
            onClick={handlePrevPage}
          />
        </div>
      )}
      {Array.from({ length: totalPages }, (_, index) => (
        <div
          key={index}
          onClick={() => handlePageClick(index + 1)}
          className={`${
            currentPageNum === index + 1
              ? "text-light badge bg-secondary py-2 px-2"
              : "text-primary"
          }`}
          style={{ cursor: "pointer" }}
        >
          {index + 1}
        </div>
      ))}
      {currentPageNum < totalPages && (
        <div
          className="d-inline-flex align-items-center justify-content-center py-2"
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
        >
          <TiArrowForward
            className="text-primary"
            onClick={handleNextPage}
          />
        </div>
      )}
    </div>
  );
};

export default Pagination;
