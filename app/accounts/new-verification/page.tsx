"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../accounts.module.css";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useVerifyEmail } from "@/data/hooks/user.hooks";
import { saveToken } from "@/utils/auth";

const VerificationPage = () => {
  const [resultmode, setResultMode] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errormessage, setErrorMessage] = useState("something went wrong");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutateAsync: verifyEmailMutation } = useVerifyEmail();

  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        const data = await verifyEmailMutation({ token });
        setResultMode("success");
        saveToken(data);
      } catch (error: any) {
        if (error.response?.status === 400) {
          setErrorMessage(
            error.response.data.error || "Invalid or expired token."
          );
          setResultMode("error");
        } else {
          setErrorMessage(
            "something went wrong in the server, try again later"
          );
          setResultMode("error");
        }
      }
    },
    [verifyEmailMutation]
  );

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setErrorMessage("something went wrong in the server, try again later");
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
