"use client";
import Datatable from "@/components/custom/Datatable/Datatable";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import OrderTableItems from "@/components/features/orders/OrderTableItems";
import { ORGANIZATION_ID } from "@/data/constants";
import { usePayments } from "@/data/hooks/payment.hooks";
import { PaymentResponse } from "@/types/payments";
import React, { useEffect, useState } from "react";

const PaymentsPage = () => {
  const { data: orders } = usePayments(Number(ORGANIZATION_ID || "0"));
  const [items, setItems] = useState<PaymentResponse[] | null>(null);

  useEffect(() => {
    if (orders) {
      // Sort the orders by created_date in descending order (newest first)
      const sortedOrders = [...orders].sort(
        (a, b) =>
          (b?.created_at ? new Date().getTime() : 0) -
          (a?.created_at ? new Date().getTime() : 0)
      );
      setItems(sortedOrders);
    }
  }, [orders]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Payments" />
      <div className="mt-4">
        <h5>Payment History</h5>

        <Datatable
          items={items ?? []}
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
