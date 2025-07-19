"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import './breadcrumb.css';

interface NextBreadcrumbProps {
  capitalizeLinks?: boolean;
}

const NextBreadcrumb = ({ capitalizeLinks }: NextBreadcrumbProps) => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter(path => path);

  return (
    <nav>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link href="/">
            <i className="bi bi-house-door"></i>
          </Link>
        </li>
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`;
          const itemClasses = paths === href ? 'breadcrumb-item active' : 'breadcrumb-item';
          const itemLink = capitalizeLinks 
            ? link[0].toUpperCase() + link.slice(1, link.length) 
            : link;
          
          return (
            <React.Fragment key={index}>
              <li className={itemClasses}>
                <Link href={href}>{itemLink}</Link>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default NextBreadcrumb;
