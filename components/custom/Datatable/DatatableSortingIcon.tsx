import React, { useState } from 'react';

interface DatatableSortingIconProps {
  itemstosort: any[];
  setItems: (items: any[]) => void;
  headername: string;
}

type SortOrder = 'asc' | 'desc' | null;

const Datatablesortingicon: React.FC<DatatableSortingIconProps> = ({ itemstosort, setItems, headername }) => {
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);

    const toggleSortOrder = (): void => {
        if (sortOrder === 'asc') {
            setSortOrder('desc');
        } else {
            setSortOrder('asc');
        }
        sortItems(sortOrder, headername);
    };

    const sortItems = (order: SortOrder, headername: string): void => {
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
