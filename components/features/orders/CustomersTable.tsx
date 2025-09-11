import React, { useMemo, useCallback } from 'react';
import Link from 'next/link';
import "./OrderTableItems.css";

/**
 * Enhanced CustomersTable component with comprehensive error handling and safety checks
 * Displays customer payment statistics with safe data processing
 * 
 * @param {{ 
 *   currentItems?: CustomerPaymentStats[];
 *   setCustomerID: (id: number) => void;
 *   toggleModal: () => void;
 * }} props
 */
const CustomersTable = ({ currentItems = [], setCustomerID, toggleModal }) => {
  
  // Safe data processing with validation
  const customersData = useMemo(() => {
    if (!Array.isArray(currentItems)) return [];
    
    return currentItems.filter(item => 
      item && 
      typeof item === 'object' && 
      item.customer__id
    );
  }, [currentItems]);

  // Safe amount formatting
  const formatAmount = useCallback((value) => {
    if (value === null || value === undefined) return '0.00';
    
    let numValue;
    if (typeof value === 'string') {
      numValue = parseFloat(value);
    } else if (typeof value === 'number') {
      numValue = value;
    } else {
      return '0.00';
    }
    
    if (isNaN(numValue) || !isFinite(numValue)) return '0.00';
    
    return numValue.toFixed(2);
  }, []);

  // Safe customer link handler
  const handleCustomerClick = useCallback((e, customerId) => {
    e.preventDefault();
    
    if (!customerId || typeof customerId !== 'number') {
      console.error('Invalid customer ID:', customerId);
      return;
    }
    
    if (typeof setCustomerID === 'function') {
      setCustomerID(customerId);
    }
    
    if (typeof toggleModal === 'function') {
      toggleModal();
    }
  }, [setCustomerID, toggleModal]);

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
          {customersData.length > 0 ? (
            customersData.map((item) => {
              const customerId = item.customer__id;
              const customerName = item.customer__username || 'Unknown Customer';
              const orderCount = item.customer__count || 0;
              const totalAmount = formatAmount(item.amount__sum);
              const averageAmount = formatAmount(item.amount__avg);

              return (
                <tr key={customerId}>
                  <td>
                    <span className="fw-medium">{customerId}</span>
                  </td>
                  <td>
                    <Link 
                      href="#" 
                      className="text-secondary text-decoration-none"
                      onClick={(e) => handleCustomerClick(e, customerId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleCustomerClick(e, customerId);
                        }
                      }}
                    >
                      {customerName}
                    </Link>
                  </td>
                  <td>
                    <span className="badge bg-primary">{orderCount}</span>
                  </td>
                  <td>
                    <span className="fw-bold text-success">
                      &#8358; {totalAmount}
                    </span>
                  </td>
                  <td>
                    <span className="text-muted">
                      &#8358; {averageAmount}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                <div className="text-muted">
                  <i className="bi bi-people mb-2" style={{ fontSize: '2rem' }}></i>
                  <p className="mb-0">No customers found</p>
                  <small>Customer payment data will appear here when available.</small>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};



export default CustomersTable