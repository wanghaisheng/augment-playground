// src/components/skeleton/SkeletonList.tsx
import React from 'react';
import SkeletonCard from './SkeletonCard';

interface SkeletonListProps {
  count?: number;
  component?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  gap?: string | number;
  layout?: 'grid' | 'list';
  columns?: number;
  variant?: 'default' | 'jade' | 'gold';
}

/**
 * 列表骨架组件
 * 用于列表的占位
 * 
 * @param count - 列表项数量
 * @param component - 自定义列表项组件
 * @param className - 容器自定义CSS类名
 * @param itemClassName - 列表项自定义CSS类名
 * @param gap - 列表项间距
 * @param layout - 布局方式
 * @param columns - 网格列数
 * @param variant - 变体样式
 */
const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  component,
  className = '',
  itemClassName = '',
  gap = '1rem',
  layout = 'list',
  columns = 2,
  variant = 'default'
}) => {
  // 创建列表项数组
  const items = Array.from({ length: count }, (_, index) => index);

  // 获取布局样式
  const getLayoutStyle = (): React.CSSProperties => {
    if (layout === 'grid') {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap
      };
    }
    
    return {
      display: 'flex',
      flexDirection: 'column',
      gap
    };
  };

  return (
    <div 
      className={`skeleton-list ${className}`}
      style={getLayoutStyle()}
    >
      {items.map((_, index) => (
        <div key={index} className={`skeleton-list-item ${itemClassName}`}>
          {component || (
            <SkeletonCard
              variant={variant}
              hasImage={layout === 'grid'}
              contentLines={layout === 'grid' ? 2 : 3}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonList;
