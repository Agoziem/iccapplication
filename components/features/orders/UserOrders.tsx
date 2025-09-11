"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import UserServices from "./UserServices";
import UserProducts from "./UserProducts";
import UserVideos from "./UserVideos";
import Datatable from "@/components/custom/Datatable/Datatable";
import OrderTableItems from "./OrderTableItems";
import { useFetchPaymentsByUser } from "@/data/payments/orders.hook";
import { useSession } from "next-auth/react";

/**
 * Enhanced UserOrders component with comprehensive error handling and validation
 * Displays user orders with tabs for different item types and complete order history
 * 
 * @component
 */
const UserOrders = () => {
  const { data: session } = useSession();
  
  // Safe categories configuration
  const categories = useMemo(() => ["services", "products", "videos"], []);
  
  // Safe state management
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  // Memoized user ID validation
  const validUserId = useMemo(() => {
    const userId = session?.user?.id;
    if (!userId) return null;
    
    const numericId = typeof userId === 'string' 
      ? parseInt(userId, 10) 
      : userId;
    
    return (!isNaN(numericId) && numericId > 0) ? numericId : null;
  }, [session?.user?.id]);

  // Safe data fetching with validation
  const { 
    data: userOrders, 
    isLoading: loadingUserOrders,
    error: queryError,
    isError 
  } = useFetchPaymentsByUser(validUserId, {
    enabled: !!validUserId, // Only fetch if valid user ID exists
    retry: (failureCount, error) => {
      // Retry up to 2 times for network errors
      if (failureCount < 2 && error?.message?.includes('network')) {
        return true;
      }
      return false;
    },
    onError: (error) => {
      console.error('User orders fetch error:', error);
      setError(error?.message || 'Failed to load orders');
    }
  });

  // Safe items update with validation
  const updateItems = useCallback((newItems) => {
    try {
      // Reset error state
      setError(null);

      if (!newItems) {
        setItems([]);
        return;
      }

      if (!Array.isArray(newItems)) {
        console.error('Invalid items data format:', typeof newItems);
        setError('Invalid order data received');
        setItems([]);
        return;
      }

      // Filter and validate items
      const validItems = newItems.filter(item => 
        item && 
        typeof item === 'object' && 
        (item.id || item.payment_id)
      );

      setItems(validItems);

      if (validItems.length !== newItems.length && newItems.length > 0) {
        console.warn(`Filtered out ${newItems.length - validItems.length} invalid items`);
      }

    } catch (error) {
      console.error('Error updating items:', error);
      setError('Failed to process order data');
      setItems([]);
    }
  }, []);

  // Effect to handle data updates
  useEffect(() => {
    if (userOrders) {
      updateItems(userOrders);
    } else if (isError) {
      setError(queryError?.message || 'Failed to load orders');
      setItems([]);
    }
  }, [userOrders, isError, queryError, updateItems]);

  // Safe tab change handler
  const handleTabChange = useCallback((category) => {
    if (!category || typeof category !== 'string') {
      console.error('Invalid category:', category);
      return;
    }

    if (categories.includes(category)) {
      setActiveTab(category);
      setError(null); // Clear any existing errors when switching tabs
    } else {
      console.error('Invalid category:', category);
    }
  }, [categories]);

  // Safe style calculation
  const getTabStyle = useCallback((category) => {
    const isActive = activeTab === category;
    
    return {
      color: isActive ? "var(--secondary)" : "var(--primary)",
      backgroundColor: isActive ? "var(--secondary-300)" : "transparent",
      border: isActive
        ? "1.5px solid var(--secondary)"
        : "1.5px solid var(--bgDarkerColor)",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out"
    };
  }, [activeTab]);

  // Tab component mapping
  const getTabComponent = useCallback(() => {
    switch (activeTab) {
      case "services":
        return <UserServices />;
      case "products":
        return <UserProducts />;
      case "videos":
        return <UserVideos />;
      default:
        console.warn('Unknown tab:', activeTab);
        return <UserServices />;
    }
  }, [activeTab]);

  // Loading state
  if (loadingUserOrders) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </div>
          <p className="text-muted">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center mt-4" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <div>
          <strong>Error:</strong> {error}
          <br />
          <small>Please try refreshing the page or contact support if the issue persists.</small>
        </div>
      </div>
    );
  }

  // No session state
  if (!session?.user) {
    return (
      <div className="alert alert-warning d-flex align-items-center mt-4" role="alert">
        <i className="bi bi-person-exclamation me-2"></i>
        <div>
          Please sign in to view your orders.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Category Tabs */}
      <div className="mb-4">
        {categories.map((category) => (
          <div
            key={category}
            className="badge rounded-5 px-4 py-2 me-2 mb-2 mb-md-0"
            style={getTabStyle(category)}
            onClick={() => handleTabChange(category)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabChange(category);
              }
            }}
            aria-pressed={activeTab === category}
            aria-label={`View ${category} orders`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        ))}
      </div>

      {/* Items Purchased */}
      <div className="mt-4">
        <div 
          role="tabpanel"
          aria-labelledby={`${activeTab}-tab`}
          aria-label={`${activeTab} orders content`}
        >
          {getTabComponent()}
        </div>
      </div>

      {/* Order table */}
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">All Orders</h5>
          {items.length > 0 && (
            <span className="badge bg-primary bg-opacity-10 text-primary">
              {items.length} order{items.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <Datatable
          items={items}
          setItems={setItems}
          label="Orders"
          filteritemlabel="reference"
        >
          <OrderTableItems />
        </Datatable>
      </div>
    </div>
  );
};

export default UserOrders;
