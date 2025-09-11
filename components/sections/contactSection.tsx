"use client";
import React, { useContext } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosMailOpen } from "react-icons/io";
import { FaPhoneVolume } from "react-icons/fa6";
import ContactForm from "@/components/custom/Contact/ContactForm";
import { useFetchOrganization } from "@/data/organization/organization.hook";

const ContactSection = () => {
 const { data: OrganizationData } = useFetchOrganization();

  return (
    <>
      <hr className="text-primary pt-4 mx-5" />
      <section
        id="contact"
        className="contact-section px-3 py-2 px-md-5 py-md-5 mb-3"
      >
        <div className="row px-2 px-md-5 align-items-center ">
          <div className="col-12 col-md-7 mb-4 mb-md-0">
            <div className="contact-info px-2 px-md-4">
              <h2>Contact Us</h2>
              <p>
                Feel free to reach out to us at any time. We are always here to
                help you with any questions or concerns you may have.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="text-primary fw-bold">
                    <IoLocationSharp className="text-secondary me-2 h5" />
                    Location
                  </span>
                  <p>{OrganizationData?.address}</p>
                </div>
                <div className="contact-item">
                  <span className="text-primary fw-bold">
                    <IoIosMailOpen className="text-secondary me-2 h5" />
                    Email
                  </span>
                  <p>
                    <a
                      href="mailto:innovationcybercafe@gmail.com"
                      className="text-primary"
                    >
                      {OrganizationData?.email}
                    </a>
                  </p>
                </div>
                <div className="contact-item">
                  <span className="text-primary fw-bold">
                    <FaPhoneVolume className="text-secondary me-2 h6" />
                    Phone
                  </span>
                  <p>{OrganizationData?.phone}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="contact-form">
              <h6>Send us a message</h6>
              <ContactForm OrganizationData={OrganizationData} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
