import Modal from "@/components/custom/Modal/modal";
import { subscriptionDefault } from "@/data/constants";
import {
  MainAPIendpoint,
} from "@/data/hooks/organization.hooks";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/custom/Pagination/Pagination";
import {
  useCreateSubscription,
  useDeleteSubscription,
  useFetchSubscriptions,
  useUpdateSubscription,
} from "@/data/organization/organization.hook";
import toast from "react-hot-toast";

const Subscriptions = () => {
  const OrganizationID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const [subscription, setSubscription] = useState(subscriptionDefault);
  const [showModal, setShowModal] = useState(false);
  const [showdeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = "20";

  const [addorupdate, setAddorupdate] = useState({
    mode: "",
    state: false,
  });

  // for data fetching
  const { data: subscriptions, isLoading: loadingSubscriptions } =
    useFetchSubscriptions(
      `${MainAPIendpoint}/subscription/${OrganizationID}/?page=${page}&page_size=${pageSize}`
    );
  // Handle page change
  const handlePageChange = (newPage) => {
    router.push(`?page=${newPage}&page_size=${pageSize}`);
  };

  // function close Modal
  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setSubscription(subscriptionDefault);
  };

  // function to add or update Subscription
  const { mutateAsync: createSubscription, isLoading: isCreating } =
    useCreateSubscription();
  const { mutateAsync: updateSubscription, isLoading: isUpdating } =
    useUpdateSubscription();
  const addorupdateSubscription = async (e) => {
    e.preventDefault();
    try {
      if (addorupdate.mode === "add") {
        await createSubscription(subscription);
      } else {
        await updateSubscription(subscription);
      }
      toast.success("Subscription added successfully");
    } catch (error) {
      console.log(error.message);
      toast.error("An error occured");
    } finally {
      closeModal();
    }
  };

  // function to delete Subscription
  const { mutateAsync: deleteSubscription, isLoading: isDeleting } =
    useDeleteSubscription();
  /**
   * @param {number} id
   */
  const removeSubscription = async (id) => {
    try {
      await deleteSubscription(id);
      toast.success("Subscription deleted successfully");
    } catch (error) {
      console.error("Error deleting email :", error);
      toast.error("An error occured while deleting Subscription");
    } finally {
      closeModal();
    }
  };

  return (
    <div className="px-3 mb-4">
      <div className="d-flex justify-content-end mb-3">
        {/* button to add new subscription email */}
        <button
          className="btn btn-primary border-0 rounded mb-2 mb-md-0"
          style={{ backgroundColor: "var(--bgDarkerColor)" }}
          onClick={() => {
            setAddorupdate({ mode: "add", state: true });
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2 h5 mb-0"></i> Add email
        </button>
      </div>
      {subscriptions?.results.length > 0 ? (
        <div>
          <div className="mb-3">
            <h4 className="mb-1">
              {subscriptions?.count} Subscription
              {subscriptions?.count > 1 ? "s" : ""}
            </h4>
            <p>in total</p>
          </div>

          {/* subscriptions emails list */}
          <ul className="list-group list-group-flush rounded">
            {subscriptions?.results.map((subscription) => (
              <li
                key={subscription.id}
                className="list-group-item d-flex flex-wrap justify-content-between align-items-center p-4 py-md-4 px-md-5"
                style={{
                  background: "var(--bgLightColor)",
                  borderColor: "var(--bgDarkColor)",
                }}
              >
                <div>
                  <h6 className="mb-0 text-break">{subscription.email}</h6>
                  <small>
                    {new Date(subscription.date_added).toDateString()}
                  </small>
                </div>
                <div className="mt-3 mt-md-0">
                  <button
                    className="btn btn-sm btn-accent-secondary me-3 py-1 rounded"
                    onClick={() => {
                      setSubscription(subscription);
                      setAddorupdate({ mode: "update", state: true });
                      setShowModal(true);
                    }}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger rounded py-1"
                    onClick={() => {
                      setSubscription(subscription);
                      setShowDeleteModal(true);
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h5>No Subscriptions yet</h5>
        </div>
      )}

      {!loadingSubscriptions &&
        subscriptions &&
        Math.ceil(subscriptions.count / parseInt(pageSize)) > 1 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(subscriptions.count / parseInt(pageSize))}
            handlePageChange={handlePageChange}
          />
        )}

      {/* update email modal */}
      <Modal showmodal={showModal} toggleModal={() => closeModal()}>
        <div className="modal-header">
          <h5 className="modal-title">
            {addorupdate.mode === "add"
              ? "Add Subscription"
              : "Update Subscription"}
          </h5>
        </div>
        <div className="modal-body">
          <form onSubmit={addorupdateSubscription}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={subscription.email}
                onChange={(e) =>
                  setSubscription({ ...subscription, email: e.target.value })
                }
                required
              />
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-accent-secondary me-2 rounded"
                onClick={() => {
                  closeModal();
                }}
              >
                cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary rounded"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating
                  ? "submitting..."
                  : addorupdate.mode === "add"
                  ? "Add"
                  : "Update"}{" "}
                email
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* delete email modal */}
      <Modal showmodal={showdeleteModal} toggleModal={() => closeModal()}>
        <div>
          <p className="mb-1">{subscription.email}</p>
          <h5 className="mb-3">Are you sure you want to delete this email?</h5>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary me-2"
              onClick={() => closeModal()}
            >
              No
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                removeSubscription(subscription.id);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "deleting Subcription ..." : "Yes"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Subscriptions;
