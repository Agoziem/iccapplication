"use client";
import { useAdminContext } from "@/providers/context/Admincontextdata";
import React, { useEffect, useState, useTransition } from "react";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import VideoCard from "./VideoCard";
import VideoForm from "./VideoForm";
import CategoryTabs from "@/components/features/Categories/Categoriestab";
import CategoriesForm from "@/components/features/Categories/Categories";
import SubCategoriesForm from "@/components/features/SubCategories/SubCategoriesForm";
import { FaVideo } from "react-icons/fa6";
import Pagination from "@/components/custom/Pagination/Pagination";
import { VideoDefault } from "@/data/constants";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  createVideo,
  deleteVideo,
  fetchVideos,
  updateVideo,
  vidoesapiAPIendpoint,
} from "@/data/hooks/video.hooks";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { PulseLoader } from "react-spinners";
import { useFetchCategories } from "@/data/categories/categories.hook";
import { useCreateVideo, useDeleteVideo, useFetchVideos, useUpdateVideo } from "@/data/hooks/video.hooks";

const Videos = () => {
  const { openModal } = useAdminContext();
  const [video, setVideo] = useState(VideoDefault);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [addorupdate, setAddorupdate] = useState({ mode: "add", state: false });

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [allCategories, setAllCategories] = useState([]);
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [isPending, startTransition] = useTransition();
  const [isdeleting, startDeletion] = useTransition();

  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoryError,
  } = useFetchCategories(`${vidoesapiAPIendpoint}/categories/`);

  useEffect(() => {
    if (!categories) return;
    if (categories.length > 0)
      setAllCategories([
        { id: 0, category: "All", description: "All Categories" },
        ...categories,
      ]);
  }, [categories]);

  // ----------------------------------------
  // Fetch Videos based on category
  // ----------------------------------------
  const {
    data: videos,
    isLoading: loadingVideos,
    error: error,
  } = useFetchVideos(
    `${vidoesapiAPIendpoint}/videos/${Organizationid}/?category=${currentCategory}&page=${page}&page_size=${pageSize}`
  );

  // -----------------------------------------
  // Handle page change
  // -----------------------------------------
  /**  @param {string} newPage */
  const handlePageChange = (newPage) => {
    router.push(
      `?category=${currentCategory}&page=${newPage}&page_size=${pageSize}`,
      {
        scroll: false,
      }
    );
  };

  // ---------------------------------------
  // Filter videos based on search input
  // ---------------------------------------
  let filteredVideos = videos?.results || [];
  if (searchQuery) {
    filteredVideos = filteredVideos.filter((video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // -------------------------------
  // Handle category change
  // -------------------------------
  /**  @param {string} category */
  const handleCategoryChange = (category) => {
    router.push(`?category=${category}&page=${page}&page_size=${pageSize}`, {
      scroll: false,
    });
  };

  // ------------------------------------------------------
  // Fetch all videos and paginate them
  // ------------------------------------------------------
  const closeModal = () => {
    setShowModal(false);
    setShowModal2(false);
    setVideo(VideoDefault);
    setAddorupdate({ mode: "", state: false });
  };

  const handleAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  //----------------------------------------------------
  // Create a new video or update an existing video
  //----------------------------------------------------
  const {mutateAsync: createVideo} = useCreateVideo();
  const {mutateAsync: updateVideo} = useUpdateVideo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      const { organization, category, subcategory, ...restData } = video;
      const videostosubmit = {
        ...restData,
        organization: Organizationid,
        category: category || "",
        subcategory: subcategory
          ? {
              ...subcategory,
              category: category.id,
            }
          : "",
      };
      try {
        if (addorupdate.mode === "add") {
          await createVideo(videostosubmit);
        } else {
          await updateVideo(videostosubmit);
        }
        handleAlert(
          `your Video have been ${
            addorupdate.mode === "add" ? "added" : "updated"
          } successfully `,
          "success"
        );
      } catch (error) {
        handleAlert("An error have occurred, please try again", "danger");
      } finally {
        closeModal();
      }
    });
  };

  //----------------------------------------------------
  // Delete a Video
  //----------------------------------------------------
  const {mutateAsync: deleteVideo} = useDeleteVideo();
  /**
   * @async
   * @param {number} id
   */
  const handleDelete = async (id) => {
    startDeletion(async () => {
      try {
        await deleteVideo(id);
        handleAlert("Service deleted Successfully", "success");
      } catch (error) {
        console.log(error.message);
        handleAlert("Error deleting Service", "danger");
      } finally {
        closeModal();
      }
    });
  };

  //   ------------------------------------------------------
  //   // Create a new service
  //   // ------------------------------------------------------
  const handleEdit = (video) => {
    setVideo(video);
    setAddorupdate({ mode: "update", state: true });
    setShowModal(true);
  };

  //   ------------------------------------------------------
  //   // Delete a service
  //   // ------------------------------------------------------
  const handleDeleteConfirm = (video) => {
    setVideo(video);
    setShowModal2(true);
  };

  return (
    <div>
      <hr />
      <div className="row">
        <div className="col-12 col-md-7">
          <CategoriesForm
            items={categories}
            addUrl={`${vidoesapiAPIendpoint}/add_category/`}
            updateUrl={`${vidoesapiAPIendpoint}/update_category`}
            deleteUrl={`${vidoesapiAPIendpoint}/delete_category`}
          />
        </div>
        <div className="col-12 col-md-5">
          <SubCategoriesForm
            categories={categories}
            apiendpoint={vidoesapiAPIendpoint}
            addUrl={`${vidoesapiAPIendpoint}/create_subcategory/`}
            updateUrl={`${vidoesapiAPIendpoint}/update_subcategory`}
            deleteUrl={`${vidoesapiAPIendpoint}/delete_subcategory`}
          />
        </div>
      </div>

      {/* categories */}
      <div className="mb-3 ps-2 ps-md-0">
        {/* Categories */}
        <h5 className="mb-3 fw-bold">categories</h5>
        {loadingCategories && !categoryError ? (
          <div className="d-flex gap-2 align-items-center">
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            fetching Service Categories
          </div>
        ) : (
          <CategoryTabs
            categories={allCategories}
            currentCategory={currentCategory}
            setCurrentCategory={handleCategoryChange}
          />
        )}
      </div>

      <div className="d-flex flex-column flex-md-row flex-wrap align-items-start align-items-md-center gap-3 pe-3 pb-3 mb-3">
        <button
          className="btn btn-primary border-0 rounded mb-2 mt-4 mt-md-0 mb-md-0"
          style={{ backgroundColor: "var(--bgDarkerColor)" }}
          onClick={() => {
            setAddorupdate({ mode: "add", state: true });
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2 h5 mb-0"></i> Add{" "}
          {currentCategory} Video
        </button>
        <div>
          <h5 className="mb-1">{currentCategory} Videos</h5>
          <p className="mb-0 text-primary">
            {videos?.count} Video{videos?.count > 1 ? "s" : ""} in Total
          </p>
        </div>
        <div className="ms-0 ms-md-auto mb-4 mb-md-0">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemlabel="video"
          />
        </div>
      </div>

      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
      {searchQuery && <h5>Search Results</h5>}
      <div className="row">
        {
          // loading
          loadingVideos && !error && (
            <div className="d-flex justify-content-center">
              {/* spinner */}
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )
        }
        {!loadingVideos && filteredVideos?.length > 0 ? (
          filteredVideos?.map((video) => (
            <VideoCard
              openModal={openModal}
              key={video.id}
              tab={currentCategory}
              item={video}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
            />
          ))
        ) : (
          <div className="mt-3 mb-3 text-center">
            <FaVideo
              className="mt-2"
              style={{
                fontSize: "6rem",
                color: "var(--bgDarkerColor)",
              }}
            />
            <p className="mt-3 mb-3">No Videos available</p>
          </div>
        )}
        {!loadingVideos &&
          videos &&
          Math.ceil(videos.count / parseInt(pageSize)) > 1 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(videos.count / parseInt(pageSize))}
              handlePageChange={handlePageChange}
            />
          )}
      </div>

      <Modal
        showmodal={showModal}
        toggleModal={closeModal}
        overlayclose={false}
      >
        <VideoForm
          video={video}
          setVideo={setVideo}
          handleSubmit={handleSubmit}
          addorupdate={addorupdate}
          categories={categories}
          isSubmitting={isPending}
        />
      </Modal>

      <Modal showmodal={showModal2} toggleModal={closeModal}>
        <div className="p-3">
          <p className="text-center">Delete Product</p>
          <hr />
          <h5 className="text-center mb-4">{video.title}</h5>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-danger border-0 rounded me-2"
              onClick={() => handleDelete(video.id)}
              disabled={isdeleting}
            >
              {isdeleting ? (
                <div className="d-inline-flex align-items-center justify-content-center gap-2">
                  <div>deleting Video</div>
                  <PulseLoader size={8} color={"#ffffff"} loading={true} />
                </div>
              ) : (
                "Delete"
              )}
            </button>
            <button
              className="btn btn-accent-secondary border-0 rounded"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Videos;
