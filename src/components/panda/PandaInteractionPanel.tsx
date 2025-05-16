// src/components/panda/PandaInteractionPanel.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  performInteraction,
  InteractionType,
  InteractionResult,
  getInteractionStats
} from '@/services/pandaInteractionService';
import PandaAnimation, { PandaAnimationType } from '@/components/game/PandaAnimation';
import { usePandaState } from '@/context/PandaStateProvider';
import AnimatedButton from '@/components/animation/AnimatedButton';
import { playSound, SoundType } from '@/utils/sound';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useLocalizedView } from '@/hooks/useLocalizedView';

// 互动面板属性
interface PandaInteractionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onInteractionComplete?: (result: InteractionResult) => void;
}

/**
 * 熊猫互动面板组件
 *
 * @param isOpen - 是否打开面板
 * @param onClose - 关闭面板回调
 * @param onInteractionComplete - 互动完成回调
 */
const PandaInteractionPanel: React.FC<PandaInteractionPanelProps> = ({
  isOpen,
  onClose,
  onInteractionComplete
}) => {
  const { pandaState, isLoading } = usePandaState();
  const [activeTab, setActiveTab] = useState<'main' | 'stats'>('main');
  const [selectedInteraction, setSelectedInteraction] = useState<InteractionType | null>(null);
  const [interactionResult, setInteractionResult] = useState<InteractionResult | null>(null);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [animationType, setAnimationType] = useState<PandaAnimationType>('idle');
  const [interactionStats, setInteractionStats] = useState<Record<InteractionType, { count: number; lastTime: Date | null; totalExperience: number }> | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<InteractionType, number>>({} as Record<InteractionType, number>);

  // 获取本地化内容
  const { content, currentLanguage } = useLocalizedView('pandaInteraction');

  // 加载互动统计信息
  useEffect(() => {
    if (isOpen && activeTab === 'stats') {
      loadInteractionStats();
    }
  }, [isOpen, activeTab]);

  // 更新冷却时间
  useEffect(() => {
    if (!isOpen || !Object.keys(cooldowns).length) return;

    const timer = setInterval(() => {
      setCooldowns(prevCooldowns => {
        const newCooldowns = { ...prevCooldowns };
        let hasActiveCooldowns = false;

        for (const type in newCooldowns) {
          if (newCooldowns[type] > 0) {
            newCooldowns[type] -= 1;
            hasActiveCooldowns = true;
          }
        }

        if (!hasActiveCooldowns) {
          clearInterval(timer);
        }

        return newCooldowns;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, cooldowns]);

  // 加载互动统计信息
  const loadInteractionStats = async () => {
    try {
      const stats = await getInteractionStats();
      setInteractionStats(stats);
    } catch (error) {
      console.error('Failed to load interaction stats:', error);
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
        message: `${getInteractionName(type)}${content.cooldownMessage} ${cooldowns[type]} ${content.seconds}`,
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
    } catch (error) {
      console.error('Interaction failed:', error);
      // 播放错误音效
      playSound(SoundType.ERROR, 0.5);

      setInteractionResult({
        success: false,
        message: `${content.interactionFailed}: ${error instanceof Error ? error.message : content.unknownError}`,
        experienceGained: 0,
        moodChanged: false,
        energyChanged: false
      });
    } finally {
      setIsInteracting(false);
    }
  };

  // 处理返回主菜单
  const handleBackToMenu = () => {
    // 播放按钮点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    setSelectedInteraction(null);
    setInteractionResult(null);
    setAnimationType('idle');
  };

  // 处理切换标签
  const handleTabChange = (tab: 'main' | 'stats') => {
    // 播放按钮点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    setActiveTab(tab);
    if (tab === 'stats') {
      loadInteractionStats();
    }
  };

  // 获取互动名称
  const getInteractionName = (type: InteractionType): string => {
    switch (type) {
      case InteractionType.PET:
        return content.pet;
      case InteractionType.FEED:
        return content.feed;
      case InteractionType.PLAY:
        return content.play;
      case InteractionType.TRAIN:
        return content.train;
      case InteractionType.CLEAN:
        return content.clean;
      case InteractionType.TALK:
        return content.talk;
      case InteractionType.GIFT:
        return content.gift;
      case InteractionType.PHOTO:
        return content.photo;
      case InteractionType.SLEEP:
        return content.sleep;
      case InteractionType.WAKE:
        return content.wake;
      default:
        return type;
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
      case InteractionType.CLEAN:
        return '🧼';
      case InteractionType.TALK:
        return '💬';
      case InteractionType.GIFT:
        return '🎁';
      case InteractionType.PHOTO:
        return '📷';
      case InteractionType.SLEEP:
        return '😴';
      case InteractionType.WAKE:
        return '⏰';
      default:
        return '❓';
    }
  };

  // 格式化时间
  const formatTime = (date: Date | null): string => {
    if (!date) return content.never;
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: currentLanguage === 'zh' ? zhCN : enUS
    });
  };

  // 渲染互动按钮
  const renderInteractionButtons = () => {
    const interactions = [
      InteractionType.PET,
      InteractionType.FEED,
      InteractionType.PLAY,
      InteractionType.TRAIN,
      InteractionType.CLEAN,
      InteractionType.TALK,
      InteractionType.GIFT,
      InteractionType.PHOTO,
      InteractionType.SLEEP,
      InteractionType.WAKE
    ];

    return (
      <div className="grid grid-cols-2 gap-3 mt-4">
        {interactions.map(type => (
          <AnimatedButton
            key={type}
            variant="jade"
            onClick={() => handleInteractionSelect(type)}
            disabled={isLoading || cooldowns[type] > 0}
            className={cooldowns[type] > 0 ? 'opacity-50' : ''}
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
          </AnimatedButton>
        ))}
      </div>
    );
  };

  // 渲染互动详情
  const renderInteractionDetail = () => {
    if (!selectedInteraction) return null;

    return (
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-4">
          {getInteractionIcon(selectedInteraction)} {getInteractionName(selectedInteraction)}
        </h3>

        <div className="mb-6">
          <PandaAnimation
            type={interactionResult?.success ? (animationType || 'idle') : 'idle'}
            mood={pandaState?.mood || 'normal'}
            energy={pandaState?.energy || 'medium'}
            size={180}
            duration={2}
            autoPlay={interactionResult?.success || false}
          />
        </div>

        {interactionResult ? (
          <div className={`p-4 rounded-lg mb-4 w-full text-center ${interactionResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className={interactionResult.success ? 'text-green-700' : 'text-red-700'}>
              {interactionResult.message}
            </p>
            {interactionResult.success && (
              <p className="text-green-700 mt-2">
                +{interactionResult.experienceGained} {content.experience}
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 bg-gray-100 rounded-lg mb-4 w-full text-center">
            <p>{content.confirmInteraction.replace('{interaction}', getInteractionName(selectedInteraction))}</p>
          </div>
        )}

        <div className="flex gap-3 mt-2">
          {!interactionResult ? (
            <>
              <AnimatedButton
                variant="jade"
                onClick={handleInteractionExecute}
                disabled={isInteracting}
              >
                {isInteracting ? content.interacting : content.confirm}
              </AnimatedButton>
              <AnimatedButton
                variant="secondary"
                onClick={handleBackToMenu}
                disabled={isInteracting}
              >
                {content.cancel}
              </AnimatedButton>
            </>
          ) : (
            <AnimatedButton
              variant="jade"
              onClick={handleBackToMenu}
            >
              {content.backToMenu}
            </AnimatedButton>
          )}
        </div>
      </div>
    );
  };

  // 渲染统计信息
  const renderStats = () => {
    if (!interactionStats) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-jade"></div>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-3">{content.interactionStats}</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">{content.interaction}</th>
                <th className="text-center py-2">{content.count}</th>
                <th className="text-center py-2">{content.experience}</th>
                <th className="text-right py-2">{content.lastTime}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(interactionStats).map(([type, stats]) => (
                <tr key={type} className="border-b border-gray-100">
                  <td className="py-2">
                    <div className="flex items-center">
                      <span className="mr-2">{getInteractionIcon(type as InteractionType)}</span>
                      <span>{getInteractionName(type as InteractionType)}</span>
                    </div>
                  </td>
                  <td className="text-center py-2">{stats.count}</td>
                  <td className="text-center py-2">{stats.totalExperience}</td>
                  <td className="text-right py-2 text-sm text-gray-600">{formatTime(stats.lastTime)}</td>
                </tr>
              ))}
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
        className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
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
            className={`py-2 px-4 ${activeTab === 'main' ? 'border-b-2 border-jade text-jade' : 'text-gray-500'}`}
            onClick={() => handleTabChange('main')}
          >
            {content.interactions}
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'stats' ? 'border-b-2 border-jade text-jade' : 'text-gray-500'}`}
            onClick={() => handleTabChange('stats')}
          >
            {content.statistics}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'main' ? (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {selectedInteraction ? renderInteractionDetail() : renderInteractionButtons()}
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderStats()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default PandaInteractionPanel;
