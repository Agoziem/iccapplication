"use client";
import React, { useEffect, useState } from "react";
import UserServices from "./UserServices";
import UserProducts from "./UserProducts";
import UserVideos from "./UserVideos";
import Datatable from "@/components/custom/Datatable/Datatable";
import OrderTableItems from "./OrderTableItems";
import { useFetchPaymentsByUser } from "@/data/payments/orders.hook";
import { useSession } from "next-auth/react";

const UserOrders = () => {
  const { data: session } = useSession();
  const categories = ["services", "products", "videos"];
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [items, setItems] = useState([]);
  const { data: userOrders, isLoading: loadingUserOrders } =
    useFetchPaymentsByUser(session?.user?.id);

  useEffect(() => {
    setItems(userOrders);
  }, [userOrders]);

  return (
    <div className="mt-4">
      {categories.map((category) => (
        <div
          key={category}
          className={`badge rounded-5 px-4 py-2 me-2 mb-2 mb-md-0`}
          style={{
            color:
              activeTab === category ? "var(--secondary)" : "var(--primary)",
            backgroundColor:
              activeTab === category ? "var(--secondary-300)" : " ",
            border:
              activeTab === category
                ? "1.5px solid var(--secondary)"
                : "1.5px solid var(--bgDarkerColor)",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab(category)}
        >
          {category}
        </div>
      ))}

      {/* Items Purchased */}
      <div className="mt-4">
        {activeTab === "services" && (
          <div>
            <UserServices />
          </div>
        )}
        {activeTab === "products" && (
          <div>
            <UserProducts />
          </div>
        )}
        {activeTab === "videos" && (
          <div>
            <UserVideos />
          </div>
        )}
      </div>

      {/* Order table */}
      <div className="mt-2">
        <h5>All Orders</h5>
        <Datatable
          items={items}
          setItems={setItems}
          label={"Orders"}
          filteritemlabel={"reference"}
        >
          <OrderTableItems />
        </Datatable>
      </div>
    </div>
  );
};

export default UserOrders;
