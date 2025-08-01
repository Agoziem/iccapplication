import { useCart } from "@/data/Cartcontext";
import React from "react";
import { useSession } from "next-auth/react";
import { RiShoppingBasketFill } from "react-icons/ri";
import { Product } from "@/types/items";

interface TopSellingProductProps {
  item: Product;
}

const TopSellingProduct: React.FC<TopSellingProductProps> = ({ item }) => {
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
            <RiShoppingBasketFill className={"h3 mb-0"} />
          </div>
        )}
      </th>
      <td className="text-primary fw-bold">{item.name}</td>
      <td>{item.category?.category}</td>
      <td>&#8358;{parseFloat(item.price)}</td>
      <td>
        {item.userIDs_that_bought_this_product?.includes(
          parseInt(session?.user?.id || "0")
        ) ? (
          <span className="badge bg-primary-light text-primary p-2">
            Purchased
            <i className="bi bi-check-circle ms-2"></i>
          </span>
        ) : cart.find(
            (cartItem) =>
              cartItem.cartType === "product" && 
              cartItem.product.id === item.id
          ) ? (
          <span
            className="badge bg-secondary-light text-secondary p-2"
            style={{ cursor: "pointer" }}
            onClick={() => removeFromCart(item.id?.toString() || "0", "product")}
          >
            remove Product {"  "}
            <i className="bi bi-cart-dash"></i>
          </span>
        ) : (
          <span
            className="badge bg-success-light text-success p-2"
            style={{ cursor: "pointer" }}
            onClick={() => addToCart({ cartType: "product", product: item }, "product")}
          >
            Add Product {"  "}
            <i className="bi bi-cart-plus"></i>
          </span>
        )}
      </td>
    </tr>
  );
};

export default TopSellingProduct;
