// src/components/panda/PandaInteractionTab.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  InteractionType, 
  InteractionResult 
} from '@/types/pandaInteractionTypes';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { usePandaState } from '@/context/PandaStateProvider';
import { useSkeletonContext } from '@/context/SkeletonProvider';
import EnhancedPandaInteractionPanel from './EnhancedPandaInteractionPanel';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';
import EnhancedDataLoader from '@/components/common/EnhancedDataLoader';
import TraditionalWindowModal from '@/components/common/TraditionalWindowModal';
import Button from '@/components/common/Button';

interface PandaInteractionTabProps {
  className?: string;
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
    rewardTitle?: string;
    rewardMessage?: string;
    close?: string;
  };
}

/**
 * 熊猫互动标签页组件
 * 提供与熊猫互动的界面
 * 
 * @param className - 自定义类名
 * @param labels - 本地化标签
 */
const PandaInteractionTab: React.FC<PandaInteractionTabProps> = ({
  className = '',
  labels: propLabels
}) => {
  const [interactionResult, setInteractionResult] = useState<InteractionResult | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  
  // 获取熊猫状态
  const { pandaState, updatePandaState } = usePandaState();
  
  // 获取骨架屏上下文
  const { isSkeletonVisible } = useSkeletonContext();
  
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
    rewardTitle: propLabels?.rewardTitle || componentLabels?.pandaInteraction?.rewardTitle || "Reward",
    rewardMessage: propLabels?.rewardMessage || componentLabels?.pandaInteraction?.rewardMessage || "You received a reward!",
    close: propLabels?.close || componentLabels?.pandaInteraction?.close || "Close"
  };

  // 处理互动完成
  const handleInteractionComplete = (result: InteractionResult) => {
    setInteractionResult(result);
    
    // 如果有奖励，显示奖励模态框
    if (result.rewards && result.rewards.length > 0) {
      setShowRewardModal(true);
    }
    
    // 如果心情或能量发生变化，更新熊猫状态
    if ((result.moodChanged || result.energyChanged) && updatePandaState && pandaState) {
      updatePandaState({
        ...pandaState,
        mood: result.newMood || pandaState.mood,
        energy: result.newEnergy || pandaState.energy
      });
    }
  };

  // 处理关闭奖励模态框
  const handleCloseRewardModal = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    setShowRewardModal(false);
  };

  // 渲染熊猫互动标签页
  return (
    <EnhancedDataLoader
      isLoading={isSkeletonVisible}
      isError={false}
      error={null}
      data={true}
      skeletonVariant="jade"
      skeletonLayout="card"
      skeletonCount={1}
    >
      {() => (
        <OptimizedAnimatedContainer
          className={`panda-interaction-tab ${className}`}
          priority="high"
        >
          <EnhancedPandaInteractionPanel
            onInteractionComplete={handleInteractionComplete}
            showStats={true}
            showAnimation={true}
            animationSize={180}
            priority="high"
            labels={{
              title: labels.title,
              interactions: labels.interactions,
              statistics: labels.statistics,
              pet: labels.pet,
              feed: labels.feed,
              play: labels.play,
              train: labels.train,
              sleep: labels.sleep,
              cooldownMessage: labels.cooldownMessage,
              seconds: labels.seconds,
              experienceGained: labels.experienceGained,
              lastInteraction: labels.lastInteraction,
              totalInteractions: labels.totalInteractions
            }}
          />

          {/* 奖励模态框 */}
          {showRewardModal && interactionResult && interactionResult.rewards && (
            <TraditionalWindowModal
              isOpen={showRewardModal}
              onClose={handleCloseRewardModal}
              title={labels.rewardTitle}
              size="small"
            >
              <div className="reward-modal-content p-4">
                <div className="reward-message text-center mb-4">
                  <p className="text-jade-700">{labels.rewardMessage}</p>
                </div>
                
                <div className="rewards-list mb-4">
                  {interactionResult.rewards.map((reward, index) => (
                    <div key={index} className="reward-item flex items-center p-2 bg-jade-50 rounded-lg mb-2">
                      <div className="reward-icon mr-3">
                        {reward.type === 'bamboo' && (
                          <span className="text-2xl">🎋</span>
                        )}
                        {reward.type === 'item' && (
                          <span className="text-2xl">🎁</span>
                        )}
                        {reward.type === 'experience' && (
                          <span className="text-2xl">✨</span>
                        )}
                      </div>
                      <div className="reward-details">
                        <h4 className="text-sm font-bold text-jade-800">{reward.name}</h4>
                        <p className="text-xs text-gray-600">{reward.description}</p>
                      </div>
                      <div className="reward-amount ml-auto font-bold text-jade-700">
                        {reward.amount > 0 && `+${reward.amount}`}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="modal-actions flex justify-center">
                  <Button
                    variant="jade"
                    onClick={handleCloseRewardModal}
                  >
                    {labels.close}
                  </Button>
                </div>
              </div>
            </TraditionalWindowModal>
          )}
        </OptimizedAnimatedContainer>
      )}
    </EnhancedDataLoader>
  );
};

export default PandaInteractionTab;
