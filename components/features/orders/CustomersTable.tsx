import React from 'react'
import "./OrderTableItems.css";
import Link from 'next/link';

interface Customer {
  customer__id: number;
  customer__username: string;
  customer__count: number;
  amount__sum: number;
  amount__avg: number;
}

interface CustomersTableProps {
  currentItems?: Customer[];
  setCustomerID: (id: number) => void;
  toggleModal: () => void;
}

const CustomersTable: React.FC<CustomersTableProps> = ({ 
  currentItems = [],
  setCustomerID,
  toggleModal 
}) => {
  return (
    <div className="card p-3 overflow-auto">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Customer ID</th>
            <th scope="col">Customer</th>
            <th scope="col">No of Orders</th>
            <th scope="col">Total Amount</th>
            <th scope="col">Ave Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentItems && currentItems.length > 0 ? (
            currentItems.map((item) => (
              <tr key={item.customer__id}>
                <td>{item.customer__id}</td>
                <td>
                    <Link href={"#"} className='text-secondary' onClick={
                      (e) => {
                        e.preventDefault();
                        setCustomerID(item.customer__id);
                        toggleModal();
                      }
                    }>{item.customer__username}</Link>
                </td>
                <td>
                    {item.customer__count}
                </td>
                <td>
                  {/* total Amount */}
                  &#8358; {item.amount__sum.toFixed(2)}
                </td>
                <td>
                    {/* Average Amount */}
                    &#8358; {item.amount__avg.toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">No Customer found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}



export default CustomersTable