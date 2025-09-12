import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import Tiptap from "@/components/custom/Richtexteditor/Tiptap";
import { servicesAPIendpoint } from "@/data/hooks/service.hooks";
import { PulseLoader } from "react-spinners";
import { useFetchSubCategories } from "@/data/categories/categories.hook";

/**
 * @param {{ service: Service; setService: (value:Service) => void; handleSubmit: any; addorupdate: any; OrganizationData: any; tab: any; categories: any;isSubmitting: boolean; }} param0
 */
const ServiceForm = ({
  service,
  setService,
  handleSubmit,
  addorupdate,
  tab,
  categories: servicecategories,
  isSubmitting,
}) => {
  const { data: subcategories, isLoading: loadingsubcategories } =
    useFetchSubCategories(
      `${servicesAPIendpoint}/subcategories/${service.category.id}/`
    );

  // ------------------------------
  // Handle category change
  // -------------------------------
  const handleCategoryChange = (e) => {
    const selectedCategory = servicecategories?.find(
      (category) => category.category === e.target.value
    );
    setService({ ...service, category: selectedCategory, subcategory: null });
  };

  // - -------------------------------
  // Handle subcategory change
  //  -------------------------------
  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = subcategories?.find(
      (subcategory) => subcategory.subcategory === e.target.value
    );
    setService({ ...service, subcategory: selectedSubCategory });
  };

  return (
    <div className="p-3">
      <h5 className="text-center mb-4">
        {addorupdate.mode === "add"
          ? `Add ${tab !== "application" ? "service" : "application"}`
          : `Edit ${tab !== "application" ? "service" : "application"}`}
      </h5>
      <hr />
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {/* Preview */}
        <div className="mb-2">
          <ImageUploader
            imagekey={"preview"}
            imageurlkey={"img_url"}
            imagename={"img_name"}
            formData={service}
            setFormData={setService}
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
            value={service.name}
            onChange={(e) => setService({ ...service, name: e.target.value })}
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
            value={service.description}
            onChange={(e) =>
              setService({ ...service, description: e.target.value })
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
            value={service.price}
            onChange={(e) => setService({ ...service, price: e.target.value })}
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
            value={service.category?.category || ""}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select category</option>
            {servicecategories.map((category) => (
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
            value={service.subcategory?.subcategory || ""}
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

        {/* Service Flow */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Service flow
          </label>
          <Tiptap
            item={service.service_flow}
            setItem={(value) => {
              setService({
                ...service,
                service_flow: value,
              });
            }}
          />
        </div>

        {/* Service details Form */}
        <div className="mb-3">
          <label htmlFor="form_link" className="form-label">
            Service details link
          </label>
          <input
            type="text"
            className="form-control"
            id="form_link"
            name="details_form_link"
            value={service.details_form_link}
            onChange={(e) =>
              setService({ ...service, details_form_link: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary rounded px-5 mt-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="d-inline-flex align-items-center justify-content-center gap-2">
              <div>Submitting Service</div>
              <PulseLoader size={8} color={"#12000d"} loading={true} />
            </div>
          ) : addorupdate.mode === "add" ? (
            "Add Service"
          ) : (
            "Update Service"
          )}
        </button>
      </form>
    </div>
  );
};

export default ServiceForm;
