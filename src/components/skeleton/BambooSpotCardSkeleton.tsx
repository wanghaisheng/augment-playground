// src/components/skeleton/BambooSpotCardSkeleton.tsx
import React from 'react';
import SkeletonBase from './SkeletonBase';
import SkeletonText from './SkeletonText';

interface BambooSpotCardSkeletonProps {
  className?: string;
  variant?: 'default' | 'jade' | 'gold';
}

/**
 * 竹子收集点卡片骨架组件
 * 模拟竹子收集点卡片的加载状态
 * 
 * @param className - 自定义CSS类名
 * @param variant - 变体样式
 */
const BambooSpotCardSkeleton: React.FC<BambooSpotCardSkeletonProps> = ({
  className = '',
  variant = 'jade'
}) => {
  return (
    <div 
      className={`bamboo-spot-card-skeleton relative rounded-lg border-2 p-4 shadow-md bg-white ${className}`}
      style={{ 
        borderColor: variant === 'jade' ? 'rgba(0, 128, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex items-start">
        <div className="bamboo-spot-image-skeleton mr-4 relative">
          <SkeletonBase
            width="5rem"
            height="5rem"
            borderRadius="50%"
            variant={variant}
          />
        </div>
        
        <div className="bamboo-spot-content-skeleton flex-1">
          <div className="bamboo-spot-header-skeleton flex justify-between items-start mb-2">
            <SkeletonText
              lines={1}
              width="60%"
              height="1.25rem"
              className="mb-1"
              variant={variant}
            />
            
            <SkeletonBase
              width="3rem"
              height="1.5rem"
              borderRadius="0.25rem"
              variant={variant}
            />
          </div>
          
          <div className="bamboo-spot-description-skeleton mb-3">
            <SkeletonText
              lines={2}
              width={['100%', '85%']}
              height="0.875rem"
              variant={variant}
            />
          </div>
          
          <div className="bamboo-spot-footer-skeleton flex justify-between items-center">
            <SkeletonBase
              width="40%"
              height="1rem"
              borderRadius="0.25rem"
              variant={variant}
            />
            
            <SkeletonBase
              width="6rem"
              height="2.5rem"
              borderRadius="0.25rem"
              variant={variant}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BambooSpotCardSkeleton;
