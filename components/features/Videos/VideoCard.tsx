import React from "react";
import VideosPlaceholder from "../../custom/ImagePlaceholders/Videosplaceholder";
import { useSession } from "next-auth/react";
import { shortenMessage } from "@/utils/utilities";


/**
 * Description placeholder
 *
 * @param {{ video: Video; openModal: any; cart: any; addToCart: any; removeFromCart: any; }} param0
 */
const VideoCard = ({ video, openModal, cart, addToCart, removeFromCart }) => {
  const { data: session } = useSession();
  return (
    <div className="card p-4 py-4">
      <div className="d-flex align-items-center">
        <div className="me-3">
          {video.thumbnail ? (
            <img
              src={video.img_url}
              alt="products"
              width={68}
              height={68}
              className="rounded-circle object-fit-cover"
              style={{ objectPosition: "center" }}
            />
          ) : (
            <VideosPlaceholder />
          )}
        </div>

        <div
          className="flex-fill d-flex flex-column justify-content-between"
          style={{ height: "100%" }}
        >
          <h6 className="flex-grow-1">{video.title}</h6>
          <p className="text-primary mb-1">
            {video.description.length > 80 ? (
              <span>
                {shortenMessage(video.description,80)}
                <span
                  className="text-secondary fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => openModal(video)}
                >
                  view more
                </span>
              </span>
            ) : (
              video.description
            )}
          </p>
          <div className="d-flex justify-content-between mt-3 flex-wrap">
            <span className="fw-bold text-primary me-2">
              &#8358;{parseFloat(video.price)}
            </span>

            <div className="me-2 me-md-3">
              {video.userIDs_that_bought_this_video.includes(
                parseInt(session?.user?.id)
              ) ? (
                <span className="badge bg-primary-light text-primary p-2">
                  Purchased
                  <i className="bi bi-check-circle ms-2"></i>
                </span>
              ) : cart.find(
                  (item) => item.id === video.id && item.cartType === "video"
                ) ? (
                <span
                  className="badge bg-secondary-light text-secondary p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => removeFromCart(video.id, "video")}
                >
                  remove video {"  "}
                  <i className="bi bi-cart-dash"></i>
                </span>
              ) : (
                <span
                  className="badge bg-success-light text-success p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => addToCart(video, "video")}
                >
                  Add video {"  "}
                  <i className="bi bi-cart-plus"></i>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
