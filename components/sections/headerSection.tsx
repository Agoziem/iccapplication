"use client";
import React from "react";
import MainHeader from "@/components/blocks/header/Mainheader/MainHeader";
import "./section.css";
import Link from "next/link";
import AnimationContainer from "@/components/animation/animation-container";
import { useMyProfile } from "@/data/hooks/user.hooks";

const HeaderSection = () => {
  const { data: user } = useMyProfile();
  return (
    <div>
      <MainHeader />
      <section className="hero">
        <div className="container">
          <div className="row align-items-center ">
            <div className="col-md-6">
              <div className="header-content text-center text-md-start px-2 px-md-4 pt-md-5">
                <AnimationContainer slideDirection="down" delay={0}>
                  <h1>Your Online Solution to admission related Issues </h1>
                </AnimationContainer>
                <AnimationContainer slideDirection="down" delay={0.2}>
                  <p>
                    Get access to the best admission resources, connect with
                    students and get your admission process done in no time.
                  </p>
                </AnimationContainer>
                <AnimationContainer slideDirection="down" className="header-btn" delay={0.4}>
                  <Link
                    className="btn btn-primary my-2 my-md-0"
                    style={{
                      padding: "10px 30px",
                      borderRadius: "25px",
                      boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 8px",
                    }}
                    href={"/dashboard"}
                  >
                    {user ? "Go to Dashboard" : "Get Started now"}
                  </Link>
                </AnimationContainer>
              </div>
            </div>

            <div className="col-md-6">
              <AnimationContainer slideDirection="right" zoom="in" className="header-image my-4 my-md-0">
                <img
                  className="img-fluid"
                  src={"/hero image.png"}
                  width={573.42}
                  height={444}
                  alt="hero image"
                />
              </AnimationContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeaderSection;
