"use client";
import React, { useContext } from "react";
import { TbTargetArrow } from "react-icons/tb";
import { FaEye, FaUserGroup } from "react-icons/fa6";
import "./section.css";
import { useFetchOrganization } from "@/data/organization/organization.hook";
import ParagraphPlaceholders from "@/components/custom/Placeholders/ParagraphPlaceholders";

const AboutSection = () => {
  const { data: OrganizationData, isLoading } = useFetchOrganization();

  return (
    <section id="about" className="text-center p-3 py-5 p-md-5">
      <div className="d-flex flex-column align-items-center">
        <h2 className="text-primary">About Us</h2>
        <p className="">{OrganizationData?.description}</p>
      </div>

      <div className="row justify-content-between mt-4 px-3 px-md-5">
        <div className="col-12 col-md-4 d-flex justify-content-center ">
          <div className="card p-4 pt-4">
            <div className="card-icon vision d-flex justify-content-center align-items-center align-self-center my-3">
              <FaEye />
            </div>
            <h6 className="text-primary">Our Vision</h6>
            {isLoading ? (
              <ParagraphPlaceholders />
            ) : (
              <p className="">{OrganizationData?.vision}</p>
            )}
          </div>
        </div>

        <div className="col-12 col-md-4 d-flex justify-content-center">
          <div className="card p-4 pt-4">
            <div className="card-icon mission d-flex justify-content-center align-items-center align-self-center my-3">
              <TbTargetArrow />
            </div>
            <h6 className="text-primary">Our Mission</h6>
            {isLoading ? (
              <ParagraphPlaceholders />
            ) : (
              <p className="">{OrganizationData?.mission}</p>
            )}
          </div>
        </div>

        <div className="col-12 col-md-4 d-flex justify-content-center">
          <div className="card p-4 pt-4">
            <div className="card-icon staff d-flex justify-content-center align-items-center align-self-center my-3">
              <FaUserGroup />
            </div>
            <h6 className="text-primary">Our Staffs</h6>
            <p className="">
              Our staffs are professionals who are dedicated to providing you
              with the best services and products that concerns Admission
              process, jamb and POST UTME
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
