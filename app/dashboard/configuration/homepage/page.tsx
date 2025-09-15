"use client";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import PrivacyPolicy from "@/components/features/configuration/home/PrivacyPolicy";
import TermsOfUse from "@/components/features/configuration/home/TermsOfUse";
import Depts from "@/components/features/configuration/home/depts";
import Messages from "@/components/features/configuration/home/messages";
import OrganizationCard from "@/components/features/configuration/home/organizationcard";
import Staffs from "@/components/features/configuration/home/staffs";
import Subscriptions from "@/components/features/configuration/home/subscriptions";
import Testimonials from "@/components/features/configuration/home/testimonials";
import React, { useState } from "react";

const HomePageConfigPage = () => {
  const [currentSection, setCurrentSection] = useState(1);

  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Homepage Settings" />
      <h3 className="my-3 mt-4">Sections</h3>
      <div className="row justify-content-between">
        <div className="col-md-5">
          <div className="card rounded p-3">
            <ul className="list-group list-group-flush">
              <li
                className="list-group-item"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                  cursor: "pointer",
                  color:
                    currentSection === 1
                      ? "var(--secondary)"
                      : "var(--primary)",
                  fontWeight: currentSection === 1 ? "bold" : "",
                }}
                onClick={() => setCurrentSection(1)}
              >
                Organization Details
              </li>
              <li
                className="list-group-item"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                  cursor: "pointer",
                  color:
                    currentSection === 2
                      ? "var(--secondary)"
                      : "var(--primary)",
                  fontWeight: currentSection === 2 ? "bold" : "",
                }}
                onClick={() => setCurrentSection(2)}
              >
                Testimonials & Reviews
              </li>
              <li
                className="list-group-item"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                  cursor: "pointer",
                  color:
                    currentSection === 3
                      ? "var(--secondary)"
                      : "var(--primary)",
                  fontWeight: currentSection === 3 ? "bold" : "",
                }}
                onClick={() => setCurrentSection(3)}
              >
                Staffs & Team
              </li>
              <li
                className="list-group-item"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                  cursor: "pointer",
                  color:
                    currentSection === 4
                      ? "var(--secondary)"
                      : "var(--primary)",
                  fontWeight: currentSection === 4 ? "bold" : "",
                }}
                onClick={() => setCurrentSection(4)}
              >
                Departments
              </li>

              <li
                className="list-group-item"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                  cursor: "pointer",
                  color:
                    currentSection === 5
                      ? "var(--secondary)"
                      : "var(--primary)",
                  fontWeight: currentSection === 5 ? "bold" : "",
                }}
                onClick={() => setCurrentSection(5)}
              >
                Subscriptions
              </li>
              <li
                className="list-group-item"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                  cursor: "pointer",
                  color:
                    currentSection === 6
                      ? "var(--secondary)"
                      : "var(--primary)",
                  fontWeight: currentSection === 6 ? "bold" : "",
                }}
                onClick={() => setCurrentSection(6)}
              >
                Messages
              </li>
              <li
                className="list-group-item"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                  cursor: "pointer",
                  color:
                    currentSection === 7
                      ? "var(--secondary)"
                      : "var(--primary)",
                  fontWeight: currentSection === 7 ? "bold" : "",
                }}
                onClick={() => setCurrentSection(7)}
              >
                Terms & Conditions
              </li>
              <li
                className="list-group-item"
                style={{
                  background: "var(--bgLighterColor)",
                  borderColor: "var(--bgDarkColor)",
                  cursor: "pointer",
                  color:
                    currentSection === 8
                      ? "var(--secondary)"
                      : "var(--primary)",
                  fontWeight: currentSection === 8 ? "bold" : "",
                }}
                onClick={() => setCurrentSection(8)}
              >
                Privacy Policy
              </li>
            </ul>
          </div>
        </div>

        <div className="col-md-7">
          {currentSection === 1 && <OrganizationCard />}
          {currentSection === 2 && <Testimonials />}

          {currentSection === 3 && <Staffs />}
          {currentSection === 4 && <Depts />}
          {currentSection === 5 && <Subscriptions />}
          {currentSection === 6 && <Messages />}
          {currentSection === 7 && <TermsOfUse />}
          {currentSection === 8 && <PrivacyPolicy />}
        </div>
      </div>
    </div>
  );
};

export default HomePageConfigPage;
