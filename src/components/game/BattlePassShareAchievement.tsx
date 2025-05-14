// src/components/game/BattlePassShareAchievement.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

/**
 * Interface for an achievement to share
 */
export interface ShareableAchievement {
  /** Achievement ID */
  id: string;
  /** Achievement name */
  name: string;
  /** Achievement description */
  description: string;
  /** Achievement icon */
  icon?: string;
  /** Achievement rarity */
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  /** Date when the achievement was unlocked */
  unlockedAt: string;
  /** User name */
  userName: string;
  /** User level */
  userLevel: number;
  /** Season name */
  seasonName: string;
}

/**
 * Props for the BattlePassShareAchievement component
 */
export interface BattlePassShareAchievementProps {
  /** Achievement to share */
  achievement: ShareableAchievement;
  /** Whether the share modal is visible */
  isVisible: boolean;
  /** Callback function when the modal is closed */
  onClose: () => void;
  /** Callback function when the achievement is shared */
  onShare?: (platform: 'twitter' | 'facebook' | 'instagram' | 'copy') => void;
  /** Localized labels for the component */
  labels: {
    /** Title for the share modal */
    shareTitle?: string;
    /** Label for the close button */
    closeButtonLabel?: string;
    /** Label for the download button */
    downloadButtonLabel?: string;
    /** Label for the copy button */
    copyButtonLabel?: string;
    /** Label for the Twitter button */
    twitterButtonLabel?: string;
    /** Label for the Facebook button */
    facebookButtonLabel?: string;
    /** Label for the Instagram button */
    instagramButtonLabel?: string;
    /** Label for the achievement unlocked text */
    achievementUnlockedLabel?: string;
    /** Label for the season text */
    seasonLabel?: string;
    /** Label for the level text */
    levelLabel?: string;
    /** Label for the rarity text */
    rarityLabel?: string;
    /** Labels for rarity levels */
    rarityLabels?: {
      common?: string;
      uncommon?: string;
      rare?: string;
      epic?: string;
      legendary?: string;
    };
    /** Label for the copied text */
    copiedLabel?: string;
  };
}

/**
 * Battle Pass Share Achievement Component
 * Allows users to share their achievements on social media
 */
const BattlePassShareAchievement: React.FC<BattlePassShareAchievementProps> = ({
  achievement,
  isVisible,
  onClose,
  onShare,
  labels
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Default labels
  const shareTitle = labels.shareTitle || 'Share Achievement';
  const closeButtonLabel = labels.closeButtonLabel || 'Close';
  const downloadButtonLabel = labels.downloadButtonLabel || 'Download';
  const copyButtonLabel = labels.copyButtonLabel || 'Copy';
  const twitterButtonLabel = labels.twitterButtonLabel || 'Twitter';
  const facebookButtonLabel = labels.facebookButtonLabel || 'Facebook';
  const instagramButtonLabel = labels.instagramButtonLabel || 'Instagram';
  const achievementUnlockedLabel = labels.achievementUnlockedLabel || 'Achievement Unlocked!';
  const seasonLabel = labels.seasonLabel || 'Season';
  const levelLabel = labels.levelLabel || 'Level';
  const rarityLabel = labels.rarityLabel || 'Rarity';
  const copiedLabel = labels.copiedLabel || 'Copied!';
  
  // Default rarity labels
  const rarityLabels = {
    common: labels.rarityLabels?.common || 'Common',
    uncommon: labels.rarityLabels?.uncommon || 'Uncommon',
    rare: labels.rarityLabels?.rare || 'Rare',
    epic: labels.rarityLabels?.epic || 'Epic',
    legendary: labels.rarityLabels?.legendary || 'Legendary'
  };

  // Get rarity color
  const getRarityColor = (rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary') => {
    switch (rarity) {
      case 'common': return '#9e9e9e';
      case 'uncommon': return '#4caf50';
      case 'rare': return '#2196f3';
      case 'epic': return '#9c27b0';
      case 'legendary': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  // Get rarity gradient
  const getRarityGradient = (rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary') => {
    switch (rarity) {
      case 'common': return 'linear-gradient(145deg, #9e9e9e, #bdbdbd)';
      case 'uncommon': return 'linear-gradient(145deg, #4caf50, #8bc34a)';
      case 'rare': return 'linear-gradient(145deg, #2196f3, #03a9f4)';
      case 'epic': return 'linear-gradient(145deg, #9c27b0, #e1bee7)';
      case 'legendary': return 'linear-gradient(145deg, #ff9800, #ffc107)';
      default: return 'linear-gradient(145deg, #9e9e9e, #bdbdbd)';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle download
  const handleDownload = async () => {
    if (!shareCardRef.current) return;
    
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: null,
        scale: 2
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `achievement-${achievement.id}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to download achievement card:', error);
    }
  };

  // Handle copy
  const handleCopy = async () => {
    if (!shareCardRef.current) return;
    
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: null,
        scale: 2
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      // In a real app, you would use the Clipboard API to copy the image
      // For now, we'll just simulate it
      console.log('Copying image to clipboard:', dataUrl.substring(0, 50) + '...');
      
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      if (onShare) {
        onShare('copy');
      }
    } catch (error) {
      console.error('Failed to copy achievement card:', error);
    }
  };

  // Handle share
  const handleShare = (platform: 'twitter' | 'facebook' | 'instagram') => {
    if (onShare) {
      onShare(platform);
    }
    
    // In a real app, you would implement sharing to social media platforms
    console.log(`Sharing to ${platform}`);
    
    // For demonstration purposes, we'll just open a new window
    const shareText = `I just unlocked the "${achievement.name}" achievement in PandaHabit Battle Pass! #PandaHabit #BattlePass`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't have a direct sharing API, so we'll just show a message
        alert('To share on Instagram, please download the image and upload it to your Instagram account.');
        break;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="share-achievement-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="share-achievement-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="share-achievement-header">
              <h2>{shareTitle}</h2>
              <button
                className="close-button"
                onClick={onClose}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="share-achievement-content">
              <div 
                ref={shareCardRef}
                className={`achievement-share-card ${achievement.rarity}`}
              >
                <div className="achievement-share-header">
                  <div className="app-logo">PandaHabit</div>
                  <div className="achievement-unlocked-text">{achievementUnlockedLabel}</div>
                </div>
                
                <div 
                  className="achievement-share-icon"
                  style={{ background: getRarityGradient(achievement.rarity) }}
                >
                  {achievement.icon || '🏆'}
                </div>
                
                <h3 className="achievement-share-name">{achievement.name}</h3>
                <p className="achievement-share-description">{achievement.description}</p>
                
                <div className="achievement-share-details">
                  <div className="detail-item">
                    <span className="detail-label">{seasonLabel}</span>
                    <span className="detail-value">{achievement.seasonName}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">{levelLabel}</span>
                    <span className="detail-value">{achievement.userLevel}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">{rarityLabel}</span>
                    <span 
                      className="detail-value rarity"
                      style={{ color: getRarityColor(achievement.rarity) }}
                    >
                      {rarityLabels[achievement.rarity]}
                    </span>
                  </div>
                </div>
                
                <div className="achievement-share-footer">
                  <div className="user-name">{achievement.userName}</div>
                  <div className="unlock-date">{formatDate(achievement.unlockedAt)}</div>
                </div>
              </div>
              
              <div className="share-actions">
                <button
                  className="download-button jade-button"
                  onClick={handleDownload}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
                    <path d="M4 16L4 17C4 18.6569 5.34315 20 7 20L17 20C18.6569 20 20 18.6569 20 17L20 16M16 12L12 16M12 16L8 12M12 16L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {downloadButtonLabel}
                </button>
                
                <button
                  className="copy-button jade-button"
                  onClick={handleCopy}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
                    <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17M8 5C8 6.10457 8.89543 7 10 7H14C15.1046 7 16 6.10457 16 5M8 5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5M16 5H18C19.1046 5 20 5.89543 20 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isCopied ? copiedLabel : copyButtonLabel}
                </button>
                
                <div className="social-buttons">
                  <button
                    className="twitter-button social-button"
                    onClick={() => handleShare('twitter')}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                    {twitterButtonLabel}
                  </button>
                  
                  <button
                    className="facebook-button social-button"
                    onClick={() => handleShare('facebook')}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
                    </svg>
                    {facebookButtonLabel}
                  </button>
                  
                  <button
                    className="instagram-button social-button"
                    onClick={() => handleShare('instagram')}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.041 0 2.67.01 2.986.058 4.04.045.977.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041 0-2.67-.01-2.986-.058-4.04-.045-.977-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.041-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                    </svg>
                    {instagramButtonLabel}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BattlePassShareAchievement;
