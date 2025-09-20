"use client";
import React, { useMemo, memo } from "react";
import HorizontalCard from "./Card/horizontalcard";
// import RecentActivity from "./RecentactionsSections/RecentActivity";
import RecentSales from "./RecentsalesSection/RecentSales";
import News from "./Newsection/News";
import TopSelling from "./TopsellingSection/TopSelling";
import CartButton from "../../custom/Offcanvas/CartButton";
import useCurrentUser from "@/hooks/useCurrentUser";
import { ORGANIZATION_ID } from "@/data/constants";
import {
  useOrderReport,
  usePayments,
  usePaymentsByUser,
} from "@/data/hooks/payment.hooks";
import { useServices } from "@/data/hooks/service.hooks";
import { useProducts } from "@/data/hooks/product.hooks";
import { useVideos } from "@/data/hooks/video.hooks";

const DashboardBody: React.FC = memo(() => {
  const { currentUser } = useCurrentUser();

  // Memoized organization ID
  const organizationId = useMemo(
    () => Number(ORGANIZATION_ID || process.env.NEXT_PUBLIC_ORGANIZATION_ID),
    []
  );

  // Memoized pagination config
  const paginationConfig = useMemo(
    () => ({
      page: 1,
      pageSize: 20,
    }),
    []
  );

  // API calls with proper error handling
  const { data: orders, isLoading: loadingOrders } =
    usePayments(organizationId);
  const { data: userOrders, isLoading: loadingUserOrders } = usePaymentsByUser(
    currentUser?.id || 0
  );

  // Fetch order report
  const {
    data: orderReport,
    isLoading: loadingOrderReport,
    error: orderReportError,
  } = useOrderReport(organizationId);

  const {
    data: services,
    isLoading: loadingServices,
    error: servicesError,
  } = useServices(organizationId);

  const {
    data: products,
    isLoading: loadingProducts,
    error: producterror,
  } = useProducts(organizationId);

  // fetchProducts
  const {
    data: videos,
    isLoading: loadingVideos,
    error: videoserror,
  } = useVideos(organizationId);

  return (
    <div className="dashboard">
      <div className="my-4 d-flex justify-content-between align-items-center flex-wrap">
        <h5 className="mb-3 mb-md-0 me-2 me-md-0">
          Welcome, {currentUser?.username}
        </h5>
        <CartButton />
      </div>
      <div className="row">
        <div className="col-12 col-md-9">
          <div className="row">
            {/* Display the Cards */}
            {currentUser?.is_staff && (
              <>
                {/* Only Admins */}
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="primary"
                    cardtitle="Services"
                    icon="bi bi-person-fill-gear"
                    cardbody={String(services?.count || 0)}
                    cardspan="Services"
                    loading={loadingServices}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="secondary"
                    cardtitle="Service Orders"
                    icon="bi bi-cart3"
                    cardbody={String(orders?.length || 0)}
                    cardspan={`Service${
                      userOrders && userOrders?.length > 1 ? "s" : ""
                    }`}
                    loading={loadingUserOrders}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="success"
                    cardtitle={`Total Customer${
                      orderReport && orderReport?.customers?.length > 1
                        ? "s"
                        : ""
                    }`}
                    icon="bi bi-people"
                    cardbody={String(orderReport?.customers?.length ?? 0)}
                    cardspan={"Total"}
                    loading={loadingOrderReport}
                  />
                </div>
              </>
            )}

            {!currentUser?.is_staff && (
              <>
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="primary"
                    cardtitle="Services"
                    icon="bi bi-person-fill-gear"
                    cardbody={String(services?.count || 0)}
                    cardspan="Services"
                    loading={loadingServices}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="secondary"
                    cardtitle="Orders"
                    icon="bi bi-person-check"
                    cardbody={String(orders?.length || 0)}
                    cardspan="Orders"
                    loading={loadingOrders}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="success"
                    cardtitle="Completed Orders"
                    icon="bi bi-cart-check"
                    cardbody={String(
                      userOrders?.filter((item) => item.status === "Completed")
                        .length || 0
                    )}
                    cardspan="Completed"
                    loading={loadingUserOrders}
                  />
                </div>
              </>
            )}

            {/* Display Analytics Chart for to the Admin & Customers */}
            {/* <div className="col-12">
              <Reports session={session} />
            </div> */}

            {/* Display the Resent Orders to Admin OR Orders purchased to customers */}
            <div className="col-12">
              <RecentSales />
            </div>

            {/* Display Services Available */}
            <div className="col-12">
              <TopSelling
                itemName={"Services"}
                data={services?.results || []}
                itemCount={services?.count}
                loading={loadingServices}
              />
            </div>

            {/* Display Products Available */}
            <div className="col-12">
              <TopSelling
                itemName={"Products"}
                data={products?.results || []}
                itemCount={products?.count}
                loading={loadingProducts}
              />
            </div>

            {/* Display Videos Available */}
            <div className="col-12">
              <TopSelling
                itemName={"Videos"}
                data={videos?.results || []}
                itemCount={videos?.count}
                loading={loadingVideos}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          {/* <div>
            <RecentActivity />
          </div> */}
          <div>
            <News />
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardBody.displayName = "DashboardBody";

export default DashboardBody;
