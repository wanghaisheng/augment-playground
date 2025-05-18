/**
 * @deprecated 此组件已废弃，请使用 EnhancedPandaAvatar 组件代替。
 * 此组件将在下一个主要版本中移除。
 *
 * EnhancedPandaAvatar 提供了以下优势：
 * 1. 与数据刷新机制集成，自动响应数据变化
 * 2. 支持骨架屏加载，提供更好的用户体验
 * 3. 支持多语言和自定义标签
 * 4. 使用优化的动画效果，提供更流畅的用户体验
 * 5. 支持动画优先级和在低性能设备上禁用动画
 */

import React from 'react';
import {
  PandaAccessoryType,
  PandaEnvironmentRecord
} from '@/services/pandaCustomizationService';
import { PandaSkinRecord } from '@/types/skins';
import EnhancedPandaAvatar from '@/components/panda/EnhancedPandaAvatar';

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
 * @deprecated 此组件已废弃，请使用 EnhancedPandaAvatar 组件代替。
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
  // 使用 EnhancedPandaAvatar 实现
  return (
    <EnhancedPandaAvatar
      mood={mood}
      energy={energy}
      size={size}
      onClick={onClick}
      className={className}
      animate={animate}
      showAccessories={showAccessories}
      showEnvironment={showEnvironment}
    />
  );
};

export default PandaAvatar;
