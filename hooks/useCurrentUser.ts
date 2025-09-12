"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { User } from "@/types/users";
import { useMyProfile } from "@/data/hooks/user.hooks";

const useCurrentUser = () => {
  const { data: currentUser } = useMyProfile();
  const [currentRoot, setCurrentRoot] = useState("");
  const paths = usePathname();
  const currentPortal = paths;

  useEffect(() => {
    if (currentPortal.includes("/admin")) {
      setCurrentRoot("admin");
    } else if (currentPortal.includes("/dashboard")) {
      setCurrentRoot("dashboard");
    } else {
      setCurrentRoot("");
    }
  }, [currentPortal]);

  return { currentUser, currentRoot };
};

export default useCurrentUser;
