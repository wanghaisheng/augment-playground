// src/components/layout/Navigation.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import type { GlobalLayoutLabelsBundle } from '@/types';

interface NavigationProps {
  labels: GlobalLayoutLabelsBundle | undefined;
  variant?: 'default' | 'bamboo';
}

/**
 * Navigation component with support for game-themed style
 *
 * @param labels - Text labels for navigation items
 * @param variant - 'default' or 'bamboo' (game-themed)
 */
const Navigation: React.FC<NavigationProps> = ({
  labels,
  variant = 'bamboo' // Default to bamboo style for game theme
}) => {
  // Provide fallbacks for label properties
  const navHomeText = labels?.navHome || "Home";
  const navSettingsText = labels?.navSettings || "Settings";

  if (!labels) { // Can show a minimal loading state or just render with fallbacks
    return <nav className={variant === 'bamboo' ? 'bamboo-nav' : ''}>Loading navigation...</nav>;
  }

  const navClass = variant === 'bamboo' ? 'bamboo-nav' : '';

  return (
    <nav className={navClass}>
      <NavLink
        to="/"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navHomeText}
      </NavLink>
      <NavLink
        to="/settings"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navSettingsText}
      </NavLink>
    </nav>
  );
};

export default Navigation;