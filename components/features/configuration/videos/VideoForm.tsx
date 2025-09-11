import VideoUploader from "@/components/custom/Fileuploader/VideoUploader";
import ImageUploader from "@/components/custom/Imageuploader/ImageUploader";
import { useFetchSubCategories } from "@/data/categories/categories.hook";
import { fetchSubCategories } from "@/data/categories/fetcher";
import { vidoesapiAPIendpoint } from "@/data/videos/fetcher";
import { PulseLoader } from "react-spinners";

/**
 * @param {{ video: Video; setVideo: (value:Video) => void; handleSubmit: any; addorupdate: any; categories: Categories;isSubmitting:boolean }} param0
 */
const VideoForm = ({
  video,
  setVideo,
  handleSubmit,
  addorupdate,
  categories: videoCategories,
  isSubmitting,
}) => {
  const { data: subcategories, isLoading: loadingsubcategories } =
    useFetchSubCategories(
      `${vidoesapiAPIendpoint}/subcategories/${video.category.id}/`,
      video.category?.id
    );

  // ------------------------------
  // Handle category change
  // -------------------------------
  const handleCategoryChange = (e) => {
    const selectedCategory = videoCategories?.find(
      (category) => category.category === e.target.value
    );
    setVideo({ ...video, category: selectedCategory, subcategory: null });
  };

  // - -------------------------------
  // Handle subcategory change
  //  -------------------------------
  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = subcategories?.find(
      (subcategory) => subcategory.subcategory === e.target.value
    );
    setVideo({ ...video, subcategory: selectedSubCategory });
  };

  return (
    <div className="p-3">
      <h5 className="text-center mb-4">
        {addorupdate.mode === "add" ? "Add Video" : `Edit ${video.title}`}
      </h5>
      <hr />
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="mb-2">
          <ImageUploader
            imagekey={"thumbnail"}
            imageurlkey={"img_url"}
            imagename={"img_name"}
            formData={video}
            setFormData={setVideo}
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={video.title}
            onChange={(e) => setVideo({ ...video, title: e.target.value })}
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
            value={video.description}
            onChange={(e) =>
              setVideo({ ...video, description: e.target.value })
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
            value={video.price}
            onChange={(e) => setVideo({ ...video, price: e.target.value })}
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
            value={video?.category?.category}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select category</option>
            {videoCategories?.map((category) => (
              <option key={category.id} value={category.category}>
                {category.category}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="mb-3">
          <label htmlFor="subcategory" className="form-label">
            Subcategory
          </label>
          <select
            className="form-select"
            id="subcategory"
            name="subcategory"
            value={video?.subcategory?.subcategory}
            onChange={handleSubCategoryChange}
            required
          >
            <option value="">Select subcategory</option>
            {loadingsubcategories ? (
              <option>Loading...</option>
            ) : (
              subcategories?.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.subcategory}>
                  {subcategory.subcategory}
                </option>
              ))
            )}
          </select>
        </div>

        {/* free */}
        <div className="mb-3">
          <label htmlFor="free" className="form-label me-2">
            Free
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="free"
            name="free"
            checked={video.free}
            onChange={(e) => setVideo({ ...video, free: e.target.checked })}
          />
        </div>

        {/* Video */}
        <div className="mb-3">
          <VideoUploader
            videokey={"video"}
            videourlkey={"video_url"}
            videoname={"video_name"}
            formData={video}
            setFormData={setVideo}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary rounded px-5 mt-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="d-inline-flex align-items-center justify-content-center gap-2">
              <div>Submitting Video</div>
              <PulseLoader size={8} color={"#12000d"} loading={true} />
            </div>
          ) : addorupdate.mode === "add" ? (
            "Add Video"
          ) : (
            "Update Video"
          )}
        </button>
      </form>
    </div>
  );
};

export default VideoForm;
