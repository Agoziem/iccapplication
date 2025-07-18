import { videoSchema, videosResponseSchema } from "@/schemas/items";
import { converttoformData } from "@/utils/formutils";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID

export const vidoesapiAPIendpoint = "/vidoesapi";

/**
 * fetch all the Videos
 * @async
 * @param {string} url
 */
export const fetchVideos = async (url) => {
  const response = await axiosInstance.get(
    url
  );
  const validation = videosResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};


/**
 * @async
 * @param {string} url // example ${vidoesapiAPIendpoint}/video_by_token/${videotoken}/
 * @returns {Promise<Video>}
 */
export const fetchVideo = async (url) => {
  const response = await axiosInstance.get(url);
  const validation = videoSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};


/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @returns {Promise<Video>}
 */
export const createVideo = async (data) => {
  const formData = converttoformData(data, [
    "category",
    "subcategory",
    "userIDs_that_bought_this_video",
  ]);
  const response = await axiosInstance.post(
    `${vidoesapiAPIendpoint}/add_video/${Organizationid}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const validation = videoSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @returns {Promise<Video>}
 */
export const updateVideo = async (data) => {
  const formData = converttoformData(data, [
    "category",
    "subcategory",
    "userIDs_that_bought_this_video",
  ]);
  const response = await axiosInstance.put(
    `${vidoesapiAPIendpoint}/update_video/${data.id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const validation = videoSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * submits Responses to database and updates the Ui optimistically
 * @async
 * @param {number} id
* @returns {Promise<number>}
 */
export const deleteVideo = async (id) => {
  await axiosInstance.delete(
    `${vidoesapiAPIendpoint}/delete_video/${id}/`
  );
  return id;
};


