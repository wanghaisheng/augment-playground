// src/components/animation/InkLoading.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { InkColorType } from '@/utils/inkAnimationUtils';

// 水墨加载组件属性
interface InkLoadingProps {
  color?: InkColorType;
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

/**
 * 水墨加载组件
 * 
 * @param color - 水墨颜色
 * @param size - 加载器大小
 * @param text - 加载文本
 * @param className - CSS类名
 */
const InkLoading: React.FC<InkLoadingProps> = ({
  color = 'black',
  size = 'medium',
  text,
  className = ''
}) => {
  // 尺寸映射
  const sizeMap = {
    small: {
      container: 40,
      drop: 8,
      distance: 12,
      fontSize: 12
    },
    medium: {
      container: 60,
      drop: 12,
      distance: 18,
      fontSize: 14
    },
    large: {
      container: 80,
      drop: 16,
      distance: 24,
      fontSize: 16
    }
  };
  
  // 生成水墨滴
  const generateInkDrops = () => {
    const drops = [];
    const count = 3;
    
    for (let i = 0; i < count; i++) {
      // 计算位置
      const angle = (i / count) * 2 * Math.PI;
      const x = Math.cos(angle) * sizeMap[size].distance;
      const y = Math.sin(angle) * sizeMap[size].distance;
      
      drops.push(
        <motion.div
          key={`ink-loading-drop-${i}`}
          className="ink-loading-drop"
          style={{
            top: '50%',
            left: '50%',
            width: sizeMap[size].drop,
            height: sizeMap[size].drop,
            backgroundColor: `var(--ink-color)`,
            filter: 'blur(2px)',
            transform: 'translate(-50%, -50%)',
            x, 
            y
          }}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.4, 0.8],
            filter: ['blur(2px)', 'blur(4px)', 'blur(2px)']
          }}
          transition={{ 
            duration: 1.5,
            delay: i * 0.5,
            repeat: Infinity,
            repeatType: 'loop'
          }}
        />
      );
    }
    
    return drops;
  };
  
  return (
    <div 
      className={`ink-loading-container ink-${color} ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}
    >
      {/* 加载动画 */}
      <div 
        className="ink-loading"
        style={{
          position: 'relative',
          width: sizeMap[size].container,
          height: sizeMap[size].container
        }}
      >
        {generateInkDrops()}
        
        {/* 中心水墨滴 */}
        <motion.div
          className="ink-loading-center"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: sizeMap[size].drop * 1.2,
            height: sizeMap[size].drop * 1.2,
            backgroundColor: `var(--ink-color)`,
            borderRadius: '50%',
            filter: 'blur(1px)',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.9, 0.7, 0.9]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop'
          }}
        />
      </div>
      
      {/* 加载文本 */}
      {text && (
        <motion.div
          className="ink-loading-text"
          style={{
            fontSize: sizeMap[size].fontSize,
            color: `var(--ink-color)`,
            fontFamily: 'var(--font-title)'
          }}
          animate={{ 
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop'
          }}
        >
          {text}
        </motion.div>
      )}
    </div>
  );
};

export default InkLoading;
