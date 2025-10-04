"use client";
import React, { useContext, useRef, useState, useCallback, memo } from "react";
import "./sideBar.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useClickOutside from "@/hooks/useClickOutside";
import { RefContext } from "./sideBarTogglerContext";
import Modal from "../../custom/Modal/modal";
import { logoutUser, useMyProfile } from "@/data/hooks/user.hooks";
import toast from "react-hot-toast";
import { QueryClient } from "react-query";

interface NavItem {
  _id: string;
  name: string;
  link: string;
  icon: string;
  content?: NavItem[];
}

interface SideBarProps {
  navList: NavItem[];
}

const SideBar: React.FC<SideBarProps> = memo(({ navList }) => {
  const paths = usePathname();
  const router = useRouter();
  const sidebarref = useRef<HTMLElement>(null);
  const sidebartoggleref = useContext(RefContext);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { data: user } = useMyProfile();
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const queryClient = new QueryClient();

  // Memoized logout function
  const logoutDashboard = useCallback(async () => {
    setLoggingOut(true);
    setShowModal(false);
    try {
      await logoutUser();
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/accounts/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  }, [router]);

  // Handle Sidebar close
  const handleSidebarClose = useCallback(() => {
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const lgBreakpoint = 992;

    if (
      windowWidth < lgBreakpoint &&
      typeof document !== "undefined" &&
      document.body.classList.contains("toggle-sidebar")
    ) {
      document.body.classList.remove("toggle-sidebar");
    }
  }, []);

  // Handle navigation for mobile
  const handleMobileNavigation = useCallback((link: string, hasContent: boolean = false) => {
    if (!hasContent) {
      router.push(link);
      handleSidebarClose();
    }
  }, [router, handleSidebarClose]);

  // Filter navigation items based on user permissions
  const filteredNavList = React.useMemo(() => {
    return navList?.filter((navGroup) => {
      if (user?.is_staff) {
        return true; // Keep all navGroups for staff users
      } else {
        // Exclude specific navGroups for non-staff users
        return !["Payments", "Customers", "Configurations"].includes(navGroup.name);
      }
    });
  }, [navList, user?.is_staff]);

  useClickOutside(sidebarref, sidebartoggleref, handleSidebarClose);

  // Render navigation item
  const renderNavItem = useCallback((navGroup: NavItem, isMobile: boolean = false) => (
    <li className="nav-item" key={navGroup._id}>
      <Link
        className={`nav-link ${paths === navGroup.link ? "active" : ""} ${
          navGroup.content && navGroup.content.length > 0 ? "collapsed" : ""
        }`}
        href={navGroup.link}
        data-bs-toggle={
          navGroup.content && navGroup.content.length > 0 ? "collapse" : ""
        }
        data-bs-target={`#${navGroup.name}`}
        {...(isMobile && {
          onClick: (e) => {
            if (navGroup.name === "Logout") {
              e.preventDefault();
              setShowModal(true);
              return;
            }
            handleMobileNavigation(navGroup.link, navGroup.content && navGroup.content.length > 0);
          },
        })}
        {...(!isMobile && navGroup.name === "Logout" && {
          onClick: (e) => {
            e.preventDefault();
            setShowModal(true);
          },
        })}
      >
        <i className={navGroup.icon}></i>
        <span>{navGroup.name}</span>
        {navGroup.content && navGroup.content.length > 0 && (
          <i className="bi bi-chevron-down ms-auto"></i>
        )}
      </Link>
      {navGroup.content && navGroup.content.length > 0 && (
        <ul
          id={navGroup.name}
          className="nav-content collapse"
          data-bs-parent="#sidebar-nav"
        >
          {navGroup.content.map((subNav) => (
            <li key={subNav._id}>
              <Link
                className={`nav-link ${paths === subNav.link ? "active" : ""}`}
                href={isMobile ? "#" : subNav.link}
                {...(isMobile && {
                  onClick: (e) => {
                    e.preventDefault();
                    router.push(subNav.link);
                    handleSidebarClose();
                  },
                })}
              >
                <i className={subNav.icon}></i>
                <span>{subNav.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  ), [paths, router, handleSidebarClose, handleMobileNavigation]);

  return (
    <>
      {/* Side bar for Large Screen */}
      <aside className="sidebar d-none d-md-block">
        <ul className="sidebar-nav" id="sidebar-nav">
          {filteredNavList?.map((navGroup) => renderNavItem(navGroup, false))}
        </ul>
      </aside>

      {/* Side bar for Small Screen */}
      <aside className="sidebar d-block d-md-none" ref={sidebarref}>
        <ul className="sidebar-nav" id="sidebar-nav">
          {filteredNavList?.map((navGroup) => renderNavItem(navGroup, true))}
        </ul>
      </aside>

      {/* Modal for logout */}
      <Modal showmodal={showModal} toggleModal={() => setShowModal(false)}>
        <div className="modal-body">
          <p className="text-center">Are you sure you want to logout?</p>
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-primary me-3"
              onClick={logoutDashboard}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">logging out</span>
                </div>
              ) : (
                "Yes"
              )}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
});

SideBar.displayName = 'SideBar';

export default SideBar;
