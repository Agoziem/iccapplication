"use client";
import FormWrapper from "@/components/features/auth/FormWrapper";
import React, { useState } from "react";
import Image from "next/image";
import styles from "../accounts.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Alert from "@/components/custom/Alert/Alert";
import { sendPasswordResetEmail } from "@/utils/mail";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useGetResetPasswordToken } from "@/data/hooks/user.hooks";
import { GetVerificationToken } from "@/types/users";
import { GetVerificationTokenSchema } from "@/schemas/users";

const PasswordResetPage = () => {
  const router = useRouter();
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "success" | "danger" | "info" | "warning";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const { mutateAsync: getResetPasswordToken } = useGetResetPasswordToken();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GetVerificationToken>({
    resolver: zodResolver(GetVerificationTokenSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: GetVerificationToken) => {
    try {
      const result = await getResetPasswordToken(data.email);
      
      // Send password reset email
      const emailResult = await sendPasswordResetEmail(data.email, result.message);
      
      setAlert({
        show: true,
        message: emailResult.message,
        type: emailResult.success ? "success" : "danger",
      });
      
      if (emailResult.success) {
        reset();
      }
    } catch (error: any) {
      console.error("Error:", error);
      setAlert({
        show: true,
        message: error.message || "User not found or an error occurred",
        type: "danger",
      });
    } finally {
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "success" });
      }, 5000);
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
              headerLabel="Reset Password"
              backButtonlabel="Don't have an account?"
              backButtonHrefText="Sign up"
              backButtonHref="/accounts/signup"
              showSocial={false}
            >
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                {/* email */}
                <div className="form-group my-4">
                  <input
                    {...register("email")}
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                {alert.show && (
                  <div className="my-3">
                    <Alert type={alert.type}>{alert.message}</Alert>
                  </div>
                )}

                {/* submit button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 my-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </form>
              <div className="text-end">
                <Link
                  href="#"
                  className="text-primary small me-2"
                  onClick={(e) => {
                    e.preventDefault();
                    router.back();
                  }}
                >
                  Back to login
                </Link>
              </div>
            </FormWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordResetPage;
