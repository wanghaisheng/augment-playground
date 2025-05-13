// src/components/game/PandaAvatar.tsx
import React, { useState, useEffect } from 'react';
import { useTableRefresh } from '@/hooks/useDataRefresh';

// 熊猫状态类型
export type PandaMood = 'normal' | 'happy' | 'focused' | 'tired';

// 熊猫能量级别
export type EnergyLevel = 'high' | 'medium' | 'low';

interface PandaAvatarProps {
  mood?: PandaMood;
  energy?: EnergyLevel;
  size?: number;
  onClick?: () => void;
  className?: string;
  animate?: boolean;
}

/**
 * 熊猫头像组件，显示不同情绪和能量状态的熊猫
 *
 * @param mood - 熊猫的情绪状态：normal(正常), happy(开心), focused(专注), tired(疲惫)
 * @param energy - 熊猫的能量级别：high(高), medium(中), low(低)
 * @param size - 头像大小，默认为120px
 * @param onClick - 点击头像时的回调函数
 * @param className - 额外的CSS类名
 * @param animate - 是否启用动画效果
 */
const PandaAvatar: React.FC<PandaAvatarProps> = ({
  mood = 'normal',
  energy = 'medium',
  size = 120,
  onClick,
  className = '',
  animate = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // 根据情绪状态获取对应的SVG图像路径
  const getPandaImage = (pandaMood: PandaMood) => {
    switch (pandaMood) {
      case 'happy':
        return '/assets/panda-happy.svg';
      case 'focused':
        return '/assets/panda-focused.svg';
      case 'tired':
        return '/assets/panda-tired.svg';
      case 'normal':
      default:
        return '/assets/panda-normal.svg';
    }
  };

  // 根据能量级别获取对应的样式
  const getEnergyStyle = (level: EnergyLevel) => {
    switch (level) {
      case 'high':
        return { filter: 'brightness(1.2) saturate(1.2)', transform: 'scale(1.05)' };
      case 'low':
        return { filter: 'brightness(0.9) saturate(0.8)', transform: 'scale(0.95)' };
      case 'medium':
      default:
        return { filter: 'brightness(1) saturate(1)', transform: 'scale(1)' };
    }
  };

  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    if (animate) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // 动画效果
  useEffect(() => {
    if (animate && isAnimating) {
      // 动画逻辑可以在这里添加
    }
  }, [animate, isAnimating]);

  // 组合样式
  const energyStyle = getEnergyStyle(energy);
  const animationStyle = isAnimating ? { animation: 'panda-bounce 0.5s ease' } : {};
  const combinedStyle = {
    width: `${size}px`,
    height: `${size}px`,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    ...energyStyle,
    ...animationStyle
  };

  return (
    <div
      className={`panda-avatar ${className}`}
      style={combinedStyle}
      onClick={handleClick}
    >
      <img
        src={getPandaImage(mood)}
        alt={`Panda in ${mood} mood`}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default PandaAvatar;
