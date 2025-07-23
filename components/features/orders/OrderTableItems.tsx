import React from "react";
import "./OrderTableItems.css";
import { useSession } from "next-auth/react";

interface OrderItem {
  id: number;
  amount: number;
  payment_reference: string;
  reference: string;
  created_at: string;
  last_updated_date?: string;
  status: string;
  customer: {
    username: string;
    name: string;
  };
}

interface OrderTableItemsProps {
  currentItems?: OrderItem[];
}

const OrderTableItems: React.FC<OrderTableItemsProps> = ({ currentItems = [] }) => {
  const { data: session } = useSession();
  
  const handleStatus = (status: string): string => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "secondary";
      case "Failed":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="card p-3 overflow-auto">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Order ID</th>
            {session?.user?.is_staff && <th scope="col">Customer</th>}
            <th scope="col">Total Amount</th>
            <th scope="col">Payment ref</th>
            <th scope="col">Date</th>
            <th scope="col">status</th>
          </tr>
        </thead>
        <tbody>
          {currentItems && currentItems.length > 0 ? (
            currentItems.map(
              /** @param {Order} item */
              (item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  {session?.user?.is_staff && <td>{item.customer.name}</td>}

                  <td className="fw-bold">
                    {/* total Amount */}
                    &#8358;
                    {item.amount.toLocaleString()}
                  </td>
                  <td>{item.reference}</td>
                  <td>
                    {item.last_updated_date &&
                      new Date(item.last_updated_date).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`badge text-${handleStatus(
                        item.status
                      )} bg-${handleStatus(item.status)}-light px-2`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No order found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTableItems;
