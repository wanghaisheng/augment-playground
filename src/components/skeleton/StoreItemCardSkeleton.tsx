// src/components/skeleton/StoreItemCardSkeleton.tsx
import React from 'react';
import SkeletonBase from './SkeletonBase';
import SkeletonText from './SkeletonText';
import SkeletonImage from './SkeletonImage';

interface StoreItemCardSkeletonProps {
  className?: string;
  variant?: 'default' | 'jade' | 'gold';
  isVip?: boolean;
}

/**
 * 商店物品卡片骨架组件
 * 模拟商店物品卡片的加载状态
 * 
 * @param className - 自定义CSS类名
 * @param variant - 变体样式
 * @param isVip - 是否为VIP物品
 */
const StoreItemCardSkeleton: React.FC<StoreItemCardSkeletonProps> = ({
  className = '',
  variant = 'jade',
  isVip = false
}) => {
  return (
    <div 
      className={`store-item-card-skeleton rounded-lg overflow-hidden shadow-md ${className}`}
      style={{ 
        border: isVip ? '2px solid #fbbf24' : '1px solid #e5e7eb'
      }}
    >
      {/* 物品图片 */}
      <SkeletonImage
        width="100%"
        height="10rem"
        borderRadius={0}
        variant={isVip ? 'gold' : variant}
      />
      
      {/* 物品内容 */}
      <div className="p-4">
        <div className="item-header-skeleton flex justify-between items-start mb-2">
          <SkeletonText
            lines={1}
            width="70%"
            height="1.25rem"
            variant={isVip ? 'gold' : variant}
          />
          
          {isVip && (
            <SkeletonBase
              width="2.5rem"
              height="1.5rem"
              borderRadius="0.25rem"
              variant="gold"
            />
          )}
        </div>
        
        <div className="item-description-skeleton mb-3">
          <SkeletonText
            lines={2}
            width={['100%', '85%']}
            height="0.875rem"
            variant={isVip ? 'gold' : variant}
          />
        </div>
        
        <div className="item-footer-skeleton flex justify-between items-center">
          <div className="item-price-skeleton flex items-center">
            <SkeletonBase
              width="1.5rem"
              height="1.5rem"
              borderRadius="50%"
              className="mr-1"
              variant={isVip ? 'gold' : variant}
            />
            
            <SkeletonBase
              width="3rem"
              height="1.25rem"
              borderRadius="0.25rem"
              variant={isVip ? 'gold' : variant}
            />
          </div>
          
          <SkeletonBase
            width="5rem"
            height="2.25rem"
            borderRadius="0.25rem"
            variant={isVip ? 'gold' : variant}
          />
        </div>
      </div>
    </div>
  );
};

export default StoreItemCardSkeleton;
