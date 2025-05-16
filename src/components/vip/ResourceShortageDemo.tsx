// src/components/vip/ResourceShortageDemo.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import ResourceShortagePrompt from './ResourceShortagePrompt';
import { playSound, SoundType } from '@/utils/sound';

/**
 * 资源不足提示演示组件
 * 
 * 用于测试不同类型的资源不足提示
 */
const ResourceShortageDemo: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [resourceType, setResourceType] = useState<'bamboo' | 'coin' | 'energy'>('bamboo');
  const [currentAmount, setCurrentAmount] = useState(0);
  const [thresholdAmount, setThresholdAmount] = useState(0);
  
  // 触发资源不足提示
  const triggerResourceShortage = (type: 'bamboo' | 'coin' | 'energy', current: number, threshold: number) => {
    playSound(SoundType.BUTTON_CLICK);
    setResourceType(type);
    setCurrentAmount(current);
    setThresholdAmount(threshold);
    setShowPrompt(true);
  };
  
  // 处理关闭提示
  const handleClosePrompt = () => {
    setShowPrompt(false);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-jade-800">资源不足提示演示</h2>
      <p className="text-gray-600 mb-6">点击下面的按钮触发不同类型的资源不足提示</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerResourceShortage('bamboo', 15, 20)}
          >
            触发竹子不足提示
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerResourceShortage('coin', 30, 50)}
          >
            触发金币不足提示
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="jade"
            className="w-full"
            onClick={() => triggerResourceShortage('energy', 20, 30)}
          >
            触发能量不足提示
          </Button>
        </motion.div>
      </div>
      
      <ResourceShortagePrompt
        isOpen={showPrompt}
        onClose={handleClosePrompt}
        resourceType={resourceType}
        currentAmount={currentAmount}
        thresholdAmount={thresholdAmount}
      />
    </div>
  );
};

export default ResourceShortageDemo;
