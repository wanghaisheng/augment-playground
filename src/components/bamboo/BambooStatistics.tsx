// src/components/bamboo/BambooStatistics.tsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import { useBambooSystem } from '@/hooks/useBambooSystem';
// 导入但未使用的类型，保留以便类型检查
// import { BambooPlantRecord, BambooTradeRecord } from '@/db';

interface BambooStatisticsProps {
  userId: string;
}

/**
 * 竹子统计组件，显示用户的竹子种植和交易统计数据
 */
const BambooStatistics: React.FC<BambooStatisticsProps> = ({ userId }) => {
  const { language } = useLanguage();
  const { plants, tradeHistory } = useBambooSystem(userId);
  const [stats, setStats] = useState({
    totalPlanted: 0,
    totalHarvested: 0,
    totalYield: 0,
    averageYield: 0,
    totalTraded: 0,
    bambooToResources: 0,
    resourcesToBamboo: 0,
    netTradeBalance: 0
  });

  // 计算统计数据
  useEffect(() => {
    // 种植统计
    const plantedCount = plants.length;
    const harvestedPlants = plants.filter(plant => plant.harvestedAt);
    const harvestedCount = harvestedPlants.length;
    const totalYield = harvestedPlants.reduce((sum, plant) => sum + plant.expectedYield, 0);
    const averageYield = harvestedCount > 0 ? Math.round(totalYield / harvestedCount) : 0;

    // 交易统计
    const bambooToResources = tradeHistory
      .filter(trade => trade.tradeDirection === 'bamboo_to_resource')
      .reduce((sum, trade) => sum + trade.bambooAmount, 0);

    const resourcesToBamboo = tradeHistory
      .filter(trade => trade.tradeDirection === 'resource_to_bamboo')
      .reduce((sum, trade) => sum + trade.bambooAmount, 0);

    const totalTraded = bambooToResources + resourcesToBamboo;
    const netTradeBalance = resourcesToBamboo - bambooToResources;

    setStats({
      totalPlanted: plantedCount,
      totalHarvested: harvestedCount,
      totalYield,
      averageYield,
      totalTraded,
      bambooToResources,
      resourcesToBamboo,
      netTradeBalance
    });
  }, [plants, tradeHistory]);

  return (
    <div className="bamboo-statistics bg-white rounded-lg shadow-sm p-4 border border-green-100">
      <h3 className="text-lg font-bold text-green-800 mb-3">
        {language === 'zh' ? '竹子统计' : 'Bamboo Statistics'}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="planting-stats">
          <h4 className="text-md font-semibold text-green-700 mb-2">
            {language === 'zh' ? '种植统计' : 'Planting Stats'}
          </h4>

          <div className="stat-item flex justify-between mb-1">
            <span className="text-sm text-gray-600">
              {language === 'zh' ? '总种植数量' : 'Total Planted'}:
            </span>
            <span className="text-sm font-medium text-gray-800">
              {stats.totalPlanted}
            </span>
          </div>

          <div className="stat-item flex justify-between mb-1">
            <span className="text-sm text-gray-600">
              {language === 'zh' ? '已收获数量' : 'Total Harvested'}:
            </span>
            <span className="text-sm font-medium text-gray-800">
              {stats.totalHarvested}
            </span>
          </div>

          <div className="stat-item flex justify-between mb-1">
            <span className="text-sm text-gray-600">
              {language === 'zh' ? '总产量' : 'Total Yield'}:
            </span>
            <span className="text-sm font-medium text-green-700">
              {stats.totalYield}
            </span>
          </div>

          <div className="stat-item flex justify-between mb-1">
            <span className="text-sm text-gray-600">
              {language === 'zh' ? '平均产量' : 'Average Yield'}:
            </span>
            <span className="text-sm font-medium text-green-700">
              {stats.averageYield}
            </span>
          </div>
        </div>

        <div className="trading-stats">
          <h4 className="text-md font-semibold text-amber-700 mb-2">
            {language === 'zh' ? '交易统计' : 'Trading Stats'}
          </h4>

          <div className="stat-item flex justify-between mb-1">
            <span className="text-sm text-gray-600">
              {language === 'zh' ? '总交易量' : 'Total Traded'}:
            </span>
            <span className="text-sm font-medium text-gray-800">
              {stats.totalTraded}
            </span>
          </div>

          <div className="stat-item flex justify-between mb-1">
            <span className="text-sm text-gray-600">
              {language === 'zh' ? '竹子兑换资源' : 'Bamboo → Resources'}:
            </span>
            <span className="text-sm font-medium text-red-600">
              -{stats.bambooToResources}
            </span>
          </div>

          <div className="stat-item flex justify-between mb-1">
            <span className="text-sm text-gray-600">
              {language === 'zh' ? '资源兑换竹子' : 'Resources → Bamboo'}:
            </span>
            <span className="text-sm font-medium text-green-600">
              +{stats.resourcesToBamboo}
            </span>
          </div>

          <div className="stat-item flex justify-between mb-1">
            <span className="text-sm text-gray-600">
              {language === 'zh' ? '净交易余额' : 'Net Trade Balance'}:
            </span>
            <span className={`text-sm font-medium ${stats.netTradeBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.netTradeBalance >= 0 ? '+' : ''}{stats.netTradeBalance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BambooStatistics;
