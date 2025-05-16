// src/components/skeleton/SkeletonCard.tsx
import React from 'react';
import SkeletonBase from './SkeletonBase';
import SkeletonText from './SkeletonText';
import SkeletonImage from './SkeletonImage';

interface SkeletonCardProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'default' | 'jade' | 'gold';
  hasImage?: boolean;
  imageHeight?: string | number;
  hasHeader?: boolean;
  hasFooter?: boolean;
  headerHeight?: string | number;
  footerHeight?: string | number;
  contentLines?: number;
  rounded?: string | number;
  padding?: string | number;
}

/**
 * 卡片骨架组件
 * 用于卡片的占位
 * 
 * @param width - 宽度
 * @param height - 高度
 * @param className - 自定义CSS类名
 * @param variant - 变体样式
 * @param hasImage - 是否包含图像
 * @param imageHeight - 图像高度
 * @param hasHeader - 是否包含头部
 * @param hasFooter - 是否包含底部
 * @param headerHeight - 头部高度
 * @param footerHeight - 底部高度
 * @param contentLines - 内容行数
 * @param rounded - 圆角大小
 * @param padding - 内边距
 */
const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = '100%',
  height = 'auto',
  className = '',
  variant = 'default',
  hasImage = true,
  imageHeight = '150px',
  hasHeader = true,
  hasFooter = true,
  headerHeight = '3rem',
  footerHeight = '3rem',
  contentLines = 3,
  rounded = '0.5rem',
  padding = '1rem'
}) => {
  return (
    <div 
      className={`skeleton-card overflow-hidden ${className}`}
      style={{ 
        width, 
        height: height === 'auto' ? 'auto' : height,
        borderRadius: rounded,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* 卡片图像 */}
      {hasImage && (
        <SkeletonImage
          width="100%"
          height={imageHeight}
          borderRadius={0}
          variant={variant}
        />
      )}

      {/* 卡片内容容器 */}
      <div style={{ padding }}>
        {/* 卡片头部 */}
        {hasHeader && (
          <div className="skeleton-card-header mb-4">
            <SkeletonText
              lines={1}
              height={headerHeight}
              variant={variant}
            />
          </div>
        )}

        {/* 卡片内容 */}
        <div className="skeleton-card-content mb-4">
          <SkeletonText
            lines={contentLines}
            width={['100%', '90%', '80%']}
            variant={variant}
          />
        </div>

        {/* 卡片底部 */}
        {hasFooter && (
          <div className="skeleton-card-footer">
            <SkeletonBase
              width="100%"
              height={footerHeight}
              variant={variant}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SkeletonCard;
