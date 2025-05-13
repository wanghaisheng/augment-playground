// src/components/game/AbilityCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { PandaAbilityRecord, AbilityType } from '@/services/pandaAbilityService';
import { RewardRarity } from '@/services/rewardService';

interface AbilityCardProps {
  ability: PandaAbilityRecord;
  isUnlocked: boolean;
  onActivate?: () => void;
  className?: string;
}

/**
 * 熊猫能力卡片组件
 * 显示熊猫能力的详细信息
 * 
 * @param ability - 能力数据
 * @param isUnlocked - 是否已解锁
 * @param onActivate - 激活能力的回调函数
 * @param className - 自定义类名
 */
const AbilityCard: React.FC<AbilityCardProps> = ({
  ability,
  isUnlocked,
  onActivate,
  className = ''
}) => {
  // 获取能力类型的中文名称
  const getAbilityTypeName = (type: AbilityType): string => {
    switch (type) {
      case AbilityType.PASSIVE:
        return '被动';
      case AbilityType.ACTIVE:
        return '主动';
      case AbilityType.ULTIMATE:
        return '终极';
      default:
        return '未知';
    }
  };

  // 获取稀有度的中文名称
  const getRarityName = (rarity: RewardRarity): string => {
    switch (rarity) {
      case RewardRarity.COMMON:
        return '普通';
      case RewardRarity.UNCOMMON:
        return '不常见';
      case RewardRarity.RARE:
        return '稀有';
      case RewardRarity.EPIC:
        return '史诗';
      case RewardRarity.LEGENDARY:
        return '传说';
      default:
        return '普通';
    }
  };

  // 获取稀有度的颜色
  const getRarityColor = (rarity: RewardRarity): string => {
    switch (rarity) {
      case RewardRarity.COMMON:
        return 'var(--text-primary)';
      case RewardRarity.UNCOMMON:
        return 'var(--jade-green)';
      case RewardRarity.RARE:
        return 'var(--imperial-blue)';
      case RewardRarity.EPIC:
        return 'var(--imperial-purple)';
      case RewardRarity.LEGENDARY:
        return 'var(--imperial-gold)';
      default:
        return 'var(--text-primary)';
    }
  };

  // 检查能力是否可用（已解锁且不在冷却中）
  const isAvailable = (): boolean => {
    if (!isUnlocked) {
      return false;
    }

    // 被动能力总是可用
    if (ability.type === AbilityType.PASSIVE) {
      return true;
    }

    // 检查冷却时间
    if (ability.lastUsedAt && ability.cooldownMinutes) {
      const now = new Date();
      const cooldownEndTime = new Date(ability.lastUsedAt);
      cooldownEndTime.setMinutes(cooldownEndTime.getMinutes() + ability.cooldownMinutes);
      
      return now >= cooldownEndTime;
    }

    return true;
  };

  // 获取冷却剩余时间
  const getCooldownRemaining = (): string => {
    if (!ability.lastUsedAt || !ability.cooldownMinutes) {
      return '';
    }

    const now = new Date();
    const cooldownEndTime = new Date(ability.lastUsedAt);
    cooldownEndTime.setMinutes(cooldownEndTime.getMinutes() + ability.cooldownMinutes);

    if (now >= cooldownEndTime) {
      return '';
    }

    const remainingMs = cooldownEndTime.getTime() - now.getTime();
    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));

    if (remainingMinutes < 60) {
      return `${remainingMinutes}分钟`;
    } else {
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = remainingMinutes % 60;
      return `${hours}小时${minutes > 0 ? ` ${minutes}分钟` : ''}`;
    }
  };

  return (
    <motion.div
      className={`ability-card ${className} ${isUnlocked ? 'unlocked' : 'locked'} ${ability.type.toLowerCase()}-ability`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="ability-card-header">
        <div className="ability-icon">
          <img 
            src={ability.iconPath} 
            alt={ability.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/assets/abilities/default-ability.svg';
            }}
          />
        </div>
        <div className="ability-info">
          <h3 className="ability-name" style={{ color: getRarityColor(ability.rarity) }}>
            {ability.name}
          </h3>
          <div className="ability-meta">
            <span className="ability-type">{getAbilityTypeName(ability.type)}</span>
            <span className="ability-rarity">{getRarityName(ability.rarity)}</span>
          </div>
        </div>
      </div>

      <div className="ability-card-body">
        <p className="ability-description">{ability.description}</p>
        
        {!isUnlocked && (
          <div className="ability-unlock-info">
            <span className="ability-lock-icon">🔒</span>
            <span>需要等级 {ability.requiredLevel} 解锁</span>
          </div>
        )}
        
        {isUnlocked && ability.type !== AbilityType.PASSIVE && (
          <div className="ability-cooldown">
            {getCooldownRemaining() ? (
              <span className="cooldown-remaining">冷却中: {getCooldownRemaining()}</span>
            ) : (
              <span className="cooldown-info">冷却时间: {ability.cooldownMinutes} 分钟</span>
            )}
          </div>
        )}
      </div>

      {isUnlocked && ability.type !== AbilityType.PASSIVE && (
        <div className="ability-card-footer">
          <button
            className={`activate-button ${isAvailable() ? 'available' : 'unavailable'}`}
            onClick={onActivate}
            disabled={!isAvailable()}
          >
            {ability.isActive ? '已激活' : '激活能力'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AbilityCard;
