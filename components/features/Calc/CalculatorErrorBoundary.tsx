import React from 'react';

/**
 * Error Boundary Component for Calculator Module
 * @param {{ error: Error; resetError: () => void; }} props
 */
const CalculatorErrorBoundary = ({ error, resetError }) => {
  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: "600px" }}>
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-calculator text-danger" style={{ fontSize: "4rem" }}></i>
        </div>
        <h3 className="text-danger mb-3">Calculator Error</h3>
        <div className="alert alert-danger">
          <p className="mb-2">
            <strong>Something went wrong with the calculator:</strong>
          </p>
          <p className="text-break">
            {error?.message || "An unexpected error occurred during calculation."}
          </p>
        </div>
        
        <div className="mt-4">
          <button 
            className="btn btn-primary me-3" 
            onClick={resetError}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Try Again
          </button>
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Reload Page
          </button>
        </div>
        
        <div className="mt-4">
          <small className="text-muted">
            If this problem persists, please refresh the page or contact support.
          </small>
        </div>
      </div>
    </div>
  );
};

/**
 * Loading Component for Calculators
 */
export const CalculatorLoadingSkeleton = () => {
  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: "700px" }}>
      <div className="text-center mb-4">
        <div className="bg-light rounded-circle mx-auto mb-3" style={{ width: "80px", height: "80px" }}></div>
        <div className="bg-light rounded mb-2" style={{ height: "30px", width: "200px", margin: "0 auto" }}></div>
      </div>
      
      <hr />
      
      {/* Form skeleton */}
      <div className="space-y-3">
        <div className="bg-light rounded mb-3" style={{ height: "40px" }}></div>
        <div className="bg-light rounded mb-3" style={{ height: "40px" }}></div>
        <div className="bg-light rounded mb-3" style={{ height: "40px" }}></div>
        <div className="bg-light rounded mb-3" style={{ height: "50px" }}></div>
      </div>
      
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading calculator...</span>
        </div>
        <p className="mt-2 text-muted">Loading calculator...</p>
      </div>
    </div>
  );
};

export default CalculatorErrorBoundary;
