// src/pages/AbilitiesPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePandaState } from '@/context/PandaStateProvider';
import AbilityList from '@/components/game/AbilityList';
import AbilityUnlockNotification from '@/components/game/AbilityUnlockNotification';
import PageTransition from '@/components/animation/PageTransition';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { PandaAbilityRecord } from '@/services/pandaAbilityService';

/**
 * 熊猫能力页面
 * 显示所有熊猫能力，并允许激活已解锁的能力
 */
const AbilitiesPage: React.FC = () => {
  const { 
    pandaState, 
    abilities, 
    unlockedAbilities, 
    isLoading, 
    activateAbility,
    checkNewAbilities
  } = usePandaState();
  
  const [newlyUnlockedAbilities, setNewlyUnlockedAbilities] = useState<PandaAbilityRecord[]>([]);
  const [showUnlockNotification, setShowUnlockNotification] = useState(false);
  
  // 检查新解锁的能力
  useEffect(() => {
    const checkForNewAbilities = async () => {
      const newAbilities = await checkNewAbilities();
      if (newAbilities.length > 0) {
        setNewlyUnlockedAbilities(newAbilities);
        setShowUnlockNotification(true);
      }
    };
    
    checkForNewAbilities();
  }, [checkNewAbilities]);
  
  // 关闭解锁通知
  const handleCloseUnlockNotification = () => {
    setShowUnlockNotification(false);
    setNewlyUnlockedAbilities([]);
  };
  
  // 激活能力
  const handleActivateAbility = async (abilityId: number) => {
    await activateAbility(abilityId);
  };
  
  return (
    <PageTransition>
      <div className="page-content">
        <div className="bamboo-frame">
          <h2>熊猫能力</h2>
          
          {isLoading ? (
            <div className="loading-container">
              <LoadingSpinner variant="jade" />
            </div>
          ) : (
            <>
              <div className="abilities-header">
                <motion.div 
                  className="panda-level-info"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3>熊猫等级: {pandaState?.level || 1}</h3>
                  <p>解锁能力: {unlockedAbilities.length} / {abilities.length}</p>
                </motion.div>
                
                <motion.div 
                  className="abilities-description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p>
                    熊猫能力可以帮助你更高效地完成任务，获得更多奖励。
                    随着熊猫等级的提升，你将解锁更多强大的能力。
                  </p>
                </motion.div>
              </div>
              
              <AbilityList
                abilities={abilities}
                unlockedAbilities={unlockedAbilities}
                onActivateAbility={handleActivateAbility}
                pandaLevel={pandaState?.level || 1}
              />
            </>
          )}
        </div>
        
        {/* 能力解锁通知 */}
        {showUnlockNotification && (
          <AbilityUnlockNotification
            newlyUnlockedAbilities={newlyUnlockedAbilities}
            onClose={handleCloseUnlockNotification}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default AbilitiesPage;
