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
import { ORGANIZATION_ID } from "@/data/constants";
import { useOrganization } from "@/data/hooks/organization.hooks";
import { useRegisterUser } from "@/data/hooks/user.hooks";
import { UserRegistrationSchema } from "@/schemas/users";
import { UserRegistration } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const FormDataSchema = UserRegistrationSchema.extend({
  confirmPassword: UserRegistrationSchema.shape.password,
  organization_id: z.number().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormDataType = z.infer<typeof FormDataSchema>;

const SignupPage = () => {
  const router = useRouter();
  const { data: OrganizationData } = useOrganization(
    Number(ORGANIZATION_ID || "0")
  );
  const [submitting, startSubmitting] = useTransition();
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "success" | "danger" | "info" | "warning";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const { mutateAsync: registerUser } = useRegisterUser();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
  } = useForm<FormDataType>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (OrganizationData && OrganizationData.id) {
      // Set organization_id when organization data is loaded
      setValue("organization_id", OrganizationData.id);
    }
  }, [OrganizationData, setValue]);

  const onSubmit = async (data: FormDataType) => {
    startSubmitting(async () => {
      try {
        // Prepare user registration data (exclude confirmPassword)
        const { confirmPassword, ...registrationData } = data;

        const result = await registerUser(registrationData);

        if (result.message && result.user) {
          if (
            result.user.email &&
            result.user.verificationToken &&
            OrganizationData
          ) {
            const expire_time = result.user.expireTime
              ? new Date(result.user.expireTime)
              : new Date(Date.now() + 60 * 60 * 1000); // 1 hour ahead
            await sendVerificationEmail(
              result.user.email,
              result.user.verificationToken,
              expire_time,
              OrganizationData
            );
            setAlert({
              show: true,
              message:
                "Registration successful! Please check your email for verification.",
              type: "success",
            });
          } else {
            setAlert({
              show: true,
              message:
                "Registration successful!, but verification email could not be sent.",
              type: "success",
            });
          }

          // Reset form on success
          reset();
        } else {
          setAlert({
            show: true,
            message: result.message || "Registration failed",
            type: "danger",
          });
        }
      } catch (error: any) {
        console.error("Error:", error);
        const message =
          error.status === 400
            ? "A user with that email already exists"
            : "An unexpected error occurred, please try again";

        setAlert({
          show: true,
          message,
          type: "danger",
        });
      } finally {
        setTimeout(() => {
          setAlert((prev) => ({ ...prev, show: false }));
        }, 5000);
      }
    });
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
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group d-md-flex my-4">
                  {/* firstname */}
                  <div className=" mb-4 mb-md-0 me-md-2">
                    <input
                      type="text"
                      {...register("firstname")}
                      className={`form-control  ${
                        errors.firstname ? "is-invalid" : ""
                      }`}
                      placeholder="firstname"
                      required
                    />
                    {errors.firstname && (
                      <div className="text-danger invalid-feedback">
                        {errors.firstname.message}
                      </div>
                    )}
                  </div>

                  {/* lastname */}
                  <div>
                    <input
                      type="text"
                      {...register("lastname")}
                      className={`form-control ${
                        errors.lastname ? "is-invalid" : ""
                      }`}
                      placeholder="lastname"
                      required
                    />
                    {errors.lastname && (
                      <div className="text-danger invalid-feedback">
                        {errors.lastname.message}
                      </div>
                    )}
                  </div>
                </div>

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
                        className={`${errors.password ? "is-invalid" : ""}`}
                        placeholder="Enter your password"
                        required
                      />
                    )}
                  />
                  {errors.password && (
                    <div className="text-danger invalid-feedback">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                {/* confirmPassword */}
                <div className="form-group my-4">
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        className={`${
                          errors.confirmPassword ? "is-invalid" : ""
                        }`}
                        placeholder="Confirm your password"
                        required
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <div className="text-danger invalid-feedback">
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
                <div className="form-group my-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={submitting || isSubmitting}
                  >
                    {submitting || isSubmitting
                      ? "Creating account..."
                      : "Create Account"}
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
