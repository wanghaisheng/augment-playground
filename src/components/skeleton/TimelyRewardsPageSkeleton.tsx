// src/components/skeleton/TimelyRewardsPageSkeleton.tsx
import React from 'react';
import { SkeletonBase, SkeletonText } from '@/components/skeleton';

/**
 * 及时奖励页面骨架屏组件
 * 模拟及时奖励页面的加载状态
 */
const TimelyRewardsPageSkeleton: React.FC = () => {
  return (
    <div className="timely-rewards-page-skeleton">
      {/* 页面标题和抽奖按钮 */}
      <div className="page-header-skeleton flex justify-between items-center mb-6">
        <SkeletonText
          lines={1}
          width="40%"
          height="2rem"
          variant="jade"
        />
        <SkeletonBase
          width="8rem"
          height="2.5rem"
          borderRadius="0.25rem"
          variant="gold"
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
            {[1, 2, 3, 4].map((i) => (
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

      {/* 奖励列表 */}
      <div className="rewards-container-skeleton">
        {/* 奖励卡片 */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="reward-card-skeleton bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <div className="flex justify-between items-center">
              <div className="reward-info-skeleton">
                <SkeletonText
                  lines={1}
                  width="60%"
                  height="1.25rem"
                  className="mb-2"
                  variant="jade"
                />
                <SkeletonText
                  lines={2}
                  width={['80%', '60%']}
                  height="0.75rem"
                  variant="default"
                />
              </div>
              <div className="reward-status-skeleton">
                <SkeletonBase
                  width="4rem"
                  height="4rem"
                  borderRadius="50%"
                  variant={i === 1 ? 'gold' : 'jade'}
                />
              </div>
            </div>
            <div className="reward-progress-skeleton mt-3">
              <div className="flex justify-between mb-1">
                <SkeletonText
                  lines={1}
                  width="30%"
                  height="0.75rem"
                  variant="default"
                />
                <SkeletonText
                  lines={1}
                  width="20%"
                  height="0.75rem"
                  variant="default"
                />
              </div>
              <SkeletonBase
                width="100%"
                height="0.5rem"
                borderRadius="0.25rem"
                variant="jade"
              />
            </div>
            <div className="reward-actions-skeleton mt-3 flex justify-end">
              <SkeletonBase
                width="6rem"
                height="2rem"
                borderRadius="0.25rem"
                variant={i === 1 ? 'gold' : 'jade'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelyRewardsPageSkeleton;
