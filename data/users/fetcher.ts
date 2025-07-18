import { UserSchema, UsersSchema } from "@/schemas/users";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const authAPIendpoint = "/authapi";

/**
 * fetch all the Videos
 * @async
 * @param {string} url
 */
export const fetchUsers = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = UsersSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * fetch single user
 * @async
 * @param {string} url
 */
export const fetchUser = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = UserSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @param {string} url
 * @param {User} data
 * @returns {Promise<User>}
 */
export const updateUser = async (url, data) => {
  const response = await axiosInstance.put(url, data);
  const validation = UserSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};
