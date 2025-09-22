"use client";
import React, { useMemo } from "react";
import { PaystackButton } from "react-paystack";
import { useParams, useRouter } from "next/navigation";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { usePaymentbyRef } from "@/data/hooks/payment.hooks";
import { BeatLoader } from "react-spinners";

const OrderPage = () => {
  const { data: user } = useMyProfile();
  const { ref } = useParams() as { ref: string };
  const { data: order, isLoading, error } = usePaymentbyRef(ref);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
  const router = useRouter();
  const name = useMemo(() => user?.username || "", [user]);
  const email = useMemo(() => user?.email || "", [user]);
  const total = useMemo(() => (order ? Number(order.amount) : 0), [order]);
  const amount = useMemo(() => total * 100, [total]); // Paystack expects amount in kobo
  const handleSuccess = () => {
    router.push(`/dashboard/orders/${ref}/completed`);
  };

  const componentProps = useMemo(
    () => ({
      email,
      amount,
      reference: ref,
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
    [email, amount, ref, name, publicKey]
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

              {/* Loading State */}
              {isLoading && (
                <li
                  className="list-group-item"
                  style={{
                    background: "var(--bgLighterColor)",
                    borderColor: "var(--bgDarkColor)",
                  }}
                >
                  <div className="py-2 text-center">
                    <BeatLoader size={8} color="var(--bgDarkerColor)" />
                  </div>
                </li>
              )}

              {/* Error State */}
              {error && (
                <li
                  className="list-group-item"
                  style={{
                    background: "var(--bgLighterColor)",
                    borderColor: "var(--bgDarkColor)",
                  }}
                >
                  <div className="py-2 fw-bold">Error Loading Order</div>
                </li>
              )}

              {/* Order Items */}
              <li
                className="list-group-item text-primary"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                }}
              >
                {/* Service Items */}
                {order &&
                  order.services.length > 0 &&
                  order.services.map((item) => (
                    <div
                      key={`${item.id}-service`}
                      className="mb-2 d-flex justify-content-between"
                    >
                      <div className="flex-fill">
                        <i className="bi bi-check2-circle me-3 h5 text-secondary fw-bold"></i>
                        {item.name}
                      </div>
                      <div className="float-md-end ms-3 fw-bold">
                        &#8358;{item.price}
                      </div>
                    </div>
                  ))}

                {/* Product Items */}
                {order &&
                  order.products.length > 0 &&
                  order.products.map((item) => (
                    <div
                      key={`${item.id}-product`}
                      className="mb-2 d-flex justify-content-between"
                    >
                      <div className="flex-fill">
                        <i className="bi bi-check2-circle me-3 h5 text-secondary fw-bold"></i>
                        {item.name}
                      </div>
                      <div className="float-md-end ms-3 fw-bold">
                        &#8358;{item.price}
                      </div>
                    </div>
                  ))}

                {/* Video Items */}
                {order &&
                  order.videos.length > 0 &&
                  order.videos.map((item) => (
                    <div
                      key={`${item.id}-video`}
                      className="mb-2 d-flex justify-content-between"
                    >
                      <div className="flex-fill">
                        <i className="bi bi-check2-circle me-3 h5 text-secondary fw-bold"></i>
                        {item.title}
                      </div>
                      <div className="float-md-end ms-3 fw-bold">
                        &#8358;{item.price}
                      </div>
                    </div>
                  ))}
              </li>

              {/* Total Amount */}
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
