import React, { useState } from 'react';
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

type SortOrder = 'asc' | 'desc' | null;

interface DatatableSortingIconProps<T> {
    itemstosort: T[];
    setItems: (items: T[]) => void;
    headername: keyof T;
}

const Datatablesortingicon = <T extends Record<string, any>>({ 
    itemstosort, 
    setItems, 
    headername 
}: DatatableSortingIconProps<T>) => {
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);

    const toggleSortOrder = () => {
        if (sortOrder === 'asc') {
            setSortOrder('desc');
        } else {
            setSortOrder('asc');
        }
        sortItems(sortOrder, headername);
    };

    const sortItems = (order: SortOrder, headername: keyof T) => {
        console.log(headername);
        const sortedItems = [...itemstosort].sort((a, b) => {
            const aValue = String(a[headername]);
            const bValue = String(b[headername]);
            
            if (order === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        setItems(sortedItems);
    };

    return (
        <>
            <span className='sorting-icon ms-2' onClick={toggleSortOrder}>
                {sortOrder === 'asc' ? 
                    <i className="bi bi-sort-alpha-up h5"></i> : 
                    <i className="bi bi-sort-alpha-down h5"></i>
                }
            </span>
        </>
    );
};

export default Datatablesortingicon;
