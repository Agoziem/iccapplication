import axios from "axios";
import {
  departmentResponseSchema,
  departmentSchema,
  organizationSchema,
  staffResponseSchema,
  staffSchema,
  subscriptionSchema,
  subscriptionsResponseSchema,
  testimonialSchema,
  testimonialsResponseSchema,
} from "@/schemas/organizations";
import { converttoformData } from "@/utils/formutils";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const MainAPIendpoint = "/api";

// ------------------------------------------------------
// Organization fetcher and mutation functions
// ------------------------------------------------------
export const fetchOrganization = async () => {
  const response = await axiosInstance.get(
    `${MainAPIendpoint}/organization/${Organizationid}/`
  );
  const validation = organizationSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {Organization} data
 * @returns {Promise<Organization>}
 */
export const createOrganization = async (data) => {
  const formData = converttoformData(data);
  const response = await axiosInstance.post(
    `${MainAPIendpoint}/organization/add/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const validation = organizationSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {Organization} data
 * @returns {Promise<Organization>}
 */
export const updateOrganization = async (data) => {
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
    const validation = organizationSchema.safeParse(response.data);
    if (!validation.success) {
      console.log(validation.error.issues);
    }
    return validation.data;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};

/**
 * @async
 * @param {number} organizationid
 * @returns {Promise<number>}
 */
export const deleteOrganization = async (organizationid) => {
  await axiosInstance.delete(
    `${MainAPIendpoint}/organization/delete/${organizationid}/`
  );
  return organizationid;
};

// ------------------------------------------------------
// Staff fetcher and mutation functions
// ------------------------------------------------------
/**
 * @async
 * @param {string} url
 */
export const fetchStaffs = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = staffResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {Staff} data
 * @returns {Promise<Staff>}
 */
export const createStaff = async (data) => {
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
  const validation = staffSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {Staff} data
 * @returns {Promise<Staff>}
 */
export const updateStaff = async (data) => {
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
  const validation = staffSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {number} staffid
 * @returns {Promise<number>}
 */
export const deleteStaff = async (staffid) => {
  await axiosInstance.delete(`${MainAPIendpoint}/staff/delete/${staffid}/`);
  return staffid;
};

// ------------------------------------------------------
// Testimonial fetcher and mutation functions
// ------------------------------------------------------
/**
 * @async
 * @param {string} url
 */
export const fetchTestimonials = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = testimonialsResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {Testimony} data
 * @returns {Promise<Testimony>}
 */
export const createTestimonial = async (data) => {
  try {
    const formData = converttoformData(data);
    const response = await axiosInstance.post(
      `${MainAPIendpoint}/testimonial/add/${Organizationid}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const validation = testimonialSchema.safeParse(response.data);
    if (!validation.success) {
      console.log(validation.error.issues);
    }
    return validation.data;
  } catch (error) {
    console.log(error.message);
    throw new Error(`${error.message}`);
  }
};

/**
 * @async
 * @param {Testimony} data
 * @returns {Promise<Testimony>}
 */
export const updateTestimonial = async (data) => {
  try {
    const formData = converttoformData(data);
    const response = await axiosInstance.put(
      `${MainAPIendpoint}/testimonial/update/${data.id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const validation = testimonialSchema.safeParse(response.data);
    if (!validation.success) {
      console.log(validation.error.issues);
    }
    return validation.data;
  } catch (error) {
    console.log(error.message);
    throw new Error(`${error.message}`);
  }
};

/**
 * @async
 * @param {number} testimonialid
 * @returns {Promise<number>}
 */
export const deleteTestimonial = async (testimonialid) => {
  await axiosInstance.delete(
    `${MainAPIendpoint}/testimonial/delete/${testimonialid}/`
  );
  return testimonialid;
};

// ------------------------------------------------------
// Department fetcher and mutation functions
// ------------------------------------------------------
/**
 * @async
 * @param {string} url
 */
export const fetchDepartments = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = departmentResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {string} url
 */
export const fetchDepartment = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = departmentSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @returns {Promise<Department>}
 */
export const createDepartment = async (data) => {
  const deptformData = converttoformData(data,["organization","services","staff_in_charge"]);
  const response = await axiosInstance.post(
    `${MainAPIendpoint}/department/add/${Organizationid}/`,
    deptformData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const validation = departmentSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @returns {Promise<Department>}
 */
export const updateDepartment = async (data) => {
  const deptformData = converttoformData(data,["organization","services","staff_in_charge"]);
  const response = await axiosInstance.put(
    `${MainAPIendpoint}/department/update/${data.id}/`,
    deptformData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const validation = departmentSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {number} departmentid
 * @returns {Promise<number>}
 */
export const deleteDepartment = async (departmentid) => {
  await axiosInstance.delete(
    `${MainAPIendpoint}/department/delete/${departmentid}/`
  );
  return departmentid;
};

// ------------------------------------------------------
// Subscription fetcher and mutation functions
// ------------------------------------------------------
/**
 * @async
 * @param {string} url
 */
export const fetchSubscriptions = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = subscriptionsResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {Subscription} data
 * @returns {Promise<Subscription>}
 */
export const createSubscription = async (data) => {
  const response = await axiosInstance.post(
    `${MainAPIendpoint}/subscription/add/${Organizationid}/`,
    data
  );
  const validation = subscriptionSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {Subscription} data
 * @returns {Promise<Subscription>}
 */
export const updateSubscription = async (data) => {
  const response = await axiosInstance.put(
    `${MainAPIendpoint}/subscription/update/${data.id}/`,
    data
  );
  const validation = subscriptionSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * @async
 * @param {number} subscriptionid
 * @returns {Promise<number>}
 */
export const deleteSubscription = async (subscriptionid) => {
  await axiosInstance.delete(
    `${MainAPIendpoint}/subscription/delete/${subscriptionid}/`
  );
  return subscriptionid;
};
