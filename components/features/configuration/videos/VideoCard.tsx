"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiEdit, FiTrash2, FiEye, FiPlay } from "react-icons/fi";
import { BsGear } from "react-icons/bs";
import VideosPlaceholder from "@/components/custom/ImagePlaceholders/Videosplaceholder";
import { Video } from "@/types/items";

interface VideoCardProps {
  item: Video;
  tab: string;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
  openModal: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  item, 
  tab, 
  onEdit, 
  onDelete, 
  openModal 
}) => {
  const formatPrice = (price: string | undefined) => {
    if (!price) return "Free";
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
        {/* Video Thumbnail */}
        <div className="position-relative">
          <div className="d-flex justify-content-center align-items-center p-3 bg-light position-relative" style={{ minHeight: "200px" }}>
            {item.img_url || item.thumbnail ? (
              <>
                <Image
                  src={item.img_url || item.thumbnail || "/placeholder-video.png"}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="rounded object-fit-cover w-100"
                  style={{ maxHeight: "180px" }}
                />
                {/* Play Button Overlay */}
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="bg-primary bg-opacity-75 rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                    <FiPlay size={24} className="text-white ms-1" />
                  </div>
                </div>
              </>
            ) : (
              <div style={{ width: "100px", height: "100px" }}>
                <VideosPlaceholder />
              </div>
            )}
          </div>
          
          {/* Category Badge */}
          {item.category?.category && (
            <span className="position-absolute top-0 end-0 badge bg-primary m-2 text-capitalize">
              {item.category.category}
            </span>
          )}
          
          {/* Free Badge */}
          {item.free && (
            <span className="position-absolute top-0 start-0 badge bg-success m-2">
              Free
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column">
          {/* Video Title */}
          <h6 className="card-title fw-bold text-dark mb-2" title={item.title}>
            {truncateText(item.title, 40)}
          </h6>

          {/* Video Description */}
          <p className="card-text text-muted small mb-3 flex-grow-1">
            {truncateText(item.description, 100)}
          </p>

          {/* Video Statistics */}
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
            <span className={`fw-bold h6 mb-0 ${item.free ? 'text-success' : 'text-primary'}`}>
              {item.free ? "Free" : formatPrice(item.price)}
            </span>
            
            {/* Action Buttons */}
            <div className="btn-group" role="group">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => onEdit(item)}
                title="Edit Video"
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
                title="Delete Video"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>

          {/* Manage Video Link */}
          <div className="mt-3 pt-2 border-top">
            <Link 
              href={`/dashboard/videos/${item.id}`} 
              className="text-decoration-none d-flex align-items-center justify-content-center text-primary small"
            >
              <BsGear className="me-1" size={14} />
              Manage Video
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;