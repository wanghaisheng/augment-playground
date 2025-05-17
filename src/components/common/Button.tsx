// src/components/common/Button.tsx
import React from 'react';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { playSound, SoundType } from '@/utils/sound';

// 按钮颜色变体
export type ButtonColor =
  | 'jade'     // 翡翠绿 - 主要操作
  | 'gold'     // 黄金 - 高级操作
  | 'silk'     // 丝绸 - 次要操作
  | 'cinnabar' // 朱砂 - 警告操作
  | 'blue'     // 青花 - 信息操作
  | 'purple'   // 紫檀 - 特殊操作
  | 'bamboo'   // 竹子 - 竹子相关操作
  | 'primary'  // 主要 - 兼容性
  | 'secondary'// 次要 - 兼容性
  | 'danger'   // 危险 - 兼容性
  | 'success'  // 成功 - 兼容性
  | 'warning'  // 警告 - 兼容性
  | 'info'     // 信息 - 兼容性
  | 'red'      // 红色 - 兼容性
  | 'gray';    // 灰色 - 兼容性

// 按钮大小
export type ButtonSize = 'small' | 'medium' | 'large';

// 按钮形状
export type ButtonShape = 'rounded' | 'pill' | 'square' | 'circle';

// 按钮变种
export type ButtonVariant =
  | 'filled'    // 填充样式
  | 'outlined'  // 轮廓样式
  | 'text'      // 文本样式
  | 'jade'      // 翡翠样式 (兼容性)
  | 'gold'      // 黄金样式 (兼容性)
  | 'bamboo'    // 竹子样式 (兼容性)
  | 'contained' // 包含样式 (兼容性)
  | 'standard'  // 标准样式 (兼容性)
  | 'ghost'     // 幽灵样式 (兼容性)
  | 'secondary' // 次要样式 (兼容性)
  | 'error';    // 错误样式 (兼容性)

// 按钮属性
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  variant?: ButtonVariant;
  isLoading?: boolean;
  loading?: boolean; // 兼容性属性，等同于isLoading
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

/**
 * 增强的按钮组件，支持多种样式、大小、形状和变种
 *
 * @param color - 按钮颜色：'jade'（翡翠绿，默认）, 'gold'（黄金）, 'silk'（丝绸）, 'cinnabar'（朱砂）, 'blue'（青花）, 'purple'（紫檀）
 * @param size - 按钮大小：'small', 'medium'（默认）, 'large'
 * @param shape - 按钮形状：'rounded'（默认）, 'pill', 'square', 'circle'
 * @param variant - 按钮变种：'filled'（默认）, 'outlined', 'text'
 * @param isLoading - 是否显示加载状态
 * @param loadingText - 加载状态显示的文本（覆盖默认本地化文本）
 * @param startIcon - 按钮左侧图标
 * @param endIcon - 按钮右侧图标
 * @param fullWidth - 是否占满容器宽度
 * @param className - 自定义类名
 */
const Button: React.FC<ButtonProps> = ({
  children,
  color = 'jade',
  size = 'medium',
  shape = 'rounded',
  variant = 'filled',
  isLoading = false,
  loading,
  loadingText,
  startIcon,
  endIcon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  // 获取本地化标签
  const { labels } = useComponentLabels();

  // 使用提供的loadingText或回退到本地化标签
  const finalLoadingText = loadingText || labels?.button?.loading || "Loading...";

  // 提取onClick属性
  const { onClick, ...restProps } = props;

  // 处理点击事件，添加音效
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 播放按钮点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    // 调用原始的onClick处理函数
    if (onClick) {
      onClick(e);
    }
  };

  // 处理loading属性（兼容性）
  const isButtonLoading = isLoading || loading;

  // 构建类名
  const baseClass = 'button-base';
  const colorClass = `button-${color}`;
  const sizeClass = `button-size-${size}`;
  const shapeClass = `button-shape-${shape}`;
  const variantClass = variant !== 'filled' ? `button-variant-${variant}` : '';
  const disabledClass = props.disabled || isButtonLoading ? 'button-disabled' : '';
  const loadingClass = isButtonLoading ? 'button-loading' : '';
  const fullWidthClass = fullWidth ? 'w-full' : '';
  const iconClass = (startIcon || endIcon) ? 'button-with-icon' : '';

  // 组合所有类名
  const buttonClassName = [
    baseClass,
    colorClass,
    sizeClass,
    shapeClass,
    variantClass,
    disabledClass,
    loadingClass,
    fullWidthClass,
    iconClass,
    className
  ].filter(Boolean).join(' ');

  // 兼容旧版本的jade和gold变体
  const legacyClass = (color === 'jade' && variant === 'filled') ? 'jade-button' :
                      (color === 'gold' && variant === 'filled') ? 'gold-button' : '';

  return (
    <button
      className={`${buttonClassName} ${legacyClass}`.trim()}
      disabled={isButtonLoading || restProps.disabled}
      onClick={handleClick}
      {...restProps}
    >
      {isButtonLoading && (
        <span className="button-loading-spinner" aria-hidden="true"></span>
      )}

      {startIcon && !isButtonLoading && (
        <span className="button-icon-left">{startIcon}</span>
      )}

      {isButtonLoading ? finalLoadingText : children}

      {endIcon && !isButtonLoading && (
        <span className="button-icon-right">{endIcon}</span>
      )}
    </button>
  );
};

export default Button;