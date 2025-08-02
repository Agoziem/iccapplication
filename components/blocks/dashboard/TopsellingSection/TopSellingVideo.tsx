import { useCart } from "@/data/Cartcontext";
import React from "react";
import { useSession } from "next-auth/react";
import { FaVideo } from "react-icons/fa6";
import { Video } from "@/types/items";

interface TopSellingVideoProps {
  item: Video;
}

const TopSellingVideo: React.FC<TopSellingVideoProps> = ({ item }) => {
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
      <td>{item.category?.category}</td>
      <td>&#8358;{parseFloat(item.price)}</td>
      <td>
        {item.userIDs_that_bought_this_video?.includes(
          parseInt(session?.user?.id || "0")
        ) ? (
          <span className="badge bg-primary-light text-primary p-2">
            Purchased
            <i className="bi bi-check-circle ms-2"></i>
          </span>
        ) : cart.find(
            (cartItem) =>
              cartItem.cartType === "video" && 
              cartItem.video.id === item.id
          ) ? (
          <span
            className="badge bg-secondary-light text-secondary p-2"
            style={{ cursor: "pointer" }}
            onClick={() => removeFromCart(item.id?.toString() || "0", "video")}
          >
            remove Video {"  "}
            <i className="bi bi-cart-dash"></i>
          </span>
        ) : (
          <span
            className="badge bg-success-light text-success p-2"
            style={{ cursor: "pointer" }}
            onClick={() => addToCart({ cartType: "video", video: item }, "video")}
          >
            Add Video {"  "}
            <i className="bi bi-cart-plus"></i>
          </span>
        )}
      </td>
    </tr>
  );
};

export default TopSellingVideo;
