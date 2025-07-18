"use client";
import "./Datatable.css";

const DatatablePagination = ({
  itemsPerPage,
  totalItems,
  setCurrentPage,
  footerlabel,
  currentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // function to paginate the items
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex align-items-center justify-content-between">
      {totalItems > 0 && (
        <div className="text-center">
          Showing <span className="fw-bold text-primary">{itemsPerPage}</span>{" "}
          of{" "}
          <span className="fw-bold text-primary">
            {totalItems} {footerlabel}
          </span>
        </div>
      )}

      {pageNumbers.length > 1 && (
        <div className="d-flex align-items-center gap-3">
          <div className="text-center">
            Page <span className="fw-bold text-primary">{currentPage}</span> of{" "}
            <span className="fw-bold text-primary">
              {Math.ceil(totalItems / itemsPerPage)}
            </span>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <nav aria-label="...">
              <ul className="pagination pagination-sm me-3 my-auto">
                {pageNumbers.map((number) => (
                  <li
                    className={`page-item ${
                      currentPage === number ? "active" : ""
                    }`}
                    key={number}
                  >
                    <div className="page-link" onClick={() => paginate(number)}>
                      {number}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatatablePagination;
