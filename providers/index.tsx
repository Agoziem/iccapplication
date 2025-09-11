"use client";
import React from "react";
import QueryProvider from "./react-query";

const Providers = ({ children }) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default Providers;
