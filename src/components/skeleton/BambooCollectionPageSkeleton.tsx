// src/components/skeleton/BambooCollectionPageSkeleton.tsx
import React from 'react';
import { SkeletonBase, SkeletonText, SkeletonImage } from '@/components/skeleton';
import { BambooSpotCardSkeleton } from '@/components/skeleton';

/**
 * 竹子收集页面骨架屏组件
 * 模拟竹子收集页面的加载状态
 */
const BambooCollectionPageSkeleton: React.FC = () => {
  return (
    <div className="bamboo-collection-page-skeleton">
      {/* 页面标题 */}
      <SkeletonText
        lines={1}
        width="50%"
        height="2rem"
        className="mb-6"
        variant="jade"
      />

      {/* 统计概览 */}
      <div className="stats-overview-skeleton mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 总收集量 */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center">
              <div>
                <SkeletonText
                  lines={1}
                  width="80%"
                  height="1.5rem"
                  className="mb-2"
                  variant="jade"
                />
                <SkeletonText
                  lines={1}
                  width="40%"
                  height="2rem"
                  variant="jade"
                />
              </div>
              <SkeletonImage
                width="3rem"
                height="3rem"
                borderRadius="50%"
                variant="jade"
              />
            </div>
            <div className="mt-2">
              <SkeletonText
                lines={1}
                width="60%"
                height="0.75rem"
                variant="jade"
              />
            </div>
          </div>

          {/* 来源统计 */}
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <SkeletonText
              lines={1}
              width="60%"
              height="1.5rem"
              className="mb-2"
              variant="gold"
            />
            <ul className="space-y-1">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex justify-between items-center">
                  <SkeletonText
                    lines={1}
                    width="40%"
                    height="1rem"
                    variant="gold"
                  />
                  <SkeletonText
                    lines={1}
                    width="20%"
                    height="1rem"
                    variant="gold"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 竹子收集点标题 */}
      <SkeletonText
        lines={1}
        width="40%"
        height="1.5rem"
        className="mb-4"
        variant="jade"
      />

      {/* 竹子收集点列表 */}
      <div className="bamboo-spots-skeleton grid grid-cols-1 md:grid-cols-2 gap-4">
        <BambooSpotCardSkeleton variant="jade" />
        <BambooSpotCardSkeleton variant="jade" />
        <BambooSpotCardSkeleton variant="jade" />
        <BambooSpotCardSkeleton variant="jade" />
      </div>

      {/* 收集提示 */}
      <div className="collection-tips-skeleton mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <SkeletonText
          lines={1}
          width="40%"
          height="1.5rem"
          className="mb-2"
          variant="default"
        />
        <ul className="space-y-1">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex">
              <SkeletonBase
                width="0.5rem"
                height="0.5rem"
                borderRadius="50%"
                className="mt-2 mr-2"
                variant="default"
              />
              <SkeletonText
                lines={1}
                width="90%"
                height="1rem"
                variant="default"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BambooCollectionPageSkeleton;
