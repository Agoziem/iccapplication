import AnimationContainer from "@/components/animation/animation-container";
import Link from "next/link";
import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuCheckCircle } from "react-icons/lu";

const ChatSection = () => {
  return (
    <div>
      <hr className="text-primary pt-4" />
      {/* built in Chat Community */}
      <div className="container px-5 px-md-4 pb-2 my-4 mt-md-3">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 feature-image d-flex justify-content-center">
            <AnimationContainer slideDirection="up" zoom="in">
              <img
                className="img-fluid mb-4 mb-md-0"
                src="/Chat room.png"
                alt="feature"
                width={650}
                height={650}
                style={{ minWidth: "269px" }}
              />
            </AnimationContainer>
          </div>
          <div className="col-12 col-md-6 px-0 px-md-5">
            <AnimationContainer slideDirection="down">
              <h6>
                <span className="text-primary">built in Chat Community</span>
              </h6>
            </AnimationContainer>
            <AnimationContainer slideDirection="down" delay={0.2}>
              <h3
                className="overflow-hidden"
                style={{
                  lineHeight: "1.4",
                }}
              >
                <span className="text-primary">
                  explore and start conversations with the Admins
                </span>{" "}
                and other users.
              </h3>
            </AnimationContainer>
            <AnimationContainer slideDirection="down" delay={0.4}>
              <ul className="list-unstyled text-primary mt-3">
                <li className="py-1">
                  <LuCheckCircle className="text-secondary me-2" />
                  you recieve responses and your documents as soon as possible
                </li>
                <li className="py-1">
                  <LuCheckCircle className="text-secondary  me-2" />
                  your questions are answered by the Admins and other users
                </li>
                <li className="py-1">
                  <LuCheckCircle className="text-secondary  me-2" />
                  Online Orientations and guidance to Jamb and Postutme
                  Processes
                </li>
                <li className="py-1">
                  <LuCheckCircle className="text-secondary  me-2" />
                  and lots more
                </li>
              </ul>
            </AnimationContainer>

            <AnimationContainer slideDirection="down" delay={0.6}>
              <Link href={"/dashboard/chat"} className="btn btn-primary mt-2">
                get started now <FaLongArrowAltRight className="ms-2" />
              </Link>
            </AnimationContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
