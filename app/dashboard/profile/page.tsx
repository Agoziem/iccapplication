"use client";
import PageTitle from "@/components/custom/PageTitle/PageTitle";
import React, { useState } from "react";
import ProfileForm from "@/components/features/Profile/ProfileForm";
import ProfileCard from "@/components/features/Profile/ProfileCard";

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  return (
    <div style={{minHeight:"100vh"}}>
      <PageTitle pathname="Profile" />
      {editMode ? (
        <ProfileForm setAlert={setAlert} setEditMode={setEditMode} />
      ) : (
        <ProfileCard alert={alert} setEditMode={setEditMode} />
      )}
    </div>
  );
};

export default ProfilePage;
