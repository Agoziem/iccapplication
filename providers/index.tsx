"use client";
import React from "react";
import QueryProvider from "./react-query";
import ContextProviders from "./context/ContextProviders";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "@/data/constants";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const Providers = ({ children }: { children: React.ReactNode }) => {
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
