"use client";
import React, { useState, ReactNode, ReactElement } from "react";
import DatatablePagination from "./DatatablePagination";
import DatatableinputFilter from "./DatatableInputFilter";
import Datatableselect from "./DatatableSelect";
import useJsonToExcel from "@/hooks/useJsonToExcel";
import "./Datatable.css";

interface DatatableProps<T> {
  items: T[];
  setItems: (items: T[]) => void;
  children: ReactNode;
  label: string;
  filteritemlabel: keyof T;
}

const Datatable = <T extends Record<string, any>>({ 
  items, 
  setItems, 
  children, 
  label, 
  filteritemlabel 
}: DatatableProps<T>) => {
  const [filterInput, setfilterInput] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const filteredItems = items?.filter((item: T) => {
    const filtertarget = item && item[filteritemlabel];
    return filterInput.toLowerCase() === ""
      ? item
      : String(filtertarget)?.toLowerCase().includes(filterInput.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

  const tableItems = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...(child.props as any),
        currentItems: currentItems,
        setItems: setItems,
      } as any);
    }
    return child;
  });

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
                filteritemlabel={String(filteritemlabel)}
              />
            </div>

            <div className="col-md-3 mb-3 mb-md-0">
              <button
                style={{ fontWeight: 500 }}
                disabled={loadingexcel}
                className="btn btn-success w-100"
                onClick={handleSaveToExcel}
              >
                <i className="bi bi-file-earmark-excel me-2"></i>
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
