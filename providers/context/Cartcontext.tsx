"use client";
import useLocalStorage from "@/hooks/useLocalStorage";
import React from "react";

const { useState, createContext, useContext, useEffect, useTransition } = React;
type ReactNode = React.ReactNode;
import { useRouter } from "next/navigation";
import { useCreatePayment } from "../../data/hooks/payment.hooks";
import { Product, Service, Video } from "@/types/items";
import { CreatePayment } from "@/types/payments";
import { ORGANIZATION_ID } from "@/data/constants";
import { useMyProfile } from "@/data/hooks/user.hooks";
import { toast } from "sonner";

export type CartItem = (Video | Service | Product) & {
  cartType?: "service" | "product" | "video";
};

interface CartContextValue {
  cart: CartItem[];
  total: number;
  showOffCanvas: boolean;
  setShowOffCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  addToCart: (item: CartItem, type: "service" | "product" | "video") => void;
  removeFromCart: (
    itemId: number,
    type: "service" | "product" | "video"
  ) => void;
  resetCart: () => void;
  checkout: () => Promise<void>;
  isPending: boolean;
  getCartItemCount: () => number;
  isItemInCart: (
    itemId: number,
    type: "service" | "product" | "video"
  ) => boolean;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextValue | null>(null);

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const router = useRouter();
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { storedValue: storedCart, setValue: setStoredCart } = useLocalStorage(
    "cart",
    cart
  );
  const [total, setTotal] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const { data: user } = useMyProfile();
  const { mutateAsync: addPayment } = useCreatePayment();

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
      const calculatedTotal = storedCart.reduce(
        (acc: number, item: CartItem) => acc + parseFloat(String(item.price)),
        0
      );
      setTotal(calculatedTotal);
    }
  }, [storedCart]);

  // ----------------------------------------------------
  // Add to Cart
  // ----------------------------------------------------
  const addToCart = (
    item: CartItem,
    type: "service" | "product" | "video"
  ): void => {
    try {
      const existingItem = cart.find(
        (cartItem) => cartItem.id === item.id && cartItem.cartType === type
      );

      if (existingItem) {
        toast.error("Item is already in cart");
        return;
      }

      const itemWithType = { ...item, cartType: type };
      const updatedCart = [...cart, itemWithType];
      setCart(updatedCart);
      setStoredCart(updatedCart);
      setTotal(total + parseFloat(String(item.price)));
      toast.success("Item added to cart");
    } catch (error: any) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  // ----------------------------------------------------
  // Remove from Cart
  // ----------------------------------------------------
  const removeFromCart = (
    itemId: number,
    type: "service" | "product" | "video"
  ): void => {
    try {
      const itemToRemove = cart.find(
        (item) => item.id === itemId && item.cartType === type
      );

      if (!itemToRemove) {
        toast.error("Item not found in cart");
        return;
      }

      const updatedCart = cart.filter(
        (item) => !(item.id === itemId && item.cartType === type)
      );

      setCart(updatedCart);
      setStoredCart(updatedCart);
      setTotal(total - parseFloat(String(itemToRemove.price)));
      toast.success("Item removed from cart");
    } catch (error: any) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  // ----------------------------------------------------
  // Reset Cart
  // ----------------------------------------------------
  const resetCart = (): void => {
    try {
      setCart([]);
      setTotal(0);
      setStoredCart([]);
    } catch (error: any) {
      console.error("Error resetting cart:", error);
      toast.error("Failed to reset cart");
    }
  };

  // ----------------------------------------------------
  // Checkout
  // ----------------------------------------------------
  const checkout = async (): Promise<void> => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    startTransition(async () => {
      toast.loading("Processing checkout...");

      try {
        if (!user || !user.id) {
          throw new Error("User not authenticated");
        }

        // Get organization ID
        const orgId = ORGANIZATION_ID ? parseInt(ORGANIZATION_ID) : 1;

        const orderData: CreatePayment = {
          customer: user.id,
          amount: total,
          services: cart
            .filter((item) => item.cartType === "service")
            .map((item) => item.id)
            .filter((id): id is number => id !== undefined),
          products: cart
            .filter((item) => item.cartType === "product")
            .map((item) => item.id)
            .filter((id): id is number => id !== undefined),
          videos: cart
            .filter((item) => item.cartType === "video")
            .map((item) => item.id)
            .filter((id): id is number => id !== undefined),
        };

        const data = await addPayment({
          organizationId: orgId,
          paymentData: orderData,
        });
        toast.dismiss();
        toast.success("Checkout successful! Redirecting...");
        resetCart(); // Clear cart after successful payment
        router.push(`/dashboard/orders/${data.reference}`);
      } catch (error: any) {
        toast.dismiss();
        console.error("Payment Error:", error?.message || error);
        toast.error(
          error?.message ||
            "An error occurred while initiating your checkout process"
        );
      }
    });
  };

  // ----------------------------------------------------
  // Utility Functions
  // ----------------------------------------------------
  const getCartItemCount = (): number => {
    return cart.length;
  };

  const isItemInCart = (
    itemId: number,
    type: "service" | "product" | "video"
  ): boolean => {
    return cart.some((item) => item.id === itemId && item.cartType === type);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        showOffCanvas,
        setShowOffCanvas,
        addToCart,
        removeFromCart,
        resetCart,
        checkout,
        isPending,
        getCartItemCount,
        isItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
