"use client";
import React, { FC } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { useCart } from "@/data/carts/Cartcontext";
import { PaystackButton } from "react-paystack";
import { useRouter } from "next/navigation";

interface PaystackCustomField {
  display_name: string;
  variable_name: string;
  value: string;
}

interface PaystackButtonConfig {
  email: string;
  amount: number;
  reference: string;
  custom_fields: PaystackCustomField[];
  publicKey: string;
  text: string;
  onSuccess: () => void;
  onClose: () => void;
}

const OrderPage: FC = () => {
  const { data: session } = useSession() as { data: Session | null };
  const { cart, total, reference, resertCart } = useCart();
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const router = useRouter();
  
  // Type guards and validation
  if (!publicKey) {
    return (
      <div className="alert alert-danger m-4">
        Paystack public key is not configured
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="alert alert-warning m-4">
        Please log in to complete your order
      </div>
    );
  }

  const amount = total * 100;
  const name = session.user.username || session.user.name || "Customer";
  const email = session.user.email;
  
  const handleSuccess = (): void => {
    resertCart();
    router.push(`/dashboard/orders/completed?ref=${reference}`);
  };

  const componentProps: PaystackButtonConfig = {
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
    onClose: () => console.log("Payment modal closed"),
  };
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
            
            {cart.length === 0 ? (
              <div className="text-center py-4">
                <p>Your cart is empty</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/dashboard/services')}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
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
                    {cart.map((item) => (
                      <div
                        key={`${item.cartType}-${item.id}`}
                        className="mb-2 d-flex justify-content-between"
                      >
                        <div className="flex-fill">
                          <i className="bi bi-check2-circle me-3 h5 text-secondary fw-bold"></i>
                          {item.cartType === "video" ? 
                            ('title' in item ? item.title : item.name) : 
                            item.name
                          }
                        </div>
                        <div className="float-md-end ms-3 fw-bold">
                          &#8358;{item.price}
                        </div>
                      </div>
                    ))}
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
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderPage;
