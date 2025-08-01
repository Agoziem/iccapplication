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
import { useRouter } from "next/navigation";
import { addPayment } from "./payments/fetcher";
import { useQueryClient } from "react-query";
import { Product, Service, Video } from "@/types/items";
import { useGetUserProfile } from "./user.hook";

// Cart item types
type CartType = "service" | "product" | "video";

interface BaseCartItem {
  cartType: CartType;
}

interface ServiceCartItem extends BaseCartItem {
  cartType: "service";
  service: Service;
}

interface ProductCartItem extends BaseCartItem {
  cartType: "product";
  product: Product;
}

interface VideoCartItem extends BaseCartItem {
  cartType: "video";
  video: Video;
}

type CartItem = ServiceCartItem | ProductCartItem | VideoCartItem;

interface PaymentResponse {
  reference: string;
  // Add other payment response properties as needed
}

interface CartContextValue {
  cart: CartItem[];
  total: number;
  reference: string;
  addToCart: (item: CartItem, type: CartType) => void;
  removeFromCart: (itemId: string, type: CartType) => void;
  resetCart: () => void;
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
  const { data: user } = useGetUserProfile();
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
        (acc: number, item: CartItem) =>
          acc +
          parseFloat(
            item.cartType === "service"
              ? item.service.price
              : item.cartType === "product"
              ? item.product.price
              : item.video.price
          ),
        0
      );
      setTotal(calculatedTotal);
    }
  }, [storedCart]);

  // ----------------------------------------------------
  // Add to Cart
  // ----------------------------------------------------

  const addToCart = (item: CartItem, type: CartType): void => {
    const newItem: CartItem = { ...item, cartType: type } as CartItem;
    const newCart = [...cart, newItem];
    setCart(newCart);
    setStoredCart(newCart);
    setTotal(
      total +
        parseFloat(
          item.cartType === "service"
            ? item.service.price
            : item.cartType === "product"
            ? item.product.price
            : item.video.price
        )
    );
  };

  // ----------------------------------------------------
  // Remove from Cart
  // ----------------------------------------------------
  const removeFromCart = (itemId: string, type: CartType): void => {
    const itemToRemove = cart.find((item) => {
      const id =
        item.cartType === "service"
          ? item.service.id?.toString()
          : item.cartType === "product"
          ? item.product.id?.toString()
          : item.video.id?.toString();
      return id === itemId && item.cartType === type;
    });

    if (!itemToRemove) return;

    const newCart = cart.filter((item) => {
      const id =
        item.cartType === "service"
          ? item.service.id?.toString()
          : item.cartType === "product"
          ? item.product.id?.toString()
          : item.video.id?.toString();
      return !(id === itemId && item.cartType === type);
    });
    setCart(newCart);
    setStoredCart(newCart);

    const priceToSubtract =
      itemToRemove.cartType === "service"
        ? itemToRemove.service.price
        : itemToRemove.cartType === "product"
        ? itemToRemove.product.price
        : itemToRemove.video.price;

    setTotal(total - parseFloat(priceToSubtract));
  };

  // ----------------------------------------------------
  // Reset Cart
  // ----------------------------------------------------
  const resetCart = (): void => {
    setCart([]);
    setTotal(0);
    setStoredCart([]);
  };

  // ----------------------------------------------------
  // Checkout
  // ----------------------------------------------------
  const queryClient = useQueryClient();
  const checkout = (): void => {
    if (!user?.id) {
      setError("User session not found");
      return;
    }

    startTransition(async () => {
      // Create a simplified order with just the essential information
      const orderData = {
        customer: {
          id: user.id,
          name: user?.first_name || undefined,
          email: user?.email || undefined,
        },
        services: cart
          .filter((item) => item.cartType === "service")
          .map((item) => item.service),
        products: cart
          .filter((item) => item.cartType === "product")
          .map((item) => item.product),
        videos: cart
          .filter((item) => item.cartType === "video")
          .map((item) => item.video),
        amount: total.toString(),
        status: "Pending" as const,
        service_delivered: false,
      };

      try {
        // Type assertion needed because the API expects IDs but TypeScript interface expects objects
        const data = (await addPayment(orderData)) as PaymentResponse;
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
        resetCart,
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
