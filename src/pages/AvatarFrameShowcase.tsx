// src/pages/AvatarFrameShowcase.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AvatarFrame from '@/components/profile/AvatarFrame';
import PageTransition from '@/components/animation/PageTransition';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import type { AvatarFrameShowcaseLabelsBundle } from '@/types';
import { AvatarFrameType } from '@/types';
import { fetchAvatarFrameShowcaseView } from '@/services';

/**
 * Avatar Frame Showcase Page
 * Displays different types of avatar frames
 */
const AvatarFrameShowcase: React.FC = () => {
  const [selectedFrameType, setSelectedFrameType] = useState<AvatarFrameType>(AvatarFrameType.BASIC);
  const [animated, setAnimated] = useState<boolean>(true);
  const [showVipBadge, setShowVipBadge] = useState<boolean>(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState<boolean>(false);
  
  // Get localized labels
  const { labels, isLoading, error } = useLocalizedView<null, AvatarFrameShowcaseLabelsBundle>(
    'avatarFrameShowcaseView',
    fetchAvatarFrameShowcaseView
  );
  
  // Default labels
  const pageTitle = labels?.pageTitle || 'Avatar Frame Showcase';
  const pageDescription = labels?.pageDescription || 'Explore different avatar frames available in PandaHabit';
  const animationToggleLabel = labels?.animationToggleLabel || 'Enable Animation';
  const vipBadgeToggleLabel = labels?.vipBadgeToggleLabel || 'Show VIP Badge';
  const onlineStatusToggleLabel = labels?.onlineStatusToggleLabel || 'Show Online Status';
  const frameTypeSectionTitle = labels?.frameTypeSectionTitle || 'Frame Types';
  const frameDescriptionSectionTitle = labels?.frameDescriptionSectionTitle || 'Frame Description';
  
  // Default frame type labels
  const frameTypeLabels = {
    [AvatarFrameType.NONE]: labels?.frameTypeLabels?.[AvatarFrameType.NONE] || 'No Frame',
    [AvatarFrameType.BASIC]: labels?.frameTypeLabels?.[AvatarFrameType.BASIC] || 'Basic Frame',
    [AvatarFrameType.BRONZE]: labels?.frameTypeLabels?.[AvatarFrameType.BRONZE] || 'Bronze Frame',
    [AvatarFrameType.SILVER]: labels?.frameTypeLabels?.[AvatarFrameType.SILVER] || 'Silver Frame',
    [AvatarFrameType.GOLD]: labels?.frameTypeLabels?.[AvatarFrameType.GOLD] || 'Gold Frame',
    [AvatarFrameType.JADE]: labels?.frameTypeLabels?.[AvatarFrameType.JADE] || 'Jade Frame (VIP)',
    [AvatarFrameType.BAMBOO]: labels?.frameTypeLabels?.[AvatarFrameType.BAMBOO] || 'Bamboo Frame (VIP)',
    [AvatarFrameType.DRAGON]: labels?.frameTypeLabels?.[AvatarFrameType.DRAGON] || 'Dragon Frame (VIP)',
    [AvatarFrameType.PHOENIX]: labels?.frameTypeLabels?.[AvatarFrameType.PHOENIX] || 'Phoenix Frame (VIP)',
    [AvatarFrameType.CUSTOM]: labels?.frameTypeLabels?.[AvatarFrameType.CUSTOM] || 'Custom Frame'
  };
  
  // Default frame descriptions
  const frameDescriptions = {
    [AvatarFrameType.NONE]: labels?.frameDescriptions?.[AvatarFrameType.NONE] || 'No frame, just the avatar image.',
    [AvatarFrameType.BASIC]: labels?.frameDescriptions?.[AvatarFrameType.BASIC] || 'A simple frame available to all users.',
    [AvatarFrameType.BRONZE]: labels?.frameDescriptions?.[AvatarFrameType.BRONZE] || 'A bronze frame for active users who have completed at least 10 tasks.',
    [AvatarFrameType.SILVER]: labels?.frameDescriptions?.[AvatarFrameType.SILVER] || 'A silver frame for dedicated users who have been using the app for at least 30 days.',
    [AvatarFrameType.GOLD]: labels?.frameDescriptions?.[AvatarFrameType.GOLD] || 'A gold frame for premium users who have purchased any premium feature.',
    [AvatarFrameType.JADE]: labels?.frameDescriptions?.[AvatarFrameType.JADE] || 'A jade frame exclusive to VIP users. Features a rotating animation with jade particles.',
    [AvatarFrameType.BAMBOO]: labels?.frameDescriptions?.[AvatarFrameType.BAMBOO] || 'A bamboo frame exclusive to VIP users. Features a pulsing animation with bamboo particles.',
    [AvatarFrameType.DRAGON]: labels?.frameDescriptions?.[AvatarFrameType.DRAGON] || 'A dragon frame exclusive to VIP users. Features a color-shifting animation with dragon particles.',
    [AvatarFrameType.PHOENIX]: labels?.frameDescriptions?.[AvatarFrameType.PHOENIX] || 'A phoenix frame exclusive to VIP users. Features a glowing animation with phoenix particles.',
    [AvatarFrameType.CUSTOM]: labels?.frameDescriptions?.[AvatarFrameType.CUSTOM] || 'A custom frame that can be used for special events or promotions.'
  };
  
  // All frame types
  const frameTypes = [
    AvatarFrameType.NONE,
    AvatarFrameType.BASIC,
    AvatarFrameType.BRONZE,
    AvatarFrameType.SILVER,
    AvatarFrameType.GOLD,
    AvatarFrameType.JADE,
    AvatarFrameType.BAMBOO,
    AvatarFrameType.DRAGON,
    AvatarFrameType.PHOENIX
  ];
  
  // Sample avatar URL
  const avatarUrl = 'https://api.dicebear.com/7.x/bottts/svg?seed=panda';
  
  return (
    <PageTransition>
      <div className="avatar-frame-showcase">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {pageTitle}
        </motion.h1>
        
        <motion.p
          className="page-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {pageDescription}
        </motion.p>
        
        <div className="showcase-container">
          <motion.div
            className="showcase-main"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="avatar-preview">
              <AvatarFrame
                avatarUrl={avatarUrl}
                frameType={selectedFrameType}
                size={200}
                animated={animated}
                animationSpeed={1}
                showVipBadge={showVipBadge}
                showOnlineStatus={showOnlineStatus}
                isOnline={true}
              />
            </div>
            
            <div className="frame-controls">
              <div className="toggle-controls">
                <label className="toggle-control">
                  <input
                    type="checkbox"
                    checked={animated}
                    onChange={() => setAnimated(!animated)}
                  />
                  <span>{animationToggleLabel}</span>
                </label>
                
                <label className="toggle-control">
                  <input
                    type="checkbox"
                    checked={showVipBadge}
                    onChange={() => setShowVipBadge(!showVipBadge)}
                  />
                  <span>{vipBadgeToggleLabel}</span>
                </label>
                
                <label className="toggle-control">
                  <input
                    type="checkbox"
                    checked={showOnlineStatus}
                    onChange={() => setShowOnlineStatus(!showOnlineStatus)}
                  />
                  <span>{onlineStatusToggleLabel}</span>
                </label>
              </div>
              
              <div className="frame-description">
                <h3>{frameDescriptionSectionTitle}</h3>
                <p>{frameDescriptions[selectedFrameType]}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="frame-types"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3>{frameTypeSectionTitle}</h3>
            
            <div className="frame-type-grid">
              {frameTypes.map((frameType) => (
                <div
                  key={frameType}
                  className={`frame-type-item ${frameType === selectedFrameType ? 'selected' : ''}`}
                  onClick={() => setSelectedFrameType(frameType)}
                >
                  <AvatarFrame
                    avatarUrl={avatarUrl}
                    frameType={frameType}
                    size={80}
                    animated={animated && frameType === selectedFrameType}
                    showVipBadge={showVipBadge && [
                      AvatarFrameType.JADE,
                      AvatarFrameType.BAMBOO,
                      AvatarFrameType.DRAGON,
                      AvatarFrameType.PHOENIX
                    ].includes(frameType)}
                  />
                  <span className="frame-type-label">{frameTypeLabels[frameType]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AvatarFrameShowcase;
