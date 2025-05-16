// src/components/bamboo/BambooTips.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageProvider';

interface BambooTip {
  id: string;
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
  icon: string;
  category: 'planting' | 'harvesting' | 'trading' | 'general';
}

/**
 * 竹子小贴士组件，提供竹子种植和交易的有用信息
 */
const BambooTips: React.FC = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'planting' | 'harvesting' | 'trading' | 'general'>('all');
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);

  // 定义小贴士
  const tips: BambooTip[] = [
    {
      id: 'tip-1',
      titleZh: '选择合适的种子',
      titleEn: 'Choose the Right Seeds',
      contentZh: '不同稀有度的种子有不同的生长时间和产量。稀有度越高的种子生长时间越长，但产量也越高。根据你的游戏习惯选择合适的种子。',
      contentEn: 'Seeds of different rarities have different growth times and yields. Higher rarity seeds take longer to grow but produce more bamboo. Choose seeds that match your play style.',
      icon: '🌱',
      category: 'planting'
    },
    {
      id: 'tip-2',
      titleZh: '定期浇水',
      titleEn: 'Water Regularly',
      contentZh: '每8小时浇一次水可以保持竹子健康度。健康度越高，最终产量越高。',
      contentEn: 'Watering every 8 hours keeps your bamboo healthy. Higher health leads to higher yields.',
      icon: '💧',
      category: 'planting'
    },
    {
      id: 'tip-3',
      titleZh: '施肥增产',
      titleEn: 'Fertilize for Better Yields',
      contentZh: '施肥可以增加20%的产量，每24小时可以施肥一次。',
      contentEn: 'Fertilizing increases yield by 20%. You can fertilize once every 24 hours.',
      icon: '🧪',
      category: 'planting'
    },
    {
      id: 'tip-4',
      titleZh: '升级地块',
      titleEn: 'Upgrade Your Plots',
      contentZh: '升级地块可以增加种植位置，并提高地块的肥力、水分和光照，从而提高产量。',
      contentEn: 'Upgrading plots increases planting slots and improves fertility, moisture, and sunlight, leading to higher yields.',
      icon: '⬆️',
      category: 'planting'
    },
    {
      id: 'tip-5',
      titleZh: '最佳收获时机',
      titleEn: 'Best Time to Harvest',
      contentZh: '竹子生长到100%时可以收获。如果你想获得最大产量，确保收获前竹子的健康度保持在90%以上。',
      contentEn: 'Bamboo can be harvested when it reaches 100% growth. For maximum yield, ensure health is above 90% before harvesting.',
      icon: '🧺',
      category: 'harvesting'
    },
    {
      id: 'tip-6',
      titleZh: '交易策略',
      titleEn: 'Trading Strategies',
      contentZh: '不同资源的交易汇率不同。稀有资源的汇率更高，但每日交易限额较低。根据你的需求选择合适的交易资源。',
      contentEn: 'Different resources have different exchange rates. Rare resources have higher rates but lower daily limits. Choose resources based on your needs.',
      icon: '📊',
      category: 'trading'
    },
    {
      id: 'tip-7',
      titleZh: '资源兑换竹子',
      titleEn: 'Resources to Bamboo',
      contentZh: '当你有多余的金币或其他资源时，可以考虑兑换成竹子。这是快速获取竹子的好方法。',
      contentEn: 'When you have excess coins or other resources, consider exchanging them for bamboo. This is a quick way to get bamboo.',
      icon: '🔄',
      category: 'trading'
    },
    {
      id: 'tip-8',
      titleZh: '竹子兑换经验',
      titleEn: 'Bamboo for Experience',
      contentZh: '用竹子兑换经验值是提升熊猫等级的有效方式。',
      contentEn: 'Exchanging bamboo for experience is an effective way to level up your panda.',
      icon: '⭐',
      category: 'trading'
    },
    {
      id: 'tip-9',
      titleZh: '多样化种植',
      titleEn: 'Diversify Your Planting',
      contentZh: '同时种植不同生长周期的竹子，可以保证你有持续的收获。',
      contentEn: 'Plant bamboo with different growth cycles to ensure a continuous harvest.',
      icon: '🌿',
      category: 'general'
    },
    {
      id: 'tip-10',
      titleZh: '关注成就',
      titleEn: 'Focus on Achievements',
      contentZh: '完成竹子相关的成就可以获得额外奖励。',
      contentEn: 'Completing bamboo-related achievements can earn you extra rewards.',
      icon: '🏆',
      category: 'general'
    }
  ];

  // 根据当前选择的类别过滤小贴士
  const filteredTips = activeCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === activeCategory);

  // 切换小贴士展开状态
  const toggleTip = (tipId: string) => {
    if (expandedTipId === tipId) {
      setExpandedTipId(null);
    } else {
      setExpandedTipId(tipId);
    }
  };

  // 获取类别名称
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'all':
        return language === 'zh' ? '全部' : 'All';
      case 'planting':
        return language === 'zh' ? '种植' : 'Planting';
      case 'harvesting':
        return language === 'zh' ? '收获' : 'Harvesting';
      case 'trading':
        return language === 'zh' ? '交易' : 'Trading';
      case 'general':
        return language === 'zh' ? '通用' : 'General';
      default:
        return category;
    }
  };

  return (
    <div className="bamboo-tips bg-white rounded-lg shadow-sm p-4 border border-green-100">
      <h3 className="text-lg font-bold text-green-800 mb-3">
        {language === 'zh' ? '竹子小贴士' : 'Bamboo Tips'}
      </h3>

      {/* 类别选择器 */}
      <div className="category-selector flex flex-wrap gap-2 mb-4">
        {['all', 'planting', 'harvesting', 'trading', 'general'].map(category => (
          <button
            key={category}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(category as any)}
          >
            {getCategoryName(category)}
          </button>
        ))}
      </div>

      {/* 小贴士列表 */}
      <div className="tips-list space-y-3">
        {filteredTips.map(tip => (
          <div 
            key={tip.id}
            className={`tip-card p-3 rounded-lg border border-green-100 transition-all ${
              expandedTipId === tip.id ? 'bg-green-50' : 'bg-white hover:bg-green-50'
            }`}
          >
            <div 
              className="tip-header flex items-center justify-between cursor-pointer"
              onClick={() => toggleTip(tip.id)}
            >
              <div className="flex items-center gap-2">
                <span className="tip-icon text-xl">{tip.icon}</span>
                <h4 className="text-md font-semibold text-gray-800">
                  {language === 'zh' ? tip.titleZh : tip.titleEn}
                </h4>
              </div>
              <span className="text-gray-400">
                {expandedTipId === tip.id ? '▲' : '▼'}
              </span>
            </div>
            
            {expandedTipId === tip.id && (
              <div className="tip-content mt-2 pl-7 text-sm text-gray-600 border-t border-green-100 pt-2">
                {language === 'zh' ? tip.contentZh : tip.contentEn}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BambooTips;
