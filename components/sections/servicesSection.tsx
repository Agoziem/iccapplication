"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { LiaCheckCircle } from "react-icons/lia";
import { FaLongArrowAltRight } from "react-icons/fa";
import Link from "next/link";
import { useOrganization } from "@/providers/context/Organizationalcontextdata";
import ReusableSwiper from "@/components/custom/Swiper/ReusableSwiper";
import { useCart } from "@/providers/context/Cartcontext";
import AnimationContainer from "@/components/animation/animation-container";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { useServiceCategories, useServices } from "@/data/hooks/service.hooks";
import { ORGANIZATION_ID } from "@/data/constants";
import { Service } from "@/types/items";

// Type for categorized services
interface CategorizedServices {
  category: string;
  services: Service[];
}

const ServicesSection: React.FC = () => {
  const { openModal } = useOrganization();
  const { cart, addToCart, removeFromCart } = useCart();
  const { data: user } = useMyProfile();
  const [categoryServices, setCategoryServices] = useState<CategorizedServices[]>([]);

  const { 
    data: categories, 
    isLoading: loadingCategories,
    error: categoriesError 
  } = useServiceCategories();

  const {
    data: services,
    isLoading: loadingServices,
    error: servicesError,
  } = useServices(parseInt(ORGANIZATION_ID || "0"));

  // Memoized featured services list
  const featuredServices = useMemo(() => [
    "Sales of JAMB/Post UTME forms",
    "Sales of Checker cards",
    "Printing of WAEC Certificate, Neco Certificate and E-Verification",
    "Academic Consultation",
    "Processing of Affidavits and All Documents for School Clearance",
    "Tutorials and Skill Acquisition for Students Productivity.",
    "Hostel bookings Campus & Off-campus",
  ], []);

  // Process categories and services with useCallback for performance
  const processServices = useCallback(() => {
    if (!categories || !services?.results) {
      setCategoryServices([]);
      return;
    }

    const processedCategories = categories
      .map((category) => {
        const servicesInCategory = services.results.filter(
          (service) => service.category && service.category.id === category.id
        );
        return {
          category: category.category || "General",
          services: servicesInCategory,
        };
      })
      .filter((categoryGroup) => categoryGroup.services.length > 0);

    setCategoryServices(processedCategories);
  }, [categories, services]);

  useEffect(() => {
    processServices();
  }, [processServices]);

  // Check if user has purchased a service
  const hasUserPurchased = useCallback((service: Service): boolean => {
    if (!user?.id) return false;
    return service.userIDs_that_bought_this_service?.includes(user.id) || false;
  }, [user?.id]);

  // Check if service is completed for user
  const isServiceCompleted = useCallback((service: Service): boolean => {
    if (!user?.id) return false;
    return service.userIDs_whose_services_have_been_completed?.includes(user.id) || false;
  }, [user?.id]);

  // Check if service is in cart
  const isInCart = useCallback((serviceId: number): boolean => {
    return cart.some(item => item.id === serviceId && item.cartType === "service");
  }, [cart]);

  // Loading state
  const isLoading = loadingCategories || loadingServices;
  const hasError = categoriesError || servicesError;

  return (
    <section id="services" className="features p-2 py-5 p-md-5">
      <div className="container px-5 px-md-4 pb-2 mb-5">
        <div className="row align-items-center">
          <div className="col-12 col-md-6">
            <AnimationContainer slideDirection="up" zoom="in" delay={0.1}>
              <Image
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
                {featuredServices.map((service, index) => (
                  <li className="py-1" key={index}>
                    <LiaCheckCircle className="text-secondary me-2" />
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

      {/* Loading State */}
      {isLoading && (
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="d-flex flex-column align-items-center text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-muted">Loading Services...</h5>
                <p className="text-muted small">Please wait while we fetch our services for you.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && !isLoading && (
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>
                  <h6 className="alert-heading mb-1">Unable to load services</h6>
                  <p className="mb-0 small">
                    There was an error loading our services. Please try refreshing the page or contact support if the problem persists.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Content */}
      {!isLoading && !hasError && categoryServices.length > 0 && (
        <div>
          {categoryServices.map((categoryGroup, index) => (
            <React.Fragment key={index}>
              <div className="p-3 py-3 py-md-4 px-md-5">
                <h4 className="mb-4">{categoryGroup.category} Services</h4>
                <ReusableSwiper noItemsMessage="No Service yet">
                  {categoryGroup.services.map((service) => (
                    <div
                      key={service.id}
                      className="card p-4 d-flex flex-column justify-content-between h-100"
                      style={{ minHeight: "330px" }}
                    >
                      {/* Body Section */}
                      <div>
                        <div className="d-flex justify-content-center align-items-center">
                          {service.preview ? (
                            <Image
                              src={service.img_url || "/logo placeholder.jpg"}
                              alt={service.name}
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
                            {service.name && service.name.length > 30
                              ? service.name.slice(0, 30) + "..."
                              : service.name}
                          </h5>
                          <p className="text-primary mb-1">
                            {service.description && service.description.length > 100 ? (
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

                      {/* Footer Section */}
                      <div className="my-2 mt-3 text-center">
                        <hr />
                        <div className="d-flex justify-content-between align-items-center mt-4">
                          <div className="fw-bold text-primary me-2">
                            &#8358;{parseFloat(service.price || "0")}
                          </div>
                          
                          {/* Service purchase status and cart actions */}
                          {hasUserPurchased(service) && !isServiceCompleted(service) ? (
                            <div className="badge bg-primary-light text-primary p-2">
                              <i className="bi bi-check-circle me-1"></i>
                              Purchased
                            </div>
                          ) : isInCart(service.id || 0) ? (
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => removeFromCart(service.id || 0, "service")}
                              disabled={!service.id}
                            >
                              <i className="bi bi-cart-dash me-1"></i>
                              Remove
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => addToCart(service, "service")}
                              disabled={!service.id}
                            >
                              <i className="bi bi-cart-plus me-1"></i>
                              Add Service
                            </button>
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
              <i className="bi bi-grid-3x3-gap-fill me-2"></i>
              View All Services
            </Link>
          </div>
          <hr className="text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !hasError && categoryServices.length === 0 && (
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="text-center py-5">
                <i className="bi bi-inbox display-1 mb-3" style={{ color: 'var(--bgDarkerColor)' }}></i>
                <h5 className="text-primary mb-3">No Services Available</h5>
                <p className="text-primary">
                  We&apos;re currently updating our services. Please check back soon for exciting new offerings!
                </p>
                <Link href="/dashboard" className="btn btn-primary">
                  <i className="bi bi-house-fill me-2"></i>
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
