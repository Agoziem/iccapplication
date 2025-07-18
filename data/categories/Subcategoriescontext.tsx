"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { SubCategory } from "@/types/categories";

// Define the context value interface
interface SubCategoriesContextValue {
  videosubcategories: SubCategory[];
  fetchVideoSubCategories: (category_id: number | string) => Promise<SubCategory[] | undefined>;
  servicesubcategories: SubCategory[];
  fetchServiceSubCategories: (category_id: number | string) => Promise<SubCategory[] | undefined>;
  productsSubcategories: SubCategory[];
  fetchProductsSubCategories: (category_id: number | string) => Promise<SubCategory[] | undefined>;
  loading: boolean;
}

// Define the provider props interface
interface SubcategoriesProviderProps {
  children: ReactNode;
}

const SubCategoriesContext = createContext<SubCategoriesContextValue | null>(null);

const Subcategoriesprovider: React.FC<SubcategoriesProviderProps> = ({ children }) => {
  const [videosubcategories, setVideoSubcategories] = useState<SubCategory[]>([]);
  const [servicesubcategories, setServiceSubcategories] = useState<SubCategory[]>([]);
  const [productsSubcategories, setProductsSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // fetch video subcategories
  const fetchVideoSubCategories = async (category_id: number | string): Promise<SubCategory[] | undefined> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/vidoesapi/subcategories/${category_id}/`
      );
      if (response.ok) {
        const data: SubCategory[] = await response.json();
        setVideoSubcategories(data);
        return data;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // fetch service subcategories
  const fetchServiceSubCategories = async (category_id: number | string): Promise<SubCategory[] | undefined> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/servicesapi/subcategories/${category_id}/`
      );
      if (response.ok) {
        const data: SubCategory[] = await response.json();
        setServiceSubcategories(data);
        return data;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // fetch products subcategories
  const fetchProductsSubCategories = async (category_id: number | string): Promise<SubCategory[] | undefined> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/productsapi/subcategories/${category_id}/`
      );
      if (response.ok) {
        const data: SubCategory[] = await response.json();
        setProductsSubcategories(data);
        return data;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubCategoriesContext.Provider
      value={{
        videosubcategories,
        fetchVideoSubCategories,
        servicesubcategories,
        fetchServiceSubCategories,
        productsSubcategories,
        fetchProductsSubCategories,
        loading,
      }}
    >
      {children}
    </SubCategoriesContext.Provider>
  );
};

const useSubCategoriesContext = (): SubCategoriesContextValue => {
  const context = useContext(SubCategoriesContext);
  if (!context) {
    throw new Error("useSubCategoriesContext must be used within a Subcategoriesprovider");
  }
  return context;
};

export { useSubCategoriesContext, Subcategoriesprovider };
