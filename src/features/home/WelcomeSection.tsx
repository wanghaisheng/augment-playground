// src/features/home/WelcomeSection.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { HomeWelcomeSectionLabels } from '@/types';
import UserTitle from '@/components/profile/UserTitle';
import Button from '@/components/common/Button';
import UserTitleSelector from '@/components/profile/UserTitleSelector';
import { playSound, SoundType } from '@/utils/sound';

interface WelcomeSectionProps {
  labels: HomeWelcomeSectionLabels | undefined;
  username: string | undefined;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ labels, username }) => {
  const [showTitleSelector, setShowTitleSelector] = useState(false);

  if (!labels || username === undefined) {
    return <p className="loading-text" style={{ fontStyle: 'italic' }}>Initializing welcome message...</p>;
  }

  const welcomeText = labels?.welcomeMessage?.replace('{user}', username) || `Welcome, ${username}! (Default)`;

  const handleOpenTitleSelector = () => {
    playSound(SoundType.BUTTON_CLICK);
    setShowTitleSelector(true);
  };

  const handleCloseTitleSelector = () => {
    setShowTitleSelector(false);
  };

  return (
    <div className="welcome-section">
      <div className="flex items-center flex-wrap gap-2 mb-2">
        <p className="text-lg">{welcomeText}</p>
        <UserTitle userId="current-user" size="medium" />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="text"
            size="small"
            onClick={handleOpenTitleSelector}
            className="ml-2 text-jade-600"
          >
            {labels.changeTitleText || '更换称号'}
          </Button>
        </motion.div>
      </div>

      {/* 称号选择器 */}
      <UserTitleSelector
        userId="current-user"
        isOpen={showTitleSelector}
        onClose={handleCloseTitleSelector}
      />
    </div>
  );
};
export default WelcomeSection;