"use client";
import React, { useEffect } from "react";

const BootstrapJs = () => {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.min.js")
      .then(() => console.log("✅ Bootstrap loaded"))
      .catch((err) => console.error("❌ Bootstrap load error", err));
  }, []);
  return null;
};

export default BootstrapJs;
