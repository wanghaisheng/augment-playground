// src/components/bamboo/PlantGrowthIndicator.tsx
import React from 'react';
import { BambooPlantRecord, BambooSeedRecord } from '@/db-old';
import { useLanguage } from '@/context/LanguageProvider';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

interface PlantGrowthIndicatorProps {
  plant: BambooPlantRecord;
  seed: BambooSeedRecord;
}

/**
 * 植物生长指示器组件
 */
const PlantGrowthIndicator: React.FC<PlantGrowthIndicatorProps> = ({
  plant,
  seed
}) => {
  const { language } = useLanguage();
  
  // 计算剩余生长时间
  const getRemainingGrowthTime = () => {
    if (plant.isHarvestable || plant.harvestedAt) {
      return null;
    }
    
    const plantedAt = new Date(plant.plantedAt);
    const totalGrowthTimeMs = seed.growthTime * 60 * 60 * 1000;
    const matureDate = new Date(plantedAt.getTime() + totalGrowthTimeMs);
    const now = new Date();
    
    if (now >= matureDate) {
      return null;
    }
    
    return formatDistanceToNow(matureDate, {
      addSuffix: true,
      locale: language === 'zh' ? zhCN : enUS
    });
  };
  
  // 获取生长阶段文本
  const getGrowthStageText = () => {
    if (plant.harvestedAt) {
      return language === 'zh' ? '已收获' : 'Harvested';
    }
    
    if (plant.isHarvestable) {
      return language === 'zh' ? '可收获' : 'Ready to Harvest';
    }
    
    switch (plant.growthStage) {
      case 0:
        return language === 'zh' ? '种子期' : 'Seed Stage';
      case 1:
        return language === 'zh' ? '发芽期' : 'Sprout Stage';
      case 2:
        return language === 'zh' ? '幼苗期' : 'Seedling Stage';
      case 3:
        return language === 'zh' ? '生长期' : 'Growth Stage';
      case 4:
        return language === 'zh' ? '成熟期' : 'Mature Stage';
      default:
        return language === 'zh' ? '未知阶段' : 'Unknown Stage';
    }
  };
  
  // 获取健康状态文本
  const getHealthStatusText = () => {
    if (plant.health >= 90) {
      return language === 'zh' ? '健康' : 'Healthy';
    } else if (plant.health >= 70) {
      return language === 'zh' ? '良好' : 'Good';
    } else if (plant.health >= 50) {
      return language === 'zh' ? '一般' : 'Fair';
    } else if (plant.health >= 30) {
      return language === 'zh' ? '较差' : 'Poor';
    } else {
      return language === 'zh' ? '不健康' : 'Unhealthy';
    }
  };
  
  // 获取健康状态颜色
  const getHealthStatusColor = () => {
    if (plant.health >= 90) {
      return '#4CAF50'; // 绿色
    } else if (plant.health >= 70) {
      return '#8BC34A'; // 浅绿色
    } else if (plant.health >= 50) {
      return '#FFC107'; // 黄色
    } else if (plant.health >= 30) {
      return '#FF9800'; // 橙色
    } else {
      return '#F44336'; // 红色
    }
  };
  
  // 获取浇水状态文本
  const getWateringStatusText = () => {
    if (!plant.lastWateredAt) {
      return language === 'zh' ? '需要浇水' : 'Needs Water';
    }
    
    const lastWatered = new Date(plant.lastWateredAt);
    const now = new Date();
    const hoursSinceLastWatered = (now.getTime() - lastWatered.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastWatered < 8) {
      return language === 'zh' ? '已浇水' : 'Watered';
    } else {
      return language === 'zh' ? '需要浇水' : 'Needs Water';
    }
  };
  
  // 获取施肥状态文本
  const getFertilizingStatusText = () => {
    if (!plant.lastFertilizedAt) {
      return language === 'zh' ? '未施肥' : 'Not Fertilized';
    }
    
    const lastFertilized = new Date(plant.lastFertilizedAt);
    const now = new Date();
    const hoursSinceLastFertilized = (now.getTime() - lastFertilized.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastFertilized < 24) {
      return language === 'zh' ? '已施肥' : 'Fertilized';
    } else {
      return language === 'zh' ? '可以施肥' : 'Can Fertilize';
    }
  };
  
  // 格式化时间
  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: language === 'zh' ? zhCN : enUS
    });
  };

  return (
    <div className="plant-growth-indicator">
      <div className="growth-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${plant.growthProgress}%` }}
          />
        </div>
        <div className="progress-text">
          {plant.growthProgress.toFixed(1)}%
        </div>
      </div>
      
      <div className="growth-details">
        <div className="detail-item">
          <span className="detail-label">{language === 'zh' ? '生长阶段' : 'Growth Stage'}:</span>
          <span className="detail-value">{getGrowthStageText()}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">{language === 'zh' ? '健康状态' : 'Health Status'}:</span>
          <span 
            className="detail-value"
            style={{ color: getHealthStatusColor() }}
          >
            {getHealthStatusText()} ({plant.health}%)
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">{language === 'zh' ? '浇水状态' : 'Watering Status'}:</span>
          <span 
            className="detail-value"
            style={{ 
              color: getWateringStatusText().includes('需要') || 
                     getWateringStatusText().includes('Needs') 
                ? '#F44336' : '#4CAF50' 
            }}
          >
            {getWateringStatusText()}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">{language === 'zh' ? '施肥状态' : 'Fertilizing Status'}:</span>
          <span className="detail-value">{getFertilizingStatusText()}</span>
        </div>
        
        {plant.lastWateredAt && (
          <div className="detail-item">
            <span className="detail-label">{language === 'zh' ? '上次浇水' : 'Last Watered'}:</span>
            <span className="detail-value">{formatTime(new Date(plant.lastWateredAt))}</span>
          </div>
        )}
        
        {plant.lastFertilizedAt && (
          <div className="detail-item">
            <span className="detail-label">{language === 'zh' ? '上次施肥' : 'Last Fertilized'}:</span>
            <span className="detail-value">{formatTime(new Date(plant.lastFertilizedAt))}</span>
          </div>
        )}
        
        {getRemainingGrowthTime() && (
          <div className="detail-item">
            <span className="detail-label">{language === 'zh' ? '预计成熟' : 'Estimated Maturity'}:</span>
            <span className="detail-value">{getRemainingGrowthTime()}</span>
          </div>
        )}
        
        <div className="detail-item">
          <span className="detail-label">{language === 'zh' ? '预期产量' : 'Expected Yield'}:</span>
          <span className="detail-value">{plant.expectedYield} {language === 'zh' ? '竹子' : 'bamboo'}</span>
        </div>
      </div>
    </div>
  );
};

export default PlantGrowthIndicator;
