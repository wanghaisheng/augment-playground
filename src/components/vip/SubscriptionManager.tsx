// src/components/vip/SubscriptionManager.tsx
import React, { useState, useEffect } from 'react';
import {
  getUserVipSubscription,
  VipSubscriptionRecord
} from '@/services/storeService';
import SubscriptionExpirationReminder from './SubscriptionExpirationReminder';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import { usePandaState } from '@/context/PandaStateProvider';

/**
 * 订阅管理器组件
 *
 * 管理VIP订阅的显示和状态
 */
const SubscriptionManager: React.FC = () => {
  const [showExpirationReminder, setShowExpirationReminder] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<VipSubscriptionRecord | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [lastReminderDate, setLastReminderDate] = useState<Date | null>(null);
  const { registerRefreshListener } = useDataRefreshContext();
  const { pandaState: _pandaState } = usePandaState(); // Rename to _pandaState to indicate it's not used

  // 检查订阅状态
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        if (isChecking) return;
        setIsChecking(true);

        const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID

        // 获取用户的VIP订阅
        const subscription = await getUserVipSubscription(userId);

        // 如果没有订阅或订阅不活跃，不显示提醒
        if (!subscription || !subscription.isActive || !subscription.endDate) {
          setIsChecking(false);
          return;
        }

        // 计算剩余天数
        const now = new Date();
        const endDate = new Date(subscription.endDate);
        const days = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // 检查是否需要显示提醒
        // 在到期前7天、3天、1天显示提醒
        const shouldRemind = days <= 7 && (days === 7 || days === 3 || days === 1 || days <= 0);

        // 检查今天是否已经显示过提醒
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const hasRemindedToday = lastReminderDate &&
                                new Date(lastReminderDate).setHours(0, 0, 0, 0) === today.getTime();

        if (shouldRemind && !hasRemindedToday) {
          setSubscriptionData(subscription);
          setDaysLeft(days);
          setShowExpirationReminder(true);
          setLastReminderDate(new Date());

          // 保存最后提醒日期到本地存储
          localStorage.setItem('lastSubscriptionReminderDate', new Date().toISOString());
        }
      } catch (error) {
        console.error('Failed to check subscription status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // 从本地存储加载最后提醒日期
    const loadLastReminderDate = () => {
      const dateStr = localStorage.getItem('lastSubscriptionReminderDate');
      if (dateStr) {
        setLastReminderDate(new Date(dateStr));
      }
    };

    // 初始加载
    loadLastReminderDate();
    checkSubscriptionStatus();

    // 设置定期检查
    const intervalId = setInterval(checkSubscriptionStatus, 3600000); // 每小时检查一次

    return () => {
      clearInterval(intervalId);
    };
  }, [isChecking, lastReminderDate]);

  // 监听数据刷新事件
  useEffect(() => {
    const handleRefresh = (refreshType: string) => {
      if (refreshType === 'vipSubscriptions' || refreshType === 'pandaState') {
        // 重新检查订阅状态
        const checkSubscriptionStatus = async () => {
          try {
            if (isChecking) return;
            setIsChecking(true);

            const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID

            // 获取用户的VIP订阅
            const subscription = await getUserVipSubscription(userId);

            // 如果没有订阅或订阅不活跃，不显示提醒
            if (!subscription || !subscription.isActive || !subscription.endDate) {
              setIsChecking(false);
              return;
            }

            // 计算剩余天数
            const now = new Date();
            const endDate = new Date(subscription.endDate);
            const days = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            // 检查是否需要显示提醒
            // 在到期前7天、3天、1天显示提醒
            const shouldRemind = days <= 7 && (days === 7 || days === 3 || days === 1 || days <= 0);

            // 检查今天是否已经显示过提醒
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const hasRemindedToday = lastReminderDate &&
                                    new Date(lastReminderDate).setHours(0, 0, 0, 0) === today.getTime();

            if (shouldRemind && !hasRemindedToday) {
              setSubscriptionData(subscription);
              setDaysLeft(days);
              setShowExpirationReminder(true);
              setLastReminderDate(new Date());

              // 保存最后提醒日期到本地存储
              localStorage.setItem('lastSubscriptionReminderDate', new Date().toISOString());
            }
          } catch (error) {
            console.error('Failed to check subscription status:', error);
          } finally {
            setIsChecking(false);
          }
        };

        checkSubscriptionStatus();
      }
    };

    // 注册刷新事件监听器
    const unregisterVipSubscriptions = registerRefreshListener('vipSubscriptions', () => {
      handleRefresh('vipSubscriptions');
    });

    const unregisterPandaState = registerRefreshListener('pandaState', () => {
      handleRefresh('pandaState');
    });

    return () => {
      unregisterVipSubscriptions();
      unregisterPandaState();
    };
  }, [isChecking, lastReminderDate]);

  // 处理关闭到期提醒
  const handleCloseExpirationReminder = () => {
    setShowExpirationReminder(false);
  };

  // 如果没有订阅数据，不渲染任何内容
  if (!subscriptionData) {
    return null;
  }

  return (
    <>
      {/* 订阅到期提醒 */}
      <SubscriptionExpirationReminder
        isOpen={showExpirationReminder}
        onClose={handleCloseExpirationReminder}
        subscription={subscriptionData}
        daysLeft={daysLeft}
      />
    </>
  );
};

export default SubscriptionManager;
