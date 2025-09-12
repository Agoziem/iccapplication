"use client";
import React from "react";
import QueryProvider from "./react-query";
import ContextProviders from "./context/ContextProviders";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <ContextProviders>{children}</ContextProviders>
    </QueryProvider>
  );
};

export default Providers;
