// src/components/skeleton/BattlePassPageSkeleton.tsx
import React from 'react';
import { SkeletonBase, SkeletonText, SkeletonImage } from '@/components/skeleton';

/**
 * 通行证页面骨架屏组件
 * 模拟通行证页面的加载状态
 */
const BattlePassPageSkeleton: React.FC = () => {
  return (
    <div className="battle-pass-page-skeleton">
      {/* 页面标题 */}
      <SkeletonText
        lines={1}
        width="40%"
        height="2rem"
        className="mb-6"
        variant="jade"
      />

      {/* 通行证进度 */}
      <div className="battle-pass-progress-skeleton bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <SkeletonText
              lines={1}
              width="60%"
              height="1.5rem"
              className="mb-2"
              variant="jade"
            />
            <SkeletonText
              lines={1}
              width="40%"
              height="1rem"
              variant="default"
            />
          </div>
          <SkeletonBase
            width="4rem"
            height="4rem"
            borderRadius="50%"
            variant="gold"
          />
        </div>
        <div className="progress-bar-skeleton mb-2">
          <SkeletonBase
            width="100%"
            height="1rem"
            borderRadius="0.5rem"
            variant="jade"
          />
        </div>
        <div className="flex justify-between">
          <SkeletonText
            lines={1}
            width="20%"
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
      </div>

      {/* 通行证奖励 */}
      <div className="battle-pass-rewards-skeleton bg-white p-4 rounded-lg shadow-sm mb-6">
        <SkeletonText
          lines={1}
          width="30%"
          height="1.5rem"
          className="mb-4"
          variant="gold"
        />
        <div className="rewards-track-skeleton flex overflow-x-auto py-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="reward-item-skeleton flex-shrink-0 mr-4 last:mr-0">
              <div className="flex flex-col items-center">
                <SkeletonText
                  lines={1}
                  width="2rem"
                  height="1rem"
                  className="mb-2"
                  variant="default"
                />
                <SkeletonBase
                  width="4rem"
                  height="4rem"
                  borderRadius="0.5rem"
                  variant={i % 3 === 0 ? 'gold' : 'jade'}
                />
                <SkeletonText
                  lines={1}
                  width="3rem"
                  height="0.75rem"
                  className="mt-2"
                  variant="default"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 通行证任务 */}
      <div className="battle-pass-tasks-skeleton bg-white p-4 rounded-lg shadow-sm mb-6">
        <SkeletonText
          lines={1}
          width="30%"
          height="1.5rem"
          className="mb-4"
          variant="jade"
        />
        <div className="tasks-list-skeleton space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="task-item-skeleton p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <SkeletonText
                    lines={1}
                    width="70%"
                    height="1.25rem"
                    className="mb-2"
                    variant="jade"
                  />
                  <SkeletonText
                    lines={1}
                    width="50%"
                    height="0.75rem"
                    variant="default"
                  />
                </div>
                <div className="flex items-center">
                  <SkeletonText
                    lines={1}
                    width="3rem"
                    height="1rem"
                    className="mr-2"
                    variant="gold"
                  />
                  <SkeletonBase
                    width="2rem"
                    height="2rem"
                    borderRadius="50%"
                    variant="gold"
                  />
                </div>
              </div>
              <div className="progress-bar-skeleton mt-2">
                <SkeletonBase
                  width="100%"
                  height="0.5rem"
                  borderRadius="0.25rem"
                  variant="jade"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 通行证排行榜 */}
      <div className="battle-pass-leaderboard-skeleton bg-white p-4 rounded-lg shadow-sm mb-6">
        <SkeletonText
          lines={1}
          width="30%"
          height="1.5rem"
          className="mb-4"
          variant="jade"
        />
        <div className="leaderboard-list-skeleton space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="leaderboard-item-skeleton flex items-center p-2 border-b border-gray-200">
              <SkeletonText
                lines={1}
                width="1.5rem"
                height="1.5rem"
                className="mr-3"
                variant={i <= 3 ? 'gold' : 'default'}
              />
              <SkeletonImage
                width="2.5rem"
                height="2.5rem"
                borderRadius="50%"
                className="mr-3"
                variant="default"
              />
              <SkeletonText
                lines={1}
                width="40%"
                height="1rem"
                className="mr-auto"
                variant="default"
              />
              <SkeletonText
                lines={1}
                width="3rem"
                height="1rem"
                variant="jade"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattlePassPageSkeleton;
