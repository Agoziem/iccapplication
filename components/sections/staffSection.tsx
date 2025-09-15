"use client";
import "./section.css";
import { PiGearBold } from "react-icons/pi";
import Link from "next/link";
import AnimationContainer from "@/components/animation/animation-container";
import { useDepartments } from "@/data/hooks/organization.hooks";
import { ORGANIZATION_ID } from "@/data/constants";
import { dept_icons } from "@/utils/selectFileIcon";

const StaffSection = () => {
  const { data: depts } = useDepartments(
    parseInt(ORGANIZATION_ID || "0")
  );

  return (
    <>
      <section
        id="staffs"
        className="text-center staff-section py-5 px-3 p-md-5"
      >
        <div className="d-md-flex flex-column align-items-center mb-3">
          <h2>Our Departments</h2>
          <p>
            our departments are well structured to meet your needs and provide
            you with the best services
          </p>
        </div>

        <div className="row px-4 px-md-5">
          {depts && depts?.results?.length > 0 ? (
            depts?.results?.map((dept, index) => (
              <AnimationContainer slideDirection="down" delay={0.1 * index} key={dept.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card py-3 mx-auto">
                  <div className="card-body">
                    <div className="d-flex flex-column justify-content-center align-items-center mb-3">
                      <span className="dept-icon h1 mb-3 text-secondary">
                        {dept_icons.find((icon) => icon.id === index + 1)
                          ?.icon || <PiGearBold />}
                      </span>
                      <h4 className="mb-0">{dept.name}</h4>
                    </div>
                    <p>{dept.description.substring(0, 100) + " ..."}</p>
                    <div>
                      <Link
                        href={`/department/${dept.id}`}
                        className="btn btn-sm btn-accent-secondary rounded"
                      >
                        view Department
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimationContainer>
            ))
          ) : (
            <div className="col-12 d-flex justify-content-center">
              <p
                className="p-3 text-primary text-center bg-primary-light mt-1 mb-3 rounded"
                style={{ minWidth: "300px" }}
              >
                No Department yet
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default StaffSection;
