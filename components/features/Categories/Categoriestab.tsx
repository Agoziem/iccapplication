import React, { useCallback } from "react";
import { Category } from "@/types/categories";

interface CategoryTabsProps {
  categories: Category[];
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  currentCategory,
  setCurrentCategory,
}) => {
  const handleCategoryClick = useCallback((category: string) => {
    setCurrentCategory(category);
  }, [setCurrentCategory]);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div>
      {categories.map((category) => (
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
          onClick={() => handleCategoryClick(category.category)}
        >
          {category.category}
        </div>
      ))}
    </div>
  );
};

export default CategoryTabs;
