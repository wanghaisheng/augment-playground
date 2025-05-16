// src/components/bamboo/BambooAchievements.tsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import { useBambooSystem } from '@/hooks/useBambooSystem';
import { playSound, SoundType } from '@/utils/sound';
import { generateSparkleParticles } from '@/utils/particleEffects';

interface BambooAchievement {
  id: string;
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
  icon: string;
  requiredValue: number;
  currentValue: number;
  isCompleted: boolean;
  type: 'planting' | 'harvesting' | 'trading';
}

interface BambooAchievementsProps {
  userId: string;
}

/**
 * 竹子成就组件，显示用户在竹子系统中的成就
 */
const BambooAchievements: React.FC<BambooAchievementsProps> = ({ userId }) => {
  const { language } = useLanguage();
  const { plants, tradeHistory, bambooCount } = useBambooSystem(userId);
  const [achievements, setAchievements] = useState<BambooAchievement[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationParticles, setAnimationParticles] = useState<React.ReactNode[]>([]);
  const [completedAchievementId, setCompletedAchievementId] = useState<string | null>(null);

  // 定义成就
  useEffect(() => {
    const plantedCount = plants.length;
    const harvestedPlants = plants.filter(plant => plant.harvestedAt);
    const harvestedCount = harvestedPlants.length;
    const totalYield = harvestedPlants.reduce((sum, plant) => sum + plant.expectedYield, 0);
    
    const bambooToResources = tradeHistory
      .filter(trade => trade.tradeDirection === 'bamboo_to_resource')
      .reduce((sum, trade) => sum + trade.bambooAmount, 0);

    const resourcesToBamboo = tradeHistory
      .filter(trade => trade.tradeDirection === 'resource_to_bamboo')
      .reduce((sum, trade) => sum + trade.bambooAmount, 0);
    
    const totalTraded = bambooToResources + resourcesToBamboo;
    
    const achievementDefinitions: BambooAchievement[] = [
      {
        id: 'plant-first',
        nameZh: '初次种植',
        nameEn: 'First Planting',
        descriptionZh: '种植你的第一株竹子',
        descriptionEn: 'Plant your first bamboo',
        icon: '🌱',
        requiredValue: 1,
        currentValue: plantedCount,
        isCompleted: plantedCount >= 1,
        type: 'planting'
      },
      {
        id: 'plant-10',
        nameZh: '竹林初成',
        nameEn: 'Bamboo Grove',
        descriptionZh: '种植10株竹子',
        descriptionEn: 'Plant 10 bamboo plants',
        icon: '🎋',
        requiredValue: 10,
        currentValue: plantedCount,
        isCompleted: plantedCount >= 10,
        type: 'planting'
      },
      {
        id: 'plant-50',
        nameZh: '竹林大师',
        nameEn: 'Bamboo Master',
        descriptionZh: '种植50株竹子',
        descriptionEn: 'Plant 50 bamboo plants',
        icon: '🏞️',
        requiredValue: 50,
        currentValue: plantedCount,
        isCompleted: plantedCount >= 50,
        type: 'planting'
      },
      {
        id: 'harvest-first',
        nameZh: '初次收获',
        nameEn: 'First Harvest',
        descriptionZh: '收获你的第一株竹子',
        descriptionEn: 'Harvest your first bamboo',
        icon: '🧺',
        requiredValue: 1,
        currentValue: harvestedCount,
        isCompleted: harvestedCount >= 1,
        type: 'harvesting'
      },
      {
        id: 'harvest-100',
        nameZh: '小小收获',
        nameEn: 'Small Harvest',
        descriptionZh: '累计收获100竹子',
        descriptionEn: 'Harvest a total of 100 bamboo',
        icon: '📦',
        requiredValue: 100,
        currentValue: totalYield,
        isCompleted: totalYield >= 100,
        type: 'harvesting'
      },
      {
        id: 'harvest-1000',
        nameZh: '丰收时节',
        nameEn: 'Bountiful Harvest',
        descriptionZh: '累计收获1000竹子',
        descriptionEn: 'Harvest a total of 1000 bamboo',
        icon: '🏆',
        requiredValue: 1000,
        currentValue: totalYield,
        isCompleted: totalYield >= 1000,
        type: 'harvesting'
      },
      {
        id: 'trade-first',
        nameZh: '初次交易',
        nameEn: 'First Trade',
        descriptionZh: '完成你的第一笔竹子交易',
        descriptionEn: 'Complete your first bamboo trade',
        icon: '🔄',
        requiredValue: 1,
        currentValue: tradeHistory.length,
        isCompleted: tradeHistory.length >= 1,
        type: 'trading'
      },
      {
        id: 'trade-500',
        nameZh: '交易达人',
        nameEn: 'Trading Expert',
        descriptionZh: '累计交易500竹子',
        descriptionEn: 'Trade a total of 500 bamboo',
        icon: '💱',
        requiredValue: 500,
        currentValue: totalTraded,
        isCompleted: totalTraded >= 500,
        type: 'trading'
      },
      {
        id: 'bamboo-hoarder',
        nameZh: '竹子收藏家',
        nameEn: 'Bamboo Hoarder',
        descriptionZh: '同时拥有1000竹子',
        descriptionEn: 'Have 1000 bamboo at once',
        icon: '💰',
        requiredValue: 1000,
        currentValue: bambooCount,
        isCompleted: bambooCount >= 1000,
        type: 'harvesting'
      }
    ];
    
    // 检查是否有新完成的成就
    const previousAchievements = achievements;
    const newlyCompleted = achievementDefinitions.find(achievement => 
      achievement.isCompleted && 
      previousAchievements.find(a => a.id === achievement.id)?.isCompleted === false
    );
    
    if (newlyCompleted) {
      setCompletedAchievementId(newlyCompleted.id);
      setShowAnimation(true);
      setAnimationParticles(generateSparkleParticles({
        count: 50,
        colors: ['#FFD700', '#FFEB3B', '#FFC107', '#FFFDE7']
      }));
      
      // 播放成就解锁音效
      playSound(SoundType.ACHIEVEMENT);
      
      // 3秒后隐藏动画
      setTimeout(() => {
        setShowAnimation(false);
        setCompletedAchievementId(null);
      }, 3000);
    }
    
    setAchievements(achievementDefinitions);
  }, [plants, tradeHistory, bambooCount, achievements]);

  return (
    <div className="bamboo-achievements bg-white rounded-lg shadow-sm p-4 border border-green-100">
      <h3 className="text-lg font-bold text-green-800 mb-3">
        {language === 'zh' ? '竹子成就' : 'Bamboo Achievements'}
      </h3>
      
      <div className="achievements-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`achievement-card p-3 rounded-lg border ${
              achievement.isCompleted 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            } relative`}
          >
            {/* 成就解锁动画 */}
            {showAnimation && completedAchievementId === achievement.id && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="particles-container absolute inset-0">
                  {animationParticles}
                </div>
                <div className="achievement-unlocked bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                  {language === 'zh' ? '成就解锁！' : 'Achievement Unlocked!'}
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className="achievement-icon text-2xl">
                {achievement.icon}
              </div>
              
              <div className="achievement-details flex-1">
                <h4 className="text-md font-semibold text-gray-800">
                  {language === 'zh' ? achievement.nameZh : achievement.nameEn}
                </h4>
                
                <p className="text-sm text-gray-600 mb-2">
                  {language === 'zh' ? achievement.descriptionZh : achievement.descriptionEn}
                </p>
                
                <div className="progress-bar h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (achievement.currentValue / achievement.requiredValue) * 100)}%` 
                    }}
                  />
                </div>
                
                <div className="progress-text text-xs text-gray-500 mt-1 flex justify-between">
                  <span>
                    {achievement.currentValue} / {achievement.requiredValue}
                  </span>
                  <span>
                    {Math.min(100, Math.round((achievement.currentValue / achievement.requiredValue) * 100))}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BambooAchievements;
