"use client";
import React, { useEffect, useState } from "react";
import styles from "../accounts.module.css";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Alert from "@/components/custom/Alert/Alert";
import PasswordInput from "@/components/custom/Inputs/PasswordInput";
import { useRouter } from "next/navigation";

const NewPasswordPage = () => {
  const [resultmode, setResultMode] = useState("loading");
  const [errormessage, setErrorMessage] = useState("something went wrong");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const verifyEmail = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/authapi/verifyToken/`,
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

  const validate = () => {
    const errors = {};
    if (!formData.password) errors.password = "Your password is required";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (
      Object.keys(errors).length === 0 &&
      formData.password === formData.confirmPassword
    ) {
      setSubmitting(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/authapi/resetPassword/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: formData.password,
              token,
            }),
          }
        );
        if (response.ok) {
          setAlert({
            show: true,
            message: "Password reset successfully, you can now login to your account",
            type: "success",
          });
          setFormData({ password: "", confirmPassword: "" });
          router.push("/accounts/login");
        } else {
          const data = await response.json();
          setAlert({
            show: true,
            message: data.error,
            type: "danger",
          });
        }
      } catch (error) {
        console.error("error:", error);
        setAlert({
          show: true,
          message: "An error occurred, please try again",
          type: "danger",
        });
      } finally {
        setSubmitting(false);
        setTimeout(() => {
          setAlert({ show: false, message: "", type: "" });
        }, 3000);
      }
    } else {
      setAlert({
        show: true,
        message: "Passwords do not match",
        type: "danger",
      });
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

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
            <h4 className="text-center">Reset your Password</h4>
            {
              {
                loading: (
                  <div className="text-center mt-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>loading...</p>
                  </div>
                ),
                success: (
                  <div className="text-center mt-3 p-3">
          

                    {/* password */}
                    <PasswordInput
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your new password"
                      formErrors={formErrors}
                    />

                    {/* confirmPassword */}
                    <PasswordInput
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your new password"
                      formErrors={formErrors}
                    />

                    {alert.show && (
                      <Alert type={alert.type}>{alert.message}</Alert>
                    )}

                    {/* submit button */}
                    <button
                      type="submit"
                      className="btn btn-primary w-100 my-3"
                      onClick={handleSubmit}
                    >
                      {submitting ? "Submitting in..." : "Submit Password"}
                    </button>
                  </div>
                ),
                error: (
                  <div className="text-center mt-3">
                    <h6 className="text-danger mb-4">{errormessage}</h6>

                    <Link
                      className="btn btn-primary rounded"
                      href="/accounts/reset-password"
                    >
                      Try again
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

export default NewPasswordPage;
