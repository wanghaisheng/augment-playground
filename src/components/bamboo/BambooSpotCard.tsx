// src/components/bamboo/BambooSpotCard.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BambooSpotRecord, BambooSpotStatus, collectBamboo } from '@/services/bambooCollectionService';
import Button from '@/components/common/Button';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { playSound, SoundType } from '@/utils/sound';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import BambooAnimation from './BambooAnimation';
import VipBoostPrompt from '@/components/vip/VipBoostPrompt';
import { RewardType } from '@/services/rewardService';
import { initializeVipBoostPromptLabels } from '@/data/vipBoostPromptLabels';
import { fetchBambooSpotCardView } from '@/services/localizedContentService';
import { Language } from '@/types';

interface BambooSpotCardProps {
  spot: BambooSpotRecord;
  onCollect: (spot: BambooSpotRecord, amount: number) => void;
  className?: string;
}

/**
 * 竹子收集点卡片组件
 */
const BambooSpotCard: React.FC<BambooSpotCardProps> = ({ spot, onCollect, className = '' }) => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState(0);
  const [baseAmount, setBaseAmount] = useState(0);
  const [showVipPrompt, setShowVipPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 定义标签类型
  interface BambooSpotCardLabels {
    available: string;
    cooldown: string;
    depleted: string;
    commonBamboo: string;
    goldenBamboo: string;
    ancientBamboo: string;
    magicalBamboo: string;
    homeGarden: string;
    forestEdge: string;
    mountainPath: string;
    sacredGrove: string;
    enchantedValley: string;
    baseAmount: string;
    status: string;
    collections: string;
    collecting: string;
    collect: string;
    unknownError: string;
  }

  // 获取本地化内容
  // 创建一个函数来获取本地化内容
  const fetchBambooSpotCardViewFn = useCallback(async (lang: Language) => {
    try {
      return await fetchBambooSpotCardView(lang);
    } catch (error) {
      console.error('Error fetching bamboo spot card view:', error);
      throw error;
    }
  }, []);

  // 使用 useLocalizedView 钩子获取本地化内容
  const { labels } = useLocalizedView<null, BambooSpotCardLabels>(
    'bambooSpotCard',
    fetchBambooSpotCardViewFn
  );

  // 为了兼容现有代码，创建content和currentLanguage
  const content = labels || {
    available: '可收集',
    cooldown: '冷却中',
    depleted: '已耗尽',
    commonBamboo: '普通竹子',
    goldenBamboo: '金色竹子',
    ancientBamboo: '古老竹子',
    magicalBamboo: '魔法竹子',
    homeGarden: '家园花园',
    forestEdge: '森林边缘',
    mountainPath: '山间小路',
    sacredGrove: '神圣树林',
    enchantedValley: '魔法山谷',
    baseAmount: '基础数量',
    status: '状态',
    collections: '收集次数',
    collecting: '收集中...',
    collect: '收集',
    unknownError: '发生未知错误'
  };
  const currentLanguage = 'zh';

  // 初始化VIP助推提示标签
  useEffect(() => {
    initializeVipBoostPromptLabels();
  }, []);

  // 处理收集竹子
  const handleCollect = async () => {
    if (spot.status !== BambooSpotStatus.AVAILABLE) {
      return;
    }

    try {
      setIsCollecting(true);
      setError(null);

      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.3);

      // 收集竹子
      const result = await collectBamboo('current-user', spot.id!);

      // 设置收集数量和基础数量
      setCollectedAmount(result.amount);
      setBaseAmount(result.baseAmount || spot.baseAmount);

      // 显示动画
      setShowAnimation(true);

      // 通知父组件
      onCollect(spot, result.amount);

      // 如果有倍数信息，延迟显示VIP助推提示
      if (result.baseAmount && result.multiplier && result.multiplier > 1) {
        setTimeout(() => {
          setShowVipPrompt(true);
        }, 2500); // 在竹子收集动画完成后显示
      }
    } catch (err) {
      console.error('Failed to collect bamboo:', err);
      setError(err instanceof Error ? err.message : content.unknownError);

      // 播放错误音效
      playSound(SoundType.ERROR, 0.3);
    } finally {
      setIsCollecting(false);
    }
  };

  // 处理动画完成
  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  // 处理关闭VIP助推提示
  const handleCloseVipPrompt = () => {
    setShowVipPrompt(false);
  };

  // 获取状态文本
  const getStatusText = () => {
    switch (spot.status) {
      case BambooSpotStatus.AVAILABLE:
        return content.available;
      case BambooSpotStatus.COOLDOWN:
        if (spot.nextAvailableAt) {
          return `${content.cooldown}: ${formatDistanceToNow(spot.nextAvailableAt, {
            addSuffix: true,
            locale: currentLanguage === 'zh' ? zhCN : enUS
          })}`;
        }
        return content.cooldown;
      case BambooSpotStatus.DEPLETED:
        return content.depleted;
      default:
        return '';
    }
  };

  // 获取类型文本
  const getTypeText = () => {
    switch (spot.type) {
      case 'common':
        return content.commonBamboo;
      case 'golden':
        return content.goldenBamboo;
      case 'ancient':
        return content.ancientBamboo;
      case 'magical':
        return content.magicalBamboo;
      default:
        return spot.type;
    }
  };

  // 获取位置文本
  const getLocationText = () => {
    switch (spot.location) {
      case 'home_garden':
        return content.homeGarden;
      case 'forest_edge':
        return content.forestEdge;
      case 'mountain_path':
        return content.mountainPath;
      case 'sacred_grove':
        return content.sacredGrove;
      case 'enchanted_valley':
        return content.enchantedValley;
      default:
        return spot.location;
    }
  };

  // 获取卡片背景色
  const getCardBackground = () => {
    switch (spot.type) {
      case 'common':
        return 'bg-gradient-to-br from-green-50 to-green-100';
      case 'golden':
        return 'bg-gradient-to-br from-amber-50 to-amber-100';
      case 'ancient':
        return 'bg-gradient-to-br from-teal-50 to-teal-100';
      case 'magical':
        return 'bg-gradient-to-br from-purple-50 to-purple-100';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100';
    }
  };

  // 获取边框颜色
  const getBorderColor = () => {
    switch (spot.type) {
      case 'common':
        return 'border-green-300';
      case 'golden':
        return 'border-amber-300';
      case 'ancient':
        return 'border-teal-300';
      case 'magical':
        return 'border-purple-300';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <motion.div
      className={`bamboo-spot-card relative rounded-lg border-2 p-4 shadow-md ${getCardBackground()} ${getBorderColor()} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <div className="bamboo-spot-image mr-4 relative">
          <img
            src={spot.visualAsset}
            alt={getTypeText()}
            className="w-20 h-20 object-contain"
          />
          {spot.status === BambooSpotStatus.COOLDOWN && (
            <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-full flex items-center justify-center">
              <motion.div
                className="w-full h-full rounded-full"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: [0.7, 0.3, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          )}
        </div>

        <div className="bamboo-spot-info flex-1">
          <h3 className="text-lg font-semibold">{getTypeText()}</h3>
          <p className="text-sm text-gray-600">{getLocationText()}</p>
          <p className="text-sm mt-1">
            <span className="font-medium">{content.baseAmount}:</span> {spot.baseAmount}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">{content.status}:</span> {getStatusText()}
          </p>
          {spot.maxCollections && (
            <p className="text-sm mt-1">
              <span className="font-medium">{content.collections}:</span> {spot.totalCollections}/{spot.maxCollections}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button
          color={spot.status === BambooSpotStatus.AVAILABLE ? 'jade' : 'silk'}
          size="small"
          onClick={handleCollect}
          disabled={spot.status !== BambooSpotStatus.AVAILABLE || isCollecting}
        >
          {isCollecting ? content.collecting : content.collect}
        </Button>
      </div>

      <AnimatePresence>
        {showAnimation && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BambooAnimation
              amount={collectedAmount}
              onComplete={handleAnimationComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIP助推提示 */}
      <VipBoostPrompt
        isOpen={showVipPrompt}
        onClose={handleCloseVipPrompt}
        rewardType={RewardType.COIN}
        baseAmount={baseAmount}
        vipAmount={collectedAmount}
        promptType="bamboo"
      />
    </motion.div>
  );
};

export default BambooSpotCard;
