// src/components/game/AbilityCard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PandaAbilityRecord, AbilityType, getAbilityKeyFromName, getLocalizedAbilityName, getLocalizedAbilityDescription } from '@/services/pandaAbilityService';
import { RewardRarity } from '@/services/rewardService';
import { AbilityCardLabels } from '@/types';

interface AbilityCardProps {
  ability: PandaAbilityRecord;
  isUnlocked: boolean;
  onActivate?: () => void;
  className?: string;
  labels?: AbilityCardLabels;
}

/**
 * Panda ability card component
 * Displays detailed information about a panda ability
 *
 * @param ability - Ability data
 * @param isUnlocked - Whether the ability is unlocked
 * @param onActivate - Callback function to activate the ability
 * @param className - Custom class name
 * @param labels - Localized labels for the component
 */
const AbilityCard: React.FC<AbilityCardProps> = ({
  ability,
  isUnlocked,
  onActivate,
  className = '',
  labels
}) => {
  const [localizedName, setLocalizedName] = useState<string>(ability.name);
  const [localizedDescription, setLocalizedDescription] = useState<string>(ability.description);

  // Load localized name and description
  useEffect(() => {
    const abilityKey = getAbilityKeyFromName(ability.name);
    if (abilityKey) {
      // Load localized name
      getLocalizedAbilityName(abilityKey, ability.name)
        .then(name => setLocalizedName(name))
        .catch(err => console.error('Error loading localized ability name:', err));

      // Load localized description
      getLocalizedAbilityDescription(abilityKey, ability.description)
        .then(desc => setLocalizedDescription(desc))
        .catch(err => console.error('Error loading localized ability description:', err));
    }
  }, [ability.name, ability.description]);
  // Get ability type name with localization
  const getAbilityTypeName = (type: AbilityType): string => {
    switch (type) {
      case AbilityType.PASSIVE:
        return labels?.typePassive || 'Passive';
      case AbilityType.ACTIVE:
        return labels?.typeActive || 'Active';
      case AbilityType.ULTIMATE:
        return labels?.typeUltimate || 'Ultimate';
      default:
        return labels?.typeUnknown || 'Unknown';
    }
  };

  // Get rarity name with localization
  const getRarityName = (rarity: RewardRarity): string => {
    switch (rarity) {
      case RewardRarity.COMMON:
        return labels?.rarityCommon || 'Common';
      case RewardRarity.UNCOMMON:
        return labels?.rarityUncommon || 'Uncommon';
      case RewardRarity.RARE:
        return labels?.rarityRare || 'Rare';
      case RewardRarity.EPIC:
        return labels?.rarityEpic || 'Epic';
      case RewardRarity.LEGENDARY:
        return labels?.rarityLegendary || 'Legendary';
      default:
        return labels?.rarityCommon || 'Common';
    }
  };

  // Get rarity color
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

  // Check if ability is available (unlocked and not on cooldown)
  const isAvailable = (): boolean => {
    if (!isUnlocked) {
      return false;
    }

    // Passive abilities are always available
    if (ability.type === AbilityType.PASSIVE) {
      return true;
    }

    // Check cooldown time
    if (ability.lastUsedAt && ability.cooldownMinutes) {
      const now = new Date();
      const cooldownEndTime = new Date(ability.lastUsedAt);
      cooldownEndTime.setMinutes(cooldownEndTime.getMinutes() + ability.cooldownMinutes);

      return now >= cooldownEndTime;
    }

    return true;
  };

  // Get remaining cooldown time with localization
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

    const minutesUnit = labels?.minutesUnit || 'min';
    const hourUnit = 'h'; // We could add this to labels if needed

    if (remainingMinutes < 60) {
      return `${remainingMinutes} ${minutesUnit}`;
    } else {
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = remainingMinutes % 60;
      return `${hours}${hourUnit}${minutes > 0 ? ` ${minutes}${minutesUnit}` : ''}`;
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
            {localizedName}
          </h3>
          <div className="ability-meta">
            <span className="ability-type">{getAbilityTypeName(ability.type)}</span>
            <span className="ability-rarity">{getRarityName(ability.rarity)}</span>
          </div>
        </div>
      </div>

      <div className="ability-card-body">
        <p className="ability-description">{localizedDescription}</p>

        {!isUnlocked && (
          <div className="ability-unlock-info">
            <span className="ability-lock-icon">🔒</span>
            <span>{labels?.requiredLevelLabel || 'Required Level'} {ability.requiredLevel}</span>
          </div>
        )}

        {isUnlocked && ability.type !== AbilityType.PASSIVE && (
          <div className="ability-cooldown">
            {getCooldownRemaining() ? (
              <span className="cooldown-remaining">{labels?.cooldownRemainingLabel || 'Cooling down'}: {getCooldownRemaining()}</span>
            ) : (
              <span className="cooldown-info">{labels?.cooldownLabel || 'Cooldown'}: {ability.cooldownMinutes} {labels?.minutesUnit || 'min'}</span>
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
            {ability.isActive
              ? (labels?.alreadyActivatedText || 'Already Activated')
              : (labels?.activateButtonText || 'Activate Ability')}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AbilityCard;
