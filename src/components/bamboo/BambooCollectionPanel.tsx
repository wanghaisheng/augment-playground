// src/components/bamboo/BambooCollectionPanel.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BambooSpotRecord,
  BambooSpotStatus,
  getAllBambooSpots,
  getBambooCollectionStats,
  BambooSource
} from '@/services/bambooCollectionService';
import BambooSpotCard from './BambooSpotCard';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import LoadingSpinner from '@/components/common/LoadingSpinner';
// 导入但未使用的组件，保留以便未来可能的扩展
// import Button from '@/components/common/Button';
// import { formatDistanceToNow } from 'date-fns';
// import { zhCN, enUS } from 'date-fns/locale';
import { BambooSpotCardSkeleton } from '@/components/skeleton';

interface BambooCollectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * 竹子收集面板组件
 */
const BambooCollectionPanel: React.FC<BambooCollectionPanelProps> = ({
  isOpen,
  onClose,
  className = ''
}) => {
  const [spots, setSpots] = useState<BambooSpotRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'spots' | 'stats'>('spots');
  const [stats, setStats] = useState<{ total: number; today: number; bySource: Record<BambooSource, number> } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 获取本地化内容
  // 创建一个模拟的本地化内容对象，实际项目中应该使用正确的fetchViewFn
  const mockFetchBambooCollection = async () => ({
    labels: {
      title: '竹子收集',
      spotsTab: '收集点',
      statsTab: '统计',
      noSpotsFound: '没有找到竹子收集点',
      noStatsFound: '没有找到统计数据',
      totalCollected: '总共收集',
      todayCollected: '今日收集',
      collectionBySource: '按来源统计',
      source: '来源',
      amount: '数量',
      noCollectionData: '暂无收集数据',
      taskSource: '任务',
      dailySource: '每日奖励',
      collectionSource: '收集点',
      giftSource: '礼物',
      purchaseSource: '购买',
      challengeSource: '挑战',
      battlePassSource: '竹令',
      vipSource: 'VIP奖励',
      unknownError: '发生未知错误'
    },
    data: null
  });

  const { data } = useLocalizedView(mockFetchBambooCollection);
  // 为了兼容现有代码，创建一个content对象
  const content = data?.labels || {
    title: '竹子收集',
    spotsTab: '收集点',
    statsTab: '统计',
    noSpotsFound: '没有找到竹子收集点',
    noStatsFound: '没有找到统计数据',
    totalCollected: '总共收集',
    todayCollected: '今日收集',
    collectionBySource: '按来源统计',
    source: '来源',
    amount: '数量',
    noCollectionData: '暂无收集数据',
    taskSource: '任务',
    dailySource: '每日奖励',
    collectionSource: '收集点',
    giftSource: '礼物',
    purchaseSource: '购买',
    challengeSource: '挑战',
    battlePassSource: '竹令',
    vipSource: 'VIP奖励',
    unknownError: '发生未知错误'
  };

  // 加载竹子收集点
  const loadBambooSpots = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取所有竹子收集点
      const allSpots = await getAllBambooSpots();
      setSpots(allSpots);
    } catch (err) {
      console.error('Failed to load bamboo spots:', err);
      setError(err instanceof Error ? err.message : content.unknownError);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载竹子收集统计
  const loadBambooStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取竹子收集统计
      const collectionStats = await getBambooCollectionStats('current-user');
      setStats(collectionStats);
    } catch (err) {
      console.error('Failed to load bamboo stats:', err);
      setError(err instanceof Error ? err.message : content.unknownError);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'spots') {
        loadBambooSpots();
      } else {
        loadBambooStats();
      }
    }
  }, [isOpen, activeTab, refreshTrigger]);

  // 注册数据刷新监听
  useRegisterTableRefresh('bambooSpots', () => setRefreshTrigger(prev => prev + 1));
  useRegisterTableRefresh('bambooCollections', () => setRefreshTrigger(prev => prev + 1));

  // 处理收集竹子
  const handleCollect = (spot: BambooSpotRecord, amount: number) => {
    // 更新竹子收集点列表
    setSpots(prevSpots =>
      prevSpots.map(s =>
        s.id === spot.id
          ? {
              ...s,
              status: BambooSpotStatus.COOLDOWN,
              lastCollectedAt: new Date(),
              nextAvailableAt: new Date(Date.now() + s.cooldownMinutes * 60 * 1000),
              totalCollections: s.totalCollections + 1
            }
          : s
      )
    );

    // 如果在统计标签页，更新统计数据
    if (stats) {
      setStats({
        ...stats,
        total: stats.total + amount,
        today: stats.today + amount,
        bySource: {
          ...stats.bySource,
          [BambooSource.COLLECTION]: stats.bySource[BambooSource.COLLECTION] + amount
        }
      });
    }
  };

  // 处理切换标签
  const handleTabChange = (tab: 'spots' | 'stats') => {
    setActiveTab(tab);
  };

  // 获取源类型文本
  const getSourceText = (source: BambooSource) => {
    switch (source) {
      case BambooSource.TASK:
        return content.taskSource;
      case BambooSource.DAILY_REWARD:
        return content.dailySource;
      case BambooSource.COLLECTION:
        return content.collectionSource;
      case BambooSource.GIFT:
        return content.giftSource;
      case BambooSource.PURCHASE:
        return content.purchaseSource;
      case BambooSource.CHALLENGE:
        return content.challengeSource;
      case BambooSource.BATTLE_PASS:
        return content.battlePassSource;
      case BambooSource.VIP:
        return content.vipSource;
      default:
        return source;
    }
  };

  // 渲染竹子收集点列表
  const renderSpotsList = () => {
    if (isLoading) {
      return (
        <div className="bamboo-spot-list-skeleton grid grid-cols-1 gap-4">
          <BambooSpotCardSkeleton variant="jade" />
          <BambooSpotCardSkeleton variant="jade" />
          <BambooSpotCardSkeleton variant="jade" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-4">
          {error}
        </div>
      );
    }

    if (spots.length === 0) {
      return (
        <div className="text-center text-gray-500 p-4">
          {content.noSpotsFound}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {spots.map(spot => (
          <BambooSpotCard
            key={spot.id}
            spot={spot}
            onCollect={handleCollect}
          />
        ))}
      </div>
    );
  };

  // 渲染竹子收集统计
  const renderStats = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner size="medium" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-4">
          {error}
        </div>
      );
    }

    if (!stats) {
      return (
        <div className="text-center text-gray-500 p-4">
          {content.noStatsFound}
        </div>
      );
    }

    return (
      <div className="bamboo-stats">
        <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-green-800">{content.totalCollected}</h3>
              <p className="text-3xl font-bold text-green-600">{stats.total}</p>
            </div>
            <div className="bg-white p-3 rounded-full">
              <img
                src="/assets/bamboo/bamboo_bundle.svg"
                alt="Bamboo"
                className="w-12 h-12"
              />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-green-700">
              <span className="font-medium">{content.todayCollected}:</span> {stats.today}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">{content.collectionBySource}</h3>
        <div className="bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4">{content.source}</th>
                <th className="text-right py-2 px-4">{content.amount}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.bySource)
                .filter(([_, amount]) => amount > 0)
                .sort(([_, a], [__, b]) => b - a)
                .map(([source, amount]) => (
                  <tr key={source} className="border-b border-gray-100">
                    <td className="py-2 px-4">{getSourceText(source as BambooSource)}</td>
                    <td className="text-right py-2 px-4 font-medium">{amount}</td>
                  </tr>
                ))
              }
              {Object.values(stats.bySource).every(amount => amount === 0) && (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-gray-500">
                    {content.noCollectionData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{content.title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`py-2 px-4 ${activeTab === 'spots' ? 'border-b-2 border-jade text-jade' : 'text-gray-500'}`}
            onClick={() => handleTabChange('spots')}
          >
            {content.spotsTab}
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'stats' ? 'border-b-2 border-jade text-jade' : 'text-gray-500'}`}
            onClick={() => handleTabChange('stats')}
          >
            {content.statsTab}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'spots' ? renderSpotsList() : renderStats()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default BambooCollectionPanel;
