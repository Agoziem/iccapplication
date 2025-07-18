"use client";
import React, { useState } from "react";
import DatatablePagination from "./DatatablePagination";
import DatatableinputFilter from "./DatatableInputFilter";
import Datatableselect from "./DatatableSelect";
import useJsonToExcel from "@/hooks/useJsonToExcel";
import { SiMicrosoftexcel } from "react-icons/si";
import "./Datatable.css"

const Datatable = ({ items, setItems, children, label, filteritemlabel }) => {
  const [filterInput, setfilterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter Items
  const filteredItems = items?.filter((item) => {
    const filtertarget = item && item[filteritemlabel];
    return filterInput.toLowerCase() === ""
      ? item
      : filtertarget?.toLowerCase().includes(filterInput.toLowerCase());
  });

  // Get Current Items for the Page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

  // Clone the children and pass the currentItems and setItems as props
  const tableItems = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      ...child.props,
      currentItems: currentItems,
      setItems: setItems,
    });
  });

  // implement saving to Excel for both the results & Student side

  const { loadingexcel, handleExport } = useJsonToExcel();
  const handleSaveToExcel = () => {
    handleExport(items);
  };

  return (
    <div>
      {items && items.length !== 0 && (
        <div className="card py-3 px-3 my-3">
          <div className="row justify-content-between align-items-end">
            <div className="col-md-3  mb-3 mb-md-0">
              <Datatableselect
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
              />
            </div>

            <div className="col-md-3 mb-3 mb-md-0">
              <DatatableinputFilter
                filterInput={filterInput}
                setfilterInput={setfilterInput}
                filteritemlabel={filteritemlabel}
              />
            </div>

            <div className="col-md-3 mb-3 mb-md-0">
              <button
                style={{ fontWeight: 500 }}
                disabled={loadingexcel}
                className="btn btn-success w-100"
                onClick={handleSaveToExcel}
              >
                <SiMicrosoftexcel className="me-2 mb-1" />
                Save to Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {tableItems}

      <DatatablePagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredItems?.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        footerlabel={label}
      />
    </div>
  );
};

export default Datatable;
