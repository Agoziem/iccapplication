"use client";
import FormWrapper from "@/components/features/auth/FormWrapper";
import React, { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import Image from "next/image";
import styles from "../accounts.module.css";
import Link from "next/link";
import Alert from "@/components/custom/Alert/Alert";
import { sendVerificationEmail } from "@/utils/mail";
import PasswordInput from "@/components/custom/Inputs/PasswordInput";

const SigninPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || DEFAULT_LOGIN_REDIRECT;
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState(null);
  const [loggingIn, startLoggingIn] = useTransition();
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.password) errors.password = "Your password is required";
    return errors;
  };

  const validateUser = async (email) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/authapi/getUserbyEmail/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    
    /** @type {User} */
    const data = await res.json();
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      const { email, password } = formData;
      startLoggingIn(async () => {

        // check whether the user email is verified
        const user = await validateUser(email);
        if (user?.emailIsVerified === true) {
          try {
            const result = await signIn("credentials", {
              redirect: false,
              email,
              password,
            });
            if (user.date_joined === user.last_login) {
                // 
            }
            if (result?.error) {
              throw new Error(result.error);
            } else {
              router.push(next);
            }
          } catch (error) {
            setAlert({
              show: true,
              message: "Invalid credentials, try again",
              type: "danger",
            });
          } finally {
            setFormData({ email: "", password: "" });
            setTimeout(() => {
              setAlert({ show: false, message: "", type: "" });
            }, 5000);
          }
        } else {
          // send Verification email
          const res = await sendVerificationEmail(
            email,
            user.verificationToken
          );
          setAlert({
            show: true,
            message: res.message,
            type: res.success ? "success" : "danger",
          });
          setTimeout(() => {
            setAlert({ show: false, message: "", type: "" });
          }, 5000);
        }
      });
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
        <div className="col-12 col-md-7 p-3 py-5 px-md-5">
          <div className="px-3 px-md-5">
            <FormWrapper
              headerLabel="Get Started."
              backButtonlabel="Don't have an account?"
              backButtonHrefText="Sign up"
              backButtonHref="/accounts/signup"
            >
              <form noValidate onSubmit={handleSubmit}>
                {/* email */}
                <div className="form-group my-4">
                  <input
                    type="email"
                    className={`form-control ${
                      formErrors?.email ? "is-invalid" : ""
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    placeholder="Enter your email"
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

                {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

                {/* submit button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 my-3"
                  disabled={loggingIn}
                >
                  {loggingIn ? "Logging in..." : "Sign In"}
                </button>
              </form>
              <div className="text-end">
                <Link href="/" className="text-primary small me-2">
                  Home
                </Link>
                <Link
                  href={"/accounts/reset-password"}
                  className="text-secondary small"
                >
                  Forgot your password?
                </Link>
              </div>
            </FormWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SigninPage;
