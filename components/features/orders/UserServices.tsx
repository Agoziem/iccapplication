import { useSession } from "next-auth/react";
import { PiEmptyBold } from "react-icons/pi";
import ServicesPlaceholder from "../../custom/ImagePlaceholders/ServicesPlaceholder";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { servicesAPIendpoint } from "@/data/services/fetcher";
import Pagination from "@/components/custom/Pagination/Pagination";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { useMemo, useState } from "react";
import { useFetchServices } from "@/data/services/service.hook";

const UserServices = () => {
  const { data: session } = useSession();
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const {
    data: services,
    isLoading: loadingServices,
    error: error,
  } = useFetchServices(
    session?.user.id
      ? `${servicesAPIendpoint}/userboughtservices/${Organizationid}/${session?.user.id}/?category=${currentCategory}&page=${page}&page_size=${pageSize}`
      : null
  );
  // -----------------------------------------
  // Handle page change
  // -----------------------------------------
  /**  @param {string} newPage */
  const handlePageChange = (newPage) => {
    router.push(
      `?category=${currentCategory}&page=${newPage}&page_size=${pageSize}`,
      {
        scroll: false,
      }
    );
  };

  // -------------------------------
  // Handle category change
  // -------------------------------
  /**  @param {string} category */
  const handleCategoryChange = (category) => {
    router.push(`?category=${category}&page=${page}&page_size=${pageSize}`, {
      scroll: false,
    });
  };

  // Memoized filtered products based on search query
  const filteredService = useMemo(() => {
    if (!services?.results) return [];
    if (!searchQuery) return services.results;

    return services.results.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [services, searchQuery]);

  // Setting the Correct Service Status for the user on the card
  /** * @param {Service} service */
  const ServiceStatus = (service) => {
    if (
      service.userIDs_whose_services_is_in_progress.includes(session?.user.id)
    ) {
      return (
        <div className="badge bg-secondary-light text-secondary py-2">
          in Progress
        </div>
      );
    }

    if (
      service.userIDs_whose_services_have_been_completed.includes(
        parseInt(session?.user.id)
      )
    ) {
      return (
        <div className="badge bg-success-light text-success py-2">
          Completed
        </div>
      );
    }
    return (
      <div className="badge bg-primary-light text-primary py-2">Purchased</div>
    );
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between ">
        <div>
          <h4 className="mt-3">Services Purchased</h4>
          <p>
            {services?.count} Service{services?.count > 1 ? "s" : ""} purchased
          </p>
        </div>
        <div className="mb-4 mb-md-0">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemlabel="service"
          />
        </div>
      </div>

      {searchQuery && <h5>Search Results</h5>}
      <div className="row">
        {filteredService?.length > 0 ? (
          filteredService?.map((service) => (
            <div key={service.id} className="col-12 col-md-4">
              <div className="card p-4">
                {/* the Body Section */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="me-3">
                    {service.preview ? (
                      <img
                        src={service.img_url}
                        alt="services"
                        width={68}
                        height={68}
                        className="rounded-circle object-fit-cover"
                        style={{ objectPosition: "center" }}
                      />
                    ) : (
                      <ServicesPlaceholder />
                    )}
                  </div>
                  <div className="flex-fill">
                    <h6 className="text-capitalize mb-1">{service.name}</h6>
                    <p
                      className="small mb-1"
                      style={{ color: "var(--bgDarkerColor)" }}
                    >
                      {service.category.category} Service
                    </p>
                    <p className="text-capitalize mb-1">
                      {service.description.length > 80 ? (
                        <span>{service.description.substring(0, 80)}... </span>
                      ) : (
                        service.description
                      )}
                    </p>

                    {/* button Section and badge */}
                    <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
                      <div>{service && ServiceStatus(service)}</div>
                      <div
                        className="badge bg-primary text-primary py-2 px-2"
                        style={{ cursor: "pointer" }}
                      >
                        {
                          // check if the service is already completed for the user
                          service.userIDs_whose_services_have_been_completed.includes(
                            parseInt(session.user.id)
                          ) ? null : (
                            <Link
                              href={`/dashboard/my-orders/service?servicetoken=${service.service_token}`}
                              className="text-white"
                            >
                              View Service
                            </Link>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <PiEmptyBold
              className="mt-2"
              style={{ fontSize: "6rem", color: "var(--bgDarkerColor)" }}
            />
            <h4>Services</h4>
            <p>you have not ordered any Service so far</p>
          </div>
        )}
      </div>
      {!loadingServices &&
        services &&
        Math.ceil(services.count / parseInt(pageSize)) > 1 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(services.count / parseInt(pageSize))}
            handlePageChange={handlePageChange}
          />
        )}
    </div>
  );
};

export default UserServices;
