import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import FileUploader from "@/components/custom/Fileuploader/FileUploader";
import {
  useAddProduct,
  useProductCategories,
  useProductSubCategories,
  useUpdateProduct,
} from "@/data/hooks/product.hooks";
import { PulseLoader } from "react-spinners";
import { Product } from "@/types/items";
import { ORGANIZATION_ID } from "@/data/constants";
import { createProductSchema, updateProductSchema } from "@/schemas/items";

type ProductFormData =
  | z.infer<typeof createProductSchema>
  | z.infer<typeof updateProductSchema>;

interface ProductFormProps {
  product?: Product | null;
  editMode: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  editMode = false,
  onSuccess,
  onCancel,
}) => {
  const { data: productcategories } = useProductCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const { data: subcategories, isLoading: loadingsubcategories } =
    useProductSubCategories(selectedCategoryId);
  const { mutateAsync: createProduct, isLoading: isCreating } = useAddProduct();
  const { mutateAsync: updateProduct, isLoading: isUpdating } =
    useUpdateProduct();

  const isSubmitting = isCreating || isUpdating;

  // Setup form with appropriate schema based on edit mode
  const form = useForm<ProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: 0,
      subcategory: 0,
      organization: ORGANIZATION_ID || "",
      digital: false,
      free: false,
      preview: "",
      product: "",
    },
  });

  // Update form when product prop changes
  useEffect(() => {
    if (editMode && product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: parseFloat(product.price || "0"),
        category: product.category?.id || 0,
        subcategory: product.subcategory?.id || 0,
        organization: ORGANIZATION_ID || "",
        digital: product.digital || false,
        free: product.free || false,
        preview: product.img_url || "",
        product: product.product || "",
      });
      setSelectedCategoryId(product.category?.id || 0);
    }
  }, [editMode, product, form]);

  // Set initial selected category for subcategory loading
  useEffect(() => {
    if (product?.category?.id) {
      setSelectedCategoryId(product.category.id);
    }
  }, [product]);

  // Handle category change for subcategory loading
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    form.setValue("subcategory", 0); // Reset subcategory when category changes
  };

  // Submit form
  const onSubmit = async (formData: ProductFormData) => {
    try {
      if (editMode && product?.id) {
        await updateProduct({
          productId: product.id,
          productData: formData,
        });
      } else {
        await createProduct({
          organizationId: parseInt(ORGANIZATION_ID || "0"),
          productData: {
            name: formData.name ?? "",
            description: formData.description ?? "",
            price: formData.price ?? 0,
            category: formData.category ?? 0,
            subcategory: formData.subcategory ?? 0,
            organization: ORGANIZATION_ID || "",
            digital: formData.digital || false,
            free: formData.free || false,
            preview: formData.preview ?? "",
            product: formData.product ?? "",
          },
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <div className="p-3">
      <h5 className="text-center mb-4">
        {editMode ? `Edit ${product?.name}` : "Add Product"}
      </h5>
      <hr />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Product Preview Image */}
        <div className="mb-2">
          <label htmlFor="preview" className="form-label">
            Product Preview image
          </label>
          <Controller
            name="preview"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <ImageUploader
                  {...field}
                  placeholder="Upload product preview image"
                  error={fieldState.error?.message}
                />
              </>
            )}
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="text"
                  className={`form-control ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="name"
                  placeholder="Enter product name"
                />
                {fieldState.error && (
                  <div className="invalid-feedback">
                    {fieldState.error.message}
                  </div>
                )}
              </>
            )}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <textarea
                  {...field}
                  className={`form-control ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="description"
                  placeholder="Enter product description"
                  rows={4}
                />
                {fieldState.error && (
                  <div className="invalid-feedback">
                    {fieldState.error.message}
                  </div>
                )}
              </>
            )}
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="number"
                  step="0.01"
                  className={`form-control ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="price"
                  placeholder="Enter product price"
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
                {fieldState.error && (
                  <div className="invalid-feedback">
                    {fieldState.error.message}
                  </div>
                )}
              </>
            )}
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <select
                  {...field}
                  className={`form-select ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="category"
                  onChange={(e) => {
                    const categoryId = parseInt(e.target.value);
                    field.onChange(categoryId);
                    handleCategoryChange(categoryId);
                  }}
                >
                  <option value={0}>Select category</option>
                  {productcategories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category}
                    </option>
                  ))}
                </select>
                {fieldState.error && (
                  <div className="invalid-feedback">
                    {fieldState.error.message}
                  </div>
                )}
              </>
            )}
          />
        </div>

        {/* Subcategory */}
        <div className="mb-3">
          <label htmlFor="subcategory" className="form-label">
            Sub-Category
          </label>
          <Controller
            name="subcategory"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <select
                  {...field}
                  className={`form-select ${
                    fieldState.error ? "is-invalid" : ""
                  }`}
                  id="subcategory"
                  disabled={loadingsubcategories || selectedCategoryId === 0}
                >
                  {loadingsubcategories ? (
                    <option>Loading...</option>
                  ) : (
                    <>
                      <option value={0}>Select subcategory</option>
                      {subcategories?.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.subcategory}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {fieldState.error && (
                  <div className="invalid-feedback">
                    {fieldState.error.message}
                  </div>
                )}
              </>
            )}
          />
        </div>

        {/* Digital */}
        <div className="mb-3">
          <div className="form-check">
            <Controller
              name="digital"
              control={form.control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="digital"
                  name={field.name}
                  ref={field.ref}
                  checked={field.value || false}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <label className="form-check-label" htmlFor="digital">
              Digital Product
            </label>
          </div>
        </div>

        {/* Free */}
        <div className="mb-3">
          <div className="form-check">
            <Controller
              name="free"
              control={form.control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="free"
                  name={field.name}
                  ref={field.ref}
                  checked={field.value || false}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <label className="form-check-label" htmlFor="free">
              Free Product
            </label>
          </div>
        </div>

        {/* File Upload for Digital Products */}
        {form.watch("digital") && (
          <div className="mb-3">
            <label className="form-label">Product File</label>
            <Controller
              name="product"
              control={form.control}
              render={({ field, fieldState }) => (
                <FileUploader
                  {...field}
                  placeholder="Upload digital product file"
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-accent-secondary rounded px-4"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary rounded px-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="d-inline-flex align-items-center justify-content-center gap-2">
                <div>{editMode ? "Updating" : "Adding"} Product</div>
                <PulseLoader size={8} color={"#ffffff"} loading={true} />
              </div>
            ) : editMode ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
