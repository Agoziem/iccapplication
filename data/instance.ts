import axios from "axios";
import { Auth } from "@/utils/authutils";
import { API_URL } from "@/constants";

// Axios instance for client-side requests without auth
export const Axiosinstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios instance for server-side requests without auth
export const AxiosInstanceServer = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios instance for client-side requests with auth
export const AxiosinstanceAuth = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosinstanceAuth.interceptors.request.use(
  (config) => {
    const token = Auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// multi part form data
export const AxiosinstanceFormData = axios.create({
  baseURL: API_URL,
});

// multi part form data with auth
export const AxiosinstanceFormDataAuth = axios.create({
  baseURL: API_URL,
});

AxiosinstanceFormDataAuth.interceptors.request.use(
  (config) => {
    const token = Auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
