import React, { useMemo, useCallback } from "react";
import { FaVideo } from "react-icons/fa";
import { RiShoppingBasketFill } from "react-icons/ri";
import TopSellingService from "./TopSellingService";
import TopSellingProduct from "./TopSellingProduct";
import TopSellingVideo from "./TopSellingVideo";
import Link from "next/link";
import "./topSelling.css";
import { Product, Service, Video } from "@/types/items";
import useCurrentUser from "@/hooks/useCurrentUser";

interface TopSellingProps {
  itemName: "Services" | "Products" | "Videos";
  data: Service[] | Product[] | Video[] | undefined;
  itemCount?: number;
  loading: boolean;
}

const TopSelling: React.FC<TopSellingProps> = React.memo(
  ({ itemName, data, itemCount, loading }) => {
    const { currentUser } = useCurrentUser();

    // Memoized icon component
    const IconComponent = useMemo(() => {
      switch (itemName) {
        case "Services":
          return (
            <i 
              className="bi bi-person-fill-gear mb-0 text-primary"
              aria-label="Services icon"
            />
          );
        case "Products":
          return (
            <RiShoppingBasketFill 
              className="mb-0 text-secondary" 
              aria-label="Products icon"
            />
          );
        case "Videos":
          return (
            <FaVideo 
              className="mb-0 text-success" 
              aria-label="Videos icon"
            />
          );
        default:
          return null;
      }
    }, [itemName]);

    // Memoized background class
    const backgroundClass = useMemo(() => {
      switch (itemName) {
        case "Services":
          return "bg-primary-light";
        case "Products":
          return "bg-secondary-light";
        case "Videos":
          return "bg-success-light";
        default:
          return "bg-primary-light";
      }
    }, [itemName]);

    // Memoized table headers
    const tableHeaders = useMemo(() => ({
      preview: itemName === "Services" || itemName === "Products" ? "Preview" : "Thumbnail",
      item: itemName === "Services" ? "Service" : itemName === "Products" ? "Product" : "Video"
    }), [itemName]);

    // Memoized dashboard link
    const dashboardLink = useMemo(() => {
      switch (itemName) {
        case "Services":
          return "/dashboard/services";
        case "Products":
          return "/dashboard/products";
        case "Videos":
          return "/dashboard/videos";
        default:
          return "/dashboard";
      }
    }, [itemName]);

    // Render item component
    const renderItemComponent = useCallback((item: Service | Product | Video, index: number) => {
      const key = (item as any)?.id || `${itemName}-${index}`;
      
      switch (itemName) {
        case "Services":
          return <TopSellingService key={key} item={item as Service} />;
        case "Products":
          return <TopSellingProduct key={key} item={item as Product} />;
        case "Videos":
          return <TopSellingVideo key={key} item={item as Video} />;
        default:
          return null;
      }
    }, [itemName]);

    // Loading state
    if (loading) {
      return (
        <div className="card top-selling overflow-auto p-3" role="region" aria-label={`${itemName} section`}>
          <div className="card-body pb-0">
            <div className="d-flex justify-content-center align-items-center py-4">
              <div className="spinner-border text-primary me-3" role="status" aria-label="Loading">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mb-0 fw-semibold">Loading {itemName}...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="card top-selling overflow-auto p-3" role="region" aria-label={`${itemName} section`}>
        <div className="card-body pb-0">
          <div className="d-flex align-items-center mb-3">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center ${backgroundClass}`}
              style={{
                width: "48px",
                height: "48px",
                fontSize: "1.2rem",
                flexShrink: 0,
              }}
              role="img"
              aria-label={`${itemName} section icon`}
            >
              {IconComponent}
            </div>
            <h6 className="ms-3 mb-0">
              {itemName} <span className="text-muted">| Recent {itemName}</span>
            </h6>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered" role="table" aria-label={`${itemName} data table`}>
              <thead className="table-light">
                <tr>
                  <th scope="col">{tableHeaders.preview}</th>
                  <th scope="col">{tableHeaders.item}</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item, index) => renderItemComponent(item, index))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <i className="bi bi-inbox fs-1 text-muted mb-2" aria-hidden="true"></i>
                        <p className="text-muted fw-bold mb-0">
                          No {itemName} Available
                        </p>
                        <small className="text-muted">
                          {itemName} will appear here once they are added.
                        </small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {itemCount && itemCount > 6 && (
            <div className="mt-3">
              <Link
                href={dashboardLink}
                className="btn btn-outline-secondary btn-sm"
                aria-label={`View all ${itemName}`}
              >
                <i className="bi bi-arrow-right me-2" aria-hidden="true"></i>
                See more {itemName}
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
);

TopSelling.displayName = "TopSelling";

export default TopSelling;
