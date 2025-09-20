import Videos from "@/components/features/configuration/videos/Videos";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import React from "react";

const VideoConfigPage = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Video Settings" />
      <Videos />
    </div>
  );
};

export default VideoConfigPage;
