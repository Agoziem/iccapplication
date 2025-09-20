"use client";
import React, { useEffect, useState, useTransition, useMemo } from "react";
import Image from "next/image";
import {
  FiUser,
  FiCalendar,
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { BsPerson } from "react-icons/bs";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import { Service, ServiceUser } from "@/types/items";
import { StatusCategory } from "./ServiceConf";
import {
  useAddServiceToCompleted,
  useAddServiceToProgress,
  useRemoveServiceFromCompleted,
  useRemoveServiceFromProgress,
  useServiceUsers,
} from "@/data/hooks/service.hooks";
import "./ServiceUsersTable.css";
import {
  sendServiceCompletedEmail,
  sendServiceStartedEmail,
} from "@/utils/mail";

interface ServiceUsersProps {
  service: Service | null;
  category: StatusCategory;
  searchQuery?: string;
}
const ServiceUsers: React.FC<ServiceUsersProps> = ({
  service,
  category,
  searchQuery = "",
}) => {
  const [isPending, startTransition] = useTransition();
  const [actionStates, setActionStates] = useState<Record<number, string>>({});

  // Hooks for different user categories
  const { data: usersData, refetch: refetchAllUsers } = useServiceUsers(
    service?.id || 0
  );

  // Mutation hooks
  const { mutateAsync: addServiceToCompleted } = useAddServiceToCompleted();
  const { mutateAsync: addServiceToProgress } = useAddServiceToProgress();
  const { mutateAsync: removeServiceFromCompleted } =
    useRemoveServiceFromCompleted();
  const { mutateAsync: removeServiceFromProgress } =
    useRemoveServiceFromProgress();

  // Filter users based on category and search query
  const filteredUsers = useMemo(() => {
    if (!usersData || !service) return [];

    // First filter by category
    let categoryFilteredUsers = usersData.results;

    switch (category.name.toLowerCase()) {
      case "progress":
        categoryFilteredUsers = usersData.results.filter(
          (user) =>
            service.userIDs_whose_services_is_in_progress?.includes(user.id) ??
            false
        );
        break;
      case "completed":
        categoryFilteredUsers = usersData.results.filter(
          (user) =>
            service.userIDs_whose_services_have_been_completed?.includes(
              user.id
            ) ?? false
        );
        break;
      case "all":
      default:
        // For "all", show all users (those who purchased the service)
        categoryFilteredUsers = usersData.results;
        break;
    }

    // Then filter by search query if provided
    if (!searchQuery.trim()) return categoryFilteredUsers;

    return categoryFilteredUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toString().includes(searchQuery)
    );
  }, [usersData, usersData?.results, searchQuery, category.name, service]);

  // Update user service status
  const updateUserServiceStatus = async (
    userId: number,
    serviceId: number,
    action: string,
    serviceUser?: ServiceUser
  ) => {
    if (!service) return;

    setActionStates((prev) => ({ ...prev, [userId]: action }));

    try {
      switch (action) {
        case "add-to-progress":
          await addServiceToProgress({ userId, serviceId });
          serviceUser && sendServiceStartedEmail(service, serviceUser);
          toast.success("User added to progress");
          break;
        case "add-to-completed":
          await addServiceToCompleted({ userId, serviceId });
          serviceUser && sendServiceCompletedEmail(service, serviceUser);
          toast.success("Service marked as completed");
          break;
        case "remove-from-progress":
          await removeServiceFromProgress({ userId, serviceId });
          toast.success("User removed from progress");
          break;
        case "remove-from-completed":
          await removeServiceFromCompleted({ userId, serviceId });
          toast.success("User removed from completed");
          break;
        default:
          throw new Error("Invalid action");
      }
      
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setActionStates((prev) => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  // Get user status for UI display
  const getUserStatus = (user: ServiceUser) => {
    if (!service) return "unknown";

    const inProgress =
      service.userIDs_whose_services_is_in_progress?.includes(user.id) ?? false;
    const completed =
      service.userIDs_whose_services_have_been_completed?.includes(user.id) ??
      false;

    if (completed) return "completed";
    if (inProgress) return "in-progress";
    return "purchased";
  };

  // Render action buttons based on category and user status
  const renderActionButtons = (user: ServiceUser) => {
    if (!service?.id) return null;

    const userStatus = getUserStatus(user);
    const isLoading = actionStates[user.id] !== undefined;
    const currentAction = actionStates[user.id];

    // Loading state
    if (isLoading) {
      return (
        <div className="d-flex align-items-center">
          <PulseLoader color="var(--primary)" size={8} />
          <span className="ms-2 text-muted small">{currentAction}...</span>
        </div>
      );
    }

    switch (category.name.toLowerCase()) {
      case "all":
        return (
          <div className="btn-group" role="group">
            {userStatus === "purchased" && (
              <button
                className="btn btn-sm btn-accent-secondary"
                onClick={() =>
                  startTransition(() =>
                    updateUserServiceStatus(
                      user.id,
                      service.id!,
                      "add-to-progress",
                      user
                    )
                  )
                }
                title="Add to Progress"
              >
                <FiClock size={14} className="me-1" />
                Start
              </button>
            )}
            {userStatus === "in-progress" && (
              <>
                <button
                  className="btn btn-sm btn-accent-success"
                  onClick={() =>
                    startTransition(() =>
                      updateUserServiceStatus(
                        user.id,
                        service.id!,
                        "add-to-completed",
                        user
                      )
                    )
                  }
                  title="Mark as Completed"
                >
                  <FiCheckCircle size={14} className="me-1" />
                  Complete
                </button>
                <button
                  className="btn btn-sm btn-accent-primary"
                  onClick={() =>
                    startTransition(() =>
                      updateUserServiceStatus(
                        user.id,
                        service.id!,
                        "remove-from-progress"
                      )
                    )
                  }
                  title="Remove from Progress"
                >
                  <FiX size={14} />
                </button>
              </>
            )}
            {userStatus === "completed" && (
              <button
                className="btn btn-sm btn-accent-secondary"
                onClick={() =>
                  startTransition(() =>
                    updateUserServiceStatus(
                      user.id,
                      service.id!,
                      "remove-from-completed"
                    )
                  )
                }
                title="Remove from Completed"
              >
                <FiX size={14} className="me-1" />
                Undo
              </button>
            )}
            {userStatus === "purchased" && (
              <button
                className="btn btn-sm btn-accent-primary"
                disabled
                title="Purchased - No actions available"
              >
                Purchased
              </button>
            )}
          </div>
        );

      case "progress":
        return (
          <div className="btn-group" role="group">
            <button
              className="btn btn-sm btn-accent-success"
              onClick={() =>
                startTransition(() =>
                  updateUserServiceStatus(
                    user.id,
                    service.id!,
                    "add-to-completed"
                  )
                )
              }
              title="Mark as Completed"
            >
              <FiCheckCircle size={14} className="me-1" />
              Complete
            </button>
            <button
              className="btn btn-sm btn-accent-primary"
              onClick={() =>
                startTransition(() =>
                  updateUserServiceStatus(
                    user.id,
                    service.id!,
                    "remove-from-progress"
                  )
                )
              }
              title="Remove from Progress"
            >
              <FiX size={14} className="me-1" />
              Remove
            </button>
          </div>
        );

      case "completed":
        return (
          <button
            className="btn btn-sm btn-accent-secondary"
            onClick={() =>
              startTransition(() =>
                updateUserServiceStatus(
                  user.id,
                  service.id!,
                  "remove-from-completed"
                )
              )
            }
            title="Remove from Completed"
          >
            <FiX size={14} className="me-1" />
            Undo Complete
          </button>
        );

      default:
        return null;
    }
  };

  // Render status badge
  const renderStatusBadge = (user: ServiceUser) => {
    const status = getUserStatus(user);

    switch (status) {
      case "completed":
        return (
          <span className="badge bg-success-light text-success">Completed</span>
        );
      case "in-progress":
        return (
          <span className="badge bg-secondary-light text-secondary">
            In Progress
          </span>
        );
      case "purchased":
        return (
          <span className="badge bg-primary-light text-primary">Purchased</span>
        );
      default:
        return (
          <span className="badge bg-secondary-light text-secondary">
            Unknown
          </span>
        );
    }
  };

  // Empty state
  if (!filteredUsers.length) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <BsPerson size={64} className="text-muted mb-3" />
          <h5 className="text-muted mb-2">No Users Found</h5>
          <p className="text-muted mb-0">
            {searchQuery
              ? "No users match your search criteria"
              : `No users in ${category.name.toLowerCase()} category`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header border-bottom">
        <div className="d-flex align-items-center justify-content-between">
          <h6 className="mb-0 fw-bold d-flex align-items-center">
            <category.icon size={20} className="me-2" />
            {category.name} Users ({filteredUsers.length})
          </h6>
          {searchQuery && (
            <small className="text-muted">
              Showing results for &ldquo;{searchQuery}&rdquo;
            </small>
          )}
        </div>
      </div>

      <div className="p-0 ">
        <div className="table-responsive">
          <table className="table table-bordered mb-0">
            <thead className="">
              <tr>
                <th scope="col" className="border-0 px-4 py-3">
                  <div className="d-flex align-items-center">
                    <FiUser size={16} className="me-2" />
                    User
                  </div>
                </th>
                <th scope="col" className="border-0 py-3">
                  Status
                </th>
                <th scope="col" className="border-0 py-3">
                  <div className="d-flex align-items-center">
                    <FiActivity size={16} className="me-2" />
                    Frequency
                  </div>
                </th>
                <th scope="col" className="border-0 py-3">
                  <div className="d-flex align-items-center">
                    <FiCalendar size={16} className="me-2" />
                    Date Joined
                  </div>
                </th>
                <th scope="col" className="border-0 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? "bg-light bg-opacity-25" : ""}
                >
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="position-relative me-3">
                        <Image
                          src={user.avatar_url || "/placeholder-avatar.png"}
                          alt={user.username}
                          width={40}
                          height={40}
                          className="rounded-circle object-fit-cover"
                          style={{
                            minWidth: "40px",
                            minHeight: "40px",
                            objectPosition: "top center",
                          }}
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold">{user.username}</h6>
                        <div>
                          <div className="text-primary small">
                            ID: {user.id}
                          </div>
                          {user.email && (
                            <div className="text-primary small">
                              {user.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{renderStatusBadge(user)}</td>
                  <td className="py-3">
                    <span className="fw-bold text-primary">
                      {user.user_count || 0}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-muted">
                      {new Date(user.date_joined).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    {renderActionButtons(user)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Footer with Summary */}
      <div className="card-footer border-top">
        <div className="row g-3 text-center">
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-center">
              <FiUser size={16} className="text-primary me-2" />
              <span className="fw-bold">{filteredUsers.length}</span>
              <span className="text-muted ms-1">Users</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-center">
              <FiActivity size={16} className="text-success me-2" />
              <span className="fw-bold">
                {filteredUsers.reduce(
                  (sum, user) => sum + (user.user_count || 0),
                  0
                )}
              </span>
              <span className="text-muted ms-1">Total Interactions</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-center">
              <span style={{ color: category.color }}>
                <category.icon size={16} className="me-2" />
              </span>
              <span className="fw-bold" style={{ color: category.color }}>
                {category.name}
              </span>
              <span className="text-muted ms-1">Category</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceUsers;
