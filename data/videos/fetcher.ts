import { videoSchema, videosResponseSchema } from "@/schemas/items";
import type { Video, Videos } from "@/types/items";
import { converttoformData } from "@/utils/formutils";
import axios from "axios";
import { z } from "zod";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

export const vidoesapiAPIendpoint = "/vidoesapi";

type VideosResponse = z.infer<typeof videosResponseSchema>;

/**
 * fetch all the Videos
 */
export const fetchVideos = async (url: string): Promise<VideosResponse | undefined> => {
  const response = await axiosInstance.get(url);
  const validation = videosResponseSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Fetch a single video by URL
 */
export const fetchVideo = async (url: string): Promise<Video | undefined> => {
  const response = await axiosInstance.get(url);
  const validation = videoSchema.safeParse(response.data);
  if (!validation.success) {
    console.log(validation.error.issues);
  }
  return validation.data;
};

/**
 * Create a new video
 */
export const createVideo = async (data: Omit<Video, "id" | "created_at" | "updated_at">): Promise<Video | undefined> => {
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
 * Update an existing video
 */
export const updateVideo = async (data: Partial<Video> & { id: number }): Promise<Video | undefined> => {
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
 * Delete a video
 */
export const deleteVideo = async (id: number): Promise<number> => {
  await axiosInstance.delete(`${vidoesapiAPIendpoint}/delete_video/${id}/`);
  return id;
};


