import AnimationContainer from "@/components/animation/animation-container";
import Link from "next/link";
import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuCheckCircle } from "react-icons/lu";

const CBTSection = () => {
  return (
    <div className="container px-4 px-md-5 mt-5 mt-md-3">
      <div className="row align-items-center ">
        <div className="col-12 col-md-6">
          <AnimationContainer slideDirection="left">
            <h6>
              <span className="text-primary">CBT Practice </span>
            </h6>
          </AnimationContainer>

          <AnimationContainer slideDirection="left" delay={0.2}>
            <h4
              style={{
                lineHeight: "1.4",
              }}
              className="overflow-hidden"
            >
              <span className="text-primary">
                Prepare for your Favourite Exams such as jamb, Neco and Weac etc
              </span>{" "}
              with our CBT platform.
            </h4>
          </AnimationContainer>

          <AnimationContainer slideDirection="left" delay={0.4}>
            <ul className="list-unstyled text-primary mt-3">
              <li className="py-1">
                <LuCheckCircle className="text-secondary me-2" /> Complete Exam
                feel for your Upcoming Exam
              </li>
              <li className="py-1">
                <LuCheckCircle className="text-secondary  me-2" /> automatic
                result generation with Corrections
              </li>
              <li className="py-1">
                <LuCheckCircle className="text-secondary  me-2" /> Practice with
                over 1000+ Questions
              </li>
            </ul>
          </AnimationContainer>

          <AnimationContainer slideDirection="left" delay={0.6}>
            <Link href={"/dashboard/cbt"} className="btn btn-primary mt-2">
              practice now <FaLongArrowAltRight className="ms-2" />
            </Link>
          </AnimationContainer>
        </div>
        <div className="col-12 col-md-6 feature-image d-flex justify-content-center">
          <AnimationContainer slideDirection="up" zoom="in">
            <img
              className="img-fluid mt-4 mt-md-0"
              src="/CBT image.png"
              alt="feature"
              width={700}
              height={700}
              style={{ minWidth: "298px" }}
            />
          </AnimationContainer>
        </div>
      </div>
    </div>
  );
};

export default CBTSection;
