// src/components/vip/VipTrialValueReview.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LatticeDialog from '@/components/game/LatticeDialog';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import { VipTrialRecord, markVipTrialValueReviewAsShown } from '@/services/vipTrialService';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { getUserCurrency } from '@/services/storeService';
import { getUserStatistics } from '@/services/statisticsService';
import { getPandaState } from '@/services/pandaService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { fetchVipTrialValueReviewView } from '@/services/localizedContentService';
import { Language } from '@/types';


interface VipTrialValueReviewProps {
  isOpen: boolean;
  onClose: () => void;
  trial: VipTrialRecord;
}

/**
 * VIP试用期价值回顾组件
 *
 * 在VIP试用期即将结束时显示，展示用户在试用期间获得的价值
 */
const VipTrialValueReview: React.FC<VipTrialValueReviewProps> = ({
  isOpen,
  onClose,
  trial
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  interface ValueStats {
    resourcesGained: {
      bamboo: number;
      coins: number;
      energy: number;
    };
    tasksCompleted: number;
    pandaGrowth: {
      level: number;
      experience: number;
    };
    challengesCompleted: number;
    streakDays: number;
    daysLeft: number;
  }

  const [valueStats, setValueStats] = useState<ValueStats | null>(null);
  const navigate = useNavigate();

  // Function to fetch localized content for VIP trial value review
  const fetchVipTrialValueReviewViewFn = useCallback(async (lang: Language) => {
    try {
      return await fetchVipTrialValueReviewView(lang);
    } catch (error) {
      console.error('Error fetching VIP trial value review view:', error);
      throw error;
    }
  }, []);

  // Fetch localized content for the VIP trial value review
  const { data: viewData } = useLocalizedView<null, { labels: { [key: string]: string } }>('vipTrialValueReview', fetchVipTrialValueReviewViewFn);

  // Get content from viewData
  const content = viewData?.labels || {} as { [key: string]: string };

  // 加载价值统计数据
  useEffect(() => {
    const loadValueStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID

        // 获取用户货币
        const currency = await getUserCurrency(userId);

        // 获取用户统计数据
        const statistics = await getUserStatistics();

        // 获取熊猫状态
        const pandaState = await getPandaState();

        // 计算试用期开始时间 - 暂时未使用，但保留以备将来需要
        // const startDate = trial.startDate ? new Date(trial.startDate) : new Date();

        // 计算试用期间的价值
        const stats = {
          // 资源收益
          resourcesGained: {
            bamboo: statistics?.resources?.bamboo || 0,
            coins: currency?.coins || 0,
            energy: pandaState?.energy || 0
          },

          // 任务完成
          tasksCompleted: statistics?.tasks?.completed || 0,

          // 熊猫成长
          pandaGrowth: {
            level: pandaState?.level || 1,
            experience: pandaState?.experience || 0
          },

          // 挑战完成
          challengesCompleted: statistics?.challenges?.completed || 0,

          // 连续打卡
          streakDays: statistics?.tasks?.streak || 0,

          // 试用期剩余天数
          daysLeft: trial.endDate ?
            Math.max(0, Math.ceil((new Date(trial.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) :
            0
        };

        setValueStats(stats);
      } catch (error) {
        console.error('Failed to load value statistics:', error);
        setError('加载统计数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadValueStats();
    }
  }, [isOpen, trial]);

  // 处理关闭
  const handleClose = async () => {
    try {
      // 标记为已显示
      await markVipTrialValueReviewAsShown(trial.id!);

      // 关闭对话框
      onClose();
    } catch (error) {
      console.error('Failed to mark VIP trial value review as shown:', error);
    }
  };

  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.BUTTON_CLICK);
    onClose();
    navigate('/vip-benefits');
  };

  // 渲染加载状态
  const renderLoading = () => (
    <div className="flex justify-center items-center h-40">
      <LoadingSpinner variant="gold" size="medium" />
    </div>
  );

  // 渲染错误状态
  const renderError = () => (
    <div className="text-center p-4">
      <div className="text-red-500 mb-4">{error}</div>
      <Button
        variant="secondary"
        onClick={onClose}
      >
        {content.closeButton || '关闭'}
      </Button>
    </div>
  );

  // 渲染价值统计
  const renderValueStats = () => {
    if (!valueStats) return null;

    return (
      <div className="value-stats">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gold-700 mb-2">
            {content.valueTitle || '您的VIP试用期即将结束'}
          </h2>

          <p className="text-gray-600">
            {content.valueDescription?.replace('{days}', valueStats.daysLeft.toString()) ||
             `您的VIP试用期还剩 ${valueStats.daysLeft} 天。看看您在试用期间获得的价值吧！`}
          </p>
        </div>

        <div className="stats-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* 资源收益 */}
          <div className="stat-card bg-gold-50 p-4 rounded-lg border border-gold-200">
            <h3 className="font-bold text-gold-700 mb-2">
              {content.resourcesTitle || '资源收益'}
            </h3>

            <div className="flex items-center mb-2">
              <img src="/assets/resources/bamboo.svg" alt="Bamboo" className="w-5 h-5 mr-2" />
              <span>{valueStats.resourcesGained.bamboo} {content.bambooLabel || '竹子'}</span>
            </div>

            <div className="flex items-center mb-2">
              <img src="/assets/resources/coin.svg" alt="Coins" className="w-5 h-5 mr-2" />
              <span>{valueStats.resourcesGained.coins} {content.coinsLabel || '金币'}</span>
            </div>

            <div className="flex items-center">
              <img src="/assets/resources/energy.svg" alt="Energy" className="w-5 h-5 mr-2" />
              <span>{valueStats.resourcesGained.energy} {content.energyLabel || '能量'}</span>
            </div>
          </div>

          {/* 任务完成 */}
          <div className="stat-card bg-jade-50 p-4 rounded-lg border border-jade-200">
            <h3 className="font-bold text-jade-700 mb-2">
              {content.tasksTitle || '任务完成'}
            </h3>

            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">✓</span>
              <span>{valueStats.tasksCompleted} {content.tasksLabel || '任务已完成'}</span>
            </div>

            <div className="flex items-center">
              <span className="text-2xl mr-2">🏆</span>
              <span>{valueStats.challengesCompleted} {content.challengesLabel || '挑战已完成'}</span>
            </div>
          </div>

          {/* 熊猫成长 */}
          <div className="stat-card bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-purple-700 mb-2">
              {content.pandaTitle || '熊猫成长'}
            </h3>

            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">⭐</span>
              <span>{content.levelLabel || '等级'}: {valueStats.pandaGrowth.level}</span>
            </div>

            <div className="flex items-center">
              <span className="text-2xl mr-2">📈</span>
              <span>{content.experienceLabel || '经验'}: {valueStats.pandaGrowth.experience}</span>
            </div>
          </div>

          {/* 连续打卡 */}
          <div className="stat-card bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-700 mb-2">
              {content.streakTitle || '连续打卡'}
            </h3>

            <div className="flex items-center">
              <span className="text-2xl mr-2">🔥</span>
              <span>{valueStats.streakDays} {content.streakLabel || '天连续打卡'}</span>
            </div>
          </div>
        </div>

        <div className="vip-promotion bg-gold-100 p-4 rounded-lg border border-gold-300 mb-6">
          <h3 className="font-bold text-gold-800 mb-2">
            {content.promotionTitle || '不要错过这些VIP特权！'}
          </h3>

          <p className="text-gray-700 mb-4">
            {content.promotionDescription || '继续订阅VIP会员，享受资源加成、专属皮肤、更多自定义目标等特权。'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="gold"
              onClick={handleNavigateToVip}
              className="flex-1"
            >
              {content.subscribeButton || '立即订阅'}
            </Button>

            <Button
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              {content.laterButton || '稍后再说'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <LatticeDialog
          isOpen={true}
          onClose={handleClose}
          title={content.dialogTitle || 'VIP试用期回顾'}
          showCloseButton={true}
          // size prop is not supported by LatticeDialog
        >
          <div className="vip-trial-value-review p-4">
            {isLoading ? renderLoading() : error ? renderError() : renderValueStats()}
          </div>
        </LatticeDialog>
      )}
    </AnimatePresence>
  );
};

export default VipTrialValueReview;
