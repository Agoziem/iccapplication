"use client";
import React from "react";
import QueryProvider from "./react-query";
import ContextProviders from "./context/ContextProviders";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "@/data/constants";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryProvider>
        <ContextProviders>{children}</ContextProviders>
      </QueryProvider>
    </GoogleOAuthProvider>
  );
};

export default Providers;
