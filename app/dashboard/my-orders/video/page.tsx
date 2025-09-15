"use client";
import { useSearchParams } from "next/navigation";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import { PulseLoader } from "react-spinners";
import { useVideoByToken } from "@/data/hooks/video.hooks";

const VideoPage = () => {
  const searchParams = useSearchParams();
  const videotoken = searchParams.get("videotoken");

  const {
    data: video,
    isLoading: loadingVideo,
    error: error,
  } = useVideoByToken(videotoken || "");

  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Video" />

      {loadingVideo && !error && (
        <div className="d-flex justify-content-center">
          <PulseLoader size={9} color={"#12000d"} loading={true} />
        </div>
      )}

      {!loadingVideo && video && (
        <div>
          <h4 className="text-center mb-4">{video?.title}</h4>
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-12 col-md-7">
                <video
                  onContextMenu={(e) => e.preventDefault()}
                  src={video?.video_url}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                    objectPosition: "top center",
                  }}
                ></video>
              </div>
              <div className="col-12 col-md-5 ps-0 ps-md-5">
                <h6>Description</h6>
                <hr />
                <p>{video?.description}</p>
                <h6>Category</h6>
                <p
                  className="badge bg-secondary-light text-secondary rounded-pill px-4 py-2"
                  style={{
                    border: "1px solid var(--secondary)",
                  }}
                >
                  {video?.category && video?.category.category}
                </p>
                <h6>Subcategory</h6>
                <p
                  className="badge bg-success-light text-success rounded-pill px-4 py-2"
                  style={{
                    border: "1px solid var(--success)",
                  }}
                >
                  {video?.subcategory && video?.subcategory.subcategory}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;
