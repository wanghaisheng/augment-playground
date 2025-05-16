// src/components/vip/ResourceShortageManager.tsx
import React, { useState, useEffect } from 'react';
import ResourceShortagePrompt from './ResourceShortagePrompt';
import { db } from '@/db-old';
import { usePandaState } from '@/context/PandaStateProvider';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';

// 资源阈值配置
const RESOURCE_THRESHOLDS = {
  bamboo: 20,
  coin: 50,
  energy: 30
};

// 冷却时间（毫秒）
const COOLDOWN_TIME = 24 * 60 * 60 * 1000; // 24小时

/**
 * 资源不足管理器组件
 * 
 * 监控用户资源水平，在资源不足时显示提示
 */
const ResourceShortageManager: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [resourceType, setResourceType] = useState<'bamboo' | 'coin' | 'energy'>('bamboo');
  const [currentAmount, setCurrentAmount] = useState(0);
  const [thresholdAmount, setThresholdAmount] = useState(0);
  const { pandaState } = usePandaState();
  const { refreshEvents } = useDataRefreshContext();
  
  // 检查资源水平
  useEffect(() => {
    const checkResourceLevels = async () => {
      try {
        // 获取上次提示时间
        const lastPromptTime = localStorage.getItem('lastResourceShortagePromptTime');
        const now = Date.now();
        
        // 如果在冷却期内，不显示提示
        if (lastPromptTime && now - parseInt(lastPromptTime) < COOLDOWN_TIME) {
          return;
        }
        
        // 获取用户资源
        const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
        const userCurrencies = await db.table('userCurrencies')
          .where('userId')
          .equals(userId)
          .first();
        
        if (!userCurrencies) {
          return;
        }
        
        // 检查竹子
        if (userCurrencies.bamboo < RESOURCE_THRESHOLDS.bamboo) {
          setResourceType('bamboo');
          setCurrentAmount(userCurrencies.bamboo);
          setThresholdAmount(RESOURCE_THRESHOLDS.bamboo);
          setShowPrompt(true);
          localStorage.setItem('lastResourceShortagePromptTime', now.toString());
          return;
        }
        
        // 检查金币
        if (userCurrencies.coins < RESOURCE_THRESHOLDS.coin) {
          setResourceType('coin');
          setCurrentAmount(userCurrencies.coins);
          setThresholdAmount(RESOURCE_THRESHOLDS.coin);
          setShowPrompt(true);
          localStorage.setItem('lastResourceShortagePromptTime', now.toString());
          return;
        }
        
        // 检查能量
        if (pandaState && pandaState.energy < RESOURCE_THRESHOLDS.energy) {
          setResourceType('energy');
          setCurrentAmount(pandaState.energy);
          setThresholdAmount(RESOURCE_THRESHOLDS.energy);
          setShowPrompt(true);
          localStorage.setItem('lastResourceShortagePromptTime', now.toString());
          return;
        }
      } catch (error) {
        console.error('Failed to check resource levels:', error);
      }
    };
    
    // 初始检查
    checkResourceLevels();
    
    // 当数据刷新时重新检查
    const handleRefresh = (refreshType: string) => {
      if (refreshType === 'userCurrencies' || refreshType === 'pandaState') {
        checkResourceLevels();
      }
    };
    
    refreshEvents.on('dataRefreshed', handleRefresh);
    
    return () => {
      refreshEvents.off('dataRefreshed', handleRefresh);
    };
  }, [pandaState, refreshEvents]);
  
  // 处理关闭提示
  const handleClosePrompt = () => {
    setShowPrompt(false);
  };
  
  return (
    <ResourceShortagePrompt
      isOpen={showPrompt}
      onClose={handleClosePrompt}
      resourceType={resourceType}
      currentAmount={currentAmount}
      thresholdAmount={thresholdAmount}
    />
  );
};

export default ResourceShortageManager;
