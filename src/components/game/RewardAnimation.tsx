import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RewardRecord } from '@/services/rewardService';
import './RewardAnimation.css';

export interface RewardAnimationProps {
  rewards: RewardRecord[];
}

const RewardAnimation: React.FC<RewardAnimationProps> = ({ rewards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReward, setShowReward] = useState(true);

  useEffect(() => {
    if (currentIndex < rewards.length - 1) {
      const timer = setTimeout(() => {
        setShowReward(false);
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setShowReward(true);
        }, 500);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, rewards.length]);

  if (!rewards || rewards.length === 0) {
    return null;
  }

  const currentReward = rewards[currentIndex];

  return (
    <div className="reward-animation-container">
      <AnimatePresence mode="wait">
        {showReward && (
          <motion.div
            key={currentIndex}
            className="reward-item"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="reward-icon">
              {currentReward.type === RewardType.EXPERIENCE && '✨'}
              {currentReward.type === 'bamboo' && '🎋'}
              {currentReward.type === 'tea' && '🍵'}
              {currentReward.type === RewardType.ITEM && '🎁'}
            </div>
            <h3 className="reward-title">{currentReward.name}</h3>
            <p className="reward-amount">
              {currentReward.amount > 0 && `+${currentReward.amount}`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="reward-progress">
        {rewards.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'completed' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RewardAnimation;
