"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { BsGear } from "react-icons/bs";
import ServicesPlaceholder from "@/components/custom/ImagePlaceholders/ServicesPlaceholder";
import ApplicationPlaceholder from "@/components/custom/ImagePlaceholders/ApplicationPlaceholder";
import { Service } from "@/types/items";

interface ServiceCardProps {
  item: Service;
  tab: string;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  openModal: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  item, 
  tab, 
  onEdit, 
  onDelete, 
  openModal 
}) => {
  const formatPrice = (price: string) => {
    try {
      return parseFloat(price).toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    } catch {
      return `₦${price}`;
    }
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return "No description available";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm border-0 position-relative overflow-hidden">
        {/* Service Image */}
        <div className="position-relative">
          <div className="d-flex justify-content-center align-items-center p-3 bg-light">
            {item.img_url ? (
              <Image
                src={item.img_url}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-circle object-fit-cover"
                style={{ maxWidth: "80px", maxHeight: "80px" }}
              />
            ) : (
              <div style={{ width: "80px", height: "80px" }}>
                {item.category?.category === "application" ? (
                  <ApplicationPlaceholder />
                ) : (
                  <ServicesPlaceholder />
                )}
              </div>
            )}
          </div>
          {/* Category Badge */}
          {item.category?.category && (
            <span className="position-absolute top-0 end-0 badge bg-primary m-2 text-capitalize">
              {item.category.category}
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column">
          {/* Service Name */}
          <h6 className="card-title fw-bold text-dark mb-2" title={item.name}>
            {truncateText(item.name, 30)}
          </h6>

          {/* Service Description */}
          <p className="card-text text-muted small mb-3 flex-grow-1">
            {truncateText(item.description, 80)}
          </p>

          {/* Service Statistics */}
          <div className="d-flex justify-content-between align-items-center mb-3 small text-muted">
            <span>
              {item.number_of_times_bought || 0} purchase{(item.number_of_times_bought || 0) !== 1 ? 's' : ''}
            </span>
            {item.created_at && (
              <span>
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Price and Actions */}
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold text-success h6 mb-0">
              {formatPrice(item.price)}
            </span>
            
            {/* Action Buttons */}
            <div className="btn-group" role="group">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => onEdit(item)}
                title="Edit Service"
              >
                <FiEdit size={14} />
              </button>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => openModal(item)}
                title="View Details"
              >
                <FiEye size={14} />
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(item)}
                title="Delete Service"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>

          {/* Manage Service Link */}
          <div className="mt-3 pt-2 border-top">
            <Link 
              href={`/dashboard/services/${item.id}`} 
              className="text-decoration-none d-flex align-items-center justify-content-center text-primary small"
            >
              <BsGear className="me-1" size={14} />
              Manage Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
