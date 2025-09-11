"use client";
import useLocalStorage from "@/hooks/useLocalStorage";
import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useTransition,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addPayment } from "../payments/fetcher";
import { useQueryClient } from "react-query";

const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [cart, setCart] = useState([]);
  const [storedCart, setStoredCart] = useLocalStorage("cart", cart);
  const [total, setTotal] = useState(0);
  const [reference, setReference] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  // ----------------------------------------------------
  // Set Cart from local storage
  // ----------------------------------------------------
  useEffect(() => {
    const isEmptyData = !storedCart || Object.keys(storedCart).length === 0;
    if (isEmptyData) {
      setCart([]);
      setTotal(0);
    } else {
      setCart(storedCart);
      const total = storedCart.reduce(
        (acc, item) => acc + parseFloat(item.price),
        0
      );
      setTotal(total);
    }
  }, [storedCart]);

  // ----------------------------------------------------
  // Add to Cart
  // ----------------------------------------------------

  const addToCart = (item, type) => {
    const newItem = { ...item, cartType: type };
    setCart([...cart, newItem]);
    setStoredCart([...cart, newItem]);
    setTotal(total + parseFloat(item.price));
  };

  // ----------------------------------------------------
  // Remove from Cart
  // ----------------------------------------------------
  const removeFromCart = (itemId, type) => {
    const itemToRemove = cart.find(
      (item) => item.id === itemId && item.cartType === type
    );
    setCart(
      cart.filter((item) => !(item.id === itemId && item.cartType === type))
    );
    setStoredCart(
      cart.filter((item) => !(item.id === itemId && item.cartType === type))
    );
    setTotal(total - parseFloat(itemToRemove.price));
  };

  // ----------------------------------------------------
  // Reset Cart
  // ----------------------------------------------------
  const resertCart = () => {
    setCart([]);
    setTotal(0);
    setStoredCart([]);
  };

  // ----------------------------------------------------
  // Checkout
  // ----------------------------------------------------
  const queryClient = useQueryClient();
  const checkout = () => {
    startTransition(async () => {
      const order = {
        customerid: session?.user.id,
        services: cart
          .filter((item) => item.cartType === "service")
          .map((item) => item.id),
        products: cart
          .filter((item) => item.cartType === "product")
          .map((item) => item.id),
        videos: cart
          .filter((item) => item.cartType === "video")
          .map((item) => item.id),
        total,
      };

      try {
        const data = await addPayment(order);
        queryClient.invalidateQueries("payments");
        setReference(data.reference);
        router.push(`/dashboard/orders`);
      } catch (error) {
        console.error("Payment Error:", error.message);
        setError(
          "An error just occurred , while initiating your CheckOut Process"
        );
      }
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        reference,
        addToCart,
        removeFromCart,
        resertCart,
        checkout,
        isPending,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  return useContext(CartContext);
};

export { CartProvider, useCart };
