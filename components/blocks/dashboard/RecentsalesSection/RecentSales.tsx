import React, { useState, useMemo, useCallback } from "react";
import CardFilter from "../Card/CardFilter";
import RecentSalesTable from "./RecentSalesTable";
import "./recentSales.css";
import { ORGANIZATION_ID } from "@/data/constants";
import useCurrentUser from "@/hooks/useCurrentUser";
import { usePayments, usePaymentsByUser } from "@/data/hooks/payment.hooks";

const RecentSales: React.FC = React.memo(() => {
  const { currentUser } = useCurrentUser();
  
  // Memoized organization ID
  const organizationId = useMemo(() =>
    Number(ORGANIZATION_ID || process.env.NEXT_PUBLIC_ORGANIZATION_ID),
    []
  );
  
  // Filter state
  const [filter, setFilter] = useState("Today");
  
  // Memoized filter change handler
  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

  // Data hooks
  const { data: orders, isLoading: loadingOrders } = usePayments(organizationId);
  const { data: userOrders, isLoading: loadingUserOrders } = usePaymentsByUser(currentUser?.id || 0);

  // Memoized loading state and data based on user role
  const { isLoading, data } = useMemo(() => {
    if (currentUser?.is_staff) {
      return { isLoading: loadingOrders, data: orders };
    }
    return { isLoading: loadingUserOrders, data: userOrders };
  }, [currentUser?.is_staff, loadingOrders, orders, loadingUserOrders, userOrders]);

  return (
    <div className="card recent-sales overflow-auto p-3" role="region" aria-label="Recent sales section">
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-semibold">
          <i className="bi bi-bag-check me-2" aria-hidden="true"></i>
          Recent Orders
          <span className="text-muted ms-2">| {filter}</span>
        </h6>
        <CardFilter filterChange={handleFilterChange} />
      </div>
      
      <hr className="mt-2" />
      
      <div className="card-body pt-0">
        <RecentSalesTable 
          loading={isLoading} 
          items={data} 
          currentUser={currentUser}
        />
      </div>
    </div>
  );
});

RecentSales.displayName = "RecentSales";

export default RecentSales;
