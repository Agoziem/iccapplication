"use client";
import { servicesAPIendpoint } from "@/data/services/fetcher";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ServiceUsers from "./ServiceUsers";
import {
  useFetchService,
  useFetchServiceUsers,
} from "@/data/services/service.hook";
import Pagination from "@/components/custom/Pagination/Pagination";

/**
 * @typedef {Object} Category
 * @property {number} id - The unique ID of the category.
 * @property {string} name - The display name of the category.
 * @property {"all"| "progress"| "completed"} category - The key used for filtering (e.g., "all", "progress", "completed").
 */

/** @type {Category[]} */
const categories = [
  {
    id: 1,
    name: "Purchased Service",
    category: "all",
  },
  {
    id: 2,
    name: "Service in Progress",
    category: "progress",
  },
  {
    id: 3,
    name: "Completed Service",
    category: "completed",
  },
];

const ServiceConfig = ({ serviceid }) => {
  const router = useRouter();
  const searchParams = useSearchParams();


  const currentCategory =
    searchParams.get("category") || categories[0].category;
  const page = searchParams.get("page") || "1";
  const pageSize = "20";

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: service,
    isLoading: loadingService,
    error,
  } = useFetchService(
    `${servicesAPIendpoint}/service/${serviceid}/`,
    serviceid
  );

  const { data: users, isLoading: loadingUsers } = useFetchServiceUsers(
    service ? service.id : null,
    currentCategory
  );


  // -------------------------------
  // Handle Page Change
  // -------------------------------
  const handlePageChange = (newPage) => {
    router.push(`?category=${currentCategory}&page=${newPage}`, {
      scroll: false,
    });
  };

  // -------------------------------
  // Handle Category Change
  // -------------------------------
  const handleCategoryChange = (category) => {
    router.push(`?category=${category}&page=1`, {
      scroll: false,
    });
  };

  return (
    <section>
      <div>
        <h4>{service?.name || "Loading service..."}</h4>
        <p>
          <span className="fw-bold">Category: </span>
          {service?.category?.category || "Unknown"}
        </p>
        <hr />
      </div>

      <div>
        {/* Filter buttons for categories */}
        <div className="mb-3 ps-2 ps-md-0">
          <h5 className="mb-3 fw-bold">User Categories</h5>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`badge rounded-5 px-4 py-2 me-2 mb-2`}
              style={{
                color:
                  currentCategory === category.category
                    ? "var(--secondary)"
                    : "var(--primary)",
                backgroundColor:
                  currentCategory === category.category
                    ? "var(--secondary-300)"
                    : " ",
                border:
                  currentCategory === category.category
                    ? "1.5px solid var(--secondary)"
                    : "1.5px solid var(--bgDarkerColor)",
                cursor: "pointer",
              }}
              onClick={() => handleCategoryChange(category.category)}
            >
              {category.name}
            </div>
          ))}
        </div>

        {/* User Table */}
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <ServiceUsers
            users={users?.results}
            service={service}
            category={currentCategory}
          />
        )}

        {/* Pagination */}
        {!loadingUsers &&
          users &&
          Math.ceil(users.count / parseInt(pageSize)) > 1 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(users.count / parseInt(pageSize))}
              handlePageChange={handlePageChange}
            />
          )}
      </div>
    </section>
  );
};

export default ServiceConfig;
