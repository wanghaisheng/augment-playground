// src/components/game/AbilityUnlockNotification.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PandaAbilityRecord } from '@/services/pandaAbilityService';
import ScrollDialog from './ScrollDialog';
import Button from '@/components/common/Button';

interface AbilityUnlockNotificationProps {
  newlyUnlockedAbilities: PandaAbilityRecord[];
  onClose: () => void;
}

/**
 * 熊猫能力解锁通知组件
 * 当新能力解锁时显示通知
 * 
 * @param newlyUnlockedAbilities - 新解锁的能力列表
 * @param onClose - 关闭通知的回调函数
 */
const AbilityUnlockNotification: React.FC<AbilityUnlockNotificationProps> = ({
  newlyUnlockedAbilities,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  
  // 当前显示的能力
  const currentAbility = newlyUnlockedAbilities[currentIndex];
  
  // 是否有能力可以显示
  const hasAbilities = newlyUnlockedAbilities.length > 0;
  
  // 是否有下一个能力
  const hasNextAbility = currentIndex < newlyUnlockedAbilities.length - 1;
  
  // 显示下一个能力
  const showNextAbility = () => {
    if (hasNextAbility) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowAll(true);
    }
  };
  
  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // 渲染单个能力解锁通知
  const renderSingleAbility = () => {
    if (!currentAbility) return null;
    
    return (
      <motion.div
        className="ability-unlock-single"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div className="ability-unlock-icon" variants={itemVariants}>
          <img 
            src={currentAbility.iconPath} 
            alt={currentAbility.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/assets/abilities/default-ability.svg';
            }}
          />
        </motion.div>
        
        <motion.h3 className="ability-unlock-title" variants={itemVariants}>
          解锁新能力！
        </motion.h3>
        
        <motion.h4 className="ability-unlock-name" variants={itemVariants}>
          {currentAbility.name}
        </motion.h4>
        
        <motion.p className="ability-unlock-description" variants={itemVariants}>
          {currentAbility.description}
        </motion.p>
        
        <motion.div className="ability-unlock-actions" variants={itemVariants}>
          {hasNextAbility ? (
            <Button variant="jade" onClick={showNextAbility}>
              下一个能力
            </Button>
          ) : (
            <Button variant="jade" onClick={() => setShowAll(true)}>
              查看所有能力
            </Button>
          )}
        </motion.div>
      </motion.div>
    );
  };
  
  // 渲染所有解锁的能力列表
  const renderAllAbilities = () => {
    return (
      <motion.div
        className="ability-unlock-all"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.h3 className="ability-unlock-title" variants={itemVariants}>
          新解锁的能力
        </motion.h3>
        
        <motion.div className="ability-unlock-list" variants={itemVariants}>
          {newlyUnlockedAbilities.map((ability, index) => (
            <div key={index} className="ability-unlock-item">
              <div className="ability-unlock-item-icon">
                <img 
                  src={ability.iconPath} 
                  alt={ability.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/assets/abilities/default-ability.svg';
                  }}
                />
              </div>
              <div className="ability-unlock-item-info">
                <h4 className="ability-unlock-item-name">{ability.name}</h4>
                <p className="ability-unlock-item-description">{ability.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
        
        <motion.div className="ability-unlock-actions" variants={itemVariants}>
          <Button variant="gold" onClick={onClose}>
            关闭
          </Button>
        </motion.div>
      </motion.div>
    );
  };
  
  // 如果没有能力，不显示通知
  if (!hasAbilities) {
    return null;
  }
  
  return (
    <ScrollDialog
      isOpen={true}
      onClose={onClose}
      title="能力解锁"
      closeOnOutsideClick={false}
      closeOnEsc={false}
      showCloseButton={showAll}
      footer={null}
    >
      <div className="ability-unlock-content">
        <AnimatePresence mode="wait">
          {!showAll ? (
            <motion.div key="single" className="ability-unlock-view">
              {renderSingleAbility()}
            </motion.div>
          ) : (
            <motion.div key="all" className="ability-unlock-view">
              {renderAllAbilities()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollDialog>
  );
};

export default AbilityUnlockNotification;
