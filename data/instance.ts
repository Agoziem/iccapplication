import axios from "axios";
import { getToken } from "@/utils/auth";
import { API_URL } from "./constants";

// ----------------------------------------
// Axios instance for main service
// ----------------------------------------
export const AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// with token
export const AxiosInstanceWithToken = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in the headers
AxiosInstanceWithToken.interceptors.request.use(
  (config ) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ----------------------------------------
// multi part form data 
// ----------------------------------------
export const AxiosInstancemultipart = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// with token for multipart
export const AxiosInstancemultipartWithToken = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
// Add a request interceptor to include the token in the headers for multipart
AxiosInstancemultipartWithToken.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


