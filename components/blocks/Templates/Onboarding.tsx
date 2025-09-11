"use client";
import React, { useContext } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io5";
import { OrganizationContext } from "@/data/organization/Organizationalcontextdata";
import Link from "next/link";

/**
 * @param {{user:User}} param0
 */
const Onboarding = ({ user }) => {
  const { OrganizationData } = useContext(OrganizationContext);
  return (
    <div>
      <div>
        <h5>Hello {user.username || user.first_name},</h5>
      </div>

      {/* the body */}
      <div>
        <p>
          Welcome to ICC ONLINE CENTER! We’re excited to have you on board! 🎉
          At Innovations Cybercafe, we make educational, academic and admission
          related services and products easy to access. Feeling stuck at any
          point? Kindly reach out to us via Instagram, Facebook, tickok,
          LinkedIn, X( Twitter) @InnovationsCybercafe and we will be happy to
          help! Here’s to doing more with ICC ONLINE CENTER!
        </p>
      </div>

      {/* the footer */}
      <div>
        <p>Lawson Sorhue Founder, Innovations Cybercafe.</p>
      </div>

      {/* Social Media icons */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link href={OrganizationData?.facebooklink || "#"} target="_blank">
          <FaFacebook
            className="me-2"
            style={{
              cursor: "pointer",
            }}
          />
        </Link>
        <Link href={OrganizationData?.whatsapplink || "#"} target="_blank">
          <IoLogoWhatsapp
            className="mx-2"
            style={{
              cursor: "pointer",
            }}
          />
        </Link>
        <Link href={OrganizationData?.instagramlink || "#"} target="_blank">
          <FaInstagram
            className="mx-2"
            style={{
              cursor: "pointer",
            }}
          />
        </Link>
        <Link href={OrganizationData?.twitterlink || "#"} target="_blank">
          <FaXTwitter
            className="mx-2"
            style={{
              cursor: "pointer",
            }}
          />
        </Link>
        <Link href={OrganizationData?.linkedinlink || "#"} target="_blank">
          <FaLinkedinIn
            className="mx-2"
            style={{
              cursor: "pointer",
            }}
          />
        </Link>
        <Link href={OrganizationData?.tiktoklink || "#"} target="_blank">
          <FaTiktok
            className="mx-2"
            style={{
              cursor: "pointer",
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default Onboarding;
