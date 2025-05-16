// src/components/animation/ButtonTypes.ts
// This file contains type definitions for the Button component
// to avoid JSX parsing issues when importing from AnimatedButton.tsx

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
  | 'info';    // 信息 - 兼容性

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
  | 'secondary';// 次要样式 (兼容性)

// 按钮属性
export interface ButtonProps {
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
  startIcon?: any;
  endIcon?: any;
  fullWidth?: boolean;
  className?: string;
  style?: any;
  onClick?: (e: any) => void;
  children?: any;
  disabled?: boolean;
}

// Mock Button component for type checking
export const Button = (props: ButtonProps) => {
  return null;
};

export default Button;
