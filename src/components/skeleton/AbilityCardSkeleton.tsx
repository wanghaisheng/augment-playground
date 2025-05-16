// src/components/skeleton/AbilityCardSkeleton.tsx
import React from 'react';
import SkeletonBase from './SkeletonBase';
import SkeletonText from './SkeletonText';

interface AbilityCardSkeletonProps {
  className?: string;
  variant?: 'default' | 'jade' | 'gold';
  isUnlocked?: boolean;
}

/**
 * 能力卡片骨架组件
 * 模拟能力卡片的加载状态
 * 
 * @param className - 自定义CSS类名
 * @param variant - 变体样式
 * @param isUnlocked - 是否已解锁
 */
const AbilityCardSkeleton: React.FC<AbilityCardSkeletonProps> = ({
  className = '',
  variant = 'jade',
  isUnlocked = false
}) => {
  return (
    <div 
      className={`ability-card-skeleton rounded-lg overflow-hidden shadow-md ${className}`}
      style={{ 
        border: isUnlocked ? '2px solid rgba(0, 128, 0, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
        backgroundColor: isUnlocked ? 'white' : 'rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="p-4">
        <div className="ability-header-skeleton flex items-center mb-3">
          <SkeletonBase
            width="3rem"
            height="3rem"
            borderRadius="50%"
            className="mr-3"
            variant={isUnlocked ? variant : 'default'}
          />
          
          <div className="ability-title-section-skeleton flex-1">
            <SkeletonText
              lines={1}
              height="1.25rem"
              className="mb-1"
              variant={isUnlocked ? variant : 'default'}
            />
            
            <SkeletonBase
              width="4rem"
              height="1rem"
              borderRadius="0.25rem"
              variant={isUnlocked ? variant : 'default'}
            />
          </div>
        </div>
        
        <div className="ability-description-skeleton mb-3">
          <SkeletonText
            lines={2}
            width={['100%', '85%']}
            height="0.875rem"
            variant={isUnlocked ? variant : 'default'}
          />
        </div>
        
        <div className="ability-footer-skeleton flex justify-between items-center">
          <SkeletonBase
            width="40%"
            height="1rem"
            borderRadius="0.25rem"
            variant={isUnlocked ? variant : 'default'}
          />
          
          {isUnlocked && (
            <SkeletonBase
              width="5rem"
              height="2rem"
              borderRadius="0.25rem"
              variant={variant}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AbilityCardSkeleton;
