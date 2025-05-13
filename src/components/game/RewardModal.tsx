// src/components/game/RewardModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollDialog from './ScrollDialog';
import Button from '@/components/common/Button';
import RewardAnimation from '@/components/animation/RewardAnimation';
import { RewardRecord, markRewardsAsViewed } from '@/services/rewardService';
import { useTableRefresh } from '@/hooks/useDataRefresh';

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

  // 当前展示的奖励
  const currentReward = rewards[currentRewardIndex];

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setCurrentRewardIndex(0);
      setShowAll(false);
      setAnimationComplete(false);
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
  };

  // 显示下一个奖励
  const handleNextReward = () => {
    if (currentRewardIndex < rewards.length - 1) {
      setCurrentRewardIndex(prev => prev + 1);
      setAnimationComplete(false);
    } else {
      setShowAll(true);
    }
  };

  // 获取奖励稀有度的中文名称
  const getRarityName = (rarity: string): string => {
    switch (rarity) {
      case 'common': return '普通';
      case 'uncommon': return '不常见';
      case 'rare': return '稀有';
      case 'epic': return '史诗';
      case 'legendary': return '传说';
      default: return '普通';
    }
  };

  // 获取奖励类型的中文名称
  const getTypeName = (type: string): string => {
    switch (type) {
      case 'experience': return '经验值';
      case 'coin': return '竹币';
      case 'item': return '物品';
      case 'badge': return '徽章';
      case 'ability': return '能力';
      default: return '奖励';
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
          <h3 className="reward-title">暂无奖励</h3>
          <div className="reward-navigation">
            <Button variant="gold" onClick={onClose}>
              关闭
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="reward-showcase">
        <h3 className="reward-title">
          获得{getTypeName(currentReward.type)}奖励！
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
              数量: {currentReward.amount}
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
                    下一个奖励
                  </Button>
                ) : (
                  <Button variant="jade" onClick={() => setShowAll(true)}>
                    查看全部奖励
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
          <h3 className="rewards-summary-title">暂无奖励</h3>
          <div className="rewards-summary-footer">
            <Button variant="gold" onClick={onClose}>
              关闭
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="rewards-summary">
        <h3 className="rewards-summary-title">
          任务奖励总览
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
            关闭
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title="任务奖励"
      closeOnOutsideClick={false}
      closeOnEsc={false}
      showCloseButton={showAll}
      footer={null}
    >
      <div className="reward-modal-content">
        {!showAll ? renderSingleReward() : renderAllRewards()}
      </div>
    </ScrollDialog>
  );
};

export default RewardModal;
