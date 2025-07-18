import PageTitle from "@/components/custom/PageTitle/PageTitle";
import Videos from "@/components/features/Videos/Videos";

const VideosPage = () => {
  return (
    <div>
      <PageTitle pathname="videos" />
      <div style={{ minHeight: "100vh" }}>
        <Videos />
      </div>
    </div>
  );
};

export default VideosPage;
