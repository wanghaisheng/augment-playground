// src/pages/AbilitiesPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePandaState } from '@/context/PandaStateProvider';
import AbilityList from '@/components/game/AbilityList';
import AbilityUnlockNotification from '@/components/game/AbilityUnlockNotification';
import PageTransition from '@/components/animation/PageTransition';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { PandaAbilityRecord } from '@/services/pandaAbilityService';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchAbilitiesPageView } from '@/services';
import { AbilitiesPageViewLabelsBundle } from '@/types';

/**
 * Panda Abilities Page
 * Displays all panda abilities and allows activation of unlocked abilities
 */
const AbilitiesPage: React.FC = () => {
  const {
    pandaState,
    abilities,
    unlockedAbilities,
    isLoading: isPandaLoading,
    activateAbility,
    checkNewAbilities
  } = usePandaState();

  const [newlyUnlockedAbilities, setNewlyUnlockedAbilities] = useState<PandaAbilityRecord[]>([]);
  const [showUnlockNotification, setShowUnlockNotification] = useState(false);

  // 获取本地化标签
  const {
    labels: pageLabels,
    isPending,
    isError,
    error,
    refetch
  } = useLocalizedView<null, AbilitiesPageViewLabelsBundle>(
    'abilitiesPageViewContent',
    fetchAbilitiesPageView
  );

  // 合并加载状态
  const isLoading = isPandaLoading || isPending;

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

  // 显示错误状态
  if (isError) {
    return (
      <PageTransition>
        <div className="page-content">
          <ErrorDisplay
            error={error}
            title={pageLabels?.errorTitle || "Failed to Load Abilities"}
            messageTemplate={pageLabels?.errorMessage || "Unable to load ability data: {message}"}
            onRetry={refetch}
            retryButtonText={pageLabels?.retryButtonText || "Retry"}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="page-content">
        <div className="bamboo-frame">
          <h2>{pageLabels?.pageTitle || "Panda Abilities"}</h2>

          <div className="abilities-header">
            <motion.div
              className="panda-level-info"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>{pageLabels?.pandaLevelLabel || "Panda Level"}: {pandaState?.level || 1}</h3>
              <p>{pageLabels?.unlockedAbilitiesLabel || "Unlocked Abilities"}: {unlockedAbilities.length} / {abilities.length}</p>
            </motion.div>

            <motion.div
              className="abilities-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p>
                {pageLabels?.abilitiesDescription ||
                  "Panda abilities help you complete tasks more efficiently and earn more rewards. As your panda levels up, you'll unlock more powerful abilities."}
              </p>
            </motion.div>
          </div>

          <AbilityList
            abilities={abilities}
            unlockedAbilities={unlockedAbilities}
            onActivateAbility={handleActivateAbility}
            pandaLevel={pandaState?.level || 1}
            isLoading={isLoading}
            labels={{
              filters: pageLabels?.filters,
              card: pageLabels?.abilityCard,
              detail: pageLabels?.abilityDetail,
              noAbilitiesMessage: pageLabels?.noAbilitiesMessage
            }}
          />
        </div>

        {/* Ability unlock notification */}
        {showUnlockNotification && (
          <AbilityUnlockNotification
            newlyUnlockedAbilities={newlyUnlockedAbilities}
            onClose={handleCloseUnlockNotification}
            labels={pageLabels?.abilityUnlockNotification}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default AbilitiesPage;
