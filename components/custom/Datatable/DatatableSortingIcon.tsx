import React, { useState } from 'react';
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

const Datatablesortingicon = ({ itemstosort, setItems, headername }) => {
    const [sortOrder, setSortOrder] = useState(null);

    const toggleSortOrder = () => {
        if (sortOrder === 'asc') {
            setSortOrder('desc');
        } else {
            setSortOrder('asc');
        }
        sortItems(sortOrder, headername); // Pass headername here
    };

    const sortItems = (order, headername) => {
        console.log(headername)
        const sortedItems = [...itemstosort].sort((a, b) => {
            if (order === 'asc') {
                return a[headername].localeCompare(b[headername]);
            } else {
                return b[headername].localeCompare(a[headername]);
            }
        });
        setItems(sortedItems);
    };

    return (
        <>
            <span className='sorting-icon ms-2' onClick={toggleSortOrder} >
                {sortOrder === 'asc' ? <i className="bi bi-sort-alpha-up h5"></i> : <i className="bi bi-sort-alpha-down h5 "></i>}
            </span>
        </>
    );
};

export default Datatablesortingicon;
