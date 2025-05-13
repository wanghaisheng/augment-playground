// src/features/home/WelcomeSection.tsx
import React from 'react';
import type { HomeWelcomeSectionLabels } from '@/types';

interface WelcomeSectionProps {
  labels: HomeWelcomeSectionLabels | undefined;
  username: string | undefined;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ labels, username }) => {
  if (!labels || username === undefined) {
    return <p className="loading-text" style={{ fontStyle: 'italic' }}>Initializing welcome message...</p>;
  }
  const welcomeText = labels.welcomeMessage.replace('{user}', username);
  return <p>{welcomeText}</p>;
};
export default WelcomeSection; 