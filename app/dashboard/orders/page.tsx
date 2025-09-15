"use client";
import React, { useMemo } from "react";
import { useCart } from "@/providers/context/Cartcontext";
import { PaystackButton } from "react-paystack";
import { useRouter } from "next/navigation";
import { useMyProfile } from "@/data/hooks/user.hooks";

const OrderPage = () => {
  const { data: user } = useMyProfile();
  const { cart, total, reference, resetCart } = useCart();
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
  const router = useRouter();
  const amount = total * 100;
  const name = useMemo(() => user?.username || "", [user]);
  const email = useMemo(() => user?.email || "", [user]);
  const handleSuccess = () => {
    resetCart();
    router.push(`/dashboard/orders/completed?ref=${reference}`);
  };

  const componentProps = useMemo(
    () => ({
      email,
      amount,
      reference,
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: name,
        },
        {
          display_name: "Email",
          variable_name: "email",
          value: email,
        },
      ],
      publicKey,
      text: "Complete Payment",
      onSuccess: () => handleSuccess(),
      onclose: () => console.log("closed"),
    }),
    [email, amount, reference, name, publicKey]
  );

  return (
    <section className="pt-5" style={{ minHeight: "100vh" }}>
      <div
        className="card p-4 mx-auto"
        style={{
          maxWidth: "500px",
        }}
      >
        <div className="row">
          <div className="col-12">
            <h4 className="text-center">Order List</h4>
            <ul className="list-group list-group-flush">
              <li
                className="list-group-item"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                }}
              >
                <div className="py-2 fw-bold">Order Summary</div>
              </li>
              <li
                className="list-group-item text-primary"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                }}
              >
                {cart && cart.length > 0 ? (
                  cart.map((item) => (
                    <div
                      key={`${item.cartType}-${item.id}`}
                      className="mb-2 d-flex justify-content-between"
                    >
                      <div className="flex-fill">
                        <i className="bi bi-check2-circle me-3 h5 text-secondary fw-bold"></i>
                        {"name" in item
                          ? item.name
                          : "title" in item
                          ? item.title
                          : "Unknown Item"}
                      </div>
                      <div className="float-md-end ms-3 fw-bold">
                        &#8358;{item.price}
                      </div>
                    </div>
                  ))
                ) : (
                  <span>No items to order</span>
                )}
              </li>
              <li
                className="list-group-item mt-2"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                }}
              >
                <div className="text-center">Total Amount to pay</div>
                <h3 className="text-center mt-2 fw-bold">&#8358;{total}</h3>
              </li>
            </ul>
            <div className="d-flex justify-content-center">
              <PaystackButton
                {...componentProps}
                className="btn btn-primary w-100 mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderPage;
