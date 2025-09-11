import Videos from "@/components/features/configuration/videos/Videos";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import React from "react";

const VideoConfigPage = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Video Settings" />
      <h4 className="my-3 mt-4">videos</h4>
      <Videos />
    </div>
  );
};

export default VideoConfigPage;
