// src/components/common/IconButton.tsx
import React from 'react';
import Button, { ButtonColor, ButtonSize, ButtonVariant } from './Button';

// 图标按钮属性
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: ButtonVariant;
  isLoading?: boolean;
  tooltip?: string;
  className?: string;
  ariaLabel: string;
}

/**
 * 图标按钮组件，只显示图标的按钮
 * 
 * @param icon - 图标
 * @param color - 按钮颜色
 * @param size - 按钮大小
 * @param variant - 按钮变种
 * @param isLoading - 是否显示加载状态
 * @param tooltip - 提示文本
 * @param className - 自定义类名
 * @param ariaLabel - 无障碍标签（必填）
 */
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  color = 'jade',
  size = 'medium',
  variant = 'filled',
  isLoading = false,
  tooltip,
  className = '',
  ariaLabel,
  ...props
}) => {
  // 根据大小设置图标按钮的尺寸
  const getButtonSize = (): ButtonSize => {
    return size;
  };

  // 构建类名
  const buttonClassName = [
    'button-icon-only',
    className
  ].filter(Boolean).join(' ');

  return (
    <Button
      color={color}
      size={getButtonSize()}
      shape="circle"
      variant={variant}
      isLoading={isLoading}
      className={buttonClassName}
      aria-label={ariaLabel}
      title={tooltip}
      {...props}
    >
      {icon}
    </Button>
  );
};

export default IconButton;
