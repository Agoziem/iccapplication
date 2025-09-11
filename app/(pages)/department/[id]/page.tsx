"use client";
import Link from "next/link";
import React, {useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import BackButton from "@/components/custom/backbutton/BackButton";
import { dept_icons } from "@/constants";
import { fetchDepartments, MainAPIendpoint } from "@/data/organization/fetcher";
import { useFetchDepartments } from "@/data/organization/organization.hook";

const Department = ({ params }) => {
  const { id } = params;
  const [department, setDepartment] = useState(null);
  const [otherDepartments, setOtherDepartments] = useState([]);
  const OrganizationID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

   // for data fetching
   const { data: depts } = useFetchDepartments(`${MainAPIendpoint}/department/${OrganizationID}/`);

 const fetchdepartment = () => {
    if (!depts) return;
    const department = depts.results.find((item) => item.id === parseInt(id));
    if (department) {
      setDepartment(department);
      const otherDepartments = depts.results.filter((item) => item.id !== parseInt(id));
      setOtherDepartments(otherDepartments);
    } 
  };

  useEffect(() => {
    if (id && depts && depts.results.length > 0) fetchdepartment();
  }, [id, depts]);

  return (
    <section className="px-5 pt-3">
      <BackButton />
      <h1 className="text-center mb-4">{department?.name} Department</h1>
      <div className="row p-md-4">
        <div className="col-12 col-md-6 ps-0">
          {department?.img ? (
            <img
              src={department.img_url}
              alt={department.name}
              className="rounded shadow-sm mx-auto d-block mb-3 mb-md-0"
              style={{
                width: "80%", 
                minWidth: "264px",
                height: "400px",
                objectFit: "cover",
              }}
            />
          ) : (
            <img
              src="/ICC dept image.png"
              alt=""
              style={{ width: "80%", minWidth: "264px" }}
              className="mx-auto d-block mb-3 mb-md-0"
            />
          )}
        </div>
        <div className="col-md-5">
          <h4>Description</h4>
          <hr />
          <p>{department?.description}</p>
          <hr />
          <div>
            <h5 className="mb-3">Staff In Charge</h5>
            <div className="d-flex flex-wrap align-items-center">
              {department?.staff_in_charge.img_url ? (
                <Link
                  href={department?.staff_in_charge.img_url || "#"}
                  target="_blank"
                >
                  <img
                    src={department?.staff_in_charge.img_url}
                    alt={department?.staff_in_charge.name}
                    className="rounded-circle"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              ) : (
                <div
                  className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                  style={{ width: "80px", height: "80px" }}
                >
                  <h1 className="text-white text-center mb-0">
                    {department?.staff_in_charge.name[0]}
                  </h1>
                </div>
              )}

              <div className="flex-fill ms-0 ms-md-3 mt-3 mt-md-0">
                <h5 className="mb-1">{department?.staff_in_charge.name}</h5>
                <p className="my-1">{department?.name} Department Head</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="my-5">
        <div className="row p-md-4 justify-content-center align-items-center">
          <div className="col-12 col-md-6">
            <img
              src="/ICC Dept Banner.png"
              alt=""
              style={{ width: "80%", minWidth: "240px",maxWidth: "400px"}}
              className=" mx-auto d-block mb-4 mb-md-0"
            />
          </div>
          <div className="col-md-5">
            <h3 className="mb-4">Services Offered</h3>
            <hr />
            <p>{department?.name} department offers the following services:</p>
            <ul className="list-unstyled">
              {department?.services.map((service) => (
                <li key={service.id} className="mb-1">
                  <IoMdCheckmarkCircleOutline className="text-secondary h4 me-2" />
                  {service.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <hr />
      <h4 className="my-4 mt-5 text-center">Other departments</h4>
      <div className="row px-0 px-md-5 text-center">
        {otherDepartments && otherDepartments.length > 0 ? (
          otherDepartments.map((dept, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card py-4 px-2 mx-auto">
                <div className="card-body">
                  <div className="d-flex flex-column justify-content-center align-items-center mb-3">
                    <span className="dept-icon h1 mb-3 text-secondary">
                      {dept_icons.find((icon) => icon.id === dept.id)?.icon}
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
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No Other Department available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Department;
