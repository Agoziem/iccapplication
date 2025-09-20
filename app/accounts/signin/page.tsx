"use client";
import FormWrapper from "@/components/features/auth/FormWrapper";
import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import Image from "next/image";
import styles from "../accounts.module.css";
import Link from "next/link";
import Alert from "@/components/custom/Alert/Alert";
import { sendVerificationEmail } from "@/utils/mail";
import PasswordInput from "@/components/custom/Inputs/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useVerifyUser } from "@/data/hooks/user.hooks";
import { UserLoginSchema } from "@/schemas/users";
import { UserLogin } from "@/types/users";
import { saveToken } from "@/utils/auth";
import { useOrganization } from "@/data/hooks/organization.hooks";
import { ORGANIZATION_ID } from "@/data/constants";

const SigninPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || DEFAULT_LOGIN_REDIRECT;
  const [loggingIn, startLoggingIn] = useTransition();
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "success" | "danger" | "info" | "warning";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const { mutateAsync: verifyUser } = useVerifyUser();
  const { data: OrganizationData } = useOrganization(
    parseInt(ORGANIZATION_ID || "1")
  );

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<UserLogin>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserLogin) => {
    startLoggingIn(async () => {
      try {
        // Check whether the user email is verified
        const response = await verifyUser(data);

        if (response?.user.emailIsVerified === true) {
          try {
            if (response && response.access_token) {
              // Save token and redirect
              saveToken(response);
              router.push(redirect);
              setAlert({
                show: true,
                message: "Login successful! Redirecting...",
                type: "success",
              });
            } else {
              throw new Error("Invalid credentials");
            }
          } catch (error) {
            setAlert({
              show: true,
              message: "Invalid credentials, try again",
              type: "danger",
            });
          }
        } else {
          // Send Verification email
          if (response?.user.verificationToken && response?.user.email && OrganizationData) {
            const expire_time = response?.user?.expireTime
              ? new Date(response.user.expireTime)
              : new Date(Date.now() + 60 * 60 * 1000); // 1 hour ahead
            const emailResult = await sendVerificationEmail(
              response?.user.email || data.email,
              response?.user.verificationToken,
              expire_time,
              OrganizationData
            );
            setAlert({
              show: true,
              message: emailResult.message,
              type: emailResult.success ? "success" : "danger",
            });
          }
        }
      } catch (error: any) {
        console.error("Error:", error);
        setAlert({
          show: true,
          message: error.message || "An error occurred, please try again",
          type: "danger",
        });
      } finally {
        reset();
        setTimeout(() => {
          setAlert({ show: false, message: "", type: "success" });
        }, 5000);
      }
    });
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
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                {/* email */}
                <div className="form-group my-4">
                  <input
                    type="email"
                    {...register("email")}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && (
                    <div className="text-danger invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                {/* password */}
                <div className="form-group my-4">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        placeholder="Enter your password"
                        required
                        className={`${errors.password ? "is-invalid" : ""}`}
                      />
                    )}
                  />
                  {errors.password && (
                    <div className="text-danger invalid-feedback">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

                {/* submit button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 my-3"
                  disabled={isSubmitting || loggingIn}
                >
                  {isSubmitting || loggingIn ? "Logging in..." : "Sign In"}
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
