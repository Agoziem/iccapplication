"use client";
import React, { useEffect, useState } from "react";
import "./backbutton.css";
import { useRouter } from "next/navigation";
import { TiArrowBack } from "react-icons/ti";

const BackButton = () => {
  const router = useRouter();
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    // Check if there is back history
    if (window.history.length > 1) {
      setHasHistory(true);
    }
  }, []);

  if (!hasHistory) {
    return null;
  }

  return (
    <div className="backbutton" >
      <span onClick={() => router.back()} >
        <TiArrowBack className="me-2" />
        back
      </span>
    </div>
  );
};

export default BackButton;
