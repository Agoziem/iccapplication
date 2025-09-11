"use client";
import React, { useEffect, useState } from "react";
import styles from "../accounts.module.css";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const VerificationPage = () => {
  const [resultmode, setResultMode] = useState("loading");
  const [errormessage, setErrorMessage] = useState("something went wrong");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyEmail = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/authapi/verifyEmail/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setResultMode("success");
    } else if (res.status === 400) {
      setErrorMessage(data.error);
      setResultMode("error");
    } else {
      setErrorMessage("something went wrong in the server, try again later");
      setResultMode("error");
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setResultMode("error");
    }
  }, [token]);

  return (
    <section
      className={`${styles.siguppage} d-flex justify-content-center align-items-center px-3 py-5`}
    >
      <div
        className="row justify-content-between"
        style={{
          width: "100%",
          maxWidth: "900px",
          borderRadius: "15px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "var(--bgColor)",
        }}
      >
        {/* The Image */}
        <div className="col-12 col-md-5 p-0 d-none d-md-block">
          <div
            className="p-0"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src="/back to School images.avif"
              alt="Authentication"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "15px 0 0 15px",
              }}
              width={500}
              height={500}
            />
          </div>
        </div>

        {/* The Form */}
        <div className="col-12 col-md-7 p-3 py-5 px-md-5 d-flex flex-column justify-content-center px-3 px-md-5">
          <div className="my-auto">
            <h4 className="text-center">email verification</h4>
            {
              {
                loading: (
                  <div className="text-center mt-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Verifying your email address...</p>
                  </div>
                ),
                success: (
                  <div className="text-center mt-3">
                    <h6 className="text-success mb-4">
                      Email verified successfully! You can now login to your
                      account.{" "}
                    </h6>

                    <Link
                      className="btn btn-primary rounded"
                      href="/accounts/signin"
                    >
                      Login to your account
                    </Link>
                  </div>
                ),
                error: (
                  <div className="text-center mt-3">
                    <h6 className="text-danger mb-4">{errormessage}</h6>

                    <Link
                      className="btn btn-primary rounded"
                      href="/accounts/signin"
                    >
                      Resend verification email
                    </Link>
                  </div>
                ),
              }[resultmode]
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerificationPage;
