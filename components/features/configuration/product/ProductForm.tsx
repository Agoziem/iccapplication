import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import FileUploader from "@/components/custom/Fileuploader/FileUploader";
import { productsAPIendpoint } from "@/data/hooks/product.hooks";
import { PulseLoader } from "react-spinners";
import { useFetchSubCategories } from "@/data/categories/categories.hook";

/**
 * @param {{ product: Product; setProduct: (value:Product) => void; handleSubmit: any; addorupdate: any; categories: Categories;isSubmitting:boolean; }} param0
 */
const ProductForm = ({
  product,
  setProduct,
  handleSubmit,
  addorupdate,
  categories: productcategories,
  isSubmitting,
}) => {
  const { data: subcategories, isLoading: loadingsubcategories } =
    useFetchSubCategories(
      `${productsAPIendpoint}/subcategories/${product.category.id}/`,
      product.category?.id
    );
  // ------------------------------
  // Handle category change
  // -------------------------------
  const handleCategoryChange = (e) => {
    const selectedCategory = productcategories?.find(
      (category) => category.category === e.target.value
    );
    setProduct({ ...product, category: selectedCategory, subcategory: null });
  };

  // - -------------------------------
  // Handle subcategory change
  //  -------------------------------
  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = subcategories?.find(
      (subcategory) => subcategory.subcategory === e.target.value
    );
    setProduct({ ...product, subcategory: selectedSubCategory });
  };

  return (
    <div className="p-3">
      <h5 className="text-center mb-4">
        {addorupdate.mode === "add" ? "Add Product" : `Edit ${product.name}`}
      </h5>
      <hr />
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="mb-2">
          <label htmlFor="preview" className="form-label">
            Product Preview image
          </label>
          <ImageUploader
            imagekey={"preview"}
            imageurlkey={"img_url"}
            imagename={"img_name"}
            formData={product}
            setFormData={setProduct}
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            rows={4}
            required
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={product.category.category}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select category</option>
            {productcategories?.map((category) => (
              <option key={category.id} value={category.category}>
                {category.category}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="mb-3">
          <label htmlFor="subcategory" className="form-label">
            Sub-Category
          </label>
          <select
            className="form-select"
            id="subcategory"
            name="subcategory"
            value={product.subcategory?.subcategory || ""}
            onChange={handleSubCategoryChange}
            // required
          >
            {loadingsubcategories ? (
              <option>Loading...</option>
            ) : (
              <>
                <option value="">Select subcategory</option>
                {subcategories?.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.subcategory}>
                    {subcategory.subcategory}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* digital */}
        <div className="mb-3">
          <label htmlFor="digital" className="form-label me-2">
            Digital
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="digital"
            name="digital"
            checked={product.digital}
            onChange={(e) =>
              setProduct({ ...product, digital: e.target.checked })
            }
          />
        </div>

        {/* free */}
        <div className="mb-2">
          <label htmlFor="free" className="form-label me-2">
            Free
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="free"
            name="free"
            checked={product.free}
            onChange={(e) => setProduct({ ...product, free: e.target.checked })}
          />
        </div>

        {/* fileinput */}
        {product.digital && (
          <div className="mb-3">
            <FileUploader
              filekey={"product"}
              fileurlkey={"product_url"}
              filename={"product_name"}
              formData={product}
              setFormData={setProduct}
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary rounded px-5 mt-3">
          {isSubmitting ? (
            <div className="d-inline-flex align-items-center justify-content-center gap-2">
              <div>Submitting Product</div>
              <PulseLoader size={8} color={"#12000d"} loading={true} />
            </div>
          ) : addorupdate.mode === "add" ? (
            "Add Product"
          ) : (
            "Update Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
