"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

// Create a single QueryClient instance outside of the component
// to prevent multiple instances during hot reloading
let queryClient: QueryClient | undefined;

function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 3,
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
        mutations: {
          retry: 1,
        },
      },
    });
  }
  return queryClient;
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Use the singleton QueryClient
  const client = React.useMemo(() => getQueryClient(), []);

  // Add error boundary for development
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // Clear any stale clients during hot reload
    React.useEffect(() => {
      const handleBeforeUnload = () => {
        queryClient = undefined;
      };
      
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);
  }

  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}
