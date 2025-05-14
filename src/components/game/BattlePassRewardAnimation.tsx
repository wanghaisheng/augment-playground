// src/components/game/BattlePassRewardAnimation.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * Interface for a reward item
 */
export interface RewardItem {
  /** Reward name */
  name: string;
  /** Reward icon */
  icon?: string;
  /** Reward quantity */
  quantity: number;
  /** Reward rarity */
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  /** Reward description */
  description?: string;
}

/**
 * Props for the BattlePassRewardAnimation component
 */
export interface BattlePassRewardAnimationProps {
  /** Reward to animate */
  reward: RewardItem;
  /** Whether the animation is visible */
  isVisible: boolean;
  /** Callback function when the animation is closed */
  onClose: () => void;
  /** Whether to play sound effects */
  playSoundEffects?: boolean;
  /** Localized labels for the component */
  labels: {
    /** Title for the reward */
    rewardTitle?: string;
    /** Label for the close button */
    closeButtonLabel?: string;
    /** Label for the claim button */
    claimButtonLabel?: string;
    /** Label for the rarity */
    rarityLabel?: string;
    /** Labels for rarity levels */
    rarityLabels?: {
      common?: string;
      uncommon?: string;
      rare?: string;
      epic?: string;
      legendary?: string;
    };
  };
}

/**
 * Battle Pass Reward Animation Component
 * Displays an animated preview of a reward when it's claimed
 */
const BattlePassRewardAnimation: React.FC<BattlePassRewardAnimationProps> = ({
  reward,
  isVisible,
  onClose,
  playSoundEffects = true,
  labels
}) => {
  const [animationStage, setAnimationStage] = useState<'initial' | 'reveal' | 'details'>('initial');
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstanceRef = useRef<any>(null);

  // Default labels
  const rewardTitle = labels.rewardTitle || 'Reward Unlocked!';
  const closeButtonLabel = labels.closeButtonLabel || 'Close';
  const claimButtonLabel = labels.claimButtonLabel || 'Claim';
  const rarityLabel = labels.rarityLabel || 'Rarity';
  
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

  // Get confetti colors based on rarity
  const getConfettiColors = (rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary') => {
    switch (rarity) {
      case 'common': return ['#9e9e9e', '#bdbdbd', '#e0e0e0'];
      case 'uncommon': return ['#4caf50', '#8bc34a', '#a5d6a7'];
      case 'rare': return ['#2196f3', '#03a9f4', '#90caf9'];
      case 'epic': return ['#9c27b0', '#e1bee7', '#ce93d8'];
      case 'legendary': return ['#ff9800', '#ffc107', '#ffecb3', '#ffd700'];
      default: return ['#9e9e9e', '#bdbdbd', '#e0e0e0'];
    }
  };

  // Play sound effect
  const playSoundEffect = (type: 'reveal' | 'claim') => {
    if (!playSoundEffects) return;
    
    // In a real app, you would play a sound effect here
    console.log(`Playing ${type} sound effect`);
  };

  // Initialize animation
  useEffect(() => {
    if (isVisible) {
      setAnimationStage('initial');
      
      // Start reveal animation after a short delay
      const timer = setTimeout(() => {
        setAnimationStage('reveal');
        playSoundEffect('reveal');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, playSoundEffects]);

  // Handle confetti animation
  useEffect(() => {
    if (animationStage === 'reveal' && confettiCanvasRef.current) {
      const canvas = confettiCanvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create confetti instance
        confettiInstanceRef.current = confetti.create(canvas, {
          resize: true,
          useWorker: true
        });
        
        // Launch confetti
        const colors = getConfettiColors(reward.rarity);
        confettiInstanceRef.current({
          particleCount: reward.rarity === 'legendary' ? 200 : 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors,
          shapes: ['circle', 'square'],
          ticks: 200,
          gravity: 1.2,
          scalar: 1.2,
          disableForReducedMotion: true
        });
        
        // Move to details stage after confetti
        const timer = setTimeout(() => {
          setAnimationStage('details');
        }, 2000);
        
        return () => {
          clearTimeout(timer);
          if (confettiInstanceRef.current) {
            confettiInstanceRef.current.reset();
          }
        };
      }
    }
  }, [animationStage, reward.rarity]);

  // Handle claim button click
  const handleClaim = () => {
    playSoundEffect('claim');
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="reward-animation-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`reward-animation-container ${reward.rarity}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <canvas
              ref={confettiCanvasRef}
              className="confetti-canvas"
              width={500}
              height={500}
            />
            
            <div className="reward-animation-content">
              <motion.h2
                className="reward-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {rewardTitle}
              </motion.h2>
              
              <div className="reward-box-container">
                <motion.div
                  className={`reward-box ${reward.rarity}`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={animationStage === 'initial' ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="reward-box-lid">
                    <div className="reward-box-lid-top"></div>
                    <div className="reward-box-lid-front"></div>
                  </div>
                  <div className="reward-box-base">
                    <div className="reward-box-base-front"></div>
                    <div className="reward-box-base-bottom"></div>
                    <div className="reward-box-base-left"></div>
                    <div className="reward-box-base-right"></div>
                    <div className="reward-box-base-back"></div>
                  </div>
                </motion.div>
                
                <AnimatePresence>
                  {animationStage === 'reveal' && (
                    <motion.div
                      className="reward-reveal"
                      initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ 
                        type: 'spring',
                        stiffness: 300,
                        damping: 15
                      }}
                    >
                      <div 
                        className="reward-icon"
                        style={{ background: getRarityGradient(reward.rarity) }}
                      >
                        {reward.icon || '🎁'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {animationStage === 'details' && (
                    <motion.div
                      className="reward-details"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div 
                        className="reward-icon-details"
                        style={{ background: getRarityGradient(reward.rarity) }}
                      >
                        {reward.icon || '🎁'}
                      </div>
                      
                      <h3 className="reward-name">
                        {reward.name}
                        {reward.quantity > 1 && ` x${reward.quantity}`}
                      </h3>
                      
                      {reward.description && (
                        <p className="reward-description">{reward.description}</p>
                      )}
                      
                      <div className="reward-rarity">
                        <span className="rarity-label">{rarityLabel}:</span>
                        <span 
                          className="rarity-value"
                          style={{ color: getRarityColor(reward.rarity) }}
                        >
                          {rarityLabels[reward.rarity]}
                        </span>
                      </div>
                      
                      <button
                        className="claim-button imperial-button"
                        onClick={handleClaim}
                      >
                        {claimButtonLabel}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button
                className="close-animation-button"
                onClick={onClose}
              >
                {closeButtonLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BattlePassRewardAnimation;
