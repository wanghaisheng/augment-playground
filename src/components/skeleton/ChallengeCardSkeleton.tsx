// src/components/skeleton/ChallengeCardSkeleton.tsx
import React from 'react';
import SkeletonBase from './SkeletonBase';
import SkeletonText from './SkeletonText';

interface ChallengeCardSkeletonProps {
  className?: string;
  variant?: 'default' | 'jade' | 'gold';
}

/**
 * 挑战卡片骨架组件
 * 模拟挑战卡片的加载状态
 * 
 * @param className - 自定义CSS类名
 * @param variant - 变体样式
 */
const ChallengeCardSkeleton: React.FC<ChallengeCardSkeletonProps> = ({
  className = '',
  variant = 'jade'
}) => {
  return (
    <div 
      className={`challenge-card-skeleton p-4 rounded-lg shadow-md bg-white ${className}`}
    >
      <div className="challenge-card-header-skeleton flex items-center mb-3">
        <SkeletonBase
          width="3rem"
          height="3rem"
          borderRadius="50%"
          className="mr-3"
          variant={variant}
        />
        
        <div className="challenge-title-section-skeleton flex-1">
          <SkeletonText
            lines={1}
            height="1.25rem"
            className="mb-2"
            variant={variant}
          />
          
          <div className="challenge-meta-skeleton flex space-x-2">
            <SkeletonBase
              width="4rem"
              height="1rem"
              borderRadius="0.25rem"
              variant={variant}
            />
            
            <SkeletonBase
              width="3rem"
              height="1rem"
              borderRadius="0.25rem"
              variant={variant}
            />
          </div>
        </div>
      </div>
      
      <div className="challenge-description-skeleton mb-3">
        <SkeletonText
          lines={2}
          width={['100%', '90%']}
          height="0.875rem"
          variant={variant}
        />
      </div>
      
      <div className="challenge-progress-skeleton mb-3">
        <SkeletonBase
          width="100%"
          height="0.5rem"
          borderRadius="0.25rem"
          variant={variant}
        />
      </div>
      
      <div className="challenge-footer-skeleton flex justify-between items-center">
        <div className="challenge-rewards-skeleton flex space-x-2">
          <SkeletonBase
            width="2rem"
            height="2rem"
            borderRadius="50%"
            variant={variant}
          />
          
          <SkeletonBase
            width="2rem"
            height="2rem"
            borderRadius="50%"
            variant={variant}
          />
        </div>
        
        <SkeletonBase
          width="6rem"
          height="2.5rem"
          borderRadius="0.25rem"
          variant={variant}
        />
      </div>
    </div>
  );
};

export default ChallengeCardSkeleton;
