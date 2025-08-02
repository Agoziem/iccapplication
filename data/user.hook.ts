import { useQuery, useMutation, useQueryClient, UseQueryResult } from "react-query";
import { AxiosinstanceAuth } from "./instance";
import { UserUpdateType } from "@/schemas/users";
import { User } from "@/types/users";



// -------------------------------------------------
// get the user profile
// -------------------------------------------------
export const useGetUserProfile = (): UseQueryResult<User> => {
  return useQuery("user", async () => {
    const response = await AxiosinstanceAuth.get("/auth/profile");
    return response.data;
  });
};

// -------------------------------------------------
// update the user profile
// -------------------------------------------------
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: Partial<UserUpdateType>) => {
      const response = await AxiosinstanceAuth.put("/auth/profile", data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userProfile");
      },
      onError: (error) => {
        console.error("Error updating user profile:", error);
      },
    }
  );
};

// -------------------------------------------------
// get all users
// -------------------------------------------------
export const useGetUsers = () => {
  return useQuery("users", async () => {
    const response = await AxiosinstanceAuth.get("auth/users");
    return response.data;
  });
};

// get user by id
export const useGetUserById = (id: string) => {
  return useQuery(["user", id], async () => {
    const response = await AxiosinstanceAuth.get(`auth/user_by_id/${id}`);
    return response.data;
  });
};

// get user by email
export const useGetUserByEmail = (email: string) => {
  return useQuery(
    ["user", email],
    async () => {
      const response = await AxiosinstanceAuth.get(`auth/user_by_email/${email}`);
      return response.data;
    },
    {
      enabled: !!email,
    }
  );
};


// delete user
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      const response = await AxiosinstanceAuth.delete(`auth/profile`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
};


