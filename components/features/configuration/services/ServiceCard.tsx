import React from "react";
import ServicesPlaceholder from "@/components/custom/ImagePlaceholders/ServicesPlaceholder";
import ApplicationPlaceholder from "@/components/custom/ImagePlaceholders/ApplicationPlaceholder";
import Link from "next/link";

/**
 * @param {{ item: Service; tab: any; onEdit: any; onDelete: any; openModal: any; }} param0
 */
const ServiceCard = ({ item, tab, onEdit, onDelete, openModal }) => (
  <div className="col-12 col-md-4">
    <div className="card p-3 py-4">
      <div className="d-flex justify-content-center align-items-center">
        <div className="me-3">
          {item.img_url ? (
            <img
              src={item.img_url}
              alt="Services"
              width={100}
              height={100}
              style={{
                maxWidth: "60px",
                maxHeight: "60px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            <>
              {item.category.category === "application" ? (
                <ApplicationPlaceholder />
              ) : (
                <ServicesPlaceholder />
              )}
            </>
          )}
        </div>

        <div className="flex-fill py-2">
          <h6>{item.name}</h6>
          <p className="text-primary mb-1">
            {item.description.length > 80 ? (
              <span className="text-primary">
                {item.description.substring(0, 80)}...{" "}
                {/* <span
                  className="text-secondary fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => openModal(item)}
                >
                  view more
                </span> */}
              </span>
            ) : (
              item.description
            )}
          </p>

          {/* Manage Service */}
          <div>
            <Link href={`services/${item.id}`} className="text-secondary fw-bold">
              manage service
            </Link>
          </div>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <span className="fw-bold text-primary">
              &#8358;{parseFloat(item.price)}
            </span>
            <div>
              <button
                className="btn btn-sm btn-accent-secondary rounded py-1 px-3 me-2"
                onClick={() => {
                  onEdit(item);
                }}
              >
                edit
              </button>
              <button
                className="btn btn-sm btn-danger rounded py-1 px-3"
                onClick={() => onDelete(item)}
              >
                delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ServiceCard;
