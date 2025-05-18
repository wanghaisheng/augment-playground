// src/components/panda/EnhancedPandaAvatar.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  getEquippedAccessories,
  PandaAccessoryRecord,
  PandaAccessoryType,
  getActiveEnvironment,
  PandaEnvironmentRecord
} from '@/services/pandaCustomizationService';
import { getEquippedSkin } from '@/services/pandaSkinService';
import { PandaSkinRecord } from '@/types/skins';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { usePandaState } from '@/context/PandaStateProvider';
import { useSkeletonContext } from '@/context/SkeletonProvider';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// 熊猫状态类型
export type PandaMood = 'normal' | 'happy' | 'focused' | 'tired';

// 熊猫能量级别
export type EnergyLevel = 'high' | 'medium' | 'low';

interface EnhancedPandaAvatarProps {
  mood?: PandaMood;
  energy?: EnergyLevel;
  size?: number;
  onClick?: () => void;
  className?: string;
  animate?: boolean;
  showAccessories?: boolean;
  showEnvironment?: boolean;
  priority?: 'low' | 'medium' | 'high';
  disableOnLowPerformance?: boolean;
  labels?: {
    loading?: string;
    error?: string;
  };
}

/**
 * 增强版熊猫头像组件
 * 显示不同情绪和能量状态的熊猫，支持装饰和环境
 *
 * @param mood - 熊猫的情绪状态：normal(正常), happy(开心), focused(专注), tired(疲惫)
 * @param energy - 熊猫的能量级别：high(高), medium(中), low(低)
 * @param size - 头像大小，默认为120px
 * @param onClick - 点击头像时的回调函数
 * @param className - 额外的CSS类名
 * @param animate - 是否启用动画效果
 * @param showAccessories - 是否显示装饰，默认为true
 * @param showEnvironment - 是否显示环境，默认为false
 * @param priority - 动画优先级，默认为medium
 * @param disableOnLowPerformance - 是否在低性能设备上禁用动画，默认为false
 * @param labels - 本地化标签
 */
const EnhancedPandaAvatar: React.FC<EnhancedPandaAvatarProps> = ({
  mood = 'normal',
  energy = 'medium',
  size = 120,
  onClick,
  className = '',
  animate = true,
  showAccessories = true,
  showEnvironment = false,
  priority = 'medium',
  disableOnLowPerformance = false,
  labels: propLabels
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [accessories, setAccessories] = useState<PandaAccessoryRecord[]>([]);
  const [skin, setSkin] = useState<PandaSkinRecord | null>(null);
  const [environment, setEnvironment] = useState<PandaEnvironmentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 获取熊猫状态
  const { pandaState } = usePandaState();
  
  // 获取骨架屏上下文
  const { isSkeletonVisible } = useSkeletonContext();
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    loading: propLabels?.loading || componentLabels?.pandaAvatar?.loading || "Loading panda...",
    error: propLabels?.error || componentLabels?.pandaAvatar?.error || "Failed to load panda"
  };

  // 加载熊猫数据
  const loadPandaData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 加载装饰
      if (showAccessories) {
        const equippedAccessories = await getEquippedAccessories();
        setAccessories(equippedAccessories);
      }

      // 加载皮肤
      const equippedSkin = await getEquippedSkin();
      setSkin(equippedSkin);

      // 加载环境
      if (showEnvironment) {
        const activeEnvironment = await getActiveEnvironment();
        setEnvironment(activeEnvironment);
      }
    } catch (err) {
      console.error('Failed to load panda data:', err);
      setError('Failed to load panda data');
    } finally {
      setIsLoading(false);
    }
  }, [showAccessories, showEnvironment]);

  // 初始加载
  useEffect(() => {
    loadPandaData();
  }, [loadPandaData]);

  // 注册数据刷新监听
  useRegisterTableRefresh('pandaAccessories', loadPandaData);
  useRegisterTableRefresh('pandaSkins', loadPandaData);
  useRegisterTableRefresh('pandaEnvironments', loadPandaData);

  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      // 播放点击音效
      playSound(SoundType.BUTTON_CLICK, 0.3);
      
      // 触发动画
      if (animate && !isAnimating) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);
      }
      
      // 调用回调
      onClick();
    }
  };

  // 根据能量级别获取样式
  const getEnergyStyle = (energyLevel: EnergyLevel) => {
    switch (energyLevel) {
      case 'high':
        return { filter: 'brightness(1.1)' };
      case 'medium':
        return { filter: 'brightness(1)' };
      case 'low':
        return { filter: 'brightness(0.9) saturate(0.9)' };
      default:
        return {};
    }
  };

  // 根据情绪状态获取对应的SVG图像路径
  const getPandaImage = (pandaMood: PandaMood) => {
    // 如果有皮肤，使用皮肤的图像
    if (skin) {
      // 使用 assetKey 构建图像路径
      const basePath = `/assets/skins/${skin.assetKey}`;
      switch (pandaMood) {
        case 'happy':
          return `${basePath}_happy.svg`;
        case 'focused':
          return `${basePath}_focused.svg`;
        case 'tired':
          return `${basePath}_tired.svg`;
        case 'normal':
        default:
          return `${basePath}_normal.svg`;
      }
    }

    // 默认图像
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
  const environmentStyle = {
    position: 'relative' as const,
    width: `${size * 1.5}px`,
    height: `${size * 1.5}px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: '8px'
  };

  // 如果正在加载或显示骨架屏，显示加载状态
  if (isLoading || isSkeletonVisible) {
    return (
      <div 
        className={`enhanced-panda-avatar-loading ${className}`}
        style={{ width: `${size}px`, height: `${size}px`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <LoadingSpinner variant="jade" text={labels.loading} />
      </div>
    );
  }

  // 如果有错误，显示错误状态
  if (error) {
    return (
      <div 
        className={`enhanced-panda-avatar-error ${className}`}
        style={{ width: `${size}px`, height: `${size}px`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className="text-red-500 text-center">
          <p>{labels.error}</p>
        </div>
      </div>
    );
  }

  // 渲染熊猫头像
  return (
    <div
      className={`enhanced-panda-environment ${className}`}
      style={environmentStyle}
    >
      {/* 环境背景 */}
      {showEnvironment && environment && environment.backgroundPath && (
        <img
          src={environment.backgroundPath}
          alt={`${environment.name} background`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -10
          }}
        />
      )}

      <motion.div
        className={`enhanced-panda-avatar ${className}`}
        style={combinedStyle}
        onClick={handleClick}
        whileHover={animate ? { scale: 1.05 } : {}}
        whileTap={animate ? { scale: 0.95 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
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
      </motion.div>

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

export default EnhancedPandaAvatar;
