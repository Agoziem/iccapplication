import ServicesPlaceholder from "@/components/custom/ImagePlaceholders/ServicesPlaceholder";
import { useSession } from "next-auth/react";

/**
 * @param {{ service: Service; openModal: any; cart: any; addToCart: any; removeFromCart: any; }} param0

 */
const ServiceCard = ({
  service,
  openModal,
  cart,
  addToCart,
  removeFromCart,
}) => {
  const { data: session } = useSession();
  return (
    <div className="card p-4 py-4">
      <div className="d-flex align-items-center">
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

        <div
          className="flex-fill d-flex flex-column justify-content-between"
          style={{ height: "100%" }}
        >
          <h6 className="flex-grow-1">{service.name}</h6>
          <p className="text-primary mb-1">
            {service.description.length > 80 ? (
              <span>
                {service.description.substring(0, 80)}...{" "}
                <span
                  className="text-secondary fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => openModal(service)}
                >
                  view more
                </span>
              </span>
            ) : (
              service.description
            )}
          </p>
          <div className="d-flex justify-content-between mt-3 flex-wrap">
            <span className="fw-bold text-primary me-2">
              &#8358;{parseFloat(service.price)}
            </span>

            <div className="me-2 me-md-3">
              {service.userIDs_that_bought_this_service.includes(
                parseInt(session?.user?.id)
              ) &&
              !service.userIDs_whose_services_have_been_completed.includes(
                parseInt(session?.user?.id)
              ) ? (
                <span className="badge bg-primary-light text-primary p-2">
                  Purchased
                  <i className="bi bi-check-circle ms-2"></i>
                </span>
              ) : cart.find(
                  (item) =>
                    item.id === service.id && item.cartType === "service"
                ) ? (
                <span
                  className="badge bg-secondary-light text-secondary p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => removeFromCart(service.id, "service")}
                >
                  remove Service {"  "}
                  <i className="bi bi-cart-dash"></i>
                </span>
              ) : (
                <span
                  className="badge bg-success-light text-success p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => addToCart(service, "service")}
                >
                  Add Service {"  "}
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

export default ServiceCard;
