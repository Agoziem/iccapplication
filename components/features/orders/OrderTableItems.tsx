import React, { useMemo, useCallback } from "react";
import "./OrderTableItems.css";
import moment from "moment";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { PaymentResponse, PaymentStatus } from "@/types/payments";

type OrderTableItemsProps = {
  currentItems?: PaymentResponse[]
}

/**
 * Enhanced OrderTableItems component with comprehensive error handling and safety checks
 * Displays order payment data with proper validation and type safety
 * Optimized with React.memo for performance
 */
const OrderTableItems: React.FC<OrderTableItemsProps> = React.memo(({ 
  currentItems = [] 
}) => {
  const { data: user } = useMyProfile();
  
  // Safe status badge handler
  const handleStatus = useCallback((status: PaymentStatus | undefined) => {
    if (!status || typeof status !== 'string') return 'secondary';
    
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'secondary';
    }
  }, []);

  // Safe data processing
  const ordersData = useMemo(() => {
    if (!Array.isArray(currentItems)) return [];
    
    return currentItems.filter(item => 
      item && 
      typeof item === 'object' && 
      item.id
    );
  }, [currentItems]);

  // Safe amount formatting
  const formatAmount = useCallback((amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) return '0.00';
    
    let numValue;
    if (typeof amount === 'string') {
      numValue = parseFloat(amount);
    } else if (typeof amount === 'number') {
      numValue = amount;
    } else {
      return '0.00';
    }
    
    if (isNaN(numValue) || !isFinite(numValue)) return '0.00';
    
    return numValue.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }, []);



  // Dynamic column span calculation
  const getColSpan = () => {
    return user?.is_staff ? 6 : 5;
  };

  return (
    <div className="card p-3 overflow-auto">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Order ID</th>
            {user?.is_staff && <th scope="col">Customer</th>}
            <th scope="col">Total Amount</th>
            <th scope="col">Payment Ref</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {ordersData.length > 0 ? (
            ordersData.map((item) => {
              const orderId = item.id || 'N/A';
              const customerName = (item.customer?.first_name || item.customer?.last_name || 'Unknown Customer');
              const amount = formatAmount(item.amount);
              const reference = item.reference || 'N/A';
              const date = moment(item.last_updated_date || item.created_at).format("MMM D, YYYY h:mm A");
              const status = item.status;
              const statusClass = handleStatus(status);

              return (
                <tr key={orderId}>
                  <td>
                    <span className="fw-medium">{orderId}</span>
                  </td>
                  {user?.is_staff && (
                    <td>
                      <span className="text-secondary">{customerName}</span>
                    </td>
                  )}
                  <td className="fw-bold text-success">
                    &#8358; {amount}
                  </td>
                  <td>
                    <span className="font-monospace text-muted small">
                      {reference}
                    </span>
                  </td>
                  <td>
                    <span className="text-muted">{date}</span>
                  </td>
                  <td>
                    <span
                      className={`badge bg-${statusClass} bg-opacity-10 text-${statusClass} px-2 py-1`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={getColSpan()} className="text-center py-4">
                <div className="text-muted">
                  <i className="bi bi-receipt mb-2" style={{ fontSize: '2rem' }}></i>
                  <p className="mb-0">No orders found</p>
                  <small>Order information will appear here when available.</small>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

// Add display name for debugging
OrderTableItems.displayName = 'OrderTableItems';

export default OrderTableItems;
