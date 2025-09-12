import { converttoformData } from "@/utils/formutils";
import { AxiosInstance, AxiosInstancemultipart, AxiosInstanceWithToken, AxiosInstancemultipartWithToken } from "../instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  Video,
  VideoCategory,
  VideoSubCategory,
  CreateVideoCategory,
  CreateVideoSubCategory,
  PaginatedVideoResponse,
  VideoCategories,
  DeleteResponse,
  UpdateVideo,
  CreateVideo
} from "@/types/items";

export const videosAPIendpoint = "/vidoesapi"; // Note: API has typo in endpoint

// Query Keys
export const VIDEO_KEYS = {
  all: ['videos'] as const,
  lists: () => [...VIDEO_KEYS.all, 'list'] as const,
  list: (organizationId: number) => [...VIDEO_KEYS.lists(), organizationId] as const,
  trending: (organizationId: number) => [...VIDEO_KEYS.all, 'trending', organizationId] as const,
  userBought: (organizationId: number, userId: number) => [...VIDEO_KEYS.all, 'userBought', organizationId, userId] as const,
  details: () => [...VIDEO_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...VIDEO_KEYS.details(), id] as const,
  detailByToken: (token: string) => [...VIDEO_KEYS.details(), 'token', token] as const,
  categories: () => [...VIDEO_KEYS.all, 'categories'] as const,
  subCategories: (categoryId: number) => [...VIDEO_KEYS.categories(), 'subcategories', categoryId] as const,
  subCategory: (id: number) => [...VIDEO_KEYS.categories(), 'subcategory', id] as const,
} as const;

// Video Management
export const fetchVideos = async (organizationId: number): Promise<PaginatedVideoResponse> => {
  const response = await AxiosInstance.get(`${videosAPIendpoint}/videos/${organizationId}/`);
  return response.data;
};

export const fetchVideo = async (videoId: number): Promise<Video> => {
  const response = await AxiosInstance.get(`${videosAPIendpoint}/video/${videoId}/`);
  return response.data;
};

export const fetchVideoByToken = async (videoToken: string): Promise<Video> => {
  const response = await AxiosInstance.get(`${videosAPIendpoint}/video_by_token/${videoToken}/`);
  return response.data;
};

export const createVideo = async (organizationId: number, videoData: CreateVideo): Promise<Video> => {
  const formData = converttoformData(videoData);
  const response = await AxiosInstancemultipartWithToken.post(`${videosAPIendpoint}/add_video/${organizationId}/`, formData);
  return response.data;
};

export const updateVideo = async (videoId: number, videoData: UpdateVideo): Promise<Video> => {
  const formData = converttoformData(videoData);
  const response = await AxiosInstancemultipartWithToken.put(`${videosAPIendpoint}/update_video/${videoId}/`, formData);
  return response.data;
};

export const deleteVideo = async (videoId: number): Promise<DeleteResponse> => {
  const response = await AxiosInstanceWithToken.delete(`${videosAPIendpoint}/delete_video/${videoId}/`);
  return response.data;
};

export const fetchTrendingVideos = async (organizationId: number): Promise<PaginatedVideoResponse> => {
  const response = await AxiosInstance.get(`${videosAPIendpoint}/trendingvideos/${organizationId}/`);
  return response.data;
};

export const fetchUserBoughtVideos = async (organizationId: number, userId: number): Promise<PaginatedVideoResponse> => {
  const response = await AxiosInstance.get(`${videosAPIendpoint}/userboughtvideos/${organizationId}/${userId}/`);
  return response.data;
};

// Video Category Management
export const fetchVideoCategories = async (): Promise<VideoCategories> => {
  const response = await AxiosInstance.get(`${videosAPIendpoint}/categories/`);
  return response.data;
};

export const createVideoCategory = async (categoryData: CreateVideoCategory): Promise<VideoCategory> => {
  const response = await AxiosInstanceWithToken.post(`${videosAPIendpoint}/add_category/`, categoryData);
  return response.data;
};

export const updateVideoCategory = async (categoryId: number, updateData: Partial<CreateVideoCategory>): Promise<VideoCategory> => {
  const response = await AxiosInstanceWithToken.put(`${videosAPIendpoint}/update_category/${categoryId}/`, updateData);
  return response.data;
};

export const deleteVideoCategory = async (categoryId: number): Promise<DeleteResponse> => {
  const response = await AxiosInstanceWithToken.delete(`${videosAPIendpoint}/delete_category/${categoryId}/`);
  return response.data;
};

// Video SubCategory Management
export const fetchVideoSubCategories = async (categoryId: number): Promise<VideoSubCategory[]> => {
  const response = await AxiosInstance.get(`${videosAPIendpoint}/subcategories/${categoryId}/`);
  return response.data;
};

export const fetchVideoSubCategory = async (subcategoryId: number): Promise<VideoSubCategory> => {
  const response = await AxiosInstance.get(`${videosAPIendpoint}/subcategory/${subcategoryId}/`);
  return response.data;
};

export const createVideoSubCategory = async (subCategoryData: CreateVideoSubCategory): Promise<VideoSubCategory> => {
  const response = await AxiosInstanceWithToken.post(`${videosAPIendpoint}/create_subcategory/`, subCategoryData);
  return response.data;
};

export const updateVideoSubCategory = async (subCategoryId: number, updateData: Partial<CreateVideoSubCategory>): Promise<VideoSubCategory> => {
  const response = await AxiosInstanceWithToken.put(`${videosAPIendpoint}/update_subcategory/${subCategoryId}/`, updateData);
  return response.data;
};

export const deleteVideoSubCategory = async (subCategoryId: number): Promise<DeleteResponse> => {
  const response = await AxiosInstanceWithToken.delete(`${videosAPIendpoint}/delete_subcategory/${subCategoryId}/`);
  return response.data;
};

// React Query Hooks

// Video Query Hooks
export const useVideos = (organizationId: number, params?: Record<string, any>): UseQueryResult<PaginatedVideoResponse, Error> => {
  return useQuery({
    queryKey: [...VIDEO_KEYS.list(organizationId), params],
    queryFn: () => fetchVideos(organizationId),
    onError: (error: Error) => {
      console.error('Error fetching videos:', error);
      throw error;
    },
  });
};

export const useVideo = (videoId: number): UseQueryResult<Video, Error> => {
  return useQuery({
    queryKey: VIDEO_KEYS.detail(videoId),
    queryFn: () => fetchVideo(videoId),
    enabled: !!videoId,
    onError: (error: Error) => {
      console.error('Error fetching video:', error);
      throw error;
    },
  });
};

export const useVideoByToken = (videoToken: string): UseQueryResult<Video, Error> => {
  return useQuery({
    queryKey: VIDEO_KEYS.detailByToken(videoToken),
    queryFn: () => fetchVideoByToken(videoToken),
    enabled: !!videoToken,
    onError: (error: Error) => {
      console.error('Error fetching video by token:', error);
      throw error;
    },
  });
};

export const useTrendingVideos = (organizationId: number, params?: Record<string, any>): UseQueryResult<PaginatedVideoResponse, Error> => {
  return useQuery({
    queryKey: [...VIDEO_KEYS.trending(organizationId), params],
    queryFn: () => fetchTrendingVideos(organizationId),
    onError: (error: Error) => {
      console.error('Error fetching trending videos:', error);
      throw error;
    },
  });
};

export const useUserBoughtVideos = (organizationId: number, userId: number, params?: Record<string, any>): UseQueryResult<PaginatedVideoResponse, Error> => {
  return useQuery({
    queryKey: [...VIDEO_KEYS.userBought(organizationId, userId), params],
    queryFn: () => fetchUserBoughtVideos(organizationId, userId),
    enabled: !!organizationId && !!userId,
    onError: (error: Error) => {
      console.error('Error fetching user bought videos:', error);
      throw error;
    },
  });
};

// Video Management Mutations
export const useCreateVideo = (): UseMutationResult<Video, Error, { organizationId: number; videoData: CreateVideo }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, videoData }) => createVideo(organizationId, videoData),
    onSuccess: (data, { organizationId }) => {
      queryClient.invalidateQueries(VIDEO_KEYS.list(organizationId));
      queryClient.invalidateQueries(VIDEO_KEYS.lists());
      queryClient.invalidateQueries(VIDEO_KEYS.trending(organizationId));
    },
    onError: (error: Error) => {
      console.error('Error creating video:', error);
      throw error;
    },
  });
};

export const useUpdateVideo = (): UseMutationResult<Video, Error, { videoId: number; videoData: UpdateVideo }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ videoId, videoData }) => updateVideo(videoId, videoData),
    onSuccess: (data, { videoId }) => {
      queryClient.setQueryData(VIDEO_KEYS.detail(videoId), data);
      queryClient.invalidateQueries(VIDEO_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error updating video:', error);
      throw error;
    },
  });
};

export const useDeleteVideo = (): UseMutationResult<DeleteResponse, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: (_, videoId) => {
      queryClient.removeQueries(VIDEO_KEYS.detail(videoId));
      queryClient.invalidateQueries(VIDEO_KEYS.lists());
    },
    onError: (error: Error) => {
      console.error('Error deleting video:', error);
      throw error;
    },
  });
};

// Video Categories Hooks
export const useVideoCategories = (): UseQueryResult<VideoCategories, Error> => {
  return useQuery({
    queryKey: VIDEO_KEYS.categories(),
    queryFn: fetchVideoCategories,
    onError: (error: Error) => {
      console.error('Error fetching video categories:', error);
      throw error;
    },
  });
};

export const useCreateVideoCategory = (): UseMutationResult<VideoCategory, Error, CreateVideoCategory> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createVideoCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(VIDEO_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error creating video category:', error);
      throw error;
    },
  });
};

export const useUpdateVideoCategory = (): UseMutationResult<VideoCategory, Error, { categoryId: number; updateData: Partial<CreateVideoCategory> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, updateData }) => updateVideoCategory(categoryId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries(VIDEO_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error updating video category:', error);
      throw error;
    },
  });
};

export const useDeleteVideoCategory = (): UseMutationResult<DeleteResponse, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteVideoCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(VIDEO_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error deleting video category:', error);
      throw error;
    },
  });
};

// Video SubCategories Hooks
export const useVideoSubCategories = (categoryId: number, params?: Record<string, any>): UseQueryResult<VideoSubCategory[], Error> => {
  return useQuery({
    queryKey: [...VIDEO_KEYS.subCategories(categoryId), params],
    queryFn: () => fetchVideoSubCategories(categoryId),
    enabled: !!categoryId,
    onError: (error: Error) => {
      console.error('Error fetching video subcategories:', error);
      throw error;
    },
  });
};

export const useVideoSubCategory = (subcategoryId: number): UseQueryResult<VideoSubCategory, Error> => {
  return useQuery({
    queryKey: VIDEO_KEYS.subCategory(subcategoryId),
    queryFn: () => fetchVideoSubCategory(subcategoryId),
    enabled: !!subcategoryId,
    onError: (error: Error) => {
      console.error('Error fetching video subcategory:', error);
      throw error;
    },
  });
};

export const useCreateVideoSubCategory = (): UseMutationResult<VideoSubCategory, Error, CreateVideoSubCategory> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createVideoSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(VIDEO_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error creating video subcategory:', error);
      throw error;
    },
  });
};

export const useUpdateVideoSubCategory = (): UseMutationResult<VideoSubCategory, Error, { subCategoryId: number; updateData: Partial<CreateVideoSubCategory> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subCategoryId, updateData }) => updateVideoSubCategory(subCategoryId, updateData),
    onSuccess: (data, { subCategoryId }) => {
      queryClient.setQueryData(VIDEO_KEYS.subCategory(subCategoryId), data);
      queryClient.invalidateQueries(VIDEO_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error updating video subcategory:', error);
      throw error;
    },
  });
};

export const useDeleteVideoSubCategory = (): UseMutationResult<DeleteResponse, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteVideoSubCategory,
    onSuccess: (_, subCategoryId) => {
      queryClient.removeQueries(VIDEO_KEYS.subCategory(subCategoryId));
      queryClient.invalidateQueries(VIDEO_KEYS.categories());
    },
    onError: (error: Error) => {
      console.error('Error deleting video subcategory:', error);
      throw error;
    },
  });
};
