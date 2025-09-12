import React from "react";

const Loading = ({ item } : { item: string }) => {
  return (
    <div className="text-center">
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <div className="ms-3 text-primary">Loading {item} ...</div>
    </div>
  );
};

export default Loading;
