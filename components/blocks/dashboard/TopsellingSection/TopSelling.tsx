import { useEffect, useState } from "react";
import { FaVideo } from "react-icons/fa";
import { RiShoppingBasketFill } from "react-icons/ri";
import TopSellingService from "./TopSellingService";
import TopSellingProduct from "./TopSellingProduct";
import TopSellingVideo from "./TopSellingVideo";
import Link from "next/link";
import "./topSelling.css";
/**
 * TopSelling Component
 * @param {Object} props
 * @param {"Services" | "Products" | "Videos"} props.itemName
 * @param {Services | Products | Videos} props.data
 * @param {number} props.itemCount
 * @param {boolean} props.loading
 * @returns {JSX.Element}
 */
function TopSelling({ itemName, data = [], itemCount, loading }) {

  return (
    <div className="card top-selling overflow-auto p-3">
      <div className="card-body pb-0">
        <div className="d-flex align-items-center mb-3">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center ${
              itemName === "Services"
                ? "bg-primary-light"
                : itemName === "Products"
                ? "bg-secondary-light"
                : "bg-success-light"
            }`}
            style={{
              width: "48px",
              height: "48px",
              fontSize: "1.2rem",
              flexShrink: 0,
            }}
          >
            {itemName === "Services" ? (
              <i className="bi bi-person-fill-gear mb-0 text-primary"></i>
            ) : itemName === "Products" ? (
              <RiShoppingBasketFill className="mb-0 text-secondary" />
            ) : (
              <FaVideo className="mb-0 text-success" />
            )}
          </div>
          <h6 className="ms-3">
            {itemName} <span>| Recent {itemName}</span>
          </h6>
        </div>

        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th scope="col">
                {itemName === "Services" || itemName === "Products"
                  ? "Preview"
                  : "Thumbnail"}
              </th>
              <th scope="col">
                {itemName === "Services"
                  ? "Service"
                  : itemName === "Products"
                  ? "Product"
                  : "Video"}
              </th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="ml-2">Loading {itemName} ...</p>
                </td>
              </tr>
            ) : data?.length > 0 ? (
              data?.map((item) => {
                if (itemName === "Services") {
                  return <TopSellingService key={item.id} item={item} />;
                } else if (itemName === "Products") {
                  return <TopSellingProduct key={item.id} item={item} />;
                } else {
                  return <TopSellingVideo key={item.id} item={item} />;
                }
              })
            ) : (
              <tr>
                <td colSpan={4}>
                  <div className="d-flex justify-content-center align-items-center">
                    <p className="text-center fw-bold mb-1 py-4">
                      No {itemName} Available
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {itemCount && itemCount > 6 && (
          <Link
            href={`/dashboard/${
              itemName === "Services"
                ? "services"
                : itemName === "Products"
                ? "products"
                : "videos"
            }`}
            className="text-secondary my-3"
          >
            See more {itemName}
          </Link>
        )}
      </div>
    </div>
  );
}

export default TopSelling;
