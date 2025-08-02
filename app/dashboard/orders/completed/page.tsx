"use client";
import { useCart } from "@/data/Cartcontext";
import React, { useCallback, useEffect, useRef, useState, FC } from "react";
import { useAdminContext } from "@/data/payments/Admincontextdata";
import { BsFillCartCheckFill } from "react-icons/bs";
import { useRouter, useSearchParams } from "next/navigation";
import useJsxToPdf from "@/hooks/useJSXtoPDF";
import { FaCheck, FaRegClipboard } from "react-icons/fa6";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { paymentsAPIendpoint, verifyPayment } from "@/data/payments/fetcher";
import { BeatLoader } from "react-spinners";
import { sendPaymentSuccessfulEmail } from "@/utils/mail";
import { useQueryClient } from "react-query";
import { Order } from "@/types/payments";

interface VerifyPaymentData {
  reference: string;
  customer_id: number;
}

interface QueryClientOrderData {
  id: string;
  reference?: string;
  status?: string;
}

const OrderCompleted: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref") || "";
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { loading: loadingPdf, generatePdf } = useJsxToPdf();
  const pdfRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession() as { data: Session | null };

  const savePdf = async (): Promise<void> => {
    if (pdfRef.current) {
      await generatePdf(pdfRef.current, "Order-Receipt");
    }
  };

  // -------------------------------
  // Verify payment function
  // -------------------------------
  const queryClient = useQueryClient();
  const verifypayment = useCallback(async (): Promise<void> => {
    if (!reference) {
      setError("Reference does not exist");
      return;
    }

    if (!session?.user?.id) {
      setError("User session not found");
      return;
    }

    setLoading(true); // Ensure loading state is set to true

    try {
      const paymentData: VerifyPaymentData = {
        reference,
        customer_id: parseInt(session.user.id),
      };

      // Call the API to verify payment
      const data = (await verifyPayment(
        `${paymentsAPIendpoint}/verifypayment/`,
        paymentData
      )) as Order;

      // Optimistically update the "orders" cache
      queryClient.invalidateQueries("payments");
      queryClient.invalidateQueries(["paymentsByUser", session.user.id]);

      setOrder(data);
      setSuccess("Your Payment has been Verified");
      await sendPaymentSuccessfulEmail(data);
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      setError(error?.message || "An error occurred while verifying payment");
    } finally {
      setLoading(false); // Reset the loading state
    }
  }, [reference, session, queryClient]);

  // -----------------------------------------------
  // trigger the Verify Payment on page load
  // -----------------------------------------------
  useEffect(() => {
    if (session && reference) {
      verifypayment();
    }
  }, [verifypayment, session, reference]);

  // -----------------------------------------------
  // Copy to clipboard function
  // -----------------------------------------------
  const handleCopy = (): void => {
    setCopied(true);
    if (order?.reference) {
      navigator.clipboard.writeText(order.reference);
    }
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "100vh" }}
    >
      {/* Loading Spinner */}
      {!success && !error ? (
        <BeatLoader color="#12000d" loading={loading} />
      ) : null}

      {/* Order Completed Card */}
      {success && order ? (
        <div
          className="card text-center"
          style={{
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <div ref={pdfRef} className="px-3 px-md-5 pt-5">
            <div>
              <div
                className="text-center bg-success-light d-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  margin: "0 auto",
                }}
              >
                <BsFillCartCheckFill
                  style={{
                    fontSize: "40px",
                    color: "var(--success)",
                  }}
                />
              </div>

              <h5 className="mb-3">Payment Successful</h5>
              <p className="mb-1">Thank you for your payment</p>
              {/* Order Id */}
              <p className="mb-1">
                <span className="fw-bold">Order ID: </span>
                {order.id}
              </p>
              {/* Amount */}
              <p className="mb-1">
                <span className="fw-bold">Amount: </span>
              </p>
              <h3 className="fw-bold">&#8358;{order.amount}</h3>

              {/* Payment ref */}
              <p className="mb-1">
                <span className="fw-bold">Payment Reference: </span>
              </p>
              <div className="text-primary">
                {order.reference}
                {copied ? (
                  <FaCheck className="h6 ms-2 text-success" />
                ) : (
                  <FaRegClipboard
                    className="h6 ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={handleCopy}
                  />
                )}
              </div>
              <div
                className="px-3 small"
                style={{
                  color: "var(--bgDarkerColor)",
                }}
              >
                Copy the payment reference to clipboard to track your order
              </div>
            </div>

            {/* Items Ordered */}
            <div className="mt-3">
              {/* Services Table */}
              {order && order.services && order.services.length > 0 && (
                <div className="px-3">
                  <div className="fw-bold text-primary">Services bought</div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">S/N</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.services.map((service, index) => (
                        <tr key={service.id}>
                          <td className="fw-bold">{index + 1}</td>
                          <td>{service.name}</td>
                          <td>&#8358;{service.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Products Table */}
              {order && order.products && order.products.length > 0 && (
                <div className="px-3">
                  <div className="fw-bold text-primary">Products bought</div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">S/N</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((product, index) => (
                        <tr key={product.id}>
                          <td className="fw-bold">{index + 1}</td>
                          <td>{product.name}</td>
                          <td>&#8358;{product.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Videos Table */}
              {order && order.videos && order.videos.length > 0 && (
                <div className="px-3">
                  <div className="fw-bold text-primary">Videos bought</div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">S/N</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.videos.map((video, index) => (
                        <tr key={video.id}>
                          <td className="fw-bold">{index + 1}</td>
                          <td>{video.title}</td>
                          <td>&#8358;{video.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Date Ordered */}
            <div className="mt-2">
              <p>
                <span className="fw-bold">Date of Payment:</span>{" "}
                {order.last_updated_date
                  ? new Date(order.last_updated_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Download buttons */}
          <div className="my-3 mb-5">
            <div>
              <Link
                href={"/dashboard/my-orders"}
                className="btn btn-primary shadow-none rounded px-5"
              >
                View your Orders <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
            <button
              className="btn btn-accent-secondary my-3 mb-3 py-2 px-5 mb-md-0 rounded"
              style={{
                fontSize: "15px",
                borderRadius: "25px",
              }}
              disabled={loadingPdf}
              onClick={savePdf}
            >
              {loadingPdf ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Downloading...</span>
                </div>
              ) : (
                "Save Receipt as PDF"
              )}
            </button>
          </div>
        </div>
      ) : null}

      {/* Error Card */}
      {error && (
        <div className="card p-4">
          <div className="alert alert-danger mt-4">{error}</div>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/dashboard/services")}
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCompleted;
