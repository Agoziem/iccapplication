import BackButton from "@/components/custom/backbutton/BackButton";
import NextBreadcrumb from "@/components/custom/Breadcrumb/breadcrumb";
import Videos from "@/components/features/Videos/Videos";

const VideosPage = () => {
  return (
    <section className="container px-3 px-md-4 py-4 mb-5">
      <div className="mb-3">
        <NextBreadcrumb capitalizeLinks />
        <BackButton />
      </div>
      <Videos />
    </section>
  );
};

export default VideosPage;
