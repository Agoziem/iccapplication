import PageTitle from "@/components/custom/PageTitle/PageTitle";
import Products from "@/components/features/Products/Products";

const ProductsPage = () => {
  return (
    <div>
      <PageTitle pathname="Products" />
      <div style={{ minHeight: "100vh" }}>
        <Products />
      </div>
    </div>
  );
};

export default ProductsPage;
