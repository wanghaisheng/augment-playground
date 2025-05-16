// src/components/common/ButtonGroup.tsx
import React from 'react';
import { ButtonColor, ButtonSize, ButtonShape, ButtonVariant } from './Button';

// 按钮组方向
export type ButtonGroupDirection = 'horizontal' | 'vertical';

// 按钮组属性
interface ButtonGroupProps {
  children: React.ReactNode;
  direction?: ButtonGroupDirection;
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  spacing?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 按钮组组件，用于组合多个按钮
 * 
 * @param children - 子元素（按钮）
 * @param direction - 排列方向：'horizontal'（默认）, 'vertical'
 * @param color - 按钮颜色（应用于所有子按钮）
 * @param size - 按钮大小（应用于所有子按钮）
 * @param shape - 按钮形状（应用于所有子按钮）
 * @param variant - 按钮变种（应用于所有子按钮）
 * @param fullWidth - 是否占满容器宽度
 * @param spacing - 按钮间距
 * @param className - 自定义类名
 * @param style - 自定义样式
 */
const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  direction = 'horizontal',
  color,
  size,
  shape,
  variant,
  fullWidth = false,
  spacing = 0,
  className = '',
  style,
}) => {
  // 克隆子元素并应用共享属性
  const clonedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    // 应用共享属性
    const sharedProps: any = {};
    if (color !== undefined) sharedProps.color = color;
    if (size !== undefined) sharedProps.size = size;
    if (variant !== undefined) sharedProps.variant = variant;
    
    // 处理形状，使按钮组看起来像一个整体
    if (shape !== undefined) {
      if (direction === 'horizontal') {
        if (index === 0) {
          sharedProps.shape = shape === 'pill' 
            ? 'pill' 
            : 'square';
          sharedProps.style = { 
            ...child.props.style,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            marginRight: spacing ? -1 : undefined
          };
        } else if (index === React.Children.count(children) - 1) {
          sharedProps.shape = shape === 'pill' 
            ? 'pill' 
            : 'square';
          sharedProps.style = { 
            ...child.props.style,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            marginLeft: spacing ? -1 : undefined
          };
        } else {
          sharedProps.shape = 'square';
          sharedProps.style = { 
            ...child.props.style,
            borderRadius: 0,
            marginLeft: spacing ? -1 : undefined,
            marginRight: spacing ? -1 : undefined
          };
        }
      } else {
        if (index === 0) {
          sharedProps.shape = shape === 'pill' 
            ? 'pill' 
            : 'square';
          sharedProps.style = { 
            ...child.props.style,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            marginBottom: spacing ? -1 : undefined
          };
        } else if (index === React.Children.count(children) - 1) {
          sharedProps.shape = shape === 'pill' 
            ? 'pill' 
            : 'square';
          sharedProps.style = { 
            ...child.props.style,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            marginTop: spacing ? -1 : undefined
          };
        } else {
          sharedProps.shape = 'square';
          sharedProps.style = { 
            ...child.props.style,
            borderRadius: 0,
            marginTop: spacing ? -1 : undefined,
            marginBottom: spacing ? -1 : undefined
          };
        }
      }
    }

    // 如果有间距，添加间距样式
    if (spacing > 0) {
      const spacingStyle = direction === 'horizontal'
        ? { marginLeft: index > 0 ? spacing : 0 }
        : { marginTop: index > 0 ? spacing : 0 };
      
      sharedProps.style = {
        ...sharedProps.style,
        ...spacingStyle
      };
    }

    return React.cloneElement(child, sharedProps);
  });

  // 构建类名
  const groupClassName = [
    'button-group',
    direction === 'vertical' ? 'button-group-vertical' : 'button-group-horizontal',
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  // 构建样式
  const groupStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    width: fullWidth ? '100%' : 'auto',
    ...style
  };

  return (
    <div className={groupClassName} style={groupStyle}>
      {clonedChildren}
    </div>
  );
};

export default ButtonGroup;
