import { useSession } from "next-auth/react";
import { PiEmptyBold } from "react-icons/pi";
import VideosPlaceholder from "../../custom/ImagePlaceholders/Videosplaceholder";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { vidoesapiAPIendpoint } from "@/data/videos/fetcher";
import Pagination from "@/components/custom/Pagination/Pagination";
import { useMemo, useState } from "react";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { useFetchVideos } from "@/data/videos/video.hook";

const UserVideos = () => {
  const { data: session } = useSession();
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const {
    data: videos,
    isLoading: loadingVideos,
    error: error,
  } = useFetchVideos(
    session?.user.id
      ? `${vidoesapiAPIendpoint}/userboughtvideos/${Organizationid}/${session?.user.id}/?category=${currentCategory}&page=${page}&page_size=${pageSize}`
      : null
  );

  // -----------------------------------------
  // Handle page change
  // -----------------------------------------
  /**  @param {string} newPage */
  const handlePageChange = (newPage) => {
    router.push(
      `?category=${currentCategory}&page=${newPage}&page_size=${pageSize}`,
      {
        scroll: false,
      }
    );
  };

  // -------------------------------
  // Handle category change
  // -------------------------------
  /**  @param {string} category */
  const handleCategoryChange = (category) => {
    router.push(`?category=${category}&page=${page}&page_size=${pageSize}`, {
      scroll: false,
    });
  };

  // Memoized filtered Videos based on search query
  const filteredVideos = useMemo(() => {
    if (!videos?.results) return [];
    if (!searchQuery) return videos.results;

    return videos.results.filter((video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [videos, searchQuery]);

  return (
    <div>
      <div className="d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between ">
        <div>
          <h4 className="mt-3">Videos Purchased</h4>
          <p>
            {videos?.count} Video{videos?.count > 1 ? "s" : ""} purchased
          </p>
        </div>
        <div className="mb-4 mb-md-0">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemlabel="video"
          />
        </div>
      </div>

      {searchQuery && <h5>Search Results</h5>}
      <div className="row">
        {filteredVideos?.length > 0 ? (
          filteredVideos?.map((video) => (
            <div key={video.id} className="col-12 col-md-4">
              <div className="card p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="me-3">
                    {video.thumbnail ? (
                      <img
                        src={video.img_url}
                        alt="video"
                        width={68}
                        height={68}
                        className="rounded-circle object-fit-cover"
                        style={{ objectPosition: "center" }}
                      />
                    ) : (
                      <VideosPlaceholder />
                    )}
                  </div>
                  <div className="flex-fill">
                    <h6 className="text-capitalize">{video.title}</h6>
                    <p className="text-capitalize mb-1">
                      {video.description.length > 80 ? (
                        <span>{video.description.substring(0, 80)}... </span>
                      ) : (
                        video.description
                      )}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <p className="small mb-1">
                        {video.category.category} Video
                      </p>
                      <div
                        className="badge bg-primary-light text-primary py-2 px-2"
                        style={{ cursor: "pointer" }}
                      >
                        <Link
                          href={`/dashboard/my-orders/video/?videotoken=${video.video_token}`}
                          className="text-primary"
                        >
                          View Video
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <PiEmptyBold
              className="mt-2"
              style={{ fontSize: "6rem", color: "var(--bgDarkerColor)" }}
            />
            <h4>Videos</h4>
            <p>you have not purchased any video</p>
          </div>
        )}
      </div>

      {!loadingVideos &&
        videos &&
        Math.ceil(videos.count / parseInt(pageSize)) > 1 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(videos.count / parseInt(pageSize))}
            handlePageChange={handlePageChange}
          />
        )}
    </div>
  );
};

export default UserVideos;
