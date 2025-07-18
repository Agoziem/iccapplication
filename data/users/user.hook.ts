import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import type { User, Users } from "@/types/users";
import { fetchUsers, fetchUser, updateUser } from "@/data/users/fetcher";

/**
 * Hook to fetch all users.
 */
export const useFetchUsers = (url: string): UseQueryResult<Users | undefined, Error> => {
  return useQuery(["users", url], () => fetchUsers(url), {
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 3, // Retry failed requests up to 3 times
  });
};

/**
 * Hook to fetch a single user by ID.
 */
export const useFetchUser = (url: string, user_id: number): UseQueryResult<User | undefined, Error> => {
  return useQuery(["user", user_id], () => fetchUser(url), {
    enabled: !!user_id, // Only run query if user_id is provided
    retry: 2, // Retry failed requests up to 2 times
  });
};

interface UpdateUserParams {
  url: string;
  data: Partial<User>;
}

/**
 * Hook to update a user.
 */
export const useUpdateUser = (): UseMutationResult<User | undefined, Error, UpdateUserParams> => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ url, data }: UpdateUserParams) => updateUser(url, data),
    {
      onSuccess: (_, variables) => {
        // Invalidate the specific user's query to refetch updated data
        if (variables.data.id) {
          queryClient.invalidateQueries(["user", variables.data.id]);
        }

        // Optionally, invalidate the users list to refetch data
        queryClient.invalidateQueries("users");
      },
    }
  );
};
