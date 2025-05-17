// src/components/skeleton/SkeletonSystem.tsx
import React from 'react';
// 使用自定义骨架屏组件替代react-loading-skeleton
import LoadingSpinner from '../common/LoadingSpinner';

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
 * 获取骨架屏颜色 - 已不再使用，保留作为参考
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
  // 使用自定义骨架屏样式
  return (
    <div className={`skeleton-text ${className}`} style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`skeleton-line ${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
          style={{
            width: typeof width === 'number' ? `${width}px` : width || '100%',
            height: typeof height === 'number' ? `${height}px` : height || '16px',
            marginBottom: index < lines - 1 ? '8px' : 0,
            lineHeight: lineHeight
          }}
        />
      ))}
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
  // 使用自定义骨架屏样式
  return (
    <div
      className={`skeleton-image ${className} ${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
      style={{
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: circle ? '50%' : '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <LoadingSpinner variant={variant === 'jade' ? 'jade' : variant === 'gold' ? 'gold' : 'default'} />
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
  // 使用自定义骨架屏样式
  return (
    <div
      className={`skeleton-button ${className} ${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
      style={{
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: rounded ? '9999px' : '4px',
        display: 'inline-block'
      }}
    />
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
  // 使用自定义骨架屏样式
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
          <div
            className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
            style={{ height: `${imageHeight}px`, width: '100%' }}
          />
        </div>
      )}

      {hasTitle && (
        <div className="skeleton-card-title mb-3">
          <div
            className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
            style={{ width: '70%', height: '24px' }}
          />
        </div>
      )}

      {hasDescription && (
        <div className="skeleton-card-description mb-3">
          {Array.from({ length: descriptionLines }).map((_, index) => (
            <div
              key={index}
              className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
              style={{
                width: '100%',
                height: '16px',
                marginBottom: index < descriptionLines - 1 ? '8px' : 0
              }}
            />
          ))}
        </div>
      )}

      {hasFooter && (
        <div className="skeleton-card-footer mt-auto">
          <div
            className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
            style={{ width: '40%', height: '30px' }}
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
          <div
            className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
            style={{
              width: `${imageSize}px`,
              height: `${imageSize}px`,
              borderRadius: '50%'
            }}
          />
        </div>
      )}

      <div className="skeleton-list-item-content flex-1">
        {hasTitle && (
          <div className="skeleton-list-item-title mb-2">
            <div
              className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
              style={{ width: '60%', height: '20px' }}
            />
          </div>
        )}

        {hasDescription && (
          <div className="skeleton-list-item-description">
            {Array.from({ length: descriptionLines }).map((_, idx) => (
              <div
                key={idx}
                className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
                style={{
                  width: '100%',
                  height: '16px',
                  marginBottom: idx < descriptionLines - 1 ? '8px' : 0
                }}
              />
            ))}
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
          <div
            className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
            style={{ height: '100px', width: '100%' }}
          />
        </div>
      )}

      {hasTitle && (
        <div className="skeleton-grid-item-title mb-2">
          <div
            className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
            style={{ width: '70%', height: '20px' }}
          />
        </div>
      )}

      {hasDescription && (
        <div className="skeleton-grid-item-description">
          {Array.from({ length: descriptionLines }).map((_, idx) => (
            <div
              key={idx}
              className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
              style={{
                width: '100%',
                height: '16px',
                marginBottom: idx < descriptionLines - 1 ? '8px' : 0
              }}
            />
          ))}
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
  return (
    <div className={`skeleton-table ${className}`} style={style}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {hasHeader && (
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={`header-${index}`} style={{ padding: '8px' }}>
                  <div
                    className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
                    style={{ height: `${cellHeight}px`, width: '100%' }}
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
                  <div
                    className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
                    style={{ height: `${cellHeight}px`, width: '100%' }}
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
            <div
              className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%'
              }}
            />
          </div>
        )}

        {hasTitle && (
          <div className="skeleton-stat-card-title mb-2">
            <div
              className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
              style={{ width: '50%', height: '16px' }}
            />
          </div>
        )}

        {hasValue && (
          <div className="skeleton-stat-card-value">
            <div
              className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
              style={{ width: '70%', height: '30px' }}
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
  return (
    <div className={`skeleton-detail-page ${className}`} style={style}>
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1 }}>
          {hasHeader && (
            <div className="skeleton-detail-page-header mb-4">
              <div
                className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
                style={{ height: '50px', width: '100%' }}
              />
            </div>
          )}

          {hasImage && (
            <div className="skeleton-detail-page-image mb-4">
              <div
                className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
                style={{ height: `${imageHeight}px`, width: '100%' }}
              />
            </div>
          )}

          {hasTitle && (
            <div className="skeleton-detail-page-title mb-3">
              <div
                className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
                style={{ height: '36px', width: '100%' }}
              />
            </div>
          )}

          {hasMeta && (
            <div className="skeleton-detail-page-meta mb-4">
              <div
                className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
                style={{ width: '60%', height: '20px' }}
              />
            </div>
          )}

          {hasContent && (
            <div className="skeleton-detail-page-content">
              {Array.from({ length: contentLines }).map((_, index) => (
                <div
                  key={`content-line-${index}`}
                  className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
                  style={{
                    width: '100%',
                    height: '16px',
                    marginBottom: index < contentLines - 1 ? '8px' : 0
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {hasSidebar && (
          <div
            className="skeleton-detail-page-sidebar"
            style={{ width: sidebarWidth }}
          >
            <div
              className={`${variant === 'jade' ? 'jade-spinner' : variant === 'gold' ? 'gold-spinner' : 'loading-spinner'}`}
              style={{ height: '400px', width: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
