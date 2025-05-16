// src/components/skeleton/StorePageSkeleton.tsx
import React from 'react';
import { SkeletonBase, SkeletonText } from '@/components/skeleton';
import { StoreItemCardSkeleton } from '@/components/skeleton';

/**
 * 商店页面骨架屏组件
 * 模拟商店页面的加载状态
 */
const StorePageSkeleton: React.FC = () => {
  return (
    <div className="store-page-skeleton">
      {/* 页面标题 */}
      <SkeletonText
        lines={1}
        width="40%"
        height="2rem"
        className="mb-6"
        variant="jade"
      />

      {/* 用户货币和VIP切换 */}
      <div className="store-header-section-skeleton mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="currency-section-skeleton flex-grow bg-white p-3 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div className="flex items-center">
              <SkeletonBase
                width="2.5rem"
                height="2.5rem"
                borderRadius="50%"
                className="mr-2"
                variant="jade"
              />
              <SkeletonText
                lines={1}
                width="4rem"
                height="1.5rem"
                variant="jade"
              />
            </div>
            <div className="flex items-center">
              <SkeletonBase
                width="2.5rem"
                height="2.5rem"
                borderRadius="50%"
                className="mr-2"
                variant="gold"
              />
              <SkeletonText
                lines={1}
                width="4rem"
                height="1.5rem"
                variant="gold"
              />
            </div>
          </div>
        </div>
        <SkeletonBase
          width="10rem"
          height="2.5rem"
          borderRadius="0.25rem"
          variant="gold"
        />
      </div>

      {/* 商店类别 */}
      <div className="categories-section-skeleton mb-6 bg-white p-3 rounded-lg shadow-sm">
        <SkeletonText
          lines={1}
          width="30%"
          height="1.5rem"
          className="mb-3"
          variant="jade"
        />
        <div className="flex overflow-x-auto py-2 px-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 mr-4">
              <SkeletonBase
                width="4rem"
                height="4rem"
                borderRadius="0.5rem"
                variant={i === 1 ? 'jade' : 'default'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 特色物品 */}
      <div className="featured-items-section-skeleton mb-8">
        <div className="section-header-skeleton flex items-center mb-4 border-b-2 border-amber-300 pb-2">
          <SkeletonText
            lines={1}
            width="40%"
            height="1.5rem"
            variant="gold"
          />
        </div>
        <div className="featured-items-grid-skeleton grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StoreItemCardSkeleton variant="gold" />
          <StoreItemCardSkeleton variant="gold" />
          <StoreItemCardSkeleton variant="gold" isVip={true} />
        </div>
      </div>

      {/* 促销物品 */}
      <div className="sale-items-section-skeleton mb-8">
        <div className="section-header-skeleton flex items-center mb-4 border-b-2 border-cinnabar-red pb-2">
          <SkeletonText
            lines={1}
            width="40%"
            height="1.5rem"
            variant="default"
            className="text-cinnabar-red"
          />
        </div>
        <div className="sale-items-grid-skeleton grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StoreItemCardSkeleton variant="default" />
          <StoreItemCardSkeleton variant="default" />
          <StoreItemCardSkeleton variant="default" />
        </div>
      </div>

      {/* 类别物品 */}
      <div className="category-items-section-skeleton mb-6">
        <div className="section-header-skeleton flex items-center mb-4 border-b-2 border-jade-500 pb-2">
          <SkeletonText
            lines={1}
            width="40%"
            height="1.5rem"
            variant="jade"
          />
        </div>
        <div className="category-items-grid-skeleton grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StoreItemCardSkeleton variant="jade" />
          <StoreItemCardSkeleton variant="jade" />
          <StoreItemCardSkeleton variant="jade" />
          <StoreItemCardSkeleton variant="jade" />
        </div>
      </div>
    </div>
  );
};

export default StorePageSkeleton;
