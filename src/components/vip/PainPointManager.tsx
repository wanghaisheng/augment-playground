// src/components/vip/PainPointManager.tsx
import React, { useState, useEffect } from 'react';
import { getUnviewedPainPointTriggers } from '@/services/painPointService';
import PainPointSolutionPrompt from './PainPointSolutionPrompt';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';

/**
 * 痛点管理器组件
 * 
 * 监听痛点触发事件，并在适当的时候显示解决方案提示
 */
const PainPointManager: React.FC = () => {
  const [currentTriggerId, setCurrentTriggerId] = useState<number | null>(null);
  const [triggerQueue, setTriggerQueue] = useState<number[]>([]);
  const { refreshData } = useDataRefreshContext();

  // 检查未查看的痛点触发记录
  useEffect(() => {
    const checkUnviewedTriggers = async () => {
      try {
        // 获取当前用户未查看的痛点触发记录
        const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
        const unviewedTriggers = await getUnviewedPainPointTriggers(userId);
        
        if (unviewedTriggers.length > 0) {
          // 将未查看的触发记录ID添加到队列中
          const triggerIds = unviewedTriggers.map(trigger => trigger.id!);
          setTriggerQueue(prevQueue => {
            // 过滤掉已经在队列中的ID
            const newIds = triggerIds.filter(id => !prevQueue.includes(id));
            return [...prevQueue, ...newIds];
          });
        }
      } catch (error) {
        console.error('Failed to check unviewed pain point triggers:', error);
      }
    };

    // 初始检查
    checkUnviewedTriggers();

    // 设置定期检查
    const intervalId = setInterval(checkUnviewedTriggers, 60000); // 每分钟检查一次

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // 当队列变化时，显示下一个提示
  useEffect(() => {
    if (triggerQueue.length > 0 && currentTriggerId === null) {
      // 从队列中取出第一个ID
      const nextTriggerId = triggerQueue[0];
      setCurrentTriggerId(nextTriggerId);
      
      // 从队列中移除该ID
      setTriggerQueue(prevQueue => prevQueue.slice(1));
    }
  }, [triggerQueue, currentTriggerId]);

  // 处理关闭提示
  const handleClosePrompt = () => {
    setCurrentTriggerId(null);
    
    // 刷新数据
    refreshData('painPointTriggers');
  };

  // 如果没有当前触发ID，不渲染任何内容
  if (currentTriggerId === null) {
    return null;
  }

  return (
    <PainPointSolutionPrompt
      triggerId={currentTriggerId}
      onClose={handleClosePrompt}
    />
  );
};

export default PainPointManager;
