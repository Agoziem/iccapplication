"use client";
import React from "react";
import { TbTargetArrow } from "react-icons/tb";
import { FaEye, FaUserGroup } from "react-icons/fa6";
import "./section.css";
import { useFetchOrganization } from "@/data/organization/organization.hook";
import ParagraphPlaceholders from "@/components/custom/Placeholders/ParagraphPlaceholders";

interface AboutCardProps {
  icon: React.ReactNode;
  title: string;
  content: string | undefined;
  isLoading: boolean;
  className?: string;
}

const AboutCard: React.FC<AboutCardProps> = ({ 
  icon, 
  title, 
  content, 
  isLoading, 
  className = "" 
}) => (
  <div className="col-12 col-md-4 d-flex justify-content-center">
    <div className="card p-4 pt-4">
      <div className={`card-icon ${className} d-flex justify-content-center align-items-center align-self-center my-3`}>
        {icon}
      </div>
      <h6 className="text-primary">{title}</h6>
      {isLoading ? (
        <ParagraphPlaceholders />
      ) : (
        <p className="">{content}</p>
      )}
    </div>
  </div>
);

const AboutSection: React.FC = () => {
  const { data: organizationData, isLoading } = useFetchOrganization();

  const aboutCards = [
    {
      icon: <FaEye />,
      title: "Our Vision",
      content: organizationData?.vision,
      className: "vision"
    },
    {
      icon: <TbTargetArrow />,
      title: "Our Mission", 
      content: organizationData?.mission,
      className: "mission"
    },
    {
      icon: <FaUserGroup />,
      title: "Our Staffs",
      content: "Our staffs are professionals who are dedicated to providing you with the best services and products that concerns Admission process, jamb and POST UTME",
      className: "staff"
    }
  ];

  return (
    <section id="about" className="text-center p-3 py-5 p-md-5">
      <div className="d-flex flex-column align-items-center">
        <h2 className="text-primary">About Us</h2>
        <p className="">{organizationData?.description}</p>
      </div>

      <div className="row justify-content-between mt-4 px-3 px-md-5">
        {aboutCards.map((card, index) => (
          <AboutCard
            key={index}
            icon={card.icon}
            title={card.title}
            content={card.content}
            isLoading={isLoading}
            className={card.className}
          />
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
