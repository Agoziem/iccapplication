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
  const organizationId = useMemo(
    () => Number(ORGANIZATION_ID || process.env.NEXT_PUBLIC_ORGANIZATION_ID),
    []
  );

  // Filter state
  const [filter, setFilter] = useState("Today");

  // Memoized filter change handler
  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

  // Data hooks
  const { data: orders, isLoading: loadingOrders } =
    usePayments(organizationId);
  const { data: userOrders, isLoading: loadingUserOrders } = usePaymentsByUser(
    currentUser?.id || 0
  );

  // Memoized loading state and data based on user role
  const { isLoading, data } = useMemo(() => {
    if (currentUser?.is_staff) {
      return { isLoading: loadingOrders, data: orders };
    }
    return { isLoading: loadingUserOrders, data: userOrders };
  }, [
    currentUser?.is_staff,
    loadingOrders,
    orders,
    loadingUserOrders,
    userOrders,
  ]);

  return (
    <div
      className="card recent-sales overflow-auto p-3"
      role="region"
      aria-label="Recent sales section"
    >
      <div className="card-body pt-0">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center mb-3">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center bg-secondary-light text-secondary `}
              style={{
                width: "48px",
                height: "48px",
                fontSize: "1.2rem",
                flexShrink: 0,
              }}
              role="img"
              aria-label={`orders section icon`}
            >
              <i className="bi bi-bag-check " aria-hidden="true"></i>
            </div>
            <h6 className="ms-3 mb-0">
              Recent Orders<span className="text-muted ms-2">| {filter}</span>
            </h6>
          </div>
          <CardFilter filterChange={handleFilterChange} />
        </div>
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
