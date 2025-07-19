"use client";
import './pageTitle.css';
import NextBreadcrumb from '../Breadcrumb/breadcrumb';
import BackButton from '../backbutton/BackButton';

interface PageTitleProps {
  pathname: string;
}

function PageTitle({ pathname }: PageTitleProps) {
  return (
    <div className="pagetitle">
      <h4>{pathname}</h4>
      <NextBreadcrumb capitalizeLinks />
      <BackButton />
    </div>
  );
}

export default PageTitle;
