"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useAdminContext } from "@/providers/context/Admincontextdata";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import ServiceCard from "./ServiceCard";
import ServiceForm from "./ServiceForm";
import CategoryTabs from "@/components/features/Categories/Categoriestab";
import Pagination from "@/components/custom/Pagination/Pagination";
import { BsPersonFillGear } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  useDeleteService,
  useServiceCategories,
  useServices,
} from "@/data/hooks/service.hooks";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { PulseLoader } from "react-spinners";
import { Service, ServiceCategory } from "@/types/items";
import { Category } from "@/types/categories";
import { ORGANIZATION_ID } from "@/data/constants";
import { ServiceCategoryManager } from "../../Categories/CategoryManager";
import ServicesSubCatForm from "../../SubCategories/servicessub";

type AlertState = {
  show: boolean;
  message: string;
  type: "info" | "success" | "warning" | "danger";
};

const Services = () => {
  const adminctx = useAdminContext();
  const [service, setService] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: "", type: "info" });
  const [addorupdate, setAddorupdate] = useState({ mode: "add", state: false });

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [allCategories, setAllCategories] = useState<Category[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isdeleting, startDeletion] = useTransition();

  // Hooks
  const { mutateAsync: deleteService } = useDeleteService();
  const { data: serviceCategories, isLoading: loadingCategories, error: categoryError } = useServiceCategories();

  // Fetch Services
  const {
    data: services,
    isLoading: loadingServices,
    error: servicesError,
  } = useServices(
    parseInt(ORGANIZATION_ID || "0"),
    {
      category: currentCategory === "All" ? "" : currentCategory,
      page: parseInt(page),
      page_size: parseInt(pageSize),
    }
  );

  // Setup categories with "All" option
  useEffect(() => {
    if (!serviceCategories) return;
    const processedCategories: Category[] = [
      { id: 0, category: "All", description: "All Categories" },
      ...serviceCategories
        .filter((cat): cat is ServiceCategory & { category: string } => Boolean(cat.category))
        .map((cat): Category => ({
          id: cat.id,
          category: cat.category!,
          description: cat.description,
        })),
    ];
    setAllCategories(processedCategories);
  }, [serviceCategories]);

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
    router.push(
      `?category=${currentCategory}&page=${pageNum}&page_size=${pageSize}`,
      {
        scroll: false,
      }
    );
  };

  // Handle category change
  const handleCategoryChange = (categoryName: string) => {
    const category = allCategories?.find(cat => cat.category === categoryName);
    const categoryId = category?.id || 0;
    router.push(
      `?category=${categoryId}&page=1&page_size=${pageSize}`,
      {
        scroll: false,
      }
    );
  };

  // Open modal for add/edit
  const openModal = (editService?: Service) => {
    if (editService) {
      setService(editService);
      setAddorupdate({ mode: "update", state: true });
    } else {
      setService(null);
      setAddorupdate({ mode: "add", state: false });
    }
    setShowModal(true);
  };

  // Handle service deletion
  const handleDelete = async (serviceId: number) => {
    startDeletion(async () => {
      try {
        await deleteService(serviceId);
        handleAlert("Service deleted successfully!", "success");
        setShowModal2(false);
        setService(null);
      } catch (error) {
        handleAlert(
          error instanceof Error ? error.message : "Failed to delete service",
          "danger"
        );
      }
    });
  };

  // Handle service edit
  const handleEdit = (service: Service) => {
    setService(service);
    setAddorupdate({ mode: "update", state: true });
    setShowModal(true);
  };

  // Handle service delete confirmation
  const handleDeleteConfirm = (service: Service) => {
    setService(service);
    setShowModal2(true);
  };

  // Close modals
  const closeModal = () => {
    setShowModal(false);
    setShowModal2(false);
    setService(null);
    setAddorupdate({ mode: "", state: false });
  };

  // Handle form success
  const handleFormSuccess = () => {
    handleAlert(
      addorupdate.mode === "add" ? "Service created successfully!" : "Service updated successfully!", 
      "success"
    );
    closeModal();
  };

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (!services?.results) return [];
    
    let filtered = services.results;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
    }
    
    return filtered;
  }, [services, searchQuery]);

  if (loadingServices) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <PulseLoader color="#0d6efd" size={15} />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <BsPersonFillGear size={32} className="text-primary me-2" />
            <h4 className="mb-0">Services Management</h4>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-primary"
            onClick={() => openModal()}
            disabled={isPending}
          >
            Add New Service
          </button>
        </div>
      </div>

      {/* Category Management */}
      <div className="row mb-4">
        <div className="col-12 md:col-md-7">
          <ServiceCategoryManager />
        </div>
        <div className="col-md-5">
          <ServicesSubCatForm />
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
                const category = allCategories?.find(cat => cat.category === categoryName);
                handleCategoryChange(category?.category || "All");
              }}
            />
          )}
        </div>
        <div className="col-md-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemlabel="service"
          />
        </div>
      </div>

      {/* Services Header */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <h5 className="mb-1">{currentCategory} Services</h5>
          <p className="mb-0 text-primary">
            {(services?.count ?? 0)} Service{(services?.count ?? 0) !== 1 ? "s" : ""} in Total
          </p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}

      {/* Search Results Header */}
      {searchQuery && <h5 className="mb-3">Search Results</h5>}

      {/* Services Grid */}
      <div className="row">
        {loadingServices && !servicesError ? (
          <div className="col-12 d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="col-12 text-center py-5">
            <BsPersonFillGear size={64} className="text-muted mb-3" />
            <h5 className="text-muted">No services found</h5>
            <p className="text-muted">
              {searchQuery ? "Try adjusting your search criteria" : "Start by adding your first service"}
            </p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              item={service}
              tab={currentCategory}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
              openModal={adminctx?.openModal || (() => {})}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {services && services.count > parseInt(pageSize) && (
        <div className="row mt-4">
          <div className="col-12">
            <Pagination
              currentPage={parseInt(page)}
              totalPages={Math.ceil(services.count / parseInt(pageSize))}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      <Modal showmodal={showModal} toggleModal={closeModal} overlayclose={false}>
        <ServiceForm
          service={service}
          editMode={addorupdate.mode === "update"}
          onSuccess={handleFormSuccess}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal showmodal={showModal2} toggleModal={closeModal}>
        <div className="p-3">
          <p className="text-center">Delete Service</p>
          <hr />
          <h5 className="text-center mb-4">{service?.name}</h5>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-danger border-0 rounded me-2"
              onClick={() => service && service.id && handleDelete(service.id)}
              disabled={isdeleting}
            >
              {isdeleting ? (
                <div className="d-inline-flex align-items-center justify-content-center gap-2">
                  <div>Deleting Service</div>
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

export default Services;
