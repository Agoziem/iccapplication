"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchVideos,
  fetchVideo,
  createVideo,
  updateVideo,
  deleteVideo,
} from "@/data/videos/fetcher";

// Hook to fetch all videos
export const useFetchVideos = (url) => {
  return useQuery(
    ["videos", url], // Dynamic cache key
    () => fetchVideos(url),
    {
      enabled: !!url, // Ensure the query only runs if the URL is provided
    }
  );
};

// Hook to fetch a single video
export const useFetchVideo = (url) => {
  return useQuery(
    ["video", url], // Dynamic cache key for a single video
    () => fetchVideo(url),
    {
      enabled: !!url, // Ensure the query only runs if the URL is provided
    }
  );
};

// Hook to fetch a single video by Token
export const useFetchVideoByToken = (url, token) => {
  return useQuery(
    ["video", token, url], // Dynamic cache key for a single video
    () => fetchVideo(url),
    {
      enabled: !!token, // Ensure the query only runs if the token is provided
    }
  );
};

// Hook to create a new video
export const useCreateVideo = () => {
  const queryClient = useQueryClient();
  return useMutation(createVideo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["videos"]); // Invalidate the videos list
    },
  });
};

// Hook to update a video
export const useUpdateVideo = () => {
  const queryClient = useQueryClient();
  return useMutation(updateVideo, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["video", variables.id]); // Invalidate the specific video
      queryClient.invalidateQueries(["videos"]); // Invalidate the videos list
    },
  });
};

// Hook to delete a video
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteVideo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["videos"]); // Invalidate the videos list
    },
  });
};
