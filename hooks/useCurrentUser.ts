"use client";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAdminContext } from "@/data/payments/Admincontextdata";

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState({});
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
