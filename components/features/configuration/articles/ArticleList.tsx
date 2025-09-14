import React, { useCallback, useState } from "react";
import Modal from "@/components/custom/Modal/modal";
import Alert from "@/components/custom/Alert/Alert";
import ArticlePlaceholder from "./ArticlePlaceholder";
import Pagination from "@/components/custom/Pagination/Pagination";
import { useRouter } from "next/navigation";
import { useDeleteArticle } from "@/data/hooks/articles.hooks";
import toast from "react-hot-toast";
import { ArticleResponse, PaginatedArticleResponse } from "@/types/articles";

interface ArticlesListProps {
  articles: PaginatedArticleResponse | null;
  article: ArticleResponse | null;
  setArticle: React.Dispatch<React.SetStateAction<ArticleResponse | null>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  currentPage: number;
  pageSize: string;
}

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "danger" | "warning" | "info";
}

const ArticleList: React.FC<ArticlesListProps> = ({
  articles,
  article,
  setArticle,
  editMode,
  setEditMode,
  loading,
  currentPage,
  pageSize,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });
  const router = useRouter();

  // handle Article Delete
  const { mutateAsync: deleteArticle } = useDeleteArticle();
  
  const removeArticle = useCallback(async (id: number) => {
    if (!id) {
      toast.error("Invalid article ID");
      return;
    }
    
    try {
      await deleteArticle(id);
      toast.success("Article deleted successfully");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("An error occurred, please try again");
    } finally {
      closeModal();
    }
  }, [deleteArticle]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setArticle(null);
  }, [setArticle]);

  // -----------------------------------------
  // Handle page change
  // -----------------------------------------
  const handlePageChange = useCallback((newPage: string | number) => {
    const pageStr = typeof newPage === 'number' ? newPage.toString() : newPage;
    router.push(`?category=All&page=${pageStr}&page_size=${pageSize}`, {
      scroll: false,
    });
  }, [router, pageSize]);

  return (
    <div>
      <h4 className="mb-3">
        {articles?.count || 0} Article{(articles?.results?.length || 0) > 1 ? "s" : ""}
      </h4>
      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
      {articles && articles.results.length > 0 ? (
        <div className="">
          {
            // loading
            loading && (
              <div className="d-flex justify-content-center">
                {/* spinner */}
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )
          }
          {!loading &&
            articles.results.map((article) => (
              <div key={article.id} className="card px-4 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="me-3">
                    {article.img ? (
                      <img
                        src={article.img_url}
                        className="rounded object-fit-cover "
                        alt="profile"
                        height={90}
                        width={90}
                        style={{ objectPosition: "top center" }}
                      />
                    ) : (
                      <ArticlePlaceholder />
                    )}
                  </div>
                  <div className="flex-fill">
                    <h6 className="text-wrap text-break">{article.title}</h6>
                    <p className="text-wrap text-break">{article.subtitle}</p>
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-sm btn-accent-primary me-2 rounded"
                    onClick={() => {
                      setArticle(article);
                      setEditMode(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger rounded"
                    onClick={() => {
                      setArticle(article);
                      setShowModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          {/* ServerSide Pagination */}
          {!loading &&
            articles &&
            Math.ceil(articles.count / parseInt(pageSize)) > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(articles.count / parseInt(pageSize))}
                handlePageChange={handlePageChange}
              />
            )}
        </div>
      ) : (
        <div className="card-body">
          <h5 className="text-center">No Articles found</h5>
        </div>
      )}
      <Modal showmodal={showModal} toggleModal={closeModal}>
        <div className="">
          <h5 className="mb-3">Delete Article</h5>
          <div className="modal-body">
            <p>
              Are you sure you want to delete this article? {article?.title}
            </p>
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-accent-secondary rounded me-3"
              onClick={() => closeModal()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger rounded"
              onClick={() => article?.id && removeArticle(article.id)}
              disabled={!article?.id}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ArticleList;
