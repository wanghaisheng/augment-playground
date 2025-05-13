// src/pages/AbilitiesPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePandaState } from '@/context/PandaStateProvider';
import AbilityList from '@/components/game/AbilityList';
import AbilityUnlockNotification from '@/components/game/AbilityUnlockNotification';
import PageTransition from '@/components/animation/PageTransition';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { PandaAbilityRecord } from '@/services/pandaAbilityService';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchAbilitiesPageView } from '@/services';
import { AbilitiesPageViewLabelsBundle } from '@/types';

/**
 * 熊猫能力页面
 * 显示所有熊猫能力，并允许激活已解锁的能力
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
            title={pageLabels?.errorTitle || "加载能力失败"}
            messageTemplate={pageLabels?.errorMessage || "无法加载能力数据: {message}"}
            onRetry={refetch}
            retryButtonText={pageLabels?.retryButtonText || "重试"}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="page-content">
        <div className="bamboo-frame">
          <h2>{pageLabels?.pageTitle || "熊猫能力"}</h2>

          {isLoading ? (
            <div className="loading-container">
              <LoadingSpinner variant="jade" text={pageLabels?.loadingMessage || "加载能力中..."} />
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
                  <h3>{pageLabels?.pandaLevelLabel || "熊猫等级"}: {pandaState?.level || 1}</h3>
                  <p>{pageLabels?.unlockedAbilitiesLabel || "解锁能力"}: {unlockedAbilities.length} / {abilities.length}</p>
                </motion.div>

                <motion.div
                  className="abilities-description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p>
                    {pageLabels?.abilitiesDescription ||
                      "熊猫能力可以帮助你更高效地完成任务，获得更多奖励。随着熊猫等级的提升，你将解锁更多强大的能力。"}
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
