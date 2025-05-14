// src/components/game/AbilityList.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AbilityCard from './AbilityCard';
import { PandaAbilityRecord, AbilityType } from '@/services/pandaAbilityService';
import ScrollDialog from './ScrollDialog';
import { AbilityCardLabels, AbilityDetailLabels, AbilityFilterLabels } from '@/types';

interface AbilityListProps {
  abilities: PandaAbilityRecord[];
  unlockedAbilities: PandaAbilityRecord[];
  onActivateAbility: (abilityId: number) => Promise<void>;
  pandaLevel: number;
  labels?: {
    filters?: AbilityFilterLabels;
    card?: AbilityCardLabels;
    detail?: AbilityDetailLabels;
    noAbilitiesMessage?: string;
  };
}

/**
 * Panda ability list component
 * Displays all panda abilities and allows activation of unlocked abilities
 *
 * @param abilities - List of all abilities
 * @param unlockedAbilities - List of unlocked abilities
 * @param onActivateAbility - Callback function to activate an ability
 * @param pandaLevel - Current panda level
 * @param labels - Localized labels for the component
 */
const AbilityList: React.FC<AbilityListProps> = ({
  abilities,
  unlockedAbilities,
  onActivateAbility,
  pandaLevel,
  labels
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedAbility, setSelectedAbility] = useState<PandaAbilityRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter abilities based on selected filter
  const filteredAbilities = abilities.filter(ability => {
    if (activeFilter === 'all') {
      return true;
    }
    if (activeFilter === 'unlocked') {
      return unlockedAbilities.some(unlocked => unlocked.id === ability.id);
    }
    if (activeFilter === 'locked') {
      return !unlockedAbilities.some(unlocked => unlocked.id === ability.id);
    }
    if (activeFilter === 'passive') {
      return ability.type === AbilityType.PASSIVE;
    }
    if (activeFilter === 'active') {
      return ability.type === AbilityType.ACTIVE;
    }
    if (activeFilter === 'ultimate') {
      return ability.type === AbilityType.ULTIMATE;
    }
    return true;
  });

  // Check if ability is unlocked
  const isAbilityUnlocked = (ability: PandaAbilityRecord): boolean => {
    return unlockedAbilities.some(unlocked => unlocked.id === ability.id);
  };

  // Handle ability activation
  const handleActivateAbility = async (abilityId: number) => {
    await onActivateAbility(abilityId);
  };

  // Open ability detail modal
  const openAbilityDetail = (ability: PandaAbilityRecord) => {
    setSelectedAbility(ability);
    setIsDetailModalOpen(true);
  };

  // Close ability detail modal
  const closeAbilityDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedAbility(null);
  };

  return (
    <div className="ability-list-container">
      <div className="filter-section">
        <h3 className="filter-title">{labels?.filters?.statusLabel || 'Status'}</h3>
        <div className="ability-filters">
          <button
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            {labels?.filters?.allLabel || 'All'}
          </button>
          <button
            className={`filter-button ${activeFilter === 'unlocked' ? 'active' : ''}`}
            onClick={() => setActiveFilter('unlocked')}
          >
            {labels?.filters?.unlockedLabel || 'Unlocked'}
          </button>
          <button
            className={`filter-button ${activeFilter === 'locked' ? 'active' : ''}`}
            onClick={() => setActiveFilter('locked')}
          >
            {labels?.filters?.lockedLabel || 'Locked'}
          </button>
          <button
            className={`filter-button ${activeFilter === 'passive' ? 'active' : ''}`}
            onClick={() => setActiveFilter('passive')}
          >
            {labels?.filters?.passiveLabel || 'Passive'}
          </button>
          <button
            className={`filter-button ${activeFilter === 'active' ? 'active' : ''}`}
            onClick={() => setActiveFilter('active')}
          >
            {labels?.filters?.activeLabel || 'Active'}
          </button>
          <button
            className={`filter-button ${activeFilter === 'ultimate' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ultimate')}
          >
            {labels?.filters?.ultimateLabel || 'Ultimate'}
          </button>
        </div>
      </div>

      <div className="abilities-grid">
        <AnimatePresence>
          {filteredAbilities.map(ability => (
            <motion.div
              key={ability.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={() => openAbilityDetail(ability)}
            >
              <AbilityCard
                ability={ability}
                isUnlocked={isAbilityUnlocked(ability)}
                onActivate={() => ability.id && handleActivateAbility(ability.id)}
                labels={labels?.card}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAbilities.length === 0 && (
        <div className="no-abilities">
          <p>{labels?.noAbilitiesMessage || 'No abilities match the current filter'}</p>
        </div>
      )}

      {/* Ability detail modal */}
      <ScrollDialog
        isOpen={isDetailModalOpen}
        onClose={closeAbilityDetail}
        title={selectedAbility?.name || labels?.detail?.title || 'Ability Details'}
      >
        {selectedAbility && (
          <div className="ability-detail">
            <div className="ability-detail-icon">
              <img
                src={selectedAbility.iconPath}
                alt={selectedAbility.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/assets/abilities/default-ability.svg';
                }}
              />
            </div>

            <div className="ability-detail-info">
              <p className="ability-detail-description">
                {selectedAbility.description}
              </p>

              <div className="ability-detail-meta">
                <div className="meta-item">
                  <span className="meta-label">{labels?.detail?.typeLabel || 'Type'}:</span>
                  <span className="meta-value">
                    {selectedAbility.type === AbilityType.PASSIVE
                      ? (labels?.card?.typePassive || 'Passive')
                      : selectedAbility.type === AbilityType.ACTIVE
                        ? (labels?.card?.typeActive || 'Active')
                        : (labels?.card?.typeUltimate || 'Ultimate')}
                  </span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">{labels?.detail?.effectLabel || 'Effect Value'}:</span>
                  <span className="meta-value">{selectedAbility.effectValue * 100}%</span>
                </div>

                {selectedAbility.cooldownMinutes && (
                  <div className="meta-item">
                    <span className="meta-label">{labels?.detail?.cooldownLabel || 'Cooldown'}:</span>
                    <span className="meta-value">{selectedAbility.cooldownMinutes} {labels?.card?.minutesUnit || 'minutes'}</span>
                  </div>
                )}

                <div className="meta-item">
                  <span className="meta-label">{labels?.detail?.requiredLevelLabel || 'Required Level'}:</span>
                  <span className="meta-value">
                    {selectedAbility.requiredLevel}
                    {pandaLevel < selectedAbility.requiredLevel &&
                      ` (${labels?.detail?.levelsNeededText || 'Need'} ${selectedAbility.requiredLevel - pandaLevel} ${labels?.detail?.levelsNeededText ? '' : 'more'})`}
                  </span>
                </div>
              </div>

              {isAbilityUnlocked(selectedAbility) && selectedAbility.type !== AbilityType.PASSIVE && (
                <div className="ability-detail-actions">
                  <button
                    className="activate-detail-button"
                    onClick={() => {
                      selectedAbility.id && handleActivateAbility(selectedAbility.id);
                      closeAbilityDetail();
                    }}
                    disabled={selectedAbility.isActive}
                  >
                    {selectedAbility.isActive
                      ? (labels?.detail?.alreadyActivatedText || 'Already Activated')
                      : (labels?.detail?.activateButtonText || 'Activate Ability')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </ScrollDialog>
    </div>
  );
};

export default AbilityList;
