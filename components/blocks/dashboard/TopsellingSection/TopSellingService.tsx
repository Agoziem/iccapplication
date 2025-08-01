import { useCart } from "@/data/Cartcontext";
import React from "react";
import { useSession } from "next-auth/react";
import { Service } from "@/types/items";

interface TopSellingServiceProps {
  item: Service;
}

const TopSellingService: React.FC<TopSellingServiceProps> = ({ item }) => {
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
            <i className="bi bi-person-fill-gear h3 mb-0"></i>
          </div>
        )}
      </th>
      <td className="text-primary fw-bold">{item.name}</td>
      <td>{item.category?.category}</td>
      <td>&#8358;{parseFloat(item.price)}</td>
      <td>
        {item.userIDs_that_bought_this_service?.includes(
          parseInt(session?.user?.id || "0")
        ) &&
        !item.userIDs_whose_services_have_been_completed?.includes(
          parseInt(session?.user?.id || "0")
        ) ? (
          <span className="badge bg-primary-light text-primary p-2">
            Purchased
            <i className="bi bi-check-circle ms-2"></i>
          </span>
        ) : cart.find(
            (cartItem) =>
              cartItem.cartType === "service" && 
              cartItem.service.id === item.id
          ) ? (
          <span
            className="badge bg-secondary-light text-secondary p-2"
            style={{ cursor: "pointer" }}
            onClick={() => removeFromCart(item.id?.toString() || "0", "service")}
          >
            remove Service {"  "}
            <i className="bi bi-cart-dash"></i>
          </span>
        ) : (
          <span
            className="badge bg-success-light text-success p-2"
            style={{ cursor: "pointer" }}
            onClick={() => addToCart({ cartType: "service", service: item }, "service")}
          >
            Add Service {"  "}
            <i className="bi bi-cart-plus"></i>
          </span>
        )}
      </td>
    </tr>
  );
};

export default TopSellingService;
