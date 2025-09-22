import { PaymentStatus, PaymentResponse } from "@/types/payments";
import { User } from "@/types/users";
import Link from "next/link";
import React, { useCallback } from "react";

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

  const canRetry = useCallback(
    (order: PaymentResponse) => {
      const isOwnedByUser =
        currentUser && order.customer && currentUser.id === order.customer.id;
      if (!isOwnedByUser) return false;
      return order.status === "Pending" || order.status === "Failed";
    },
    [currentUser]
  );

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
                <td className=" text-nowrap">
                  {item.customer.first_name ||
                    item.customer.last_name ||
                    "Unknown Name"}
                </td>
              ) : null}
              <td>
                <div className="text-truncate" style={{ maxWidth: "150px" }}>
                  {item.reference}
                </div>
              </td>
              <td className="fw-bold">
                &#8358;
                {parseFloat(item.amount).toLocaleString()}
              </td>
              <td className="text-nowrap">
                <span
                  className={`badge text-${handleStatus(
                    item.status as PaymentStatus
                  )} bg-${handleStatus(
                    item.status as PaymentStatus
                  )}-light px-2 py-2`}
                >
                  {item.status}
                </span>
                {canRetry(item) && (
                  <Link
                    className={`badge text-primary bg-primary-light px-2 py-2`}
                    style={{ cursor: "pointer", marginLeft: "8px" }}
                    href={`/dashboard/orders/${item.reference}`}
                  >
                    retry
                  </Link>
                )}
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
