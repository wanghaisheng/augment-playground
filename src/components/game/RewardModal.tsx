// src/components/game/RewardModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollDialog from './ScrollDialog';
import Button from '@/components/common/Button';
import RewardAnimation from '@/components/animation/RewardAnimation';
import { RewardRecord, markRewardsAsViewed, RewardType } from '@/services/rewardService';

import VipBoostPrompt from '@/components/vip/VipBoostPrompt';

import { initializeVipBoostPromptLabels } from '@/data/vipBoostPromptLabels';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: RewardRecord[];
}

/**
 * 奖励展示模态框
 * 以卷轴风格展示任务完成后获得的奖励
 *
 * @param isOpen - 控制模态框是否显示
 * @param onClose - 关闭模态框的回调函数
 * @param rewards - 要展示的奖励列表
 */
const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  onClose,
  rewards
}) => {
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showVipPrompt, setShowVipPrompt] = useState(false);

  // 当前展示的奖励
  const currentReward = rewards[currentRewardIndex];

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setCurrentRewardIndex(0);
      setShowAll(false);
      setAnimationComplete(false);

      // 初始化VIP助推提示标签
      initializeVipBoostPromptLabels();
    }
  }, [isOpen]);

  // 标记奖励为已查看
  useEffect(() => {
    if (!isOpen) return;

    const rewardIds = rewards
      .filter(reward => reward.id !== undefined)
      .map(reward => reward.id as number);

    if (rewardIds.length > 0) {
      markRewardsAsViewed(rewardIds);
    }
  }, [isOpen, rewards]);

  // 处理动画完成
  const handleAnimationComplete = () => {
    setAnimationComplete(true);

    // 如果是经验值或竹币奖励，并且有倍数信息，显示VIP助推提示
    if (currentReward &&
        (currentReward.type === RewardType.EXPERIENCE || currentReward.type === RewardType.COIN) &&
        currentReward.baseAmount !== undefined &&
        currentReward.multiplier !== undefined &&
        currentReward.multiplier > 1) {
      // 延迟显示VIP助推提示，让用户先看到奖励动画
      setTimeout(() => {
        setShowVipPrompt(true);
      }, 1000);
    }
  };

  // 显示下一个奖励
  const handleNextReward = () => {
    // 关闭VIP助推提示
    setShowVipPrompt(false);

    if (currentRewardIndex < rewards.length - 1) {
      setCurrentRewardIndex(prev => prev + 1);
      setAnimationComplete(false);
    } else {
      setShowAll(true);
    }
  };

  // 处理关闭VIP助推提示
  const handleCloseVipPrompt = () => {
    setShowVipPrompt(false);
  };

  // 获取奖励稀有度的名称
  const getRarityName = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'Common';
      case 'uncommon': return 'Uncommon';
      case 'rare': return 'Rare';
      case 'epic': return 'Epic';
      case 'legendary': return 'Legendary';
      default: return 'Common';
    }
  };

  // 获取奖励类型的名称
  const getTypeName = (type: string): string => {
    switch (type) {
      case 'experience': return 'Experience';
      case 'coin': return 'Bamboo Coin';
      case 'item': return 'Item';
      case 'badge': return 'Badge';
      case 'ability': return 'Ability';
      default: return 'Reward';
    }
  };

  // 根据稀有度获取动画样式
  const getAnimationStyleForRarity = (rarity: string): 'default' | 'burst' | 'float' | 'spin' | 'pulse' => {
    switch (rarity) {
      case 'legendary': return 'burst';
      case 'epic': return 'spin';
      case 'rare': return 'pulse';
      case 'uncommon': return 'float';
      default: return 'default';
    }
  };

  // 渲染单个奖励展示
  const renderSingleReward = () => {
    // 确保有奖励可以显示
    if (!rewards.length || !currentReward) {
      return (
        <div className="reward-showcase">
          <h3 className="reward-title">No Rewards</h3>
          <div className="reward-navigation">
            <Button variant="gold" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="reward-showcase">
        <h3 className="reward-title">
          You got a {getTypeName(currentReward.type)} reward!
        </h3>

        <div className="reward-animation-container">
          <RewardAnimation
            type={currentReward.type}
            rarity={currentReward.rarity}
            iconPath={currentReward.iconPath}
            amount={currentReward.amount}
            size={120}
            onAnimationComplete={handleAnimationComplete}
            animationStyle={getAnimationStyleForRarity(currentReward.rarity)}
            playSound={true}
            soundVolume={0.6}
          />
        </div>

        <div className="reward-details">
          <h4>{currentReward.name}</h4>
          <p className="reward-rarity">
            {getRarityName(currentReward.rarity)}
          </p>
          <p className="reward-description">
            {currentReward.description}
          </p>
          {currentReward.amount > 1 && (
            <p className="reward-amount">
              Quantity: {currentReward.amount}
            </p>
          )}
        </div>

        <div className="reward-navigation">
          <AnimatePresence>
            {animationComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentRewardIndex < rewards.length - 1 ? (
                  <Button variant="jade" onClick={handleNextReward}>
                    Next Reward
                  </Button>
                ) : (
                  <Button variant="jade" onClick={() => setShowAll(true)}>
                    View All Rewards
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // 渲染所有奖励列表
  const renderAllRewards = () => {
    // 确保有奖励可以显示
    if (!rewards.length) {
      return (
        <div className="rewards-summary">
          <h3 className="rewards-summary-title">No Rewards</h3>
          <div className="rewards-summary-footer">
            <Button variant="gold" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="rewards-summary">
        <h3 className="rewards-summary-title">
          Rewards Summary
        </h3>

        <div className="rewards-list">
          {rewards.map((reward, index) => (
            <div key={index} className="reward-item">
              <div className="reward-item-icon">
                <img
                  src={reward.iconPath}
                  alt={reward.name}
                  style={{ width: 40, height: 40 }}
                />
              </div>
              <div className="reward-item-details">
                <h4>{reward.name}</h4>
                <p className="reward-item-description">
                  {reward.description}
                </p>
              </div>
              <div className="reward-item-amount">
                {reward.amount > 0 && `x${reward.amount}`}
              </div>
            </div>
          ))}
        </div>

        <div className="rewards-summary-footer">
          <Button variant="gold" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <ScrollDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Task Rewards"
        closeOnOutsideClick={false}
        closeOnEsc={false}
        showCloseButton={showAll}
        footer={null}
      >
        <div className="reward-modal-content">
          {!showAll ? renderSingleReward() : renderAllRewards()}
        </div>
      </ScrollDialog>

      {/* VIP助推提示 */}
      {currentReward && currentReward.baseAmount !== undefined && (
        <VipBoostPrompt
          isOpen={showVipPrompt}
          onClose={handleCloseVipPrompt}
          rewardType={currentReward.type}
          baseAmount={currentReward.baseAmount}
          vipAmount={currentReward.amount}
          rarity={currentReward.rarity}
          promptType={currentReward.type === RewardType.EXPERIENCE ? 'task' : 'bamboo'}
        />
      )}
    </>
  );
};

export default RewardModal;
