// src/components/vip/VipTrialManager.tsx
import React, { useState, useEffect } from 'react';
import {
  checkVipTrialEligibility,
  createVipTrial,
  getUserVipTrial,
  updateVipTrialStatus,
  VipTrialStatus
} from '@/services/vipTrialService';
import VipTrialGuide from './VipTrialGuide';
import VipTrialValueReview from './VipTrialValueReview';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import { usePandaState } from '@/context/PandaStateProvider';

/**
 * VIP试用管理器组件
 *
 * 管理VIP试用的显示和状态
 */
const VipTrialManager: React.FC = () => {
  const [showTrialGuide, setShowTrialGuide] = useState(false);
  const [showValueReview, setShowValueReview] = useState(false);
  const [trialData, setTrialData] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { refreshData } = useDataRefreshContext();
  const { pandaState } = usePandaState();

  // 检查VIP试用资格和状态
  useEffect(() => {
    const checkVipTrialStatus = async () => {
      try {
        if (isChecking) return;
        setIsChecking(true);

        const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID

        // 获取用户的VIP试用记录
        let trial = await getUserVipTrial(userId);

        // 如果没有试用记录，检查用户是否有资格获得试用
        if (!trial) {
          const isEligible = await checkVipTrialEligibility(userId);

          if (isEligible) {
            // 创建VIP试用记录
            trial = await createVipTrial(userId);

            // 刷新数据
            refreshData('vipTrials');
            refreshData('pandaState');
          }
        } else {
          // 更新试用状态
          trial = await updateVipTrialStatus(userId);
        }

        // 如果有试用记录，并且是活跃状态，并且没有显示过指南，显示试用指南
        if (
          trial &&
          trial.status === VipTrialStatus.ACTIVE &&
          !trial.hasShownGuide
        ) {
          setTrialData(trial);
          setShowTrialGuide(true);
          return;
        }

        // 如果有试用记录，并且是活跃状态，并且没有显示过价值回顾，并且试用期即将结束（剩余2天或更少），显示价值回顾
        if (
          trial &&
          trial.status === VipTrialStatus.ACTIVE &&
          !trial.hasShownValueReview &&
          trial.endDate
        ) {
          const now = new Date();
          const endDate = new Date(trial.endDate);
          const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          if (daysLeft <= 2) {
            setTrialData(trial);
            setShowValueReview(true);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to check VIP trial status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // 初始检查
    checkVipTrialStatus();

    // 设置定期检查
    const intervalId = setInterval(checkVipTrialStatus, 60000); // 每分钟检查一次

    return () => {
      clearInterval(intervalId);
    };
  }, [refreshData]);

  // 监听数据刷新事件
  useEffect(() => {
    const handleRefresh = (refreshType: string) => {
      if (refreshType === 'vipTrials' || refreshType === 'pandaState') {
        // 重新检查VIP试用状态
        const checkVipTrialStatus = async () => {
          try {
            if (isChecking) return;
            setIsChecking(true);

            const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID

            // 获取用户的VIP试用记录
            const trial = await getUserVipTrial(userId);

            // 如果有试用记录，并且是活跃状态，并且没有显示过指南，显示试用指南
            if (
              trial &&
              trial.status === VipTrialStatus.ACTIVE &&
              !trial.hasShownGuide
            ) {
              setTrialData(trial);
              setShowTrialGuide(true);
              return;
            }

            // 如果有试用记录，并且是活跃状态，并且没有显示过价值回顾，并且试用期即将结束（剩余2天或更少），显示价值回顾
            if (
              trial &&
              trial.status === VipTrialStatus.ACTIVE &&
              !trial.hasShownValueReview &&
              trial.endDate
            ) {
              const now = new Date();
              const endDate = new Date(trial.endDate);
              const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

              if (daysLeft <= 2) {
                setTrialData(trial);
                setShowValueReview(true);
                return;
              }
            }
          } catch (error) {
            console.error('Failed to check VIP trial status:', error);
          } finally {
            setIsChecking(false);
          }
        };

        checkVipTrialStatus();
      }
    };

    // 注册刷新事件监听器
    const { refreshEvents } = useDataRefreshContext();
    refreshEvents.on('dataRefreshed', handleRefresh);

    return () => {
      refreshEvents.off('dataRefreshed', handleRefresh);
    };
  }, [useDataRefreshContext, isChecking]);

  // 处理关闭试用指南
  const handleCloseTrialGuide = () => {
    setShowTrialGuide(false);

    // 刷新数据
    refreshData('vipTrials');
    refreshData('pandaState');
  };

  // 处理关闭价值回顾
  const handleCloseValueReview = () => {
    setShowValueReview(false);

    // 刷新数据
    refreshData('vipTrials');
    refreshData('pandaState');
  };

  // 如果没有试用数据，不渲染任何内容
  if (!trialData) {
    return null;
  }

  return (
    <>
      {/* VIP试用指南 */}
      <VipTrialGuide
        isOpen={showTrialGuide}
        onClose={handleCloseTrialGuide}
        trial={trialData}
      />

      {/* VIP试用价值回顾 */}
      <VipTrialValueReview
        isOpen={showValueReview}
        onClose={handleCloseValueReview}
        trial={trialData}
      />
    </>
  );
};

export default VipTrialManager;
