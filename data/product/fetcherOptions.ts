import type { Product, Products } from "@/types/items";

/**
 * Add Product Response Configuration for optimistic updates
 */
export const addProductOptions = (newProduct: Product) => {
  return {
    optimisticData: (products: Products): Products =>
      [...products, newProduct].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      ),

    rollbackOnError: true,
    populateCache: (addedProduct: Product, products: Products): Products =>
      [...products, addedProduct].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      ),
    revalidate: false,
  };
};

/**
 * Update Product Configuration for optimistic updates
 */
export const updateProductOptions = (updatedProduct: Product) => {
  return {
    optimisticData: (products: Products): Products => {
      return products.map((product) =>
        product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
      );
    },

    rollbackOnError: true,
    populateCache: (updatedProductResponse: Product, products: Products): Products => {
      return products.map((product) =>
        product.id === updatedProductResponse.id ? updatedProductResponse : product
      );
    },
    revalidate: false,
  };
};

/**
 * Delete Product Configuration for optimistic updates
 */
export const deleteProductOptions = (productId: number) => {
  return {
    optimisticData: (products: Products): Products => {
      return products.filter((product) => product.id !== productId);
    },

    rollbackOnError: true,
    populateCache: (deletedProductId: number, products: Products): Products => {
      return products.filter((product) => product.id !== deletedProductId);
    },
    revalidate: false,
  };
};
