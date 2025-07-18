import React, { useState, useEffect } from "react";
import CardFilter from "../Card/CardFilter";
import RecentSalesTable from "./RecentSalesTable";
import "./recentSales.css";
import { useFetchPayments, useFetchPaymentsByUser } from "@/data/payments/orders.hook";

function RecentSales({ session }) {
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const [filter, setFilter] = useState("Today");
  const handleFilterChange = (filter) => {
    setFilter(filter);
  };
  const { data: orders, isLoading:loadingOrders } = useFetchPayments(Organizationid);
  const { data: userOrders, isLoading:loadingUserOrders} = useFetchPaymentsByUser(session?.user?.id);

  return (
    <div className="card recent-sales overflow-auto p-3">
      <div className="d-flex justify-content-end pe-4">
        <CardFilter filterChange={handleFilterChange} />
      </div>
      <div className="card-body">
        <h6 className="pb-3">
          Recent Orders
          <span>| {filter}</span>
        </h6>
        {session?.user?.is_staff ? (
          <RecentSalesTable loading={loadingOrders} items={orders} session={session} />
        ) : (
          <RecentSalesTable loading={loadingUserOrders} items={userOrders} session={session} />
        )}
      </div>
    </div>
  );
}

export default RecentSales;
