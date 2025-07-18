import CategoriesForm from "@/components/features/Categories/Categories";

const ArticleCategoryForm = ({ categories }) => {
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
