"use client";
import useLocalStorage from "@/hooks/useLocalStorage";
import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useTransition,
  ReactNode,
  FC,
} from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { addPayment } from "../payments/fetcher";
import { useQueryClient } from "react-query";

// Cart item types
type CartType = "service" | "product" | "video";

interface BaseCartItem {
  id: string;
  name: string;
  price: string;
  cartType: CartType;
}

interface ServiceCartItem extends BaseCartItem {
  cartType: "service";
  // Add service-specific properties if needed
}

interface ProductCartItem extends BaseCartItem {
  cartType: "product";
  // Add product-specific properties if needed
}

interface VideoCartItem extends BaseCartItem {
  cartType: "video";
  title?: string;
  // Add video-specific properties if needed
}

type CartItem = ServiceCartItem | ProductCartItem | VideoCartItem;

interface OrderData {
  customerid: string;
  services: string[];
  products: string[];
  videos: string[];
  total: number;
}

interface PaymentResponse {
  reference: string;
  // Add other payment response properties as needed
}

interface CartContextValue {
  cart: CartItem[];
  total: number;
  reference: string;
  addToCart: (item: Omit<CartItem, 'cartType'>, type: CartType) => void;
  removeFromCart: (itemId: string, type: CartType) => void;
  resertCart: () => void;
  checkout: () => void;
  isPending: boolean;
  error: string | null;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextValue | null>(null);

const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storedCart, setStoredCart] = useLocalStorage("cart", [] as CartItem[]);
  const [total, setTotal] = useState<number>(0);
  const [reference, setReference] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------
  // Set Cart from local storage
  // ----------------------------------------------------
  useEffect(() => {
    const isEmptyData = !storedCart || storedCart.length === 0;
    if (isEmptyData) {
      setCart([]);
      setTotal(0);
    } else {
      setCart(storedCart);
      const calculatedTotal = storedCart.reduce(
        (acc: number, item: CartItem) => acc + parseFloat(item.price),
        0
      );
      setTotal(calculatedTotal);
    }
  }, [storedCart]);

  // ----------------------------------------------------
  // Add to Cart
  // ----------------------------------------------------

  const addToCart = (item: Omit<CartItem, 'cartType'>, type: CartType): void => {
    const newItem: CartItem = { ...item, cartType: type } as CartItem;
    const newCart = [...cart, newItem];
    setCart(newCart);
    setStoredCart(newCart);
    setTotal(total + parseFloat(item.price));
  };

  // ----------------------------------------------------
  // Remove from Cart
  // ----------------------------------------------------
  const removeFromCart = (itemId: string, type: CartType): void => {
    const itemToRemove = cart.find(
      (item) => item.id === itemId && item.cartType === type
    );
    
    if (!itemToRemove) return;

    const newCart = cart.filter((item) => !(item.id === itemId && item.cartType === type));
    setCart(newCart);
    setStoredCart(newCart);
    setTotal(total - parseFloat(itemToRemove.price));
  };

  // ----------------------------------------------------
  // Reset Cart
  // ----------------------------------------------------
  const resertCart = (): void => {
    setCart([]);
    setTotal(0);
    setStoredCart([]);
  };

  // ----------------------------------------------------
  // Checkout
  // ----------------------------------------------------
  const queryClient = useQueryClient();
  const checkout = (): void => {
    if (!session?.user?.id) {
      setError("User session not found");
      return;
    }

    startTransition(async () => {
      const order: OrderData = {
        customerid: session.user.id,
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
        const data = await addPayment(order) as PaymentResponse;
        queryClient.invalidateQueries("payments");
        if (data?.reference) {
          setReference(data.reference);
        }
        router.push(`/dashboard/orders`);
      } catch (error: any) {
        console.error("Payment Error:", error?.message || "Unknown error");
        setError(
          "An error just occurred, while initiating your CheckOut Process"
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

const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
