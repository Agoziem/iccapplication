"use client";
import Datatable from "@/components/custom/Datatable/Datatable";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import OrderTableItems from "@/components/features/orders/OrderTableItems";
import { useFetchPayments } from "@/data/payments/orders.hook";
import { Orders } from "@/types/payments";
import React, { useEffect, useState } from "react";

const PaymentsPage = () => {
  const [items, setItems] = useState<Orders>([]);
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  // for data fetching and sorting by date
  const { data: orders } = useFetchPayments(Organizationid);

  useEffect(() => {
    if (orders) {
      // Sort the orders by created_date in descending order (newest first)
      const sortedOrders = [...orders].sort((a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setItems(sortedOrders);
    }
  }, [orders]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Payments" />
      <div className="mt-4">
        <h5>Payment History</h5>

        <Datatable
          items={items}
          setItems={setItems}
          label={"Payments"}
          filteritemlabel={"reference"}
        >
          <OrderTableItems />
        </Datatable>
      </div>
    </div>
  );
};

export default PaymentsPage;
