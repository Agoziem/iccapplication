"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "./breadcrumb.css";

// Define the props interface for the component
interface NextBreadcrumbProps {
  capitalizeLinks?: boolean;
}
const NextBreadcrumb: React.FC<NextBreadcrumbProps> = ({
  capitalizeLinks = false,
}) => {
  const paths: string = usePathname();
  const pathNames: string[] = paths.split("/").filter((path: string) => path);

  return (
    <nav>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link href={"/"}>
            <i className="bi bi-house-door"></i>
          </Link>
        </li>
        {pathNames.map((link: string, index: number) => {
          const href: string = `/${pathNames.slice(0, index + 1).join("/")}`;
          const itemClasses: string =
            paths === href ? "breadcrumb-item active" : "breadcrumb-item";
          const itemLink: string = capitalizeLinks
            ? link[0].toUpperCase() + link.slice(1, link.length)
            : link;

          return (
            <React.Fragment key={index}>
              <li className={itemClasses}>
                <Link href={href}>{itemLink}</Link>
              </li>
              {/* {pathNames.length !== index + 1 && separator} */}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default NextBreadcrumb;
