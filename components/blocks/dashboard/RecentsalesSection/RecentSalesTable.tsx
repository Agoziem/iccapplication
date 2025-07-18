import React from "react";

function RecentSalesTable({ loading, items, session }) {
  const handleStatus = (status) => {
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
          {session?.user?.is_staff ? <th scope="col">Customer</th> : null}
          <th scope="col">Payment Ref</th>
          <th scope="col">Total</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td
              colSpan={session?.user?.is_staff ? 5 : 4}
              className="text-center"
            >
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
              {session?.user?.is_staff ? <td>{item.customer.name}</td> : null}
              <td>{item.reference}</td>
              <td className="fw-bold">
                &#8358;
                {parseFloat(item.amount).toLocaleString()}
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
