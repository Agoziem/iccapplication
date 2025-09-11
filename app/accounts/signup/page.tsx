"use client";
import React, { useContext, useEffect, useState, useTransition } from "react";
import FormWrapper from "@/components/features/auth/FormWrapper";
import Image from "next/image";
import Link from "next/link";
import styles from "../accounts.module.css";
import { useRouter } from "next/navigation";
import Alert from "@/components/custom/Alert/Alert";
import { sendVerificationEmail } from "@/utils/mail";
import PasswordInput from "@/components/custom/Inputs/PasswordInput";
import { useFetchOrganization } from "@/data/organization/organization.hook";

const SignupPage = () => {
  const router = useRouter();
  const { data: OrganizationData } = useFetchOrganization();
  const [formData, setFormData] = useState({
    organization_id: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState(null);
  const [submitting, startSubmitting] = useTransition();
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (OrganizationData && OrganizationData.id) {
      setFormData((prev) => ({
        ...prev,
        id: OrganizationData.id,
      }));
    }
  }, [OrganizationData]);

  // ----------------------------------------
  // Handle form input changes
  // ----------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  // ----------------------------------------
  // Form validation
  // ----------------------------------------

  const validate = () => {
    const errors = {};
    if (!formData.firstname) errors.firstname = "firstname is required";
    if (!formData.lastname) errors.lastname = "lastname is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.password) errors.password = "your password is required";
    if (!formData.confirmPassword) {
      errors.confirmPassword = "password confirmation is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "passwords do not match";
    }
    return errors;
  };

  // ----------------------------------------
  // Handle form submission
  // ----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      startSubmitting(async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/authapi/register/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );
          if (response.ok) {
            setFormData({
              organization_id: null,
              firstname: "",
              lastname: "",
              email: "",
              password: "",
              confirmPassword: "",
            });
            const data = await response.json();
            const verificationres = await sendVerificationEmail(
              data.user.email,
              data.user.verificationToken
            );
            setAlert({
              show: true,
              message: verificationres.message,
              type: verificationres.success ? "success" : "danger",
            });
          } else {
            const message =
              response.status === 400
                ? "a user with that email already exists"
                : "An error occurred, please try again";
            setAlert({
              show: true,
              message: message,
              type: "danger",
            });
          }
        } catch (error) {
          console.error("error:", error);
          setAlert({
            show: true,
            message: "An unexcepted error just occurred, please try again",
            type: "danger",
          });
        } finally {
          setTimeout(() => {
            setAlert((prev) => ({ ...prev, show: false }));
          }, 3000);
        }
      });
    }
  };

  //
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
              src="/sign up.png"
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
        <div className="col-12 col-md-7 p-3 py-5 px-md-5">
          <div className="px-3 px-md-5">
            <FormWrapper
              headerLabel="Create your Account."
              backButtonlabel="Already have an account?"
              backButtonHrefText="Sign in"
              backButtonHref="/accounts/signin"
            >
              <form noValidate onSubmit={handleSubmit}>
                <div className="form-group d-md-flex my-4">
                  {/* firstname */}
                  <div className=" mb-4 mb-md-0 me-md-2">
                    <input
                      type="text"
                      name="firstname"
                      className={`form-control  ${
                        formErrors?.firstname ? "is-invalid" : ""
                      }`}
                      placeholder="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                    />
                    {formErrors?.firstname && (
                      <div className="text-danger invalid-feedback">
                        {formErrors?.firstname}
                      </div>
                    )}
                  </div>

                  {/* lastname */}
                  <div>
                    <input
                      type="text"
                      name="lastname"
                      className={`form-control ${
                        formErrors?.lastname ? "is-invalid" : ""
                      }`}
                      placeholder="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                    />
                    {formErrors?.lastname && (
                      <div className="text-danger invalid-feedback">
                        {formErrors?.lastname}
                      </div>
                    )}
                  </div>
                </div>

                {/* email */}
                <div className="form-group my-4">
                  <input
                    name="email"
                    type="email"
                    className={`form-control ${
                      formErrors?.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {formErrors?.email && (
                    <div className="text-danger invalid-feedback">
                      {formErrors?.email}
                    </div>
                  )}
                </div>

                {/* password */}
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  formErrors={formErrors}
                />

                {/* confirmPassword */}
                <PasswordInput
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  formErrors={formErrors}
                />

                {alert.show && (
                  <div className="my-3">
                    <Alert type={alert.type}>{alert.message}</Alert>
                  </div>
                )}

                {/* submit button */}
                <div className="form-group my-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={submitting}
                  >
                    {submitting ? "Creating account..." : "Create Account"}
                  </button>
                </div>
              </form>

              <div className="text-end">
                <Link href="/" className="text-secondary me-2">
                  Home
                </Link>
              </div>
            </FormWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
