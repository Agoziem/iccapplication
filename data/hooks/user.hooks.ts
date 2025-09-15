import { converttoformData } from "@/utils/formutils";
import { AxiosInstance, AxiosInstancemultipart, AxiosInstanceWithToken, AxiosInstancemultipartWithToken } from "../instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  User,
  UserLogin,
  UserRegistration,
  UserRegistrationResponse,
  UserRegistrationOAuth,
  UserUpdate,
  GetUserByEmail,
  GetVerificationToken,
  VerifyEmail,
  VerifyToken,
  ResetPassword,
  SuccessResponse,
  Users
} from "@/types/users";
import { getRefreshToken, TokenType } from "@/utils/auth";

export const authAPIendpoint = "/authapi";

// Query Keys
export const USER_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_KEYS.all, 'list'] as const,
  list: () => [...USER_KEYS.lists()] as const,
  details: () => [...USER_KEYS.all, 'detail'] as const,
  personaldetail: () => [...USER_KEYS.all, 'personaldetail'] as const,
  detail: (id: number) => [...USER_KEYS.details(), id] as const,
  byEmail: (email: string) => [...USER_KEYS.all, 'byEmail', email] as const,
} as const;


// User Management
export const fetchUsers = async (): Promise<Users> => {
  const response = await AxiosInstance.get(`${authAPIendpoint}/getUsers/`);
  return response.data;
};

export const fetchUser = async (): Promise<User> => {
  const response = await AxiosInstanceWithToken.get(`${authAPIendpoint}/getuser/`);
  return response.data;
};

export const getUserByEmail = async (emailData: GetUserByEmail): Promise<User> => {
  const response = await AxiosInstance.post(`${authAPIendpoint}/getUserbyEmail/`, emailData);
  return response.data;
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await AxiosInstanceWithToken.get(`${authAPIendpoint}/getuserbyid/${userId}/`);
  return response.data;
}; 

export const updateUser = async (userId: number, userData: UserUpdate): Promise<User> => {
  const formData = converttoformData(userData);
  const response = await AxiosInstancemultipartWithToken.put(`${authAPIendpoint}/update/${userId}/`, formData);
  return response.data;
};

export const deleteUser = async (userId: number): Promise<SuccessResponse> => {
  const response = await AxiosInstanceWithToken.delete(`${authAPIendpoint}/delete/${userId}/`);
  return response.data;
};

// Authentication
export const registerUser = async (userData: UserRegistration): Promise<UserRegistrationResponse> => {
  const response = await AxiosInstance.post(`${authAPIendpoint}/register/`, userData);
  return response.data;
};

export const registerUserOAuth = async (provider: string, userData: UserRegistrationOAuth): Promise<TokenType> => {
  const response = await AxiosInstance.post(`${authAPIendpoint}/register_oauth/${provider}/`, userData);
  return response.data;
};

// Email Verification
export const getResetPasswordToken = async (email: string): Promise<SuccessResponse> => {
  const response = await AxiosInstance.post(`${authAPIendpoint}/getResetPasswordToken/`, { email });
  return response.data;
};

export const verifyEmail = async (verificationData: VerifyEmail): Promise<TokenType> => {
  const response = await AxiosInstance.post(`${authAPIendpoint}/verifyEmail/`, verificationData);
  return response.data;
};

export const verifyToken = async (tokenData: VerifyToken): Promise<User> => {
  const response = await AxiosInstance.post(`${authAPIendpoint}/verifyToken/`, tokenData);
  return response.data;
};

export const verifyUser = async (userData: any): Promise<TokenType> => {
  const response = await AxiosInstance.post(`${authAPIendpoint}/verifyuser/`, userData);
  return response.data;
};

// Password Reset
export const resetPassword = async (resetData: ResetPassword): Promise<SuccessResponse> => {
  const response = await AxiosInstance.post(`${authAPIendpoint}/resetPassword/`, resetData);
  return response.data;
};

// logout function
export const logoutUser = async (): Promise<SuccessResponse> => {
  const refresh_token = getRefreshToken();
  if (!refresh_token) {
    throw new Error("No refresh token available for logout.");
  }
  const response = await AxiosInstanceWithToken.post(`${authAPIendpoint}/logout/`, { refresh_token });
  return response.data;
};

// React Query Hooks
// =================================================
// User Query Hooks
// =================================================
export const useUsers = (): UseQueryResult<Users, Error> => {
  return useQuery({
    queryKey: USER_KEYS.list(),
    queryFn: fetchUsers,
    onError: (error: Error) => {
      console.error('Error fetching users:', error);
      throw error;
    },
  });
};

export const useMyProfile = (): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: USER_KEYS.personaldetail(),
    queryFn: () => fetchUser(),
    onError: (error: Error) => {
      console.error('Error fetching user:', error);
      throw error;
    },
  });
};

export const useUserByEmail = (emailData: GetUserByEmail): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: USER_KEYS.byEmail(emailData.email),
    queryFn: () => getUserByEmail(emailData),
    enabled: !!emailData.email,
    onError: (error: Error) => {
      console.error('Error fetching user by email:', error);
      throw error;
    },
  });
};

export const useUserById = (user_id: number): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: USER_KEYS.detail(user_id),
    queryFn: () => getUserById(user_id),
    enabled: !!user_id,
    onError: (error: Error) => {
      console.error('Error fetching user by email:', error);
      throw error;
    },
  });
};

// User Management Mutations
export const useUpdateUser = (): UseMutationResult<User, Error, { userId: number; userData: UserUpdate }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, userData }) => updateUser(userId, userData),
    onSuccess: (data, { userId }) => {
      queryClient.setQueryData(USER_KEYS.detail(userId), data);
      queryClient.invalidateQueries(USER_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error updating user:', error);
      throw error;
    },
  });
};

export const useDeleteUser = (): UseMutationResult<SuccessResponse, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, userId) => {
      queryClient.removeQueries(USER_KEYS.detail(userId));
      queryClient.invalidateQueries(USER_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error deleting user:', error);
      throw error;
    },
  });
};

// ================================================================
// Authentication Mutations
// ================================================================
export const useRegisterUser = (): UseMutationResult<UserRegistrationResponse, Error, UserRegistration> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries(USER_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error registering user:', error);
      throw error;
    },
  });
};

export const useRegisterUserOAuth = (): UseMutationResult<TokenType, Error, { provider: string; userData: UserRegistrationOAuth }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ provider, userData }) => registerUserOAuth(provider, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(USER_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error registering user with OAuth:', error);
      throw error;
    },
  });
};

// Email Verification Mutations
export const useGetResetPasswordToken = (): UseMutationResult<SuccessResponse, Error, string> => {
  return useMutation({
    mutationFn: getResetPasswordToken,
    onError: (error: Error) => {
      console.error('Error getting reset password token:', error);
      throw error;
    },
  });
};

export const useVerifyEmail = (): UseMutationResult<TokenType, Error, VerifyEmail> => {
  return useMutation({
    mutationFn: verifyEmail,
    onError: (error: Error) => {
      console.error('Error verifying email:', error);
      throw error;
    },
  });
};

export const useVerifyToken = (): UseMutationResult<User, Error, VerifyToken> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: verifyToken,
    onSuccess: (data) => {
      if (data.id) {
        queryClient.setQueryData(USER_KEYS.detail(data.id), data);
      }
    },
    onError: (error: Error) => {
      console.error('Error verifying token:', error);
      throw error;
    },
  });
};

export const useVerifyUser = (): UseMutationResult<TokenType, Error, any> => {
  return useMutation({
    mutationFn: verifyUser,
    onError: (error: Error) => {
      console.error('Error verifying user:', error);
      throw error;
    },
  });
};

// Password Reset Mutations
export const useResetPassword = (): UseMutationResult<SuccessResponse, Error, ResetPassword> => {
  return useMutation({
    mutationFn: resetPassword,
    onError: (error: Error) => {
      console.error('Error resetting password:', error);
      throw error;
    },
  });
};
