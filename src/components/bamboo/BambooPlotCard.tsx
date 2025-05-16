// src/components/bamboo/BambooPlotCard.tsx
import React, { useState } from 'react';
import { BambooPlotRecord } from '@/db-old';
import { unlockPlot, upgradePlot } from '@/services/bambooPlantingService';
import { useLanguage } from '@/context/LanguageProvider';
import { playSound, SoundType } from '@/utils/sound';
import { generateSparkleParticles } from '@/utils/particleEffects';
import Button from '@/components/common/Button';
import { useDataRefresh } from '@/context/DataRefreshProvider';

interface BambooPlotCardProps {
  plot: BambooPlotRecord;
  userId: string;
  onSelect: (plotId: number) => void;
  isSelected: boolean;
  bambooCount: number;
}

/**
 * 竹子种植地块卡片组件
 */
const BambooPlotCard: React.FC<BambooPlotCardProps> = ({
  plot,
  userId,
  onSelect,
  isSelected,
  bambooCount
}) => {
  const { language } = useLanguage();
  const { refreshData } = useDataRefresh();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);

  // 解锁地块
  const handleUnlock = async () => {
    if (isUnlocking) return;

    setIsUnlocking(true);
    try {
      const success = await unlockPlot(userId, plot.id!);

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
      console.error('Failed to unlock plot:', error);
    } finally {
      setIsUnlocking(false);
    }
  };

  // 升级地块
  const handleUpgrade = async () => {
    if (isUpgrading) return;

    setIsUpgrading(true);
    try {
      const success = await upgradePlot(userId, plot.id!);

      if (success) {
        // 播放升级音效
        playSound(SoundType.LEVEL_UP);

        // 显示粒子效果
        setShowParticles(true);
        setParticles(generateSparkleParticles({
          count: 50,
          colors: ['#4CAF50', '#8BC34A', '#CDDC39', '#F0F4C3']
        }));

        // 3秒后隐藏粒子效果
        setTimeout(() => {
          setShowParticles(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to upgrade plot:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  // 选择地块
  const handleSelect = () => {
    if (plot.isUnlocked) {
      onSelect(plot.id!);
      playSound(SoundType.CLICK);
    }
  };

  // 获取地块状态文本
  const getPlotStatusText = () => {
    if (!plot.isUnlocked) {
      return language === 'zh' ? '未解锁' : 'Locked';
    }

    return `${language === 'zh' ? '等级' : 'Level'} ${plot.level}`;
  };

  // 获取地块描述文本
  const getPlotDescriptionText = () => {
    if (!plot.isUnlocked) {
      return language === 'zh'
        ? `解锁需要 ${plot.unlockCost} 竹子`
        : `Unlock for ${plot.unlockCost} bamboo`;
    }

    return language === 'zh'
      ? `可种植 ${plot.maxPlants} 株竹子，升级需要 ${plot.upgradeCost} 竹子`
      : `Can plant ${plot.maxPlants} bamboo, upgrade for ${plot.upgradeCost} bamboo`;
  };

  // 获取地块属性文本
  const getPlotAttributesText = () => {
    if (!plot.isUnlocked) {
      return '';
    }

    return language === 'zh'
      ? `肥力: ${plot.fertility} | 水分: ${plot.moisture} | 光照: ${plot.sunlight}`
      : `Fertility: ${plot.fertility} | Moisture: ${plot.moisture} | Sunlight: ${plot.sunlight}`;
  };

  return (
    <div
      className={`bamboo-plot-card ${isSelected ? 'selected' : ''} ${plot.isUnlocked ? 'unlocked' : 'locked'}`}
      onClick={handleSelect}
    >
      {/* 粒子效果 */}
      {showParticles && (
        <div className="particles-container">
          {particles}
        </div>
      )}

      <div className="plot-header">
        <h3>{plot.name}</h3>
        <span className="plot-status">{getPlotStatusText()}</span>
      </div>

      <div className="plot-image">
        <img
          src={`/assets/bamboo/plots/plot_${plot.isUnlocked ? 'unlocked' : 'locked'}_${Math.min(plot.level, 3)}.svg`}
          alt={plot.name}
        />
      </div>

      <div className="plot-description">
        <p>{getPlotDescriptionText()}</p>
        {plot.isUnlocked && (
          <p className="plot-attributes">{getPlotAttributesText()}</p>
        )}
      </div>

      <div className="plot-actions">
        {!plot.isUnlocked ? (
          <Button
            color="bamboo"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleUnlock();
            }}
            disabled={isUnlocking || bambooCount < plot.unlockCost}
          >
            {language === 'zh' ? '解锁' : 'Unlock'}
          </Button>
        ) : (
          <Button
            color="bamboo"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleUpgrade();
            }}
            disabled={isUpgrading || bambooCount < plot.upgradeCost}
          >
            {language === 'zh' ? '升级' : 'Upgrade'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BambooPlotCard;
