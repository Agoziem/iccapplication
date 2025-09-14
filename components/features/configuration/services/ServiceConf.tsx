"use client";
import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BsGear, BsPeople, BsClipboardCheck } from "react-icons/bs";
import { FiUsers, FiClock, FiCheckCircle } from "react-icons/fi";
import { PulseLoader } from "react-spinners";
import { useService, useServiceUsers } from "@/data/hooks/service.hooks";
import ServiceUsers from "./ServiceUsers";
import Pagination from "@/components/custom/Pagination/Pagination";
import SearchInput from "@/components/custom/Inputs/SearchInput";

export interface StatusCategory {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
}

const categories: StatusCategory[] = [
  {
    id: 1,
    name: "All",
    description: "All Users who purchased this service",
    icon: FiUsers,
    color: "var(--primary)",
    bgColor: "var(--primary-100)",
  },
  {
    id: 2,
    name: "Progress", 
    description: "Services currently in progress",
    icon: FiClock,
    color: "var(--warning)",
    bgColor: "var(--warning-100)",
  },
  {
    id: 3,
    name: "Completed",
    description: "Services that have been completed",
    icon: FiCheckCircle,
    color: "var(--success)",
    bgColor: "var(--success-100)",
  },
];

interface ServiceConfigProps {
  serviceid: number;
}

const ServiceConfig: React.FC<ServiceConfigProps> = ({ serviceid }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || categories[0].name;
  const page = searchParams.get("page") || "1";
  const pageSize = "20";

  const [searchQuery, setSearchQuery] = useState("");

  // Hooks
  const {
    data: service,
    isLoading: loadingService,
    error: serviceError,
  } = useService(serviceid);

  const { 
    data: users, 
    isLoading: loadingUsers,
    error: usersError,
  } = useServiceUsers(serviceid, {
    category: currentCategory,
    page: parseInt(page),
    page_size: parseInt(pageSize),
  });

  // Get current category data
  const currentCategoryData = useMemo(() => 
    categories.find(cat => cat.name === currentCategory) || categories[0],
    [currentCategory]
  );

  // Handle page change
  const handlePageChange = (newPage: string | number) => {
    const pageNum = typeof newPage === "string" ? parseInt(newPage) : newPage;
    router.push(
      `?category=${currentCategory}&page=${pageNum}`,
      { scroll: false }
    );
  };

  // Handle category change
  const handleCategoryChange = (categoryName: string) => {
    router.push(
      `?category=${categoryName}&page=1`,
      { scroll: false }
    );
  };

  // Loading state
  if (loadingService) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <PulseLoader color="#0d6efd" size={15} />
          <p className="mt-3 text-muted">Loading service details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (serviceError) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Loading Service</h4>
        <p className="mb-0">
          {serviceError instanceof Error ? serviceError.message : "Failed to load service details"}
        </p>
      </div>
    );
  }

  return (
    <section className="container-fluid">
      {/* Service Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <BsGear size={32} className="text-primary me-3" />
                <div>
                  <h4 className="mb-1 fw-bold">{service?.name || "Service Configuration"}</h4>
                  <div className="d-flex align-items-center text-muted">
                    <span className="me-3">
                      <strong>Category:</strong> {service?.category?.category || "Unknown"}
                    </span>
                    <span className="me-3">
                      <strong>Price:</strong> ₦{service?.price || "0"}
                    </span>
                    {service?.created_at && (
                      <span>
                        <strong>Created:</strong> {new Date(service.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Service Statistics */}
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-center p-3 bg-primary bg-opacity-10 rounded">
                    <BsPeople size={24} className="text-primary me-2" />
                    <div>
                      <div className="fw-bold text-primary">
                        {service?.number_of_times_bought || 0}
                      </div>
                      <small className="text-muted">Total Purchases</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center p-3 bg-warning bg-opacity-10 rounded">
                    <FiClock size={24} className="text-warning me-2" />
                    <div>
                      <div className="fw-bold text-warning">
                        {service?.userIDs_whose_services_is_in_progress?.length || 0}
                      </div>
                      <small className="text-muted">In Progress</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center p-3 bg-success bg-opacity-10 rounded">
                    <BsClipboardCheck size={24} className="text-success me-2" />
                    <div>
                      <div className="fw-bold text-success">
                        {service?.userIDs_whose_services_have_been_completed?.length || 0}
                      </div>
                      <small className="text-muted">Completed</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories and Search */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h5 className="mb-3 fw-bold d-flex align-items-center">
            <currentCategoryData.icon size={20} className="me-2" />
            User Categories
          </h5>
          <div className="d-flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = currentCategory === category.name;
              
              return (
                <button
                  key={category.id}
                  className={`btn btn-outline-primary d-flex align-items-center px-3 py-2 ${
                    isActive ? "active" : ""
                  }`}
                  style={{
                    borderRadius: "25px",
                    border: isActive ? `2px solid ${category.color}` : "2px solid var(--bs-border-color)",
                    backgroundColor: isActive ? category.bgColor : "transparent",
                    color: isActive ? category.color : "var(--bs-body-color)",
                  }}
                  onClick={() => handleCategoryChange(category.name)}
                >
                  <IconComponent size={16} className="me-2" />
                  <span className="fw-medium">{category.name}</span>
                  <span className="badge bg-light text-dark ms-2 small">
                    {category.name === "All" 
                      ? users?.count || 0
                      : category.name === "Progress"
                      ? service?.userIDs_whose_services_is_in_progress?.length || 0
                      : service?.userIDs_whose_services_have_been_completed?.length || 0
                    }
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-muted mt-2 mb-0">{currentCategoryData.description}</p>
        </div>
        <div className="col-md-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemlabel="user"
          />
        </div>
      </div>

      {/* Users Section */}
      <div className="row">
        <div className="col-12">
          {loadingUsers ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
              <div className="text-center">
                <PulseLoader color="#0d6efd" size={12} />
                <p className="mt-3 text-muted">Loading users...</p>
              </div>
            </div>
          ) : usersError ? (
            <div className="alert alert-warning" role="alert">
              <h5 className="alert-heading">Error Loading Users</h5>
              <p className="mb-0">
                {usersError instanceof Error ? usersError.message : "Failed to load users"}
              </p>
            </div>
          ) : (
            <ServiceUsers
              users={users?.results}
              service={service || null}
              category={currentCategoryData}
              searchQuery={searchQuery}
            />
          )}

          {/* Pagination */}
          {!loadingUsers && users && Math.ceil(users.count / parseInt(pageSize)) > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination
                currentPage={parseInt(page)}
                totalPages={Math.ceil(users.count / parseInt(pageSize))}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceConfig;
