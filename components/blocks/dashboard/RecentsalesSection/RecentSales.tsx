import React, { useState } from "react";
import CardFilter from "../Card/CardFilter";
import RecentSalesTable from "./RecentSalesTable";
import "./recentSales.css";
import { useFetchPayments, useFetchPaymentsByUser } from "@/data/payments/orders.hook";
import { Session } from "next-auth";

interface RecentSalesProps {
  session: Session | null;
}

const RecentSales: React.FC<RecentSalesProps> = ({ session }) => {
  const organizationId = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const [filter, setFilter] = useState<string>("Today");
  
  const handleFilterChange = (filter: string): void => {
    setFilter(filter);
  };
  
  const { data: orders, isLoading: loadingOrders } = useFetchPayments(
    organizationId ? parseInt(organizationId) : 0
  );
  const { data: userOrders, isLoading: loadingUserOrders } = useFetchPaymentsByUser(
    session?.user?.id ? parseInt(session.user.id) : 0
  );

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
};

export default RecentSales;
