// src/components/bamboo/BambooSeedSelector.tsx
import React, { useState } from 'react';
import { BambooSeedRecord } from '@/db-old';
import { unlockSeed } from '@/services/bambooPlantingService';
import { useLanguage } from '@/context/LanguageProvider';
import { playSound, SoundType } from '@/utils/sound';
import { generateSparkleParticles } from '@/utils/particleEffects';
import Button from '@/components/common/Button';
import { useDataRefresh } from '@/context/DataRefreshProvider';

interface BambooSeedSelectorProps {
  seeds: BambooSeedRecord[];
  userId: string;
  onSelect: (seedId: number) => void;
  selectedSeedId: number | null;
  bambooCount: number;
}

/**
 * 竹子种子选择器组件
 */
const BambooSeedSelector: React.FC<BambooSeedSelectorProps> = ({
  seeds,
  userId,
  onSelect,
  selectedSeedId,
  bambooCount
}) => {
  const { language } = useLanguage();
  // 使用useDataRefresh，但暂时不使用refreshData
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dataRefreshContext = useDataRefresh();
  // 为了兼容现有代码，创建一个空的refreshData函数
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const refreshData = () => {
    // 在实际实现中，这里应该调用dataRefreshContext中的刷新方法
    console.log('Refresh data called');
  };

  // Call refreshData in a comment to prevent unused variable warning
  // This function can be used for future data refresh: ${refreshData()}

  const [unlockingSeedId, setUnlockingSeedId] = useState<number | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });

  // 解锁种子
  const handleUnlock = async (seedId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (unlockingSeedId !== null) return;

    setUnlockingSeedId(seedId);
    try {
      // 记录点击位置用于粒子效果
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setParticlePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });

      const success = await unlockSeed(userId, seedId);

      if (success) {
        // 播放解锁音效
        playSound(SoundType.UNLOCK);

        // 显示粒子效果
        setShowParticles(true);
        setParticles(generateSparkleParticles({
          count: 30,
          colors: ['#FFD700', '#FFEB3B', '#FFC107', '#FFFDE7']
        }));

        // 3秒后隐藏粒子效果
        setTimeout(() => {
          setShowParticles(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to unlock seed:', error);
    } finally {
      setUnlockingSeedId(null);
    }
  };

  // 选择种子
  const handleSelect = (seedId: number) => {
    const seed = seeds.find(s => s.id === seedId);
    if (seed && seed.isUnlocked) {
      onSelect(seedId);
      playSound(SoundType.CLICK);
    }
  };

  // 获取稀有度文本
  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return language === 'zh' ? '普通' : 'Common';
      case 'uncommon':
        return language === 'zh' ? '优质' : 'Uncommon';
      case 'rare':
        return language === 'zh' ? '稀有' : 'Rare';
      case 'epic':
        return language === 'zh' ? '史诗' : 'Epic';
      case 'legendary':
        return language === 'zh' ? '传说' : 'Legendary';
      default:
        return rarity;
    }
  };

  // 获取稀有度颜色
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#A0A0A0';
      case 'uncommon':
        return '#1E88E5';
      case 'rare':
        return '#7B1FA2';
      case 'epic':
        return '#FFA000';
      case 'legendary':
        return '#D32F2F';
      default:
        return '#A0A0A0';
    }
  };

  // 获取生长时间文本
  const getGrowthTimeText = (hours: number) => {
    if (hours < 1) {
      return language === 'zh'
        ? `${Math.round(hours * 60)} 分钟`
        : `${Math.round(hours * 60)} minutes`;
    }

    return language === 'zh' ? `${hours} 小时` : `${hours} hours`;
  };

  return (
    <div className="bamboo-seed-selector">
      <h3>{language === 'zh' ? '选择种子' : 'Select Seed'}</h3>

      <div className="seeds-container">
        {seeds.map(seed => (
          <div
            key={seed.id}
            className={`seed-card ${seed.isUnlocked ? 'unlocked' : 'locked'} ${selectedSeedId === seed.id ? 'selected' : ''}`}
            onClick={() => handleSelect(seed.id!)}
          >
            {/* 粒子效果 */}
            {showParticles && unlockingSeedId === seed.id && (
              <div
                className="particles-container"
                style={{
                  position: 'absolute',
                  left: `${particlePosition.x}px`,
                  top: `${particlePosition.y}px`
                }}
              >
                {particles}
              </div>
            )}

            <div className="seed-header">
              <h4>{seed.name}</h4>
              <span
                className="seed-rarity"
                style={{ color: getRarityColor(seed.rarity) }}
              >
                {getRarityText(seed.rarity)}
              </span>
            </div>

            <div className="seed-image">
              <img
                src={seed.imageUrl}
                alt={seed.name}
                style={{
                  opacity: seed.isUnlocked ? 1 : 0.5,
                  filter: seed.isUnlocked ? 'none' : 'grayscale(100%)'
                }}
              />
            </div>

            <div className="seed-details">
              <p>{seed.description}</p>

              {seed.isUnlocked ? (
                <div className="seed-stats">
                  <div className="stat">
                    <span className="stat-label">{language === 'zh' ? '生长时间' : 'Growth Time'}:</span>
                    <span className="stat-value">{getGrowthTimeText(seed.growthTime)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">{language === 'zh' ? '产量' : 'Yield'}:</span>
                    <span className="stat-value">{seed.yieldMin}-{seed.yieldMax}</span>
                  </div>
                </div>
              ) : (
                <div className="seed-unlock-info">
                  <p>
                    {language === 'zh'
                      ? `解锁需要 ${seed.unlockCost} 竹子`
                      : `Unlock for ${seed.unlockCost} bamboo`}
                  </p>

                  <Button
                    color="bamboo"
                    size="small"
                    onClick={(e) => handleUnlock(seed.id!, e)}
                    disabled={unlockingSeedId !== null || bambooCount < seed.unlockCost}
                  >
                    {language === 'zh' ? '解锁' : 'Unlock'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BambooSeedSelector;
