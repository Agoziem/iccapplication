import UserOrders from "@/components/features/orders/UserOrders";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import React from "react";

const MyOrders = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="My Orders" />
      <div>
        <UserOrders />
      </div>
    </div>
  );
};

export default MyOrders;
