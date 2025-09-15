"use client";
import React, { useEffect, useState } from "react";
import styles from "../accounts.module.css";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Alert from "@/components/custom/Alert/Alert";
import PasswordInput from "@/components/custom/Inputs/PasswordInput";
import { useRouter } from "next/navigation";
import { useResetPassword } from "@/data/hooks/user.hooks";
import { ResetPasswordSchema } from "@/schemas/users";
import { ResetPassword } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {z} from "zod";

const FormDataSchema = ResetPasswordSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormDataType = z.infer<typeof FormDataSchema>;

const NewPasswordPage = () => {
  const [resultmode, setResultMode] = useState("loading");
  const [errormessage, setErrorMessage] = useState("something went wrong");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "success" | "danger" | "info" | "warning";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  
  const { mutateAsync: changePassword } = useResetPassword();
  const router = useRouter();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<FormDataType>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password values for real-time validation feedback
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Validate token on component mount
  useEffect(() => {
    if (token) {
      setResultMode("success");
    } else {
      setResultMode("error");
      setErrorMessage("Invalid or missing reset token");
    }
  }, [token]);

  const onSubmit = async (data: FormDataType) => {
    try {
      const result = await changePassword({
        token: data.token,
        password: data.password,
      });
      
      setAlert({
        show: true,
        message: "Password reset successfully, you can now login to your account",
        type: "success",
      });
      
      reset();
      setTimeout(() => {
        router.push("/accounts/signin");
      }, 2000);
      
    } catch (error: any) {
      console.error("error:", error);
      setAlert({
        show: true,
        message: error.message || "An error occurred, please try again",
        type: "danger",
      });
    } finally {
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "success" });
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
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      {/* Hidden token field */}
                      <input
                        type="hidden"
                        {...register("token")}
                        value={token || ""}
                      />

                      {/* password */}
                      <div className="form-group my-4">
                        <input
                          {...register("password")}
                          type="password"
                          className={`form-control ${errors.password ? "is-invalid" : ""}`}
                          placeholder="Enter your new password"
                          disabled={isSubmitting}
                        />
                        {errors.password && (
                          <div className="invalid-feedback d-block">
                            {errors.password.message}
                          </div>
                        )}
                      </div>

                      {/* confirmPassword */}
                      <div className="form-group my-4">
                        <input
                          {...register("confirmPassword")}
                          type="password"
                          className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                          placeholder="Confirm your new password"
                          disabled={isSubmitting}
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback d-block">
                            {errors.confirmPassword.message}
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
                        {isSubmitting ? "Submitting..." : "Submit Password"}
                      </button>
                    </form>
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
