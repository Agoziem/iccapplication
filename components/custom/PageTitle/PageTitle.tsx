"use client";
import './pageTitle.css';
import NextBreadcrumb from '../Breadcrumb/breadcrumb';
import BackButton from '../backbutton/BackButton';

function PageTitle({pathname}) {
  return (
    <div className="pagetitle">
      <h4>{pathname}</h4>
      <NextBreadcrumb capitalizeLinks />
      <BackButton />
    </div>
  );
}

export default PageTitle;
