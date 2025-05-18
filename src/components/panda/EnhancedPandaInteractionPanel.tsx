// src/components/panda/EnhancedPandaInteractionPanel.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  performInteraction,
  getInteractionStats
} from '@/services/pandaInteractionService';
import { InteractionType, InteractionResult, InteractionStats } from '@/types/pandaInteractionTypes';
import { playSound, SoundType } from '@/utils/sound';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { useSkeletonContext } from '@/context/SkeletonProvider';
import { usePandaState } from '@/context/PandaStateProvider';
import { useLanguage } from '@/context/LanguageProvider';
import EnhancedPandaAnimation, { PandaAnimationType } from './EnhancedPandaAnimation';
import EnhancedAnimatedButton from '@/components/animation/EnhancedAnimatedButton';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EnhancedDataLoader from '@/components/common/EnhancedDataLoader';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';

interface EnhancedPandaInteractionPanelProps {
  onInteractionComplete?: (result: InteractionResult) => void;
  className?: string;
  showStats?: boolean;
  showAnimation?: boolean;
  animationSize?: number;
  priority?: 'low' | 'medium' | 'high';
  disableOnLowPerformance?: boolean;
  labels?: {
    title?: string;
    interactions?: string;
    statistics?: string;
    pet?: string;
    feed?: string;
    play?: string;
    train?: string;
    sleep?: string;
    cooldownMessage?: string;
    seconds?: string;
    experienceGained?: string;
    lastInteraction?: string;
    totalInteractions?: string;
    backToInteractions?: string;
    tryAgain?: string;
  };
}

/**
 * 增强版熊猫互动面板组件
 * 提供与熊猫互动的界面，包括各种互动选项和反馈
 *
 * @param onInteractionComplete - 互动完成时的回调函数
 * @param className - 额外的CSS类名
 * @param showStats - 是否显示互动统计信息
 * @param showAnimation - 是否显示动画
 * @param animationSize - 动画大小
 * @param priority - 动画优先级
 * @param disableOnLowPerformance - 是否在低性能设备上禁用动画
 * @param labels - 本地化标签
 */
const EnhancedPandaInteractionPanel: React.FC<EnhancedPandaInteractionPanelProps> = ({
  onInteractionComplete,
  className = '',
  showStats = true,
  showAnimation = true,
  animationSize = 180,
  priority = 'medium',
  disableOnLowPerformance = false,
  labels: propLabels
}) => {
  const [selectedInteraction, setSelectedInteraction] = useState<InteractionType | null>(null);
  const [interactionResult, setInteractionResult] = useState<InteractionResult | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interactionStats, setInteractionStats] = useState<InteractionStats | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<InteractionType, number>>({
    [InteractionType.PET]: 0,
    [InteractionType.FEED]: 0,
    [InteractionType.PLAY]: 0,
    [InteractionType.TRAIN]: 0,
    [InteractionType.SLEEP]: 0
  });
  const [animationType, setAnimationType] = useState<PandaAnimationType>('idle');
  
  // 获取熊猫状态
  const { pandaState } = usePandaState();
  
  // 获取骨架屏上下文
  const { isSkeletonVisible } = useSkeletonContext();
  
  // 获取语言设置
  const { language } = useLanguage();
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    title: propLabels?.title || componentLabels?.pandaInteraction?.title || "Panda Interaction",
    interactions: propLabels?.interactions || componentLabels?.pandaInteraction?.interactions || "Interactions",
    statistics: propLabels?.statistics || componentLabels?.pandaInteraction?.statistics || "Statistics",
    pet: propLabels?.pet || componentLabels?.pandaInteraction?.pet || "Pet",
    feed: propLabels?.feed || componentLabels?.pandaInteraction?.feed || "Feed",
    play: propLabels?.play || componentLabels?.pandaInteraction?.play || "Play",
    train: propLabels?.train || componentLabels?.pandaInteraction?.train || "Train",
    sleep: propLabels?.sleep || componentLabels?.pandaInteraction?.sleep || "Sleep",
    cooldownMessage: propLabels?.cooldownMessage || componentLabels?.pandaInteraction?.cooldownMessage || "is on cooldown for",
    seconds: propLabels?.seconds || componentLabels?.pandaInteraction?.seconds || "seconds",
    experienceGained: propLabels?.experienceGained || componentLabels?.pandaInteraction?.experienceGained || "Experience gained",
    lastInteraction: propLabels?.lastInteraction || componentLabels?.pandaInteraction?.lastInteraction || "Last interaction",
    totalInteractions: propLabels?.totalInteractions || componentLabels?.pandaInteraction?.totalInteractions || "Total interactions",
    backToInteractions: propLabels?.backToInteractions || componentLabels?.pandaInteraction?.backToInteractions || "Back to interactions",
    tryAgain: propLabels?.tryAgain || componentLabels?.pandaInteraction?.tryAgain || "Try again"
  };

  // 互动类型列表
  const interactions = [
    InteractionType.PET,
    InteractionType.FEED,
    InteractionType.PLAY,
    InteractionType.TRAIN,
    InteractionType.SLEEP
  ];

  // 初始加载
  useEffect(() => {
    loadInteractionStats();
  }, []);

  // 注册数据刷新监听
  useRegisterTableRefresh('pandaInteractions', loadInteractionStats);

  // 冷却时间计时器
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        
        Object.keys(updated).forEach(key => {
          const type = key as InteractionType;
          if (updated[type] > 0) {
            updated[type] -= 1;
            hasChanges = true;
          }
        });
        
        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 加载互动统计信息
  const loadInteractionStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await getInteractionStats();
      setInteractionStats(stats);
    } catch (err) {
      console.error('Failed to load interaction stats:', err);
      setError('Failed to load interaction stats');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取互动名称
  const getInteractionName = (type: InteractionType): string => {
    switch (type) {
      case InteractionType.PET:
        return labels.pet;
      case InteractionType.FEED:
        return labels.feed;
      case InteractionType.PLAY:
        return labels.play;
      case InteractionType.TRAIN:
        return labels.train;
      case InteractionType.SLEEP:
        return labels.sleep;
      default:
        return '';
    }
  };

  // 获取互动图标
  const getInteractionIcon = (type: InteractionType): string => {
    switch (type) {
      case InteractionType.PET:
        return '👋';
      case InteractionType.FEED:
        return '🍎';
      case InteractionType.PLAY:
        return '🎮';
      case InteractionType.TRAIN:
        return '💪';
      case InteractionType.SLEEP:
        return '😴';
      default:
        return '';
    }
  };

  // 处理互动选择
  const handleInteractionSelect = (type: InteractionType) => {
    // 播放按钮点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    if (cooldowns[type] > 0) {
      // 如果在冷却中，显示提示
      setInteractionResult({
        success: false,
        message: `${getInteractionName(type)} ${labels.cooldownMessage} ${cooldowns[type]} ${labels.seconds}`,
        experienceGained: 0,
        moodChanged: false,
        energyChanged: false
      });
      return;
    }

    setSelectedInteraction(type);
    setInteractionResult(null);
  };

  // 处理互动执行
  const handleInteractionExecute = async () => {
    if (!selectedInteraction) return;

    // 播放按钮点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    try {
      setIsInteracting(true);
      setError(null);

      // 执行互动
      const result = await performInteraction(selectedInteraction);
      setInteractionResult(result);

      if (result.success) {
        // 设置动画类型
        setAnimationType(result.animation as PandaAnimationType || 'idle');

        // 设置冷却时间
        if (result.cooldown) {
          setCooldowns(prev => ({
            ...prev,
            [selectedInteraction]: result.cooldown!
          }));
        }

        // 回调
        if (onInteractionComplete) {
          onInteractionComplete(result);
        }
      } else {
        // 播放错误音效
        playSound(SoundType.ERROR, 0.5);
      }

      // 刷新统计信息
      await loadInteractionStats();
    } catch (err) {
      console.error('Failed to perform interaction:', err);
      setError('Failed to perform interaction');
      
      // 播放错误音效
      playSound(SoundType.ERROR, 0.5);
    } finally {
      setIsInteracting(false);
    }
  };

  // 处理返回互动列表
  const handleBackToInteractions = () => {
    // 播放按钮点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    
    setSelectedInteraction(null);
    setInteractionResult(null);
  };

  // 格式化上次互动时间
  const formatLastInteractionTime = (timestamp: number): string => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { 
      addSuffix: true,
      locale: language === 'zh' ? zhCN : enUS
    });
  };

  // 渲染互动选择
  const renderInteractionSelection = () => {
    return (
      <OptimizedAnimatedContainer
        className="grid grid-cols-2 gap-3 mt-4"
        priority={priority}
      >
        {interactions.map(type => (
          <EnhancedAnimatedButton
            key={type}
            variant="jade"
            onClick={() => handleInteractionSelect(type)}
            disabled={isLoading || cooldowns[type] > 0}
            className={cooldowns[type] > 0 ? 'opacity-50' : ''}
            priority={priority}
          >
            <div className="flex flex-col items-center">
              <span className="text-xl mb-1">{getInteractionIcon(type)}</span>
              <span>{getInteractionName(type)}</span>
              {cooldowns[type] > 0 && (
                <span className="text-xs mt-1">
                  {cooldowns[type]}s
                </span>
              )}
            </div>
          </EnhancedAnimatedButton>
        ))}
      </OptimizedAnimatedContainer>
    );
  };

  // 渲染互动详情
  const renderInteractionDetail = () => {
    if (!selectedInteraction) return null;

    return (
      <OptimizedAnimatedContainer
        className="flex flex-col items-center"
        priority={priority}
      >
        <h3 className="text-xl font-semibold mb-4">
          {getInteractionIcon(selectedInteraction)} {getInteractionName(selectedInteraction)}
        </h3>

        {showAnimation && (
          <div className="mb-6">
            <EnhancedPandaAnimation
              type={interactionResult?.success ? (animationType || 'idle') : 'idle'}
              mood={pandaState?.mood || 'normal'}
              energy={pandaState?.energy || 'medium'}
              size={animationSize}
              duration={2}
              autoPlay={interactionResult?.success || false}
              priority={priority}
              disableOnLowPerformance={disableOnLowPerformance}
            />
          </div>
        )}

        {interactionResult && (
          <div className={`interaction-result p-3 rounded-lg mb-4 ${
            interactionResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-center ${
              interactionResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {interactionResult.message}
            </p>
            
            {interactionResult.success && interactionResult.experienceGained > 0 && (
              <p className="text-center text-jade-600 mt-2">
                {labels.experienceGained}: +{interactionResult.experienceGained}
              </p>
            )}
          </div>
        )}

        <div className="interaction-actions flex gap-2 mt-2">
          <Button
            variant="secondary"
            onClick={handleBackToInteractions}
          >
            {labels.backToInteractions}
          </Button>
          
          {!interactionResult?.success && (
            <Button
              variant="jade"
              onClick={handleInteractionExecute}
              disabled={isInteracting || cooldowns[selectedInteraction] > 0}
            >
              {isInteracting ? (
                <LoadingSpinner variant="white" size="small" />
              ) : (
                labels.tryAgain
              )}
            </Button>
          )}
        </div>
      </OptimizedAnimatedContainer>
    );
  };

  // 渲染互动统计
  const renderInteractionStats = () => {
    if (!interactionStats) return null;

    return (
      <OptimizedAnimatedContainer
        className="interaction-stats mt-4 p-3 bg-gray-50 rounded-lg"
        priority={priority}
      >
        <h3 className="text-lg font-semibold mb-2">{labels.statistics}</h3>
        
        <div className="stats-grid grid grid-cols-2 gap-2">
          {Object.entries(interactionStats.lastInteractionTimes).map(([type, timestamp]) => (
            <div key={type} className="stat-item">
              <div className="flex items-center">
                <span className="mr-1">{getInteractionIcon(type as InteractionType)}</span>
                <span className="text-sm font-medium">{getInteractionName(type as InteractionType)}</span>
              </div>
              <div className="text-xs text-gray-500">
                {labels.lastInteraction}: {formatLastInteractionTime(timestamp)}
              </div>
              <div className="text-xs text-gray-500">
                {labels.totalInteractions}: {interactionStats.interactionCounts[type as InteractionType] || 0}
              </div>
            </div>
          ))}
        </div>
      </OptimizedAnimatedContainer>
    );
  };

  // 如果正在加载或显示骨架屏，显示加载状态
  if (isSkeletonVisible) {
    return (
      <div className={`enhanced-panda-interaction-panel-skeleton ${className}`}>
        <div className="h-40 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // 渲染熊猫互动面板
  return (
    <EnhancedDataLoader
      isLoading={isLoading}
      isError={!!error}
      error={error}
      data={true}
      onRetry={loadInteractionStats}
      skeletonVariant="jade"
      skeletonLayout="list"
      skeletonCount={4}
    >
      {() => (
        <div className={`enhanced-panda-interaction-panel ${className}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedInteraction || 'selection'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedInteraction ? (
                renderInteractionDetail()
              ) : (
                <>
                  {renderInteractionSelection()}
                  {showStats && renderInteractionStats()}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </EnhancedDataLoader>
  );
};

export default EnhancedPandaInteractionPanel;
