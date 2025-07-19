import React from "react";

interface BulkEmailProps {
  message: string;
}

const BulkEmail: React.FC<BulkEmailProps> = ({ message }) => {
  return <p>{message}</p>;
};

export default BulkEmail;
