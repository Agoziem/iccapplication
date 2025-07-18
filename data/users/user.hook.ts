import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchUsers, fetchUser, updateUser } from "@/data/users/fetcher";

/**
 * Hook to fetch all users.
 * @param {string} url - API endpoint to fetch all users.
 */
export const useFetchUsers = (url) => {
  return useQuery(["users", url], () => fetchUsers(url), {
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 3, // Retry failed requests up to 3 times
  });
};

/**
 * Hook to fetch a single user by ID.
 * @param {string} url - API endpoint to fetch the user.
 */
export const useFetchUser = (url, user_id) => {
  return useQuery(["user", user_id], () => fetchUser(url), {
    enabled: !!user_id, // Only run query if the URL is provided
    retry: 2, // Retry failed requests up to 2 times
  });
};

/**
 * Hook to update a user.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(
    /**
     * Mutation function to update a user.
     * @param {{ url: string; data: User }} param
     * @returns {Promise<User>}
     */
    ({ url, data }) => updateUser(url, data),
    {
      onSuccess: (_, variables) => {
        // Invalidate the specific user's query to refetch updated data
        queryClient.invalidateQueries(["user", variables.data.id]);

        // Optionally, invalidate the users list to refetch data
        queryClient.invalidateQueries("users");
      },
    }
  );
};
