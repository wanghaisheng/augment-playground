// src/pages/PandaInteractionShowcase.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PandaAnimation, { PandaAnimationType } from '@/components/game/PandaAnimation';
import { usePandaState } from '@/context/PandaStateProvider';
import AnimatedButton from '@/components/animation/AnimatedButton';
import {
  InteractionType,
  type InteractionResult
} from '@/types/pandaInteractionTypes';
import {
  performInteraction
} from '@/services/pandaInteractionService';
import { playSound, SoundType, enableSound } from '@/utils/sound';

/**
 * 熊猫互动展示页面
 * 展示各种熊猫互动动画和效果
 */
const PandaInteractionShowcase: React.FC = () => {
  const { pandaState } = usePandaState();
  const [selectedAnimation, setSelectedAnimation] = useState<PandaAnimationType>('idle');
  const [selectedInteraction, setSelectedInteraction] = useState<InteractionType | null>(null);
  const [interactionResult, setInteractionResult] = useState<InteractionResult | null>(null);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  // 启用声音（用户交互后）
  useEffect(() => {
    enableSound();
  }, []);

  // 动画类型选项
  const animationTypes: PandaAnimationType[] = [
    'idle',
    'pet',
    'eat',
    'play',
    'train',
    'clean',
    'talk',
    'happy',
    'pose',
    'sleep',
    'wake',
    'levelUp'
  ];

  // 互动类型选项
  const interactionTypes: InteractionType[] = [
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

  // 处理动画选择
  const handleAnimationSelect = (type: PandaAnimationType) => {
    setSelectedAnimation(type);
    playSound(SoundType.BUTTON_CLICK, 0.3);
  };

  // 处理互动选择
  const handleInteractionSelect = (type: InteractionType) => {
    setSelectedInteraction(type);
    setInteractionResult(null);
    setShowResult(false);
    playSound(SoundType.BUTTON_CLICK, 0.3);
  };

  // 处理互动执行
  const handleInteractionExecute = async () => {
    if (!selectedInteraction) return;

    try {
      setIsInteracting(true);

      // 执行互动
      const result = await performInteraction(selectedInteraction);
      setInteractionResult(result);
      setShowResult(true);

      if (result.success && result.animation) {
        setSelectedAnimation(result.animation as PandaAnimationType);
      }
    } catch (error) {
      console.error('Interaction failed:', error);
      setInteractionResult({
        success: false,
        message: `互动失败：${error instanceof Error ? error.message : '未知错误'}`,
        experienceGained: 0,
        moodChanged: false,
        energyChanged: false
      });
      setShowResult(true);
    } finally {
      setIsInteracting(false);
    }
  };

  // 获取互动名称
  const getInteractionName = (type: InteractionType): string => {
    switch (type) {
      case InteractionType.PET:
        return '抚摸';
      case InteractionType.FEED:
        return '喂食';
      case InteractionType.PLAY:
        return '玩耍';
      case InteractionType.TRAIN:
        return '训练';
      case InteractionType.CLEAN:
        return '清洁';
      case InteractionType.TALK:
        return '对话';
      case InteractionType.GIFT:
        return '赠送礼物';
      case InteractionType.PHOTO:
        return '拍照';
      case InteractionType.SLEEP:
        return '睡觉';
      case InteractionType.WAKE:
        return '唤醒';
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

  return (
    <div className="page-container">
      <div className="bamboo-frame">
        <h1>熊猫互动展示</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">动画预览</h2>
            <div className="border border-gray-200 rounded-lg p-8 flex justify-center items-center h-64 relative bg-gray-50">
              <PandaAnimation
                type={selectedAnimation}
                mood={pandaState?.mood || 'normal'}
                energy={pandaState?.energy || 'medium'}
                size={180}
                duration={2}
                loop={selectedAnimation === 'idle'}
                autoPlay={true}
                showAccessories={true}
              />
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">选择动画类型</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {animationTypes.map((type) => (
                <AnimatedButton
                  key={type}
                  color={selectedAnimation === type ? 'jade' : 'silk'}
                  size="small"
                  onClick={() => handleAnimationSelect(type)}
                >
                  {type}
                </AnimatedButton>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">互动系统</h2>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-3">选择互动类型</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {interactionTypes.map((type) => (
                  <AnimatedButton
                    key={type}
                    color={selectedInteraction === type ? 'jade' : 'silk'}
                    size="small"
                    onClick={() => handleInteractionSelect(type)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{getInteractionIcon(type)}</span>
                      <span>{getInteractionName(type)}</span>
                    </div>
                  </AnimatedButton>
                ))}
              </div>

              {selectedInteraction && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {getInteractionIcon(selectedInteraction)} {getInteractionName(selectedInteraction)}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    执行此互动将会影响熊猫的心情和能量，并获得经验值。
                  </p>
                  <AnimatedButton
                    color="jade"
                    onClick={handleInteractionExecute}
                    disabled={isInteracting}
                  >
                    {isInteracting ? '互动中...' : '执行互动'}
                  </AnimatedButton>
                </div>
              )}

              {showResult && interactionResult && (
                <motion.div
                  className={`p-4 rounded-lg mt-4 ${interactionResult.success ? 'bg-green-100' : 'bg-red-100'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className={interactionResult.success ? 'text-green-700' : 'text-red-700'}>
                    {interactionResult.message}
                  </p>
                  {interactionResult.success && (
                    <>
                      <p className="text-green-700 mt-2">
                        +{interactionResult.experienceGained} 经验
                      </p>
                      {interactionResult.moodChanged && (
                        <p className="text-green-700">
                          心情变化: {interactionResult.newMood}
                        </p>
                      )}
                      {interactionResult.energyChanged && (
                        <p className="text-green-700">
                          能量变化: {interactionResult.newEnergy}
                        </p>
                      )}
                      {interactionResult.cooldown && (
                        <p className="text-amber-700 mt-2">
                          冷却时间: {interactionResult.cooldown} 秒
                        </p>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">熊猫状态</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">心情</h3>
              <p className="text-xl">{pandaState?.mood || 'normal'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">能量</h3>
              <p className="text-xl">{pandaState?.energy || 'medium'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">经验</h3>
              <p className="text-xl">{pandaState?.experience || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PandaInteractionShowcase;
