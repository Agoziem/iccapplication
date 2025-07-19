'use client';
import React from 'react';
import './header.css';
import Logo from './Logo';
import Nav from './Nav/Nav';

interface HeaderProps {
  portalname: string;
  portallink: string;
}

const Header: React.FC<HeaderProps> = ({ portalname, portallink }) => {
  return (
    <header id="header" className="dashboardheader fixed-top d-flex align-items-center">
      <Logo portalname={portalname} portallink={portallink} />
      <Nav />
    </header>
  );
};

export default Header;
