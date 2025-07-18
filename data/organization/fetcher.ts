import axios from "axios";
import {
  Organization,
  Department,
  DepartmentResponse,
  Staff,
  Staffpaginated,
  Testimony,
  Testimonypaginated,
  Subscription,
  Subscriptionpaginated
} from "@/types/organizations";
import { converttoformData } from "@/utils/formutils";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const MainAPIendpoint = "/api";

// ------------------------------------------------------
// Organization fetcher and mutation functions
// ------------------------------------------------------

export const fetchOrganization = async (): Promise<Organization | undefined> => {
  const response = await axiosInstance.get(`${MainAPIendpoint}/organization/${Organizationid}/`);
  return response.data;
};

export const createOrganization = async (data: Partial<Organization>): Promise<Organization | undefined> => {
  const formData = converttoformData(data);
  const response = await axiosInstance.post(`${MainAPIendpoint}/organization/add/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateOrganization = async (data: Partial<Organization>): Promise<Organization | undefined> => {
  try {
    const formData = converttoformData(data);
    const response = await axiosInstance.put(
      `${MainAPIendpoint}/organization/update/${data.id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(errorMessage);
  }
};

export const deleteOrganization = async (organizationid: number): Promise<number> => {
  await axiosInstance.delete(`${MainAPIendpoint}/organization/delete/${organizationid}/`);
  return organizationid;
};

// ------------------------------------------------------
// Staff fetcher and mutation functions
// ------------------------------------------------------

export const fetchStaffs = async (url: string): Promise<Staffpaginated | undefined> => {
  const response = await axiosInstance.get(url);
  return response.data;
};

export const createStaff = async (data: Partial<Staff>): Promise<Staff | undefined> => {
  const formData = converttoformData(data);
  const response = await axiosInstance.post(
    `${MainAPIendpoint}/staff/add/${Organizationid}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateStaff = async (data: Partial<Staff>): Promise<Staff | undefined> => {
  const formData = converttoformData(data);
  const response = await axiosInstance.put(
    `${MainAPIendpoint}/staff/update/${data.id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteStaff = async (staffid: number): Promise<number> => {
  await axiosInstance.delete(`${MainAPIendpoint}/staff/delete/${staffid}/`);
  return staffid;
};

// ------------------------------------------------------
// Testimonial fetcher and mutation functions
// ------------------------------------------------------

export const fetchTestimonials = async (url: string): Promise<Testimonypaginated | undefined> => {
  const response = await axiosInstance.get(url);
  return response.data;
};

export const createTestimonial = async (data: Partial<Testimony>): Promise<Testimony | undefined> => {
  try {
    const formData = converttoformData(data);
    const response = await axiosInstance.post(
      `${MainAPIendpoint}/testimonials/add/${Organizationid}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};

export const updateTestimonial = async (data: Partial<Testimony>): Promise<Testimony | undefined> => {
  try {
    const formData = converttoformData(data);
    const response = await axiosInstance.put(
      `${MainAPIendpoint}/testimonials/update/${data.id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};

export const deleteTestimonial = async (testimonialid: number): Promise<number> => {
  await axiosInstance.delete(`${MainAPIendpoint}/testimonials/delete/${testimonialid}/`);
  return testimonialid;
};

// ------------------------------------------------------
// Department fetcher and mutation functions
// ------------------------------------------------------

/**
 * Fetch departments with pagination
 */
export const fetchDepartments = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Fetch single department
 */
export const fetchDepartment = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Create new department
 */
export const createDepartment = async (data: Partial<Department>) => {
  const formData = converttoformData(data);
  const response = await axiosInstance.post(
    `${MainAPIendpoint}/department/add/${Organizationid}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Update existing department
 */
export const updateDepartment = async (data: Partial<Department>) => {
  const formData = converttoformData(data);
  const response = await axiosInstance.put(
    `${MainAPIendpoint}/department/update/${data.id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Delete department
 */
export const deleteDepartment = async (departmentid: number) => {
  await axiosInstance.delete(`${MainAPIendpoint}/department/delete/${departmentid}/`);
  return departmentid;
};

// ------------------------------------------------------
// Subscription fetcher and mutation functions
// ------------------------------------------------------

/**
 * Fetch subscriptions with pagination
 */
export const fetchSubscriptions = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Create new subscription
 */
export const createSubscription = async (data: Partial<Subscription>) => {
  const response = await axiosInstance.post(
    `${MainAPIendpoint}/subscription/add/${Organizationid}/`,
    data
  );
  return response.data;
};

/**
 * Update existing subscription
 */
export const updateSubscription = async (data: Partial<Subscription>) => {
  const response = await axiosInstance.put(
    `${MainAPIendpoint}/subscription/update/${data.id}/`,
    data
  );
  return response.data;
};

/**
 * Delete subscription
 */
export const deleteSubscription = async (subscriptionid: number) => {
  await axiosInstance.delete(`${MainAPIendpoint}/subscription/delete/${subscriptionid}/`);
  return subscriptionid;
};

