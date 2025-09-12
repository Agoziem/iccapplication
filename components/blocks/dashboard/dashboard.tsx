"use client";
import HorizontalCard from "./Card/horizontalcard";
// import RecentActivity from "./RecentactionsSections/RecentActivity";
import RecentSales from "./RecentsalesSection/RecentSales";
// import Reports from "./ReportchartsSection/Reports";
import News from "./Newsection/News";
import TopSelling from "./TopsellingSection/TopSelling";
import { useSession } from "next-auth/react";
import CartButton from "../../custom/Offcanvas/CartButton";
import { useFetchServices } from "@/data/services/service.hook";
import { servicesAPIendpoint } from "@/data/hooks/service.hooks";
import { productsAPIendpoint } from "@/data/hooks/product.hooks";
import { useFetchProducts } from "@/data/product/product.hook";
import { useFetchVideos } from "@/data/hooks/video.hooks";
import {
  useFetchPayments,
  useFetchPaymentsByUser,
  useGetOrderReport,
} from "@/data/payments/orders.hook";
import { vidoesapiAPIendpoint } from "@/data/hooks/video.hooks";

const DashboardBody = () => {
  const { data: session } = useSession();
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const { data: orders, isLoading: loadingOrders } =
    useFetchPayments(Organizationid);
  const { data: userOrders, isLoading: loadingUserOrders } =
    useFetchPaymentsByUser(session?.user?.id);

  const page = 1;
  const pageSize = 6;

  // fetchOrderReport
  const {
    data: orderReport,
    isLoading: loadingOrderReport,
    error: orderReporterror,
  } = useGetOrderReport();

  // fetchServices
  const {
    data: services,
    isLoading: loadingServices,
    error: serviceserror,
  } = useFetchServices(
    `${servicesAPIendpoint}/services/${Organizationid}/?category=All&page=${page}&page_size=${pageSize}`
  );

  // fetchProducts
  const {
    data: products,
    isLoading: loadingProducts,
    error: producterror,
  } = useFetchProducts(
    `${productsAPIendpoint}/products/${Organizationid}/?category=All&page=${page}&page_size=${pageSize}`
  );

  // fetchProducts
  const {
    data: videos,
    isLoading: loadingVideos,
    error: videoserror,
  } = useFetchVideos(
    `${vidoesapiAPIendpoint}/videos/${Organizationid}/?category=All&page=${page}&page_size=${pageSize}`
  );

  return (
    <div className="dashboard">
      <div className="my-4 d-flex justify-content-between align-items-center flex-wrap">
        <h5 className="mb-3 mb-md-0 me-2 me-md-0">
          Welcome, {session?.user?.username}
        </h5>
        <CartButton />
      </div>
      <div className="row">
        <div className="col-12 col-md-9">
          <div className="row">
            {/* Display the Cards */}
            {session?.user?.is_staff ? (
              <>
                {/* Only Admins */}
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="primary"
                    cardtitle="Services"
                    icon="bi bi-person-fill-gear"
                    cardbody={services?.count}
                    cardspan="Services"
                    loading={loadingServices}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="secondary"
                    cardtitle="Orders"
                    icon="bi bi-cart3"
                    cardbody={userOrders?.length}
                    cardspan={`Service${
                      userOrders?.length > 1 ? "s" : ""
                    } Ordered`}
                    loading={loadingUserOrders}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="success"
                    cardtitle="Customers"
                    icon="bi bi-people"
                    cardbody={orderReport?.customers?.length}
                    cardspan={`Total Customer${
                      orderReport?.customers?.length > 1 ? "s" : ""
                    }`}
                    loading={loadingOrderReport}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="primary"
                    cardtitle="Services"
                    icon="bi bi-person-fill-gear"
                    cardbody={services?.count}
                    cardspan="Services"
                    loading={loadingServices}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="secondary"
                    cardtitle="Orders"
                    icon="bi bi-person-check"
                    cardbody={orders?.length}
                    cardspan="Orders"
                    loading={loadingOrders}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <HorizontalCard
                    iconcolor="success"
                    cardtitle="Completed Orders"
                    icon="bi bi-cart-check"
                    cardbody={
                      userOrders &&
                      userOrders.filter((item) => item.status === "Completed")
                        .length
                    }
                    cardspan="Completed Orders"
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
              <RecentSales session={session} />
            </div>

            {/* Display Services Available */}
            <div className="col-12">
              <TopSelling
                itemName={"Services"}
                data={services?.results}
                itemCount={services?.count}
                loading={loadingServices}
              />
            </div>

            {/* Display Products Available */}
            <div className="col-12">
              <TopSelling
                itemName={"Products"}
                data={products?.results}
                itemCount={products?.count}
                loading={loadingProducts}
              />
            </div>

            {/* Display Videos Available */}
            <div className="col-12">
              <TopSelling
                itemName={"Videos"}
                data={videos?.results}
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
};

export default DashboardBody;
