import { PaginatedVideoResponse, PaginatedVideoUserResponse, Video } from "@/types/videos";
import { AxiosinstanceAuth, AxiosinstanceFormDataAuth } from "./instance";
import { CreateVideoType } from "@/schemas/videos";
import { ORGANIZATION_ID } from "@/constants";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";

const organizationId = ORGANIZATION_ID;

// ======================================================
// React Query Hooks - Videos
// ======================================================

/**
 * Hook to fetch all videos
 */
export const useGetVideos = (): UseQueryResult<PaginatedVideoResponse> => {
  return useQuery(
    ["videos"],
    async () => {
      const response = await AxiosinstanceAuth.get(`/videos/${organizationId}`);
      return response.data;
    },
    {
      enabled: !!organizationId,
    }
  );
};

// get trending videos
export const useGetTrendingVideos = (): UseQueryResult<PaginatedVideoResponse> => {
  return useQuery(
    ["trendingVideos"],
    async () => {
      const response = await AxiosinstanceAuth.get(`/videos/trending/${organizationId}`);
      return response.data;
    },
    {
      enabled: !!organizationId,
    }
  );
};

// get free videos
export const useGetFreeVideos = (): UseQueryResult<PaginatedVideoResponse> => {
  return useQuery(
    ["freeVideos"],
    async () => {
      const response = await AxiosinstanceAuth.get(`/videos/free/${organizationId}`);
      return response.data;
    },
    {
      enabled: !!organizationId,
    }
  );
};

// get paid videos
export const useGetPaidVideos = (): UseQueryResult<PaginatedVideoResponse> => {
  return useQuery(
    ["paidVideos"],
    async () => {
      const response = await AxiosinstanceAuth.get(`/videos/paid/${organizationId}`);
      return response.data;
    },
    {
      enabled: !!organizationId,
    }
  );
};


// get user videos
export const useGetUserVideos = (): UseQueryResult<PaginatedVideoResponse> => {
  return useQuery(
    ["userVideos"],
    async () => {
      const response = await AxiosinstanceAuth.get(`/videos/user/${organizationId}`);
      return response.data;
    },
    {
      enabled: !!organizationId,
    }
  );
};


/**
 * Hook to fetch single video by URL
 */
export const useGetVideo = (id: number): UseQueryResult<Video> => {
  return useQuery(
    ["video", id],
    async () => {
      const response = await AxiosinstanceAuth.get(`/v1ideos/video/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );
};

// get video by token
export const useGetVideoByToken = (token: string): UseQueryResult<Video> => {
  return useQuery(
    ["videoByToken", token],
    async () => {
      const response = await AxiosinstanceAuth.get(`/videos/token/${token}`);
      return response.data;
    },
    {
      enabled: !!token,
    }
  );
};

/**
 * Hook to create a new video
 */
export const useCreateVideo = (): UseMutationResult<
  Video,
  Error,
  { new_video: CreateVideoType; thumbnail?: File | null; video?: File | null }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { new_video: CreateVideoType; thumbnail?: File | null; video?: File | null }) => {
      const response = await AxiosinstanceFormDataAuth.post(`/videos/${organizationId}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate all video-related queries
        queryClient.invalidateQueries("videos");
      },
      onError: (error) => {
        console.error("Failed to create video:", error);
      },
    }
  );
};

/**
 * Hook to update an existing video
 */
export const useUpdateVideo = (): UseMutationResult<
  Video,
  Error,
  { updated_video: CreateVideoType; thumbnail?: File | null; video?: File | null; id: number }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { updated_video: CreateVideoType; thumbnail?: File | null; video?: File | null; id: number }) => {
      const response = await AxiosinstanceAuth.put(
        `/videos/video/${data.id}`,
        {
          updated_video: data.updated_video,
          thumbnail: data.thumbnail,
          video: data.video,
        }
      );
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("videos");
        queryClient.invalidateQueries(["video", variables.id]);
      },
      onError: (error) => {
        console.error("Failed to update video:", error);
      },
    }
  );
};

/**
 * Hook to delete a video
 */
export const useDeleteVideo = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      await AxiosinstanceAuth.delete(`/videos/video/${id}`);
    },
    {
      onSuccess: () => {
        // Invalidate all video-related queries
        queryClient.invalidateQueries("videos");
        queryClient.invalidateQueries("video");
      },
      onError: (error) => {
        console.error("Failed to delete video:", error);
      },
    }
  );
};


// users that bought a video
export const useGetUsersThatBoughtVideo = (videoId: number): UseQueryResult<PaginatedVideoUserResponse> => {
  return useQuery(
    ["usersThatBoughtVideo", videoId],
    async () => {
      const response = await AxiosinstanceAuth.get(`/video-users/watchers/${videoId}`);
      return response.data;
    },
    {
      enabled: !!videoId,
    }
  );
}