import React from "react";
import { TiArrowBack, TiArrowForward } from "react-icons/ti";

interface PaginationProps {
  currentPage: string | number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  className?: string;
  style?: React.CSSProperties;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  handlePageChange,
  className = "",
  style = {},
  showPageNumbers = true,
  maxVisiblePages = 10
}) => {
  const currentPageNum = typeof currentPage === 'string' ? parseInt(currentPage) : currentPage;
  const isValidPage = !isNaN(currentPageNum) && currentPageNum > 0 && currentPageNum <= totalPages;
  const safeCurrentPage = isValidPage ? currentPageNum : 1;

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== safeCurrentPage) {
      handlePageChange(page);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, page: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePageClick(page);
    }
  };

  const getVisiblePages = (): number[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, safeCurrentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  return (
    <div 
      className={`d-flex align-items-center justify-content-center gap-3 mt-3 my-4 ${className}`}
      style={style}
    >
      <div className="text-primary">
        Page
        <span className="fw-bold mx-2">
          {safeCurrentPage}
        </span>
        of
        <span className="fw-bold mx-2">
          {totalPages}
        </span>
      </div>
      
      {safeCurrentPage > 1 && (
        <div
          className="d-inline-flex align-items-center justify-content-center py-2"
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
          role="button"
          tabIndex={0}
          onClick={() => handlePageClick(safeCurrentPage - 1)}
          onKeyDown={(e) => handleKeyDown(e, safeCurrentPage - 1)}
          aria-label="Previous page"
        >
          <TiArrowBack className="text-primary" />
        </div>
      )}
      
      {showPageNumbers && getVisiblePages().map((pageNum) => (
        <div
          key={pageNum}
          onClick={() => handlePageClick(pageNum)}
          onKeyDown={(e) => handleKeyDown(e, pageNum)}
          className={`${
            safeCurrentPage === pageNum
              ? "text-light badge bg-secondary py-2 px-2"
              : "text-primary"
          }`}
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
          aria-label={`Page ${pageNum}`}
          aria-current={safeCurrentPage === pageNum ? "page" : undefined}
        >
          {pageNum}
        </div>
      ))}
      
      {safeCurrentPage < totalPages && (
        <div
          className="d-inline-flex align-items-center justify-content-center py-2"
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
          role="button"
          tabIndex={0}
          onClick={() => handlePageClick(safeCurrentPage + 1)}
          onKeyDown={(e) => handleKeyDown(e, safeCurrentPage + 1)}
          aria-label="Next page"
        >
          <TiArrowForward className="text-primary" />
        </div>
      )}
    </div>
  );
};

export default Pagination;
