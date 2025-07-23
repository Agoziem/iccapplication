import React, { useEffect } from "react";
import { ArticleCategory } from "@/types/articles";

interface CategoryTabsProps {
  categories: ArticleCategory[];
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  currentCategory,
  setCurrentCategory,
}) => {
  return (
    <div>
      {categories?.length > 0 &&
        categories?.map((category: ArticleCategory) => (
          <div
            key={category.id}
            className={`badge rounded-5 px-4 py-2 me-2 mb-2`}
            style={{
              color:
                currentCategory === category.category
                  ? "var(--secondary)"
                  : "var(--primary)",
              backgroundColor:
                currentCategory === category.category
                  ? "var(--secondary-300)"
                  : " ",
              border:
                currentCategory === category.category
                  ? "1.5px solid var(--secondary)"
                  : "1.5px solid var(--bgDarkerColor)",
              cursor: "pointer",
            }}
            onClick={() => setCurrentCategory(category.category)}
          >
            {category.category}
          </div>
        ))}
    </div>
  );
};

export default CategoryTabs;
