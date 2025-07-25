import React from "react";

interface LoadingProps {
  item?: string;
}

const Loading = ({ item = "content" }: LoadingProps) => {
  return (
    <div className="text-center">
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <div className="ms-3 text-primary">Loading {item}...</div>
    </div>
  );
};

export default Loading;
