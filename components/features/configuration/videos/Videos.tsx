"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaVideo } from "react-icons/fa6";
import { BsPersonFillGear } from "react-icons/bs";
import { PulseLoader } from "react-spinners";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import VideoCard from "./VideoCard";
import VideoForm from "./VideoForm";
import CategoryTabs from "@/components/features/Categories/Categoriestab";
import Pagination from "@/components/custom/Pagination/Pagination";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { useAdminContext } from "@/providers/context/Admincontextdata";
import {
  useDeleteVideo,
  useVideoCategories,
  useVideos,
} from "@/data/hooks/video.hooks";
import { Video, VideoCategory } from "@/types/items";
import { Category } from "@/types/categories";
import { ORGANIZATION_ID } from "@/data/constants";
import { VideoCategoryManager } from "../../Categories/CategoryManager";
import VideoSubCatForm from "../../SubCategories/videossub";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

type AlertState = {
  show: boolean;
  message: string;
  type: "info" | "success" | "warning" | "danger";
};

const Videos = () => {
  const adminctx = useAdminContext();
  const [video, setVideo] = useState<Video | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });
  const [addorupdate, setAddorupdate] = useState({ mode: "add", state: false });

  const [currentCategory, setCurrentCategory] = useQueryState(
    "category",
    parseAsString.withDefault("All")
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState(
    "page_size",
    parseAsInteger.withDefault(10)
  );
  const [allCategories, setAllCategories] = useState<Category[] | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<VideoCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isdeleting, startDeletion] = useTransition();

  // Hooks
  const { mutateAsync: deleteVideo } = useDeleteVideo();
  const {
    data: videoCategories,
    isLoading: loadingCategories,
    error: categoryError,
  } = useVideoCategories();

  // Fetch Videos
  const {
    data: videos,
    isLoading: loadingVideos,
    error: videosError,
  } = useVideos(parseInt(ORGANIZATION_ID || "0"), {
    category: currentCategory === "All" ? "" : currentCategory,
    page: page,
    page_size: pageSize,
  });

  // Setup categories with "All" option
  useEffect(() => {
    if (!videoCategories) return;
    const processedCategories: Category[] = [
      { id: 0, category: "All", description: "All Categories" },
      ...videoCategories
        .filter((cat) => Boolean(cat.category))
        .map(
          (cat): Category => ({
            id: cat.id || 0,
            category: cat.category!,
            description: cat.description || "",
          })
        ),
    ];
    setAllCategories(processedCategories);
  }, [videoCategories]);

  // Handle alert display
  const handleAlert = (message: string, type: AlertState["type"]) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "info" });
    }, 5000);
  };

  // Handle page change
  const handlePageChange = (newPage: string | number) => {
    const pageNum = typeof newPage === "string" ? parseInt(newPage) : newPage;
    if (isNaN(pageNum) || pageNum < 1) return;
    setPage(pageNum);
  };

  // Handle category change
  const handleCategoryChange = (categoryName: string) => {
    const category = allCategories?.find(
      (cat) => cat.category === categoryName
    );
    setCurrentCategory(category?.category || "All");
    setPage(1);
  };

  // Open modal for add/edit
  const openModal = (editVideo?: Video) => {
    if (editVideo) {
      setVideo(editVideo);
      setAddorupdate({ mode: "update", state: true });
    } else {
      setVideo(null);
      setAddorupdate({ mode: "add", state: false });
    }
    setShowModal(true);
  };

  // Handle video deletion
  const handleDelete = async (videoId: number) => {
    startDeletion(async () => {
      try {
        await deleteVideo(videoId);
        handleAlert("Video deleted successfully!", "success");
        setShowModal2(false);
        setVideo(null);
      } catch (error) {
        handleAlert(
          error instanceof Error ? error.message : "Failed to delete video",
          "danger"
        );
      }
    });
  };

  // Handle video edit
  const handleEdit = (video: Video) => {
    setVideo(video);
    setAddorupdate({ mode: "update", state: true });
    setShowModal(true);
  };

  // Handle video delete confirmation
  const handleDeleteConfirm = (video: Video) => {
    setVideo(video);
    setShowModal2(true);
  };

  // Close modals
  const closeModal = () => {
    setShowModal(false);
    setShowModal2(false);
    setVideo(null);
    setAddorupdate({ mode: "", state: false });
  };

  // Handle form success
  const handleFormSuccess = () => {
    handleAlert(
      addorupdate.mode === "add"
        ? "Video created successfully!"
        : "Video updated successfully!",
      "success"
    );
    closeModal();
  };

  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!videos?.results) return [];

    let filtered = videos.results;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (video.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ??
            false)
      );
    }

    return filtered;
  }, [videos, searchQuery]);

  if (loadingVideos) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <PulseLoader color="var(--primary)" size={15} />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <FaVideo size={25} className="text-primary me-2" />
            <h5 className="mb-0">Videos Management</h5>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-primary"
            onClick={() => openModal()}
            disabled={isPending}
          >
            Add New Video
          </button>
        </div>
      </div>
      <hr />

      {/* Category Management */}
      <div className="row mb-4 pt-2">
        <div className="col-12 col-md-7">
          <VideoCategoryManager />
        </div>
        <div className="col-12 col-md-5">
          <VideoSubCatForm />
        </div>
      </div>

      {/* Categories and Search */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h5 className="mb-3 fw-bold">Categories</h5>
          {loadingCategories && !categoryError ? (
            <div className="text-center">
              <PulseLoader color="#0d6efd" size={10} />
            </div>
          ) : (
            <CategoryTabs
              categories={allCategories || []}
              currentCategory={currentCategory}
              setCurrentCategory={(categoryName: string) => {
                const category = allCategories?.find(
                  (cat) => cat.category === categoryName
                );
                handleCategoryChange(category?.category || "All");
              }}
            />
          )}
        </div>
        <div className="col-md-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemlabel="video"
          />
        </div>
      </div>

      {/* Videos Header */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <h5 className="mb-1">{currentCategory} Videos</h5>
          <p className="mb-0 text-primary">
            {videos?.count ?? 0} Video{(videos?.count ?? 0) !== 1 ? "s" : ""} in
            Total
          </p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

      {/* Search Results Header */}
      {searchQuery && <h5 className="mb-3">Search Results</h5>}

      {/* Videos Grid */}
      <div className="row">
        {loadingVideos && !videosError ? (
          <div className="col-12 d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FaVideo size={64} className="text-muted mb-3" />
            <h5 className="text-muted">No videos found</h5>
            <p className="text-muted">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Start by adding your first video"}
            </p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              item={video}
              tab={currentCategory}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
              openModal={adminctx?.openModal || (() => {})}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {videos && videos.count > pageSize && (
        <div className="row mt-4">
          <div className="col-12">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(videos.count / pageSize)}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Add/Edit Video Modal */}
      <Modal
        showmodal={showModal}
        toggleModal={closeModal}
        overlayclose={false}
      >
        <VideoForm
          video={video}
          editMode={addorupdate.mode === "update"}
          onSuccess={handleFormSuccess}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal showmodal={showModal2} toggleModal={closeModal}>
        <div className="p-3">
          <p className="text-center">Delete Video</p>
          <hr />
          <h5 className="text-center mb-4">{video?.title}</h5>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-danger border-0 rounded me-2"
              onClick={() => video && video.id && handleDelete(video.id)}
              disabled={isdeleting}
            >
              {isdeleting ? (
                <div className="d-inline-flex align-items-center justify-content-center gap-2">
                  <div>Deleting Video</div>
                  <PulseLoader size={8} color={"#ffffff"} loading={true} />
                </div>
              ) : (
                "Delete"
              )}
            </button>
            <button
              className="btn btn-secondary border-0 rounded"
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
