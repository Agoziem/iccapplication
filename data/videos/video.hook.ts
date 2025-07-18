"use client";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import type { Video, Videos } from "@/types/items";
import { z } from "zod";
import { videosResponseSchema } from "@/schemas/items";
import {
  fetchVideos,
  fetchVideo,
  createVideo,
  updateVideo,
  deleteVideo,
} from "@/data/videos/fetcher";

type VideosResponse = z.infer<typeof videosResponseSchema>;

// Hook to fetch all videos
export const useFetchVideos = (url: string): UseQueryResult<VideosResponse | undefined, Error> => {
  return useQuery(
    ["videos", url], // Dynamic cache key
    () => fetchVideos(url),
    {
      enabled: !!url, // Ensure the query only runs if the URL is provided
    }
  );
};

// Hook to fetch a single video
export const useFetchVideo = (url: string): UseQueryResult<Video | undefined, Error> => {
  return useQuery(
    ["video", url], // Dynamic cache key for a single video
    () => fetchVideo(url),
    {
      enabled: !!url, // Ensure the query only runs if the URL is provided
    }
  );
};

// Hook to fetch a single video by Token
export const useFetchVideoByToken = (url: string, token: string): UseQueryResult<Video | undefined, Error> => {
  return useQuery(
    ["video", token, url], // Dynamic cache key for a single video
    () => fetchVideo(url),
    {
      enabled: !!token, // Ensure the query only runs if the token is provided
    }
  );
};

// Hook to create a new video
export const useCreateVideo = (): UseMutationResult<Video | undefined, Error, Omit<Video, "id" | "created_at" | "updated_at">> => {
  const queryClient = useQueryClient();
  return useMutation(createVideo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["videos"]); // Invalidate the videos list
    },
  });
};

// Hook to update a video
export const useUpdateVideo = (): UseMutationResult<Video | undefined, Error, Partial<Video> & { id: number }> => {
  const queryClient = useQueryClient();
  return useMutation(updateVideo, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["video", variables.id]); // Invalidate the specific video
      queryClient.invalidateQueries(["videos"]); // Invalidate the videos list
    },
  });
};

// Hook to delete a video
export const useDeleteVideo = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteVideo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["videos"]); // Invalidate the videos list
    },
  });
};
