// src/components/game/AbilityList.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AbilityCard from './AbilityCard';
import { PandaAbilityRecord, AbilityType } from '@/services/pandaAbilityService';
import { useTableRefresh } from '@/hooks/useDataRefresh';
import ScrollDialog from './ScrollDialog';

interface AbilityListProps {
  abilities: PandaAbilityRecord[];
  unlockedAbilities: PandaAbilityRecord[];
  onActivateAbility: (abilityId: number) => Promise<void>;
  pandaLevel: number;
}

/**
 * 熊猫能力列表组件
 * 显示所有熊猫能力，并允许激活已解锁的能力
 *
 * @param abilities - 所有能力列表
 * @param unlockedAbilities - 已解锁的能力列表
 * @param onActivateAbility - 激活能力的回调函数
 * @param pandaLevel - 当前熊猫等级
 */
const AbilityList: React.FC<AbilityListProps> = ({
  abilities,
  unlockedAbilities,
  onActivateAbility,
  pandaLevel
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedAbility, setSelectedAbility] = useState<PandaAbilityRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 过滤能力
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

  // 检查能力是否已解锁
  const isAbilityUnlocked = (ability: PandaAbilityRecord): boolean => {
    return unlockedAbilities.some(unlocked => unlocked.id === ability.id);
  };

  // 处理能力激活
  const handleActivateAbility = async (abilityId: number) => {
    await onActivateAbility(abilityId);
  };

  // 打开能力详情模态框
  const openAbilityDetail = (ability: PandaAbilityRecord) => {
    setSelectedAbility(ability);
    setIsDetailModalOpen(true);
  };

  // 关闭能力详情模态框
  const closeAbilityDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedAbility(null);
  };

  return (
    <div className="ability-list-container">
      <div className="ability-filters">
        <button
          className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          全部
        </button>
        <button
          className={`filter-button ${activeFilter === 'unlocked' ? 'active' : ''}`}
          onClick={() => setActiveFilter('unlocked')}
        >
          已解锁
        </button>
        <button
          className={`filter-button ${activeFilter === 'locked' ? 'active' : ''}`}
          onClick={() => setActiveFilter('locked')}
        >
          未解锁
        </button>
        <button
          className={`filter-button ${activeFilter === 'passive' ? 'active' : ''}`}
          onClick={() => setActiveFilter('passive')}
        >
          被动
        </button>
        <button
          className={`filter-button ${activeFilter === 'active' ? 'active' : ''}`}
          onClick={() => setActiveFilter('active')}
        >
          主动
        </button>
        <button
          className={`filter-button ${activeFilter === 'ultimate' ? 'active' : ''}`}
          onClick={() => setActiveFilter('ultimate')}
        >
          终极
        </button>
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
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAbilities.length === 0 && (
        <div className="no-abilities">
          <p>没有符合条件的能力</p>
        </div>
      )}

      {/* 能力详情模态框 */}
      <ScrollDialog
        isOpen={isDetailModalOpen}
        onClose={closeAbilityDetail}
        title={selectedAbility?.name || '能力详情'}
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
                  <span className="meta-label">类型:</span>
                  <span className="meta-value">
                    {selectedAbility.type === AbilityType.PASSIVE ? '被动' :
                     selectedAbility.type === AbilityType.ACTIVE ? '主动' : '终极'}
                  </span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">效果值:</span>
                  <span className="meta-value">{selectedAbility.effectValue * 100}%</span>
                </div>

                {selectedAbility.cooldownMinutes && (
                  <div className="meta-item">
                    <span className="meta-label">冷却时间:</span>
                    <span className="meta-value">{selectedAbility.cooldownMinutes} 分钟</span>
                  </div>
                )}

                <div className="meta-item">
                  <span className="meta-label">解锁等级:</span>
                  <span className="meta-value">
                    {selectedAbility.requiredLevel}
                    {pandaLevel < selectedAbility.requiredLevel &&
                      ` (还需 ${selectedAbility.requiredLevel - pandaLevel} 级)`}
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
                    {selectedAbility.isActive ? '已激活' : '激活能力'}
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
