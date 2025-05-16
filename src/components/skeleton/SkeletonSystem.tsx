// src/components/skeleton/SkeletonSystem.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// 基础骨架屏属性
interface BaseSkeletonProps {
  variant?: 'default' | 'jade' | 'gold';
  className?: string;
  style?: React.CSSProperties;
}

// 骨架屏文本属性
interface SkeletonTextProps extends BaseSkeletonProps {
  lines?: number;
  width?: number | string;
  height?: number;
  lineHeight?: number;
}

// 骨架屏图像属性
interface SkeletonImageProps extends BaseSkeletonProps {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
}

// 骨架屏按钮属性
interface SkeletonButtonProps extends BaseSkeletonProps {
  width?: number | string;
  height?: number;
  rounded?: boolean;
}

// 骨架屏卡片属性
interface SkeletonCardProps extends BaseSkeletonProps {
  width?: number | string;
  height?: number | string;
  hasImage?: boolean;
  imageHeight?: number;
  hasTitle?: boolean;
  hasDescription?: boolean;
  descriptionLines?: number;
  hasFooter?: boolean;
}

// 骨架屏列表属性
interface SkeletonListProps extends BaseSkeletonProps {
  count?: number;
  layout?: 'grid' | 'list';
  columns?: number;
  itemHeight?: number;
  hasImage?: boolean;
  imageSize?: number;
  hasTitle?: boolean;
  hasDescription?: boolean;
  descriptionLines?: number;
  gap?: number;
}

// 骨架屏表格属性
interface SkeletonTableProps extends BaseSkeletonProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  cellHeight?: number;
}

// 骨架屏统计卡片属性
interface SkeletonStatCardProps extends BaseSkeletonProps {
  width?: number | string;
  height?: number;
  hasIcon?: boolean;
  hasTitle?: boolean;
  hasValue?: boolean;
}

// 骨架屏详情页属性
interface SkeletonDetailPageProps extends BaseSkeletonProps {
  hasHeader?: boolean;
  hasImage?: boolean;
  imageHeight?: number;
  hasTitle?: boolean;
  hasMeta?: boolean;
  hasContent?: boolean;
  contentLines?: number;
  hasSidebar?: boolean;
  sidebarWidth?: number | string;
}

/**
 * 获取骨架屏颜色
 * @param variant 骨架屏变体
 * @returns 骨架屏颜色
 */
const getSkeletonColor = (variant: 'default' | 'jade' | 'gold' = 'default') => {
  switch (variant) {
    case 'jade':
      return {
        baseColor: '#e6f7f1',
        highlightColor: '#c2e8d9'
      };
    case 'gold':
      return {
        baseColor: '#fdf6e3',
        highlightColor: '#f5e7c3'
      };
    default:
      return {
        baseColor: '#f0f0f0',
        highlightColor: '#e0e0e0'
      };
  }
};

/**
 * 骨架屏文本组件
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  width,
  height,
  lineHeight = 1.5,
  variant = 'default',
  className = '',
  style
}) => {
  const { baseColor, highlightColor } = getSkeletonColor(variant);
  
  return (
    <div className={`skeleton-text ${className}`} style={style}>
      <Skeleton
        count={lines}
        width={width}
        height={height}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ lineHeight }}
      />
    </div>
  );
};

/**
 * 骨架屏图像组件
 */
export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  width = '100%',
  height = 200,
  circle = false,
  variant = 'default',
  className = '',
  style
}) => {
  const { baseColor, highlightColor } = getSkeletonColor(variant);
  
  return (
    <div className={`skeleton-image ${className}`} style={style}>
      <Skeleton
        width={width}
        height={height}
        circle={circle}
        baseColor={baseColor}
        highlightColor={highlightColor}
      />
    </div>
  );
};

/**
 * 骨架屏按钮组件
 */
export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  width = 100,
  height = 40,
  rounded = true,
  variant = 'default',
  className = '',
  style
}) => {
  const { baseColor, highlightColor } = getSkeletonColor(variant);
  
  return (
    <div 
      className={`skeleton-button ${className}`} 
      style={{
        ...style,
        borderRadius: rounded ? '9999px' : '4px'
      }}
    >
      <Skeleton
        width={width}
        height={height}
        baseColor={baseColor}
        highlightColor={highlightColor}
        borderRadius={rounded ? '9999px' : '4px'}
      />
    </div>
  );
};

/**
 * 骨架屏卡片组件
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = '100%',
  height,
  hasImage = true,
  imageHeight = 150,
  hasTitle = true,
  hasDescription = true,
  descriptionLines = 3,
  hasFooter = true,
  variant = 'default',
  className = '',
  style
}) => {
  const { baseColor, highlightColor } = getSkeletonColor(variant);
  
  return (
    <div 
      className={`skeleton-card ${className}`} 
      style={{
        width,
        height,
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #eee',
        ...style
      }}
    >
      {hasImage && (
        <div className="skeleton-card-image mb-3">
          <Skeleton
            height={imageHeight}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      )}
      
      {hasTitle && (
        <div className="skeleton-card-title mb-3">
          <Skeleton
            width="70%"
            height={24}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      )}
      
      {hasDescription && (
        <div className="skeleton-card-description mb-3">
          <Skeleton
            count={descriptionLines}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      )}
      
      {hasFooter && (
        <div className="skeleton-card-footer mt-auto">
          <Skeleton
            width="40%"
            height={30}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      )}
    </div>
  );
};

/**
 * 骨架屏列表组件
 */
export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  layout = 'list',
  columns = 2,
  itemHeight,
  hasImage = true,
  imageSize = 60,
  hasTitle = true,
  hasDescription = true,
  descriptionLines = 2,
  gap = 16,
  variant = 'default',
  className = '',
  style
}) => {
  const { baseColor, highlightColor } = getSkeletonColor(variant);
  
  // 生成列表项
  const renderListItem = (index: number) => (
    <div 
      key={index}
      className="skeleton-list-item"
      style={{
        display: 'flex',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #eee',
        height: itemHeight
      }}
    >
      {hasImage && (
        <div className="skeleton-list-item-image mr-3">
          <Skeleton
            width={imageSize}
            height={imageSize}
            circle
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      )}
      
      <div className="skeleton-list-item-content flex-1">
        {hasTitle && (
          <div className="skeleton-list-item-title mb-2">
            <Skeleton
              width="60%"
              height={20}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </div>
        )}
        
        {hasDescription && (
          <div className="skeleton-list-item-description">
            <Skeleton
              count={descriptionLines}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </div>
        )}
      </div>
    </div>
  );
  
  // 生成网格项
  const renderGridItem = (index: number) => (
    <div 
      key={index}
      className="skeleton-grid-item"
      style={{
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #eee',
        height: itemHeight
      }}
    >
      {hasImage && (
        <div className="skeleton-grid-item-image mb-3">
          <Skeleton
            height={100}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      )}
      
      {hasTitle && (
        <div className="skeleton-grid-item-title mb-2">
          <Skeleton
            width="70%"
            height={20}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      )}
      
      {hasDescription && (
        <div className="skeleton-grid-item-description">
          <Skeleton
            count={descriptionLines}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      )}
    </div>
  );
  
  return (
    <div 
      className={`skeleton-list ${layout === 'grid' ? 'skeleton-grid' : ''} ${className}`}
      style={{
        display: layout === 'grid' ? 'grid' : 'flex',
        gridTemplateColumns: layout === 'grid' ? `repeat(${columns}, 1fr)` : undefined,
        gap: `${gap}px`,
        flexDirection: layout === 'list' ? 'column' : undefined,
        ...style
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        layout === 'grid' ? renderGridItem(index) : renderListItem(index)
      ))}
    </div>
  );
};

/**
 * 骨架屏表格组件
 */
export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  hasHeader = true,
  cellHeight = 40,
  variant = 'default',
  className = '',
  style
}) => {
  const { baseColor, highlightColor } = getSkeletonColor(variant);
  
  return (
    <div className={`skeleton-table ${className}`} style={style}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {hasHeader && (
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={`header-${index}`} style={{ padding: '8px' }}>
                  <Skeleton
                    height={cellHeight}
                    baseColor={baseColor}
                    highlightColor={highlightColor}
                  />
                </th>
              ))}
            </tr>
          </thead>
        )}
        
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={`cell-${rowIndex}-${colIndex}`} style={{ padding: '8px' }}>
                  <Skeleton
                    height={cellHeight}
                    baseColor={baseColor}
                    highlightColor={highlightColor}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * 骨架屏统计卡片组件
 */
export const SkeletonStatCard: React.FC<SkeletonStatCardProps> = ({
  width = '100%',
  height = 120,
  hasIcon = true,
  hasTitle = true,
  hasValue = true,
  variant = 'default',
  className = '',
  style
}) => {
  const { baseColor, highlightColor } = getSkeletonColor(variant);
  
  return (
    <div 
      className={`skeleton-stat-card ${className}`} 
      style={{
        width,
        height,
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...style
      }}
    >
      <div className="skeleton-stat-card-content">
        {hasIcon && (
          <div className="skeleton-stat-card-icon mb-3">
            <Skeleton
              width={40}
              height={40}
              circle
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </div>
        )}
        
        {hasTitle && (
          <div className="skeleton-stat-card-title mb-2">
            <Skeleton
              width="50%"
              height={16}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </div>
        )}
        
        {hasValue && (
          <div className="skeleton-stat-card-value">
            <Skeleton
              width="70%"
              height={30}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 骨架屏详情页组件
 */
export const SkeletonDetailPage: React.FC<SkeletonDetailPageProps> = ({
  hasHeader = true,
  hasImage = true,
  imageHeight = 200,
  hasTitle = true,
  hasMeta = true,
  hasContent = true,
  contentLines = 10,
  hasSidebar = false,
  sidebarWidth = '30%',
  variant = 'default',
  className = '',
  style
}) => {
  const { baseColor, highlightColor } = getSkeletonColor(variant);
  
  return (
    <div className={`skeleton-detail-page ${className}`} style={style}>
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1 }}>
          {hasHeader && (
            <div className="skeleton-detail-page-header mb-4">
              <Skeleton
                height={50}
                baseColor={baseColor}
                highlightColor={highlightColor}
              />
            </div>
          )}
          
          {hasImage && (
            <div className="skeleton-detail-page-image mb-4">
              <Skeleton
                height={imageHeight}
                baseColor={baseColor}
                highlightColor={highlightColor}
              />
            </div>
          )}
          
          {hasTitle && (
            <div className="skeleton-detail-page-title mb-3">
              <Skeleton
                height={36}
                baseColor={baseColor}
                highlightColor={highlightColor}
              />
            </div>
          )}
          
          {hasMeta && (
            <div className="skeleton-detail-page-meta mb-4">
              <Skeleton
                width="60%"
                height={20}
                baseColor={baseColor}
                highlightColor={highlightColor}
              />
            </div>
          )}
          
          {hasContent && (
            <div className="skeleton-detail-page-content">
              <Skeleton
                count={contentLines}
                baseColor={baseColor}
                highlightColor={highlightColor}
              />
            </div>
          )}
        </div>
        
        {hasSidebar && (
          <div 
            className="skeleton-detail-page-sidebar"
            style={{ width: sidebarWidth }}
          >
            <Skeleton
              height={400}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};
