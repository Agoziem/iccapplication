"use client";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import React, { useState } from "react";
import ProfileCard from "@/components/features/Profile/ProfileCard";

interface AlertState {
  show: boolean;
  type: "success" | "danger" | "info" | "warning";
  message: string;
}

const ProfilePage = () => {
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });
  return (
    <div style={{ minHeight: "100vh" }}>
      <PageTitle pathname="Profile" />
      <ProfileCard alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default ProfilePage;
