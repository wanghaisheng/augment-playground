// src/components/bamboo/BambooFeatureWidget.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageProvider';
import { useBambooSystem } from '@/hooks/useBambooSystem';
import { playSound, SoundType } from '@/utils/sound';

/**
 * 竹子功能小部件，用于在主页上展示竹子种植和交易功能
 */
const BambooFeatureWidget: React.FC = () => {
  const { language } = useLanguage();
  const { bambooCount } = useBambooSystem();

  const handleClick = () => {
    playSound(SoundType.CLICK);
  };

  return (
    <div className="bamboo-feature-widget bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 shadow-sm border border-green-200">
      <h3 className="text-lg font-bold text-green-800 mb-2">
        {language === 'zh' ? '竹子系统' : 'Bamboo System'}
      </h3>

      <div className="flex items-center gap-2 mb-3">
        <img
          src="/assets/bamboo/bamboo_icon.svg"
          alt="Bamboo"
          className="w-6 h-6"
        />
        <span className="font-bold text-green-700">{bambooCount}</span>
        <span className="text-green-600">
          {language === 'zh' ? '竹子' : 'bamboo'}
        </span>
      </div>

      <p className="text-sm text-green-700 mb-4">
        {language === 'zh'
          ? '种植和交易竹子，获取更多资源！'
          : 'Plant and trade bamboo to get more resources!'}
      </p>

      <div className="grid grid-cols-3 gap-2">
        <Link
          to="/bamboo-planting"
          className="bg-green-600 hover:bg-green-700 text-white text-center py-2 px-3 rounded-lg text-sm transition-colors"
          onClick={handleClick}
        >
          {language === 'zh' ? '种植竹子' : 'Plant Bamboo'}
        </Link>

        <Link
          to="/bamboo-trading"
          className="bg-amber-600 hover:bg-amber-700 text-white text-center py-2 px-3 rounded-lg text-sm transition-colors"
          onClick={handleClick}
        >
          {language === 'zh' ? '交易竹子' : 'Trade Bamboo'}
        </Link>

        <Link
          to="/bamboo-dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-lg text-sm transition-colors"
          onClick={handleClick}
        >
          {language === 'zh' ? '仪表盘' : 'Dashboard'}
        </Link>
      </div>
    </div>
  );
};

export default BambooFeatureWidget;
