'use client';
import React, { memo } from 'react';
import './header.css';
import Logo from './Logo';
// import SearchBar from './Searchbar/SearchBar';
import Nav from './Nav/Nav';

interface HeaderProps {
  portalname?: string;
  portallink?: string;
}

const Header: React.FC<HeaderProps> = memo(({ portalname, portallink }) => {
  return (
    <header id="header" className="dashboardheader fixed-top d-flex align-items-center">
      <Logo portalname={portalname} portallink={portallink} />
      {/* <SearchBar /> */}
      <Nav />
    </header>
  );
});
Header.displayName = 'Header';

export default Header;
