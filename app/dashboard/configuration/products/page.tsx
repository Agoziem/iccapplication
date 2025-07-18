import Products from "@/components/features/configuration/product/Products";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import React from "react";

const ProductConfigPage = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Products Settings" />
      <div>
        <h4 className="my-3 mt-4">Products</h4>
        <Products/>
      </div>
    </div>
  );
};

export default ProductConfigPage;
