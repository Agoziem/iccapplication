"use client";
import React, { ChangeEvent } from 'react';

interface DatatableSelectProps {
    itemsPerPage: number;
    setItemsPerPage: (value: number) => void;
}

const Datatableselect: React.FC<DatatableSelectProps> = ({ itemsPerPage, setItemsPerPage }) => {
    const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
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
    );
};

export default Datatableselect;