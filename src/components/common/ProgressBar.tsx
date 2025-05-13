// src/components/common/ProgressBar.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  total?: number;
  showPercentage?: boolean;
  className?: string;
  height?: number;
  color?: string;
  backgroundColor?: string;
  radius?: number;
  animate?: boolean;
}

/**
 * 进度条组件
 * 显示任务或奖励的完成进度
 * 
 * @param progress 当前进度值
 * @param total 总进度值，默认为100
 * @param showPercentage 是否显示百分比文本
 * @param className 自定义CSS类名
 * @param height 进度条高度，默认为10px
 * @param color 进度条颜色，默认为主题色
 * @param backgroundColor 进度条背景色，默认为半透明灰色
 * @param radius 进度条圆角半径，默认为4px
 * @param animate 是否启用动画效果，默认为true
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total = 100,
  showPercentage = false,
  className = '',
  height = 10,
  color,
  backgroundColor,
  radius = 4,
  animate = true
}) => {
  // 计算百分比
  const percentage = Math.min(Math.max(0, Math.round((progress / total) * 100)), 100);
  
  // 动画变体
  const variants = {
    initial: { width: '0%' },
    animate: { width: `${percentage}%` }
  };

  return (
    <div 
      className={`progress-bar-container ${className}`}
      style={{
        height: `${height}px`,
        backgroundColor: backgroundColor || 'rgba(0, 0, 0, 0.1)',
        borderRadius: `${radius}px`,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <motion.div
        className="progress-bar-fill"
        style={{
          height: '100%',
          backgroundColor: color || 'var(--primary-color, #4caf50)',
          borderRadius: `${radius}px`
        }}
        initial={animate ? "initial" : false}
        animate={animate ? "animate" : false}
        variants={variants}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      
      {showPercentage && (
        <div 
          className="progress-bar-text"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: percentage > 50 ? '#fff' : '#000',
            fontSize: `${height < 20 ? 10 : 14}px`,
            fontWeight: 'bold',
            textShadow: percentage > 50 ? '0 0 2px rgba(0,0,0,0.5)' : 'none'
          }}
        >
          {percentage}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
