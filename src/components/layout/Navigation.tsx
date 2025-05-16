// src/components/layout/Navigation.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import type { GlobalLayoutLabelsBundle } from '@/types';
import { usePandaState } from '@/context/PandaStateProvider';

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
  const navTasksText = labels?.navTasks || "Tasks";
  const navAbilitiesText = labels?.navAbilities || "Abilities";
  const navChallengesText = labels?.navChallenges || "Challenges";
  const navRewardsText = labels?.navRewards || "Rewards";
  const navTeaRoomText = labels?.navTeaRoom || "Tea Room";
  const navStoreText = labels?.navStore || "Store";
  const navVipText = labels?.navVip || "VIP";
  const navBattlePassText = labels?.navBattlePass || "Battle Pass";
  const navCustomGoalsText = labels?.navCustomGoals || "Custom Goals";
  const navSocialText = labels?.navSocial || "Social";
  const navAvatarFramesText = labels?.navAvatarFrames || "Avatar Frames";
  const navBambooPlantingText = labels?.navBambooPlanting || "Bamboo Planting";
  const navBambooTradingText = labels?.navBambooTrading || "Bamboo Trading";
  const navBambooDashboardText = labels?.navBambooDashboard || "Bamboo Dashboard";
  const navSettingsText = labels?.navSettings || "Settings";

  if (!labels) { // Can show a minimal loading state or just render with fallbacks
    return <nav className={variant === 'bamboo' ? 'bamboo-nav' : ''}>Loading navigation...</nav>;
  }

  const { pandaState } = usePandaState();
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
        to="/tasks"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navTasksText}
      </NavLink>
      <NavLink
        to="/abilities"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navAbilitiesText}
      </NavLink>
      <NavLink
        to="/challenges"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navChallengesText}
      </NavLink>
      <NavLink
        to="/rewards"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navRewardsText}
      </NavLink>
      <NavLink
        to="/tearoom"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navTeaRoomText}
      </NavLink>
      <NavLink
        to="/store"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navStoreText}
      </NavLink>
      <NavLink
        to="/vip-benefits"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        <div className="nav-item-with-badge">
          {navVipText}
          {pandaState?.isVip && <span className="nav-vip-badge">VIP</span>}
        </div>
      </NavLink>
      <NavLink
        to="/battle-pass"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navBattlePassText}
      </NavLink>
      <NavLink
        to="/custom-goals"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        <div className="nav-item-with-badge">
          {navCustomGoalsText}
          {pandaState?.isVip && <span className="nav-vip-badge">VIP</span>}
        </div>
      </NavLink>
      <NavLink
        to="/social"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        <div className="nav-item-with-badge">
          {navSocialText}
          {pandaState?.isVip && <span className="nav-vip-badge">VIP</span>}
        </div>
      </NavLink>
      <NavLink
        to="/avatar-frames"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navAvatarFramesText}
      </NavLink>
      <NavLink
        to="/bamboo-planting"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navBambooPlantingText}
      </NavLink>
      <NavLink
        to="/bamboo-trading"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navBambooTradingText}
      </NavLink>
      <NavLink
        to="/bamboo-dashboard"
        className={({isActive}) => isActive ? 'active' : ''}
      >
        {navBambooDashboardText}
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