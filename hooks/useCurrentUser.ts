"use client";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAdminContext } from "@/data/payments/Admincontextdata";
import { User } from "@/types/users";

interface UseCurrentUserReturn {
  currentUser: User | null;
  currentRoot: string;
}

type Portal = "admin" | "dashboard" | "";

const useCurrentUser = (): UseCurrentUserReturn => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoot, setCurrentRoot] = useState<Portal>("");
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
