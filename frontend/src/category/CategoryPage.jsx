// CategoryPage.jsx

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useCategoryStore } from "../store/useCategoryStore";

export default function CategoryPage() {
  const {
    categories,
    loading,
    fetchAllCategories,
  } = useCategoryStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    // only category, no title
    navigate(`/search?category=${categoryId}`);
  };

  return (
    <>
      <Navbar />

      <div className="bg-bg text-text min-h-screen px-4 md:px-10 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm tracking-[0.3em] uppercase text-primary/70 mb-2">
            Explore Collections
          </p>

          <h1 className="text-3xl md:text-4xl font-serif text-accent">
            Shop by Category
          </h1>

          <p className="text-text/60 mt-3">
            Discover premium fashion curated for every style
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            Loading categories...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() =>
                  handleCategoryClick(category._id)
                }
                className="cursor-pointer bg-surface border border-primary/10 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary transition duration-300"
              >
                {/* Image */}
                <div className="h-56 bg-bg">
                  <img
                    src={
                      category.image?.url ||
                      category.image ||
                      "https://via.placeholder.com/300x300?text=Category"
                    }
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-xl font-medium mb-2 capitalize">
                    {category.name}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}