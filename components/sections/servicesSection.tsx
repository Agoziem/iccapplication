"use client";
import React, { useContext, useEffect, useState } from "react";
import { LuCheckCircle } from "react-icons/lu";
import { FaLongArrowAltRight } from "react-icons/fa";
import Link from "next/link";
import { useOrganization } from "@/data/organization/Organizationalcontextdata";
import ReusableSwiper from "@/components/custom/Swiper/ReusableSwiper";
import { useCart } from "@/data/carts/Cartcontext";
import { useSession } from "next-auth/react";
import { servicesAPIendpoint } from "@/data/services/fetcher";
import { useFetchCategories } from "@/data/categories/categories.hook";
import { useFetchServices } from "@/data/services/service.hook";
import AnimationContainer from "@/components/animation/animation-container";
import NormalAnimationContainer from "@/components/animation/animation-normal";

const ServicesSection = () => {
  const { openModal } = useOrganization();
  const { cart, addToCart, removeFromCart } = useCart();
  const { data: session } = useSession();
  const [categoryServices, setCategoryServices] = useState([]);
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

  const { data: categories } = useFetchCategories(
    `${servicesAPIendpoint}/categories/`
  );

  const {
    data: services,
    isLoading: loadingServices,
    error: error,
  } = useFetchServices(
    `${servicesAPIendpoint}/services/${Organizationid}/?category=All&page=1&page_size=100`
  );

  const featuredservices = [
    "Sales of JAMB/Post UTME forms",
    "Sales of Checker cards",
    "Printing of WAEC Certificate, Neco Certificate and E-Verification",
    "Academic Consultation",
    "Processing of Affidavits and All Documents for School Clearance",
    "Tutorials and Skill Acquisition for Students Productivity.",
    "Hostel bookings Campus & Off-campus",
  ];

  useEffect(() => {
    if (categories && services) {
      const categoryServices = categories
        .map((category) => {
          const servicesInCategory = services.results.filter(
            (service) => service.category.id === category.id
          );
          return {
            category: category.category,
            services: servicesInCategory,
          };
        })
        .filter((category) => category.services.length > 0);

      setCategoryServices(categoryServices);
    }
  }, [categories, services]);

  return (
    <section id="services" className="features p-2 py-5 p-md-5">
      <div className="container px-5 px-md-4 pb-2 mb-5">
        <div className="row align-items-center">
          <div className="col-12 col-md-6">
            <AnimationContainer slideDirection="up" zoom="in" delay={0.1}>
              <img
                className="img-fluid mb-4 mb-md-0 mx-auto d-block"
                src="/features image.png"
                alt="feature"
                width={500}
                height={500}
                style={{ minWidth: "288px" }}
              />
            </AnimationContainer>
          </div>
          <div className="col-12 col-md-6 px-0 px-md-5">
            <h6>
              <span className="text-primary">What we do</span>
            </h6>
            <AnimationContainer slideDirection="down" delay={0.1}>
              <h3
                style={{
                  lineHeight: "1.4",
                }}
              >
                <span className="text-primary">
                  We offer a wide range of services
                </span>{" "}
                to help you with your Admission process.
              </h3>
            </AnimationContainer>
            <AnimationContainer slideDirection="down" delay={0.2}>
              <ul className="list-unstyled text-primary mt-3">
                {featuredservices.map((service, index) => (
                  <li className="py-1" key={index}>
                    <LuCheckCircle className="text-secondary me-2" />
                    {service}
                  </li>
                ))}
              </ul>
            </AnimationContainer>

            <AnimationContainer slideDirection="down" delay={0.4}>
              <Link
                href={"/dashboard/services"}
                className="btn btn-primary mt-2"
              >
                Get started now <FaLongArrowAltRight className="ms-2" />
              </Link>
            </AnimationContainer>
          </div>
        </div>
      </div>

      <hr className="text-primary pt-4" />

      {loadingServices && !error && (
        <div
          className=" d-flex align-items-center  justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {categoryServices && categoryServices.length > 0 && (
        <div>
          {categoryServices.map((category, index) => (
            <React.Fragment key={index}>
              <div className="p-3 py-3 py-md-4 px-md-5">
                <h4 className="mb-4">{category.category} Services</h4>
                <ReusableSwiper noItemsMessage="No Service yet">
                  {category.services.map((service) => (
                    <div
                      key={service.id}
                      className="card p-4 d-flex flex-column justify-content-between"
                      style={{ minHeight: "330px" }}
                    >
                      {/* Body Section */}
                      <div>
                        <div className="d-flex justify-content-center align-items-center">
                          {service.preview ? (
                            <img
                              src={service.img_url}
                              alt="services"
                              width={80}
                              height={80}
                              className="me-3 rounded-circle object-fit-cover"
                              style={{ objectPosition: "center" }}
                            />
                          ) : (
                            <div
                              className="me-3 d-flex justify-content-center align-items-center flex-shrink-0"
                              style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                backgroundColor: "var(--bgDarkColor)",
                                color: "var(--bgDarkerColor)",
                              }}
                            >
                              <i className="bi bi-person-fill-gear h2 mb-0"></i>
                            </div>
                          )}
                        </div>
                        <div className="text-center mt-3">
                          <h5>
                            {service.name.length > 30
                              ? service.name.slice(0, 30) + "..."
                              : service.name}
                          </h5>
                          <p className="text-primary mb-1">
                            {service.description.length > 100 ? (
                              <span>
                                {service.description.substring(0, 100)}...{" "}
                                <span
                                  className="text-secondary fw-bold"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => openModal(service)}
                                >
                                  view more
                                </span>
                              </span>
                            ) : (
                              service.description
                            )}
                          </p>
                        </div>
                      </div>

                      {/* footer Section */}
                      <div className="my-2 mt-3 text-center">
                        <hr />
                        <div className="d-flex justify-content-between mt-4">
                          <div className="fw-bold text-primary me-2">
                            &#8358;{parseFloat(service.price)}
                          </div>
                          {service.userIDs_that_bought_this_service.includes(
                            parseInt(session?.user?.id)
                          ) &&
                          !service.userIDs_whose_services_have_been_completed.includes(
                            parseInt(session?.user?.id)
                          ) ? (
                            <div className="badge bg-primary-light text-primary p-2">
                              Purchased
                              <i className="bi bi-check-circle ms-2"></i>
                            </div>
                          ) : cart.find(
                              (item) =>
                                item.id === service.id &&
                                item.cartType === "service"
                            ) ? (
                            <div
                              className="badge bg-secondary-light text-secondary p-2"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                removeFromCart(service.id, "service")
                              }
                            >
                              remove Service {"  "}
                              <i className="bi bi-cart-dash"></i>
                            </div>
                          ) : (
                            <div
                              className="badge bg-success-light text-success p-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => addToCart(service, "service")}
                            >
                              Add Service {"  "}
                              <i className="bi bi-cart-plus"></i>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </ReusableSwiper>
              </div>
            </React.Fragment>
          ))}
          {/* Services button */}
          <div className="d-flex justify-content-center mt-0 mb-5">
            <Link href="/services" className="btn btn-primary px-5">
              View Services
            </Link>
          </div>
          <hr className="text-primary" />
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
