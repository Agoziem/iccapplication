"use client";
import Datatable from "@/components/custom/Datatable/Datatable";
import Modal from "@/components/custom/Modal/modal";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import CustomersTable from "@/components/features/orders/CustomersTable";
import { ORGANIZATION_ID } from "@/data/constants";
import { useOrderReport } from "@/data/hooks/payment.hooks";
import { useUserById } from "@/data/hooks/user.hooks";
import { CustomerPaymentStatsArray } from "@/types/payments";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const CustomersPage = () => {
  const [items, setItems] = useState<CustomerPaymentStatsArray | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [customerID, setCustomerID] = useState<number | null>(null);
  const { data: orderReport } = useOrderReport(Number(ORGANIZATION_ID || "0"));

  useEffect(() => {
    if (orderReport) {
      setItems(orderReport.customers ? orderReport.customers : null);
    }
  }, [orderReport]);

  // fetch User
  const {
    data: customer,
    isLoading: loadingCustomer,
    error,
  } = useUserById(customerID || 0);

  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Customers" />
      <div className="mt-4">
        <h5>ICC Customers</h5>
        {items && items.length > 0 && (
          <Datatable
            items={items}
            setItems={setItems}
            label={"Customers"}
            filteritemlabel={"customer__username"}
          >
            <CustomersTable
              setCustomerID={setCustomerID}
              toggleModal={() => setShowModal(true)}
            />
          </Datatable>
        )}

        {/* Modal for Comment */}
        <Modal showmodal={showModal} toggleModal={() => setShowModal(false)}>
          <div className="modal-body">
            {loadingCustomer && (
              <div className="w-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div>loading Customer</div>
              </div>
            )}

            {!loadingCustomer && customer ? (
              <div>
                <div className="profilepicture d-flex flex-column justify-content-center align-items-center my-3">
                  {customer.avatar_url ? (
                    <Image
                      src={customer.avatar_url}
                      alt="Picture of the Customer"
                      width={80}
                      height={80}
                      className="rounded-circle"
                      style={{
                        objectFit: "cover",
                        objectPosition: "top center",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle text-white d-flex justify-content-center align-items-center"
                      style={{
                        width: 80,
                        height: 80,
                        fontSize: 40,
                        backgroundColor: "var(--bgDarkerColor)",
                      }}
                    >
                      {customer.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h5 className="text-center my-0">{customer.username}</h5>
                <p className="text-center my-0 mb-2">
                  {customer.is_staff ? "Admin" : "Customer"}
                </p>
                <hr />

                <p className="my-1">
                  <span className="fw-bold">fullname: </span>
                  {customer.first_name} {customer.last_name}
                </p>
                <p className="my-1">
                  <span className="fw-bold">email: </span>
                  {customer.email || "email is not available"}
                </p>
                <p className="my-1">
                  <span className="fw-bold">sex: </span>
                  {customer.Sex || "sex is not available"}
                </p>
                <p className="my-1">
                  <span className="fw-bold">phone number: </span>
                  {customer.phone || "Phone number is not available"}
                </p>
                <p className="my-1">
                  <span className="fw-bold">address: </span>
                  {customer.address || "address is not available"}
                </p>

                <p className="my-1">
                  <span className="fw-bold">currently </span>
                  {customer.is_active ? "active" : "not active"}
                </p>
                <p>
                  <span className="fw-bold">date joined: </span>{" "}
                  {customer.date_joined &&
                    new Date(customer.date_joined).toDateString()}
                </p>
              </div>
            ) : (
              <div className="text-center">No Customer found</div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CustomersPage;
