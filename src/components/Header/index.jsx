import React from 'react';
import {
  Nav, NavVariants, NavItem, NavList, PageHeader,
} from '@patternfly/react-core';

/**
 * Page header, includes top nav
 * @param {Object} props
 * @param {string} props.currentViewId
 * @param {() => void} props.onNavSelect
 */
const Header = ({ currentViewId, onNavSelect }) => {
  /** Wrapper for NavItem */
  const HeaderNavItem = ({ children, viewId }) => (
    <NavItem itemId={viewId} isActive={currentViewId === viewId}>
      {children}
    </NavItem>
  );

  const nav = (
    <Nav onSelect={onNavSelect}>
      <NavList variant={NavVariants.horizontal}>
        <HeaderNavItem viewId="welcome">Welcome</HeaderNavItem>
        <HeaderNavItem viewId="classification">Fire Hazard Classification</HeaderNavItem>
        <HeaderNavItem viewId="notification">Active Fire Notification</HeaderNavItem>
      </NavList>
    </Nav>
  );

  return (
    <PageHeader topNav={nav} />
  );
};

export default Header;
