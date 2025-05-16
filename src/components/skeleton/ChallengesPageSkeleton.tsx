// src/components/skeleton/ChallengesPageSkeleton.tsx
import React from 'react';
import { SkeletonBase, SkeletonText } from '@/components/skeleton';
import { ChallengeCardSkeleton } from '@/components/skeleton';

/**
 * 挑战页面骨架屏组件
 * 模拟挑战页面的加载状态
 */
const ChallengesPageSkeleton: React.FC = () => {
  return (
    <div className="challenges-page-skeleton">
      {/* 页面标题和按钮 */}
      <div className="flex justify-between items-center mb-6">
        <SkeletonText
          lines={1}
          width="40%"
          height="2rem"
          variant="jade"
        />
        <SkeletonBase
          width="8rem"
          height="2.25rem"
          borderRadius="0.25rem"
          variant="jade"
        />
      </div>

      {/* 过滤器部分 */}
      <div className="filter-section-skeleton mb-6">
        {/* 状态过滤器 */}
        <div className="filter-group-skeleton mb-4">
          <SkeletonText
            lines={1}
            width="20%"
            height="1.25rem"
            className="mb-2"
            variant="jade"
          />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBase
                key={i}
                width="5rem"
                height="2rem"
                borderRadius="0.25rem"
                variant={i === 2 ? 'jade' : 'default'}
              />
            ))}
          </div>
        </div>

        {/* 类型过滤器 */}
        <div className="filter-group-skeleton mb-4">
          <SkeletonText
            lines={1}
            width="20%"
            height="1.25rem"
            className="mb-2"
            variant="jade"
          />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonBase
                key={i}
                width="5rem"
                height="2rem"
                borderRadius="0.25rem"
                variant={i === 1 ? 'jade' : 'default'}
              />
            ))}
          </div>
        </div>

        {/* 难度过滤器 */}
        <div className="filter-group-skeleton mb-4">
          <SkeletonText
            lines={1}
            width="20%"
            height="1.25rem"
            className="mb-2"
            variant="jade"
          />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonBase
                key={i}
                width="5rem"
                height="2rem"
                borderRadius="0.25rem"
                variant={i === 1 ? 'jade' : 'default'}
              />
            ))}
          </div>
        </div>

        {/* 清除过滤器按钮 */}
        <div className="filter-actions-skeleton">
          <SkeletonBase
            width="8rem"
            height="2.25rem"
            borderRadius="0.25rem"
            variant="default"
          />
        </div>
      </div>

      {/* 挑战列表 */}
      <div className="challenges-container-skeleton space-y-4">
        <ChallengeCardSkeleton variant="jade" />
        <ChallengeCardSkeleton variant="jade" />
        <ChallengeCardSkeleton variant="jade" />
      </div>
    </div>
  );
};

export default ChallengesPageSkeleton;
