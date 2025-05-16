// src/components/common/Switch.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { playSound, SoundType } from '@/utils/sound';

// 开关颜色变体
export type SwitchColor =
  | 'jade'    // 翡翠绿
  | 'gold'    // 黄金
  | 'blue'    // 青花
  | 'purple'  // 紫檀
  | 'gray';   // 灰色

// 开关大小
export type SwitchSize = 'small' | 'medium' | 'large';

// 开关属性
export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: SwitchColor;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  label?: string;
  labelPosition?: 'left' | 'right';
}

/**
 * 开关组件
 * 
 * 用于切换开关状态的组件，支持不同颜色和大小
 * 
 * @param checked 是否选中
 * @param onChange 状态变化回调
 * @param color 颜色变体
 * @param size 大小
 * @param disabled 是否禁用
 * @param className 自定义类名
 * @param label 标签文本
 * @param labelPosition 标签位置
 */
const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  color = 'jade',
  size = 'medium',
  disabled = false,
  className = '',
  label,
  labelPosition = 'right'
}) => {
  // 获取开关尺寸
  const getSwitchSize = () => {
    switch (size) {
      case 'small':
        return {
          width: 32,
          height: 16,
          circle: 12,
          padding: 2
        };
      case 'large':
        return {
          width: 56,
          height: 28,
          circle: 22,
          padding: 3
        };
      case 'medium':
      default:
        return {
          width: 44,
          height: 22,
          circle: 18,
          padding: 2
        };
    }
  };

  // 获取开关颜色
  const getSwitchColor = () => {
    if (disabled) {
      return {
        bg: 'bg-gray-300',
        activeBg: 'bg-gray-400',
        circle: 'bg-white'
      };
    }

    switch (color) {
      case 'gold':
        return {
          bg: 'bg-gray-200',
          activeBg: 'bg-amber-500',
          circle: 'bg-white'
        };
      case 'blue':
        return {
          bg: 'bg-gray-200',
          activeBg: 'bg-blue-500',
          circle: 'bg-white'
        };
      case 'purple':
        return {
          bg: 'bg-gray-200',
          activeBg: 'bg-purple-500',
          circle: 'bg-white'
        };
      case 'gray':
        return {
          bg: 'bg-gray-200',
          activeBg: 'bg-gray-500',
          circle: 'bg-white'
        };
      case 'jade':
      default:
        return {
          bg: 'bg-gray-200',
          activeBg: 'bg-jade-500',
          circle: 'bg-white'
        };
    }
  };

  const switchSize = getSwitchSize();
  const switchColor = getSwitchColor();

  // 处理点击事件
  const handleClick = () => {
    if (!disabled) {
      // 播放按钮点击音效
      playSound(SoundType.BUTTON_CLICK, 0.3);
      
      onChange(!checked);
    }
  };

  // 渲染开关
  const renderSwitch = () => (
    <div
      className={`relative inline-block ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={{
        width: switchSize.width,
        height: switchSize.height
      }}
      onClick={handleClick}
    >
      <div
        className={`absolute inset-0 rounded-full transition-colors ${checked ? switchColor.activeBg : switchColor.bg}`}
      />
      <motion.div
        className={`absolute rounded-full ${switchColor.circle} shadow-md`}
        style={{
          width: switchSize.circle,
          height: switchSize.circle,
          top: switchSize.padding,
          left: switchSize.padding
        }}
        animate={{
          x: checked ? switchSize.width - switchSize.circle - switchSize.padding * 2 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      />
    </div>
  );

  // 如果没有标签，只渲染开关
  if (!label) {
    return renderSwitch();
  }

  // 渲染带标签的开关
  return (
    <div className={`inline-flex items-center ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleClick}>
      {labelPosition === 'left' && (
        <span className="mr-2 text-sm">{label}</span>
      )}
      {renderSwitch()}
      {labelPosition === 'right' && (
        <span className="ml-2 text-sm">{label}</span>
      )}
    </div>
  );
};

export default Switch;
