import { useCart } from "@/providers/context/Cartcontext";
import React from "react";
import { useSession } from "next-auth/react";
import { FaVideo } from "react-icons/fa6";

/**
 * @param {{ item: Video; }} param0
 */
function TopSellingVideo({ item }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const { data: session } = useSession();
  return (
    <tr>
      <th scope="row">
        {item.img_url ? (
          <img src={item.img_url} alt="" className="shadow-sm" />
        ) : (
          <div
            className="rounded d-flex justify-content-center align-items-center"
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "var(--bgDarkColor)",
              color: "var(--bgDarkerColor)",
            }}
          >
            <FaVideo className={"h5 mb-0"} />
          </div>
        )}
      </th>
      <td className="text-primary fw-bold">{item.title}</td>
      <td>{item.category.category}</td>
      <td>&#8358;{parseFloat(item.price)}</td>
      <td>
        {item.userIDs_that_bought_this_video.includes(
          parseInt(session?.user?.id)
        ) ? (
          <span className="badge bg-primary-light text-primary p-2">
            Purchased
            <i className="bi bi-check-circle ms-2"></i>
          </span>
        ) : cart.find(
            (video) => video.id === item.id && video.cartType === "video"
          ) ? (
          <span
            className="badge bg-secondary-light text-secondary p-2"
            style={{ cursor: "pointer" }}
            onClick={() => removeFromCart(item.id, "video")}
          >
            remove Video {"  "}
            <i className="bi bi-cart-dash"></i>
          </span>
        ) : (
          <span
            className="badge bg-success-light text-success p-2"
            style={{ cursor: "pointer" }}
            onClick={() => addToCart(item, "video")}
          >
            Add Video {"  "}
            <i className="bi bi-cart-plus"></i>
          </span>
        )}
      </td>
    </tr>
  );
}

export default TopSellingVideo;
