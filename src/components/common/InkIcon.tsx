import React from 'react';

// 图标类型定义
export type InkIconType = 
  // 导航图标
  | 'navigation-home'
  | 'navigation-tasks'
  | 'navigation-challenges'
  | 'navigation-store'
  | 'navigation-settings'
  | 'navigation-vip'
  | 'navigation-battlepass'
  
  // 操作图标
  | 'action-add'
  | 'action-delete'
  | 'action-edit'
  | 'action-complete'
  | 'action-refresh'
  | 'action-search'
  | 'action-share'
  | 'action-favorite'
  
  // 状态图标
  | 'status-success'
  | 'status-error'
  | 'status-warning'
  | 'status-info'
  | 'status-locked'
  | 'status-unlocked'
  | 'status-loading'
  
  // 资源图标
  | 'resource-experience'
  | 'resource-coin'
  | 'resource-bamboo'
  | 'resource-diamond'
  | 'resource-item'
  | 'resource-badge'
  | 'resource-food';

// 图标尺寸定义
export type InkIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 图标属性定义
interface InkIconProps {
  type: InkIconType;
  size?: InkIconSize;
  className?: string;
  onClick?: () => void;
  title?: string;
  alt?: string;
}

/**
 * 水墨风格图标组件
 * 
 * 使用示例:
 * ```tsx
 * <InkIcon type="navigation-home" size="md" />
 * ```
 */
const InkIcon: React.FC<InkIconProps> = ({ 
  type, 
  size = 'md', 
  className = '', 
  onClick,
  title,
  alt
}) => {
  // 尺寸映射
  const sizeMap: Record<InkIconSize, string> = {
    xs: '16px',
    sm: '24px',
    md: '32px',
    lg: '40px',
    xl: '48px'
  };
  
  // 图标路径
  const iconPath = `/assets/icons/ink-${type}.svg`;
  
  // 样式
  const style: React.CSSProperties = {
    width: sizeMap[size],
    height: sizeMap[size],
    display: 'inline-block',
    verticalAlign: 'middle',
    transition: 'transform 0.3s ease'
  };
  
  return (
    <img 
      src={iconPath}
      alt={alt || `${type} icon`}
      title={title}
      className={`ink-icon ink-icon-${type} ${className}`}
      style={style}
      onClick={onClick}
    />
  );
};

export default InkIcon;
