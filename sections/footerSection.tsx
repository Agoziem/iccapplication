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
import { useFetchOrganization } from "@/data/organization/organization.hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

// Zod schema for newsletter subscription
const subscriptionSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface AlertState {
  type: "success" | "danger" | "";
  message: string;
  show: boolean;
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  className?: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  icon,
  className = "mx-2",
}) => (
  <Link href={href || "#"} target="_blank">
    <span className={className} style={{ cursor: "pointer" }}>
      {icon}
    </span>
  </Link>
);

const FooterSection: React.FC = () => {
  const { data: organizationData } = useFetchOrganization();
  const [alert, setAlert] = useState<AlertState>({
    type: "",
    message: "",
    show: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: "",
    },
  });

  const showAlert = (
    type: "success" | "danger",
    message: string,
    duration = 5000
  ) => {
    setAlert({ type, message, show: true });
    setTimeout(() => {
      setAlert({ type: "", message: "", show: false });
    }, duration);
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    if (!organizationData?.id) {
      showAlert("danger", "Organization not loaded");
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/api/subscription/add/${organizationData?.id}/`,
        data
      );
      reset();
      showAlert(
        "success",
        "You have successfully subscribed to our newsletter"
      );
    } catch (error) {
      showAlert(
        "danger",
        error instanceof Error ? error.message : "An unexpected error occurred",
        3000
      );
    }
  };

  const socialLinks = [
    {
      href: organizationData?.facebooklink,
      icon: <FaFacebook />,
      className: "me-2",
    },
    { href: organizationData?.whatsapplink, icon: <IoLogoWhatsapp /> },
    { href: organizationData?.instagramlink, icon: <FaInstagram /> },
    { href: organizationData?.twitterlink, icon: <FaXTwitter /> },
    { href: organizationData?.linkedinlink, icon: <FaLinkedinIn /> },
    { href: organizationData?.tiktoklink, icon: <FaTiktok /> },
  ];

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#services", label: "Services" },
    { href: "/#staffs", label: "Departments" },
    { href: "/#contact", label: "Contact" },
  ];

  const featureLinks = [
    { href: "/articles", label: "Articles" },
    { href: "/dashboard/cbt", label: "CBT practice" },
    { href: "/dashboard/chat", label: "Chatroom" },
    { href: "/dashboard/services", label: "Jamb" },
    { href: "/dashboard/services", label: "Post Utme" },
  ];

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
                {socialLinks.map((link, index) => (
                  <SocialLink
                    key={index}
                    href={link.href || "#"}
                    icon={link.icon}
                    className={link.className}
                  />
                ))}
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
                {errors.email && (
                  <div className="text-danger mb-2">{errors.email.message}</div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="subscribe-input d-md-flex">
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your email"
                      {...register("email")}
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
          <div className="col-6 col-md-3 d-flex justify-content-center">
            <div className="footer-links">
              <h6>Quick Links</h6>
              <ul className="list-unstyled">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link className="small" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-6 col-md-3 d-flex justify-content-center">
            <div className="footer-links">
              <h6>features</h6>
              <ul className="list-unstyled">
                {featureLinks.map((link, index) => (
                  <li key={index}>
                    <Link className="small" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* subfooter */}
      <div className="subfooter py-3 d-flex justify-content-center align-items-center">
        <p className="text-center small mb-0">
          &copy; 2024{" "}
          <span className="text-secondary">Innovations CyberCafe.</span> All
          Rights Reserved
        </p>
      </div>
    </section>
  );
};

export default FooterSection;
