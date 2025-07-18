"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

const SubCategoriesContext = createContext(null);

const Subcategoriesprovider = ({ children }) => {
  const [videosubcategories, setVideoSubcategories] = useState([]);
  const [servicesubcategories, setServiceSubcategories] = useState([]);
  const [productsSubcategories, setProductsSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch video subcategories
  const fetchVideoSubCategories = async (category_id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/vidoesapi/subcategories/${category_id}/`
      );
      if (response.ok) {
        const data = await response.json();
        setVideoSubcategories(data);
        return data;
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // fetch service subcategories
  const fetchServiceSubCategories = async (category_id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/servicesapi/subcategories/${category_id}/`
      );
      if (response.ok) {
        const data = await response.json();
        setServiceSubcategories(data);
        return data;
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };


  // fetch products subcategories
  const fetchProductsSubCategories = async (category_id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/productsapi/subcategories/${category_id}/`
      );
      if (response.ok) {
        const data = await response.json();
        setProductsSubcategories(data);
        return data;
      }
    } catch (error) {
      setError(error);
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

const useSubCategoriesContext = () => {
  return useContext(SubCategoriesContext);
};

export { useSubCategoriesContext, Subcategoriesprovider };
