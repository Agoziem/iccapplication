'use client';
import React from 'react';
import './header.css';
import Logo from './Logo';
// import SearchBar from './Searchbar/SearchBar';
import Nav from './Nav/Nav';

function Header({portalname, portallink}) {
  return (
    <header id="header" className="dashboardheader fixed-top d-flex align-items-center">
      <Logo portalname={portalname} portallink={portallink} />
      {/* <SearchBar /> */}
      <Nav />
    </header>
  );
}

export default Header;
