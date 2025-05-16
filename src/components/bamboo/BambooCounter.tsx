// src/components/bamboo/BambooCounter.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBambooSystem } from '@/hooks/useBambooSystem';
import { useLanguage } from '@/context/LanguageProvider';
import { Tooltip } from '@/components/common/Tooltip';

interface BambooCounterProps {
  showLabel?: boolean;
  showTooltip?: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * 竹子计数器组件，显示用户当前的竹子数量
 */
const BambooCounter: React.FC<BambooCounterProps> = ({
  showLabel = false,
  showTooltip = true,
  size = 'medium'
}) => {
  const { language } = useLanguage();
  const { bambooCount } = useBambooSystem();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(bambooCount);

  // 当竹子数量变化时添加动画效果
  useEffect(() => {
    if (bambooCount !== prevCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      setPrevCount(bambooCount);

      return () => clearTimeout(timer);
    }
  }, [bambooCount, prevCount]);

  // 根据大小设置样式
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: 'px-2 py-1',
          icon: 'w-4 h-4',
          text: 'text-xs'
        };
      case 'large':
        return {
          container: 'px-4 py-2',
          icon: 'w-8 h-8',
          text: 'text-lg'
        };
      case 'medium':
      default:
        return {
          container: 'px-3 py-1.5',
          icon: 'w-6 h-6',
          text: 'text-base'
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const tooltipText = language === 'zh'
    ? '竹子是熊猫的主要食物，可以通过完成任务和挑战获得。点击查看竹子仪表盘。'
    : 'Bamboo is the main food for pandas. You can earn it by completing tasks and challenges. Click to view bamboo dashboard.';

  return (
    <Tooltip content={showTooltip ? tooltipText : ''} placement="bottom">
      <Link
        to="/bamboo-dashboard"
        className={`bamboo-counter ${sizeStyles.container} flex items-center gap-2 bg-green-50 rounded-full border border-green-200 hover:bg-green-100 transition-all ${isAnimating ? 'animate-pulse' : ''}`}
      >
        <img
          src="/assets/bamboo/bamboo_icon.svg"
          alt="Bamboo"
          className={sizeStyles.icon}
        />
        <span className={`${sizeStyles.text} font-bold text-green-800 ${isAnimating ? 'text-green-600' : ''}`}>
          {bambooCount}
        </span>
        {showLabel && (
          <span className={`${sizeStyles.text} text-green-700 ml-1`}>
            {language === 'zh' ? '竹子' : 'Bamboo'}
          </span>
        )}
      </Link>
    </Tooltip>
  );
};

export default BambooCounter;
