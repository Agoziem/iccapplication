import { PaymentStatus, PaymentResponse } from "@/types/payments";
import { User } from "@/types/users";
import React from "react";

type RecentSalesTableProps = {
  loading: boolean;
  items: PaymentResponse[] | undefined;
  currentUser: User | undefined;
};

function RecentSalesTable({
  loading,
  items,
  currentUser,
}: RecentSalesTableProps) {
  const handleStatus = (status: PaymentStatus) => {
    switch (status) {
      case "Completed":
        return "success";
        break;
      case "Pending":
        return "secondary";
        break;
      case "Failed":
        return "danger";
        break;
      default:
        return "secondary";
    }
  };

  return (
    <table className="table table-bordered datatable">
      <thead className="table-light">
        <tr>
          <th scope="col">Order id</th>
          {currentUser?.is_staff ? <th scope="col">Customer</th> : null}
          <th scope="col">Payment Ref</th>
          <th scope="col">Total</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={currentUser?.is_staff ? 5 : 4} className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="ml-2">Loading Orders ...</p>
            </td>
          </tr>
        ) : items && items.length > 0 ? (
          items.slice(0, 10).map((item) => (
            <tr key={item.id}>
              <th scope="row">
                <a href="#">{item.id}</a>
              </th>
              {currentUser?.is_staff ? (
                <td>{item.customer.first_name}</td>
              ) : null}
              <td>{item.reference}</td>
              <td className="fw-bold">
                &#8358;
                {parseFloat(item.amount).toLocaleString()}
              </td>
              <td>
                <span
                  className={`badge text-${handleStatus(
                    item.status as PaymentStatus
                  )} bg-${handleStatus(
                    item.status as PaymentStatus
                  )}-light px-2`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center fw-bold  py-4">
              No Order Yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default RecentSalesTable;
