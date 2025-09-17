"use client";
import useLocalStorage from "@/hooks/useLocalStorage";
import React from "react";

const {
  useState,
  createContext,
  useContext,
  useEffect,
  useTransition,
} = React;
type ReactNode = React.ReactNode;
import { useRouter } from "next/navigation";
import { addPayment } from "../../data/hooks/payment.hooks";
import { useQueryClient } from "react-query";
import { getUserId } from "@/utils/auth";
import { Product, Service, Video } from "@/types/items";
import { CreatePayment } from "@/types/payments";
import { ORGANIZATION_ID } from "@/data/constants";

export type CartItem = (Video | Service | Product) & {
  cartType?: "service" | "product" | "video";
};


interface CartContextValue {
  cart: CartItem[];
  total: number;
  reference: string;
  showOffCanvas: boolean;
  setShowOffCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  addToCart: (item: CartItem, type: "service" | "product" | "video") => void;
  removeFromCart: (itemId: number, type: "service" | "product" | "video") => void;
  resetCart: () => void;
  checkout: () => void;
  isPending: boolean;
  error: string | null;
  clearError: () => void;
  getCartItemCount: () => number;
  isItemInCart: (itemId: number, type: "service" | "product" | "video") => boolean;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextValue | null>(null);

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const router = useRouter();
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storedCart, setStoredCart] = useLocalStorage("cart", cart);
  const [total, setTotal] = useState<number>(0);
  const [reference, setReference] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
  const addToCart = (item: CartItem, type: "service" | "product" | "video"): void => {
    try {
      setError(null); // Clear any previous errors
      const existingItem = cart.find(
        (cartItem) => cartItem.id === item.id && cartItem.cartType === type
      );
      
      if (existingItem) {
        setError("Item is already in cart");
        return;
      }

      const itemWithType = { ...item, cartType: type };
      const updatedCart = [...cart, itemWithType];
      setCart(updatedCart);
      setStoredCart(updatedCart);
      setTotal(total + parseFloat(String(item.price)));
    } catch (error: any) {
      console.error("Error adding item to cart:", error);
      setError("Failed to add item to cart");
    }
  };

  // ----------------------------------------------------
  // Remove from Cart
  // ----------------------------------------------------
  const removeFromCart = (itemId: number, type: "service" | "product" | "video"): void => {
    try {
      setError(null); // Clear any previous errors
      const itemToRemove = cart.find(
        (item) => item.id === itemId && item.cartType === type
      );
      
      if (!itemToRemove) {
        setError("Item not found in cart");
        return;
      }
      
      const updatedCart = cart.filter(
        (item) => !(item.id === itemId && item.cartType === type)
      );
      
      setCart(updatedCart);
      setStoredCart(updatedCart);
      setTotal(total - parseFloat(String(itemToRemove.price)));
    } catch (error: any) {
      console.error("Error removing item from cart:", error);
      setError("Failed to remove item from cart");
    }
  };

  // ----------------------------------------------------
  // Reset Cart
  // ----------------------------------------------------
  const resetCart = (): void => {
    try {
      setError(null); // Clear any previous errors
      setCart([]);
      setTotal(0);
      setStoredCart([]);
    } catch (error: any) {
      console.error("Error resetting cart:", error);
      setError("Failed to reset cart");
    }
  };

  // ----------------------------------------------------
  // Checkout
  // ----------------------------------------------------
  const queryClient = useQueryClient();
  const checkout = async (): Promise<void> => {
    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    startTransition(async () => {
      setError(null); // Clear any previous errors
      
      try {
        // Get user ID from token
        const userId = getUserId();
        if (!userId) {
          throw new Error("User not authenticated");
        }

        // Get organization ID
        const orgId = ORGANIZATION_ID ? parseInt(ORGANIZATION_ID) : 1;

        const orderData: CreatePayment = {
          customer: parseInt(userId),
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

        const data = await addPayment(orgId, orderData);
        queryClient.invalidateQueries("payments");
        setReference(data.reference || "");
        resetCart(); // Clear cart after successful payment
        router.push(`/dashboard/orders`);
      } catch (error: any) {
        console.error("Payment Error:", error?.message || error);
        setError(
          error?.message || "An error occurred while initiating your checkout process"
        );
      }
    });
  };

  // ----------------------------------------------------
  // Utility Functions
  // ----------------------------------------------------
  const clearError = (): void => {
    setError(null);
  };

  const getCartItemCount = (): number => {
    return cart.length;
  };

  const isItemInCart = (itemId: number, type: "service" | "product" | "video"): boolean => {
    return cart.some((item) => item.id === itemId && item.cartType === type);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        reference,
        showOffCanvas,
        setShowOffCanvas,
        addToCart,
        removeFromCart,
        resetCart,
        checkout,
        isPending,
        error,
        clearError,
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
