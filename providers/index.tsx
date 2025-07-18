"use client";
import React from "react";
import QueryProvider from "./react-query";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default Providers;
