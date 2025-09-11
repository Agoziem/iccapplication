import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { PulseLoader } from "react-spinners";
import "./ServiceUsersTable.css";
import { useUpdateServiceUser } from "@/data/services/service.hook";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";

/**
 * @param {{ users: ServiceUser[], service: Service, category: string }} props
 */

const ServiceUsers = ({ users, service, category }) => {
  const [isPending, startTransition] = useTransition();
  const { mutateAsync: updateStatus } = useUpdateServiceUser();

  // -----------------------------------------
  // Update User Service Status
  // -----------------------------------------

  const queryClient = useQueryClient();
  const updateUserServiceStatus = async (userId, serviceId, action) => {
    try {
      // Perform the API call
      await updateStatus({ userId, serviceId, action, category });
      toast.success("User status updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  
  // -----------------------------------------
  // Determine Action Buttons
  // -----------------------------------------

  const renderActionButtons = (user) => {
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
            service?.userIDs_whose_services_is_in_progress.includes(
              parseInt(user.id)
            ) ||
            service?.userIDs_whose_services_have_been_completed.includes(
              parseInt(user.id)
            )
          }
        >
          {isPending ? (
            <PulseLoader color="#fff" size={8} margin={2} />
          ) : service?.userIDs_whose_services_is_in_progress.includes(
              parseInt(user.id)
            ) ? (
            "Service in Progress"
          ) : service?.userIDs_whose_services_have_been_completed.includes(
              parseInt(user.id)
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
