"use client";
import React from "react";
import QueryProvider from "./react-query";
import ContextProviders from "./context/ContextProviders";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "@/data/constants";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const Providers = ({ children }: { children: React.ReactNode }) => {
  // Add development warning suppression for concurrent rendering
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const originalError = console.error;
      console.error = (...args: any[]) => {
        if (
          typeof args[0] === "string" &&
          args[0].includes("Detected multiple renderers concurrently rendering the same context provider")
        ) {
          // Suppress this specific error in development
          return;
        }
        originalError(...args);
      };

      return () => {
        console.error = originalError;
      };
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryProvider>
        <NuqsAdapter>
          <ContextProviders>{children}</ContextProviders>
        </NuqsAdapter>
      </QueryProvider>
    </GoogleOAuthProvider>
  );
};

export default Providers;
