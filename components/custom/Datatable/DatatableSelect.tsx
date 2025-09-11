"use client";
import React from 'react'

const Datatableselect = ({itemsPerPage,setItemsPerPage}) => {

    // Handle change in number of items per page
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
    };

  return (
    <div>
        <select  
        className="form-select"
        value={itemsPerPage} 
        onChange={handleItemsPerPageChange}
        >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={15}>15 per page</option>
      </select>
    </div>
  )
}

export default Datatableselect