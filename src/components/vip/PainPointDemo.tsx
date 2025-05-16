// src/components/vip/PainPointDemo.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import { 
  triggerPainPointSolution, 
  PainPointType 
} from '@/services/painPointService';
import { playSound, SoundType } from '@/utils/sound';

/**
 * 痛点解决方案演示组件
 * 
 * 用于测试不同类型的痛点解决方案提示
 */
const PainPointDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // 触发痛点解决方案
  const triggerPainPoint = async (type: PainPointType, data: Record<string, any>) => {
    try {
      setIsLoading(true);
      playSound(SoundType.BUTTON_CLICK);
      
      // 触发痛点解决方案
      const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
      const trigger = await triggerPainPointSolution(userId, type, data);
      
      if (trigger) {
        console.log(`Pain point solution triggered: ${type}`);
      } else {
        console.log(`Failed to trigger pain point solution: ${type}`);
      }
    } catch (error) {
      console.error('Error triggering pain point solution:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-jade-800">痛点解决方案演示</h2>
      <p className="text-gray-600 mb-6">点击下面的按钮触发不同类型的痛点解决方案提示</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerPainPoint(PainPointType.TASK_OVERDUE, { overdueTasks: 5 })}
            disabled={isLoading}
          >
            触发任务逾期提示
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerPainPoint(PainPointType.LOW_ENERGY, { pandaEnergy: 15 })}
            disabled={isLoading}
          >
            触发熊猫能量不足提示
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerPainPoint(PainPointType.RESOURCE_SHORTAGE, { bamboo: 5, coins: 8 })}
            disabled={isLoading}
          >
            触发资源不足提示
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerPainPoint(PainPointType.STREAK_BREAK, { streakBroken: true })}
            disabled={isLoading}
          >
            触发连续打卡中断提示
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerPainPoint(PainPointType.FOCUS_ISSUE, { averageTaskCompletionTime: 150 })}
            disabled={isLoading}
          >
            触发注意力问题提示
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default PainPointDemo;
