import type { Video, Videos } from "@/types/items";

/**
 * Add Video Response Configuration for optimistic updates
 */
export const addVideoOptions = (newVideo: Video) => {
  return {
    optimisticData: (videos: Videos): Videos =>
      [...videos, newVideo].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      ),

    rollbackOnError: true,
    populateCache: (addedVideo: Video, videos: Videos): Videos =>
      [...videos, addedVideo].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      ),
    revalidate: false,
  };
};

/**
 * Update Video Configuration for optimistic updates
 */
export const updateVideoOptions = (updatedVideo: Video) => {
  return {
    optimisticData: (videos: Videos): Videos => {
      return videos.map((video) =>
        video.id === updatedVideo.id ? { ...video, ...updatedVideo } : video
      );
    },

    rollbackOnError: true,
    populateCache: (updatedVideoResponse: Video, videos: Videos): Videos => {
      return videos.map((video) =>
        video.id === updatedVideoResponse.id ? updatedVideoResponse : video
      );
    },
    revalidate: false,
  };
};

/**
 * Delete Video Configuration for optimistic updates
 */
export const deleteVideoOptions = (videoId: number) => {
  return {
    optimisticData: (videos: Videos): Videos => {
      return videos.filter((video) => video.id !== videoId);
    },

    rollbackOnError: true,
    populateCache: (deletedVideoId: number, videos: Videos): Videos => {
      return videos.filter((video) => video.id !== deletedVideoId);
    },
    revalidate: false,
  };
};
