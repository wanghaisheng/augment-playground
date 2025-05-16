// src/components/skeleton/SkeletonText.tsx
import React from 'react';
import SkeletonBase from './SkeletonBase';

interface SkeletonTextProps {
  lines?: number;
  width?: string | number | (string | number)[];
  height?: string | number;
  className?: string;
  variant?: 'default' | 'jade' | 'gold';
  lineClassName?: string;
  lastLineWidth?: string | number;
}

/**
 * 文本骨架组件
 * 用于文本内容的占位
 * 
 * @param lines - 行数
 * @param width - 宽度，可以是单个值或数组（为每行指定不同宽度）
 * @param height - 每行高度
 * @param className - 容器自定义CSS类名
 * @param variant - 变体样式
 * @param lineClassName - 每行自定义CSS类名
 * @param lastLineWidth - 最后一行宽度，如果不指定则使用width
 */
const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'default',
  lineClassName = '',
  lastLineWidth
}) => {
  // 创建行数组
  const linesArray = Array.from({ length: lines }, (_, index) => index);

  // 获取行宽度
  const getLineWidth = (index: number): string | number => {
    // 如果是最后一行且指定了lastLineWidth
    if (index === lines - 1 && lastLineWidth !== undefined) {
      return lastLineWidth;
    }
    
    // 如果width是数组，返回对应索引的宽度，如果索引超出数组长度，返回最后一个宽度
    if (Array.isArray(width)) {
      return index < width.length ? width[index] : width[width.length - 1];
    }
    
    // 否则返回统一宽度
    return width;
  };

  return (
    <div className={`skeleton-text ${className}`}>
      {linesArray.map((_, index) => (
        <SkeletonBase
          key={index}
          width={getLineWidth(index)}
          height={height}
          className={`mb-2 ${lineClassName}`}
          variant={variant}
        />
      ))}
    </div>
  );
};

export default SkeletonText;
