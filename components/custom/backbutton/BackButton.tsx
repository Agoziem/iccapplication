"use client";
import React, { useEffect, useState } from "react";
import "./backbutton.css";
import { useRouter } from "next/navigation";
import { TiArrowBack } from "react-icons/ti";

const BackButton = () => {
  const router = useRouter();
  const [hasHistory, setHasHistory] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      setHasHistory(true);
    }
  }, []);

  const handleBackClick = () => {
    router.back();
  };

  if (!hasHistory) {
    return null;
  }

  return (
    <div className="backbutton">
      <span onClick={handleBackClick}>
        <TiArrowBack className="me-2" />
        back
      </span>
    </div>
  );
};

export default BackButton;
