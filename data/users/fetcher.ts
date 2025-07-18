import { UserSchema, UsersSchema } from "@/schemas/users";
import type { User, Users } from "@/types/users";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const authAPIendpoint = "/authapi";

/**
 * Fetch all users
 */
export const fetchUsers = async (url: string): Promise<Users | undefined> => {
  const response = await axiosInstance.get(url);
  const validation = UsersSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Fetch single user
 */
export const fetchUser = async (url: string): Promise<User | undefined> => {
  const response = await axiosInstance.get(url);
  const validation = UserSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Update user data
 */
export const updateUser = async (url: string, data: Partial<User>): Promise<User | undefined> => {
  const response = await axiosInstance.put(url, data);
  const validation = UserSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};
