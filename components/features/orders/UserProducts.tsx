import { useSession } from "next-auth/react";
import { PiEmptyBold } from "react-icons/pi";
import ProductPlaceholder from "../../custom/ImagePlaceholders/Productplaceholder";
import Link from "next/link";
import { productsAPIendpoint } from "@/data/product/fetcher";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Pagination from "@/components/custom/Pagination/Pagination";
import SearchInput from "@/components/custom/Inputs/SearchInput";
import { useMemo, useState } from "react";
import { useFetchProducts } from "@/data/product/product.hook";

const UserProducts = () => {
  const { data: session } = useSession();
  const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const page = searchParams.get("page") || "1";
  const pageSize = "10";
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const {
    data: products,
    isLoading: loadingProducts,
    error: error,
  } = useFetchProducts(
    session?.user.id
      ? `${productsAPIendpoint}/userboughtproducts/${Organizationid}/${session?.user.id}/?category=${currentCategory}&page=${page}&page_size=${pageSize}`
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

  // Memoized filtered services based on search query
  const filteredProducts = useMemo(() => {
    if (!products?.results) return [];
    if (!searchQuery) return products.results;

    return products.results.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <div>
      <div className="d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between ">
        <div>
          <h4 className="mt-3">Products Purchased</h4>
          <p>
            {products?.count} Product{products?.count > 1 ? "s" : ""} purchased
          </p>
        </div>
        <div className="mb-4 mb-md-0">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemlabel="product"
          />
        </div>
      </div>

      {searchQuery && <h5>Search Results</h5>}
      <div className="row">
        {filteredProducts?.length > 0 ? (
          filteredProducts?.map((product) => (
            <div key={product.id} className="col-12 col-md-4">
              <div className="card p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="me-3">
                    {product.preview ? (
                      <img
                        src={product.img_url}
                        alt="products"
                        width={68}
                        height={68}
                        className="rounded-circle object-fit-cover"
                        style={{ objectPosition: "center" }}
                      />
                    ) : (
                      <ProductPlaceholder />
                    )}
                  </div>
                  <div className="flex-fill">
                    <h6 className="text-capitalize">{product.name}</h6>
                    <p className="text-capitalize mb-1">
                      {product.description.length > 80 ? (
                        <span>{product.description.substring(0, 80)}... </span>
                      ) : (
                        product.description
                      )}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <p className="small mb-1">
                        {product.category.category} Product
                      </p>
                      <div
                        className="badge bg-primary py-2 px-2"
                        style={{ cursor: "pointer" }}
                      >
                        <Link
                          href={product.product_url || "#"}
                          target="_blank"
                          className="text-light"
                        >
                          view product
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
            <h4>Products</h4>
            <p>you have not purchased any Products so far</p>
          </div>
        )}

        {!loadingProducts &&
          products &&
          Math.ceil(products.count / parseInt(pageSize)) > 1 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(products.count / parseInt(pageSize))}
              handlePageChange={handlePageChange}
            />
          )}
      </div>
    </div>
  );
};

export default UserProducts;
