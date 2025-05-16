// src/components/skeleton/SkeletonImage.tsx
import React from 'react';
import SkeletonBase from './SkeletonBase';

interface SkeletonImageProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'default' | 'jade' | 'gold';
  showIcon?: boolean;
}

/**
 * 图像骨架组件
 * 用于图像的占位
 * 
 * @param width - 宽度
 * @param height - 高度
 * @param borderRadius - 边框圆角
 * @param className - 自定义CSS类名
 * @param variant - 变体样式
 * @param showIcon - 是否显示图像图标
 */
const SkeletonImage: React.FC<SkeletonImageProps> = ({
  width = '100%',
  height = '200px',
  borderRadius = '0.25rem',
  className = '',
  variant = 'default',
  showIcon = true
}) => {
  return (
    <SkeletonBase
      width={width}
      height={height}
      borderRadius={borderRadius}
      className={`skeleton-image flex items-center justify-center ${className}`}
      variant={variant}
    >
      {showIcon && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-400 opacity-50"
        >
          <path
            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17.99 9L16.58 7.58L13.99 10.17L11.4 7.58L9.99 9L12.58 11.59L9.99 14.17L11.4 15.59L13.99 13L16.58 15.59L17.99 14.17L15.4 11.59L17.99 9Z"
            fill="currentColor"
          />
        </svg>
      )}
    </SkeletonBase>
  );
};

export default SkeletonImage;
