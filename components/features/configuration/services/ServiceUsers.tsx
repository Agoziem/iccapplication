import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { PulseLoader } from "react-spinners";
import "./ServiceUsersTable.css";
import { useUpdateServiceUser } from "@/data/services/service.hook";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import React from "react";
import { Service, ServiceUser } from "@/types/items";


interface ServiceUsersProps {
  users: ServiceUser[];
  service: Service;
  category: string;
}

const ServiceUsers: React.FC<ServiceUsersProps> = ({ users, service, category }) => {
  const [isPending, startTransition] = useTransition();
  const { mutateAsync: updateStatus } = useUpdateServiceUser();

  // Helper function to convert user ID to number
  const getUserIdAsNumber = (id: string | number): number => {
    return typeof id === 'string' ? parseInt(id) : id;
  };

  // -----------------------------------------
  // Update User Service Status
  // -----------------------------------------

  const queryClient = useQueryClient();
  const updateUserServiceStatus = async (
    userId: string | number, 
    serviceId: string | number, 
    action: "add-to-progress" | "add-to-completed" | "remove-from-progress" | "remove-from-completed"
  ): Promise<void> => {
    try {
      // Perform the API call
      await updateStatus({ 
        userId: getUserIdAsNumber(userId), 
        serviceId: getUserIdAsNumber(serviceId), 
        action, 
        category: category as "all" | "progress" | "completed" 
      });
      toast.success("User status updated successfully");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  
  // -----------------------------------------
  // Determine Action Buttons
  // -----------------------------------------

  const renderActionButtons = (user: ServiceUser) => {
    if (category === "all") {
      return (
        <button
          className="btn btn-sm btn-primary"
          onClick={() =>
            startTransition(() => {
              updateUserServiceStatus(user.id, service.id, "add-to-progress");
            })
          }
          disabled={
            isPending ||
            service?.userIDs_whose_services_is_in_progress?.includes(
              getUserIdAsNumber(user.id)
            ) ||
            service?.userIDs_whose_services_have_been_completed?.includes(
              getUserIdAsNumber(user.id)
            )
          }
        >
          {isPending ? (
            <PulseLoader color="#fff" size={8} margin={2} />
          ) : service?.userIDs_whose_services_is_in_progress?.includes(
              getUserIdAsNumber(user.id)
            ) ? (
            "Service in Progress"
          ) : service?.userIDs_whose_services_have_been_completed?.includes(
              getUserIdAsNumber(user.id)
            ) ? (
            "Service Completed"
          ) : (
            "Add to Progress"
          )}
        </button>
      );
    }

    if (category === "progress") {
      return (
        <>
          <button
            className="btn btn-sm btn-danger"
            onClick={() =>
              startTransition(() => {
                updateUserServiceStatus(
                  user.id,
                  service.id,
                  "remove-from-progress"
                );
              })
            }
            disabled={isPending}
          >
            {isPending ? (
              <PulseLoader color="#fff" size={8} margin={2} />
            ) : (
              "Remove from Progress"
            )}
          </button>
          <button
            className="btn btn-sm btn-success ms-2"
            onClick={() =>
              startTransition(() => {
                updateUserServiceStatus(
                  user.id,
                  service.id,
                  "add-to-completed"
                );
              })
            }
            disabled={isPending}
          >
            {isPending ? (
              <PulseLoader color="#fff" size={8} margin={2} />
            ) : (
              "Add to Completed"
            )}
          </button>
        </>
      );
    }

    if (category === "completed") {
      return (
        <button
          className="btn btn-sm btn-danger"
          onClick={() =>
            startTransition(() => {
              updateUserServiceStatus(
                user.id,
                service.id,
                "remove-from-completed"
              );
            })
          }
          disabled={isPending}
        >
          {isPending ? (
            <PulseLoader color="#fff" size={8} margin={2} />
          ) : (
            "Remove from Completed"
          )}
        </button>
      );
    }

    return null;
  };

  return (
    <div className="card p-4 overflow-auto">
      <table className="table table-bordered">
        <thead>
          <tr>
            {["User ID", "Profile", "Frequency", "Date Joined", "Edit"].map(
              (header) => (
                <th scope="col" key={header}>
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {users?.length ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <Image
                      src={user.avatar_url}
                      alt={user.username}
                      width={40}
                      height={40}
                      className="rounded-circle"
                    />
                    <span className="ms-2">{user.username}</span>
                  </div>
                </td>
                <td>{user.user_count}</td>
                <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                <td>{renderActionButtons(user)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceUsers;
