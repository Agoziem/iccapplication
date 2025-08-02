"use client";
import React from "react";
import QueryProvider from "./react-query";
import ContextProviders from "./ContextProviders";
import { Toaster } from "sonner";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ContextProviders>
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    </ContextProviders>
  );
};

export default Providers;
