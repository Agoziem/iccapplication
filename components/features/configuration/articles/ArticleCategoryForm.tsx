import React from "react";
import CategoriesForm from "@/components/features/Categories/Categories";
import { Categories } from "@/types/categories";



interface ArticleCategoryFormProps {
  categories: Categories;
}

const ArticleCategoryForm: React.FC<ArticleCategoryFormProps> = ({ categories }) => {
  return (
    <CategoriesForm
      items={categories}
      addUrl={"/blogsapi/addCategory/"}
      updateUrl={"/blogsapi/updateCategory/"}
      deleteUrl={"/blogsapi/deleteCategory/"}
    />
  );
};

export default ArticleCategoryForm;
