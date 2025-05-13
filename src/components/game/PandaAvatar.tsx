// src/components/game/PandaAvatar.tsx
import React, { useState, useEffect } from 'react';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import {
  getEquippedAccessories,
  PandaAccessoryRecord,
  PandaAccessoryType,
  getActiveEnvironment,
  PandaEnvironmentRecord
} from '@/services/pandaCustomizationService';

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
  showAccessories?: boolean;
  showEnvironment?: boolean;
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
 * @param showAccessories - 是否显示装饰，默认为true
 * @param showEnvironment - 是否显示环境，默认为false
 */
const PandaAvatar: React.FC<PandaAvatarProps> = ({
  mood = 'normal',
  energy = 'medium',
  size = 120,
  onClick,
  className = '',
  animate = true,
  showAccessories = true,
  showEnvironment = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [accessories, setAccessories] = useState<PandaAccessoryRecord[]>([]);
  const [environment, setEnvironment] = useState<PandaEnvironmentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载装饰和环境
  const loadCustomizations = async () => {
    try {
      setIsLoading(true);

      // 加载装饰
      if (showAccessories) {
        const equippedAccessories = await getEquippedAccessories();
        setAccessories(equippedAccessories);
      }

      // 加载环境
      if (showEnvironment) {
        const activeEnvironment = await getActiveEnvironment();
        if (activeEnvironment) {
          setEnvironment(activeEnvironment);
        }
      }
    } catch (err) {
      console.error('Failed to load customizations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadCustomizations();
  }, [showAccessories, showEnvironment]);

  // 注册数据刷新监听
  useRegisterTableRefresh('pandaAccessories', loadCustomizations);
  useRegisterTableRefresh('pandaEnvironments', loadCustomizations);

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

  // 获取装饰的z-index
  const getAccessoryZIndex = (type: PandaAccessoryType): number => {
    switch (type) {
      case PandaAccessoryType.BACKGROUND:
        return -1;
      case PandaAccessoryType.FRAME:
        return 1;
      case PandaAccessoryType.HAT:
        return 2;
      case PandaAccessoryType.GLASSES:
        return 3;
      case PandaAccessoryType.SCARF:
        return 4;
      case PandaAccessoryType.PENDANT:
        return 5;
      case PandaAccessoryType.EFFECT:
        return 10;
      default:
        return 0;
    }
  };

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

  // 环境样式
  const environmentStyle = showEnvironment && environment ? {
    backgroundImage: `url(${environment.backgroundPath})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    padding: '10px'
  } : {};

  return (
    <div
      className={`panda-environment ${className}`}
      style={environmentStyle}
    >
      <div
        className={`panda-avatar ${className}`}
        style={combinedStyle}
        onClick={handleClick}
      >
        {/* 背景装饰 */}
        {showAccessories && accessories.filter(a => a.type === PandaAccessoryType.BACKGROUND).map(accessory => (
          <img
            key={accessory.id}
            src={accessory.imagePath}
            alt={accessory.name}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: getAccessoryZIndex(accessory.type)
            }}
          />
        ))}

        {/* 熊猫基础图像 */}
        <img
          src={getPandaImage(mood)}
          alt={`Panda in ${mood} mood`}
          style={{ width: '100%', height: '100%', position: 'relative', zIndex: 0 }}
        />

        {/* 其他装饰 */}
        {showAccessories && accessories.filter(a => a.type !== PandaAccessoryType.BACKGROUND).map(accessory => (
          <img
            key={accessory.id}
            src={accessory.imagePath}
            alt={accessory.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: getAccessoryZIndex(accessory.type),
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>

      {/* 环境前景 */}
      {showEnvironment && environment && environment.foregroundPath && (
        <img
          src={environment.foregroundPath}
          alt={`${environment.name} foreground`}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 20,
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
};

export default PandaAvatar;
