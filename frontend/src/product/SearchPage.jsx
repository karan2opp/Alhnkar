import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "./ProductCard";
import { useProductStore } from "../store/useProductStore";

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const title =
    searchParams.get("title") || "";

  const category =
    searchParams.get("category") || "";

  const {
    products,
    fetchProducts,
    loading,
  } = useProductStore();

  useEffect(() => {
    fetchProducts({
      title,
      category,
    });
  }, [title, category]);

  return (
    <>
      <Navbar />

      <div className="bg-bg text-text min-h-screen px-4 md:px-10 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-serif text-accent">
            Search Results
          </h1>

          <p className="text-text/60 mt-2">
            Showing results for:
            <span className="ml-2 font-medium">
              {title || "Products"}
            </span>
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            Searching products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}