"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io5";
import Alert from "@/components/custom/Alert/Alert";
import "./section.css";
import {
  useCreateSubscription,
  useOrganization,
} from "@/data/hooks/organization.hooks";
import { ORGANIZATION_ID } from "@/data/constants";
import { CreateSubscriptionSchema } from "@/schemas/organizations";
import { CreateSubscription } from "@/types/organizations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type AlertType = "info" | "success" | "warning" | "danger";

const FooterSection = () => {
  const { data: OrganizationData } = useOrganization(
    parseInt(ORGANIZATION_ID as string, 10)
  );
  const { mutateAsync: createSubscription } = useCreateSubscription();

  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
    show: boolean;
  }>({
    type: "info",
    message: "",
    show: false,
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateSubscription>({
    resolver: zodResolver(CreateSubscriptionSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: CreateSubscription) => {
    try {
      await createSubscription({
        organizationId: Number(ORGANIZATION_ID || "0"),
        subscriptionData: data
      });
      reset();
      setAlert({
        type: "success",
        message: "You have successfully subscribed to our newsletter",
        show: true,
      });
      setTimeout(() => {
        setAlert({
          type: "info",
          message: "",
          show: false,
        });
      }, 5000);
    } catch (error: any) {
      setAlert({
        type: "danger",
        message: error.message || "An error occurred while subscribing",
        show: true,
      });
      setTimeout(() => {
        setAlert({
          type: "info",
          message: "",
          show: false,
        });
      }, 3000);
    }
  };

  return (
    <section className="footer">
      <div className="p-5 p-md-5">
        <div className="row px-0 px-md-5">
          <div className="col-12 col-md-6">
            <div className="footer-info pe-0 pe-md-5 mb-4 mb-md-0">
              <h5>ICC Online Center</h5>
              <p className="small mb-1">
                connect with us on our social media platforms
              </p>
              <div className="social-links">
                <Link
                  href={OrganizationData?.facebooklink || "#"}
                  target="_blank"
                >
                  <FaFacebook
                    className="me-2"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </Link>
                <Link
                  href={OrganizationData?.whatsapplink || "#"}
                  target="_blank"
                >
                  <IoLogoWhatsapp
                    className="mx-2"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </Link>
                <Link
                  href={OrganizationData?.instagramlink || "#"}
                  target="_blank"
                >
                  <FaInstagram
                    className="mx-2"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </Link>
                <Link
                  href={OrganizationData?.twitterlink || "#"}
                  target="_blank"
                >
                  <FaXTwitter
                    className="mx-2"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </Link>
                <Link
                  href={OrganizationData?.linkedinlink || "#"}
                  target="_blank"
                >
                  <FaLinkedinIn
                    className="mx-2"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </Link>
                <Link
                  href={OrganizationData?.tiktoklink || "#"}
                  target="_blank"
                >
                  <FaTiktok
                    className="mx-2"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </Link>
              </div>
              <div className="mt-3">
                <p className="small">
                  subscribe to our newsletter to get updates on our latest
                  products and services
                </p>
                {alert.show && (
                  <div className="mb-2">
                    <Alert type={alert.type}>{alert.message}</Alert>
                  </div>
                )}
                {errors?.email && (
                  <div className="text-danger mb-2">{errors.email.message}</div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="subscribe-input d-md-flex">
                    <input
                      {...register("email")}
                      type="email"
                      className={`form-control ${
                        errors?.email ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your email"
                      disabled={isSubmitting}
                    />

                    <button
                      type="submit"
                      className="btn btn-primary ms-0 ms-md-3 mt-3 mt-md-0"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 d-flex justify-content-center ">
            <div className="footer-links">
              <h6>Quick Links</h6>
              <ul className=" list-unstyled ">
                <li>
                  <Link className="small" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="small" href="/#about">
                    About
                  </Link>
                </li>
                <li>
                  <Link className="small" href="/#services">
                    Services
                  </Link>
                </li>
                <li>
                  <Link className="small" href="/#staffs">
                    Departments
                  </Link>
                </li>
                <li>
                  <Link className="small" href="/#contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-6 col-md-3 d-flex justify-content-center ">
            <div className="footer-links">
              <h6>features</h6>
              <ul className="list-unstyled">
                <li>
                  <Link className="small" href="/articles">
                    Articles
                  </Link>
                </li>
                <li>
                  <Link className="small" href="/dashboard/cbt">
                    CBT practice
                  </Link>
                </li>
                <li>
                  <Link className="small" href="/dashboard/chat">
                    Chatroom
                  </Link>
                </li>
                <li>
                  <Link className="small" href="/dashboard/services">
                    Jamb
                  </Link>
                </li>
                <li>
                  <Link className="small" href="/dashboard/services">
                    Post Utme
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* subfooter */}
      <div className="subfooter py-3 d-flex justify-content-center align-items-center">
        <p className="text-center  small mb-0">
          &copy; 2024{" "}
          <span className="text-secondary">Innovations CyberCafe.</span> All
          Rights Reserved
        </p>
      </div>
    </section>
  );
};

export default FooterSection;
