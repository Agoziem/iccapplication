import VideosPlaceholder from '@/components/custom/ImagePlaceholders/Videosplaceholder';
import React from 'react'

interface Video {
  id: string;
  title: string;
  img_url?: string;
  price: number | string;
  description?: string;
  [key: string]: any;
}

interface VideoCardProps {
  openModal: (item: Video) => void;
  item: Video;
  onDelete: (item: Video) => void;
  onEdit: (item: Video) => void;
  tab: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ openModal, item, onDelete, onEdit, tab }) => {
  return (
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
            <VideosPlaceholder />
          )}
        </div>

        <div className="flex-fill py-2">
          <h6>{item.title}</h6>
          <p className="text-primary mb-1">
            {item.description && item.description.length > 80 ? (
              <span className="text-primary">
                {item.description.substring(0, 80)}...{" "}
                <span
                  className="text-secondary fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => openModal(item)}
                >
                  view more
                </span>
              </span>
            ) : (
              item.description || ""
            )}
          </p>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <span className="fw-bold text-primary">
              &#8358;{parseFloat(String(item.price))}
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
  )
}

export default VideoCard