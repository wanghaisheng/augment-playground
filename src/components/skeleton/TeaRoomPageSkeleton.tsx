// src/components/skeleton/TeaRoomPageSkeleton.tsx
import React from 'react';
import { SkeletonBase, SkeletonText } from '@/components/skeleton';

/**
 * 茶室页面骨架屏组件
 * 模拟茶室页面的加载状态
 */
const TeaRoomPageSkeleton: React.FC = () => {
  return (
    <div className="tea-room-page-skeleton">
      {/* 页面标题 */}
      <SkeletonText
        lines={1}
        width="40%"
        height="2rem"
        className="mb-2"
        variant="jade"
      />
      
      {/* 页面描述 */}
      <SkeletonText
        lines={2}
        width={['90%', '70%']}
        height="1rem"
        className="mb-6"
        variant="default"
      />

      {/* 茶室部分 */}
      <div className="tea-room-sections-skeleton grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 情绪追踪部分 */}
        <div className="mood-tracking-section-skeleton bg-white p-4 rounded-lg shadow-md border-l-4 border-jade-500">
          <div className="flex items-center mb-4">
            <SkeletonBase
              width="1.5rem"
              height="1.5rem"
              borderRadius="50%"
              className="mr-2"
              variant="jade"
            />
            <SkeletonText
              lines={1}
              width="60%"
              height="1.5rem"
              variant="jade"
            />
          </div>
          
          {/* 情绪选择器 */}
          <div className="mood-selector-skeleton mb-4">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBase
                  key={i}
                  width="3rem"
                  height="3rem"
                  borderRadius="50%"
                  variant={i === 3 ? 'jade' : 'default'}
                />
              ))}
            </div>
            <SkeletonBase
              width="100%"
              height="0.5rem"
              borderRadius="0.25rem"
              className="mb-2"
              variant="jade"
            />
          </div>
          
          {/* 情绪强度 */}
          <div className="mood-intensity-skeleton mb-4">
            <SkeletonText
              lines={1}
              width="40%"
              height="1rem"
              className="mb-2"
              variant="jade"
            />
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBase
                  key={i}
                  width="2rem"
                  height="2rem"
                  borderRadius="50%"
                  variant={i === 4 ? 'jade' : 'default'}
                />
              ))}
            </div>
          </div>
          
          {/* 提交按钮 */}
          <SkeletonBase
            width="100%"
            height="2.5rem"
            borderRadius="0.25rem"
            variant="jade"
          />
        </div>

        {/* 反思部分 */}
        <div className="reflection-section-skeleton bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500">
          <div className="flex items-center mb-4">
            <SkeletonBase
              width="1.5rem"
              height="1.5rem"
              borderRadius="50%"
              className="mr-2"
              variant="gold"
            />
            <SkeletonText
              lines={1}
              width="60%"
              height="1.5rem"
              variant="gold"
            />
          </div>
          
          <SkeletonText
            lines={3}
            width={['100%', '90%', '80%']}
            height="1rem"
            className="mb-4"
            variant="default"
          />
          
          <div className="reflection-actions-skeleton flex flex-col gap-2">
            <SkeletonBase
              width="100%"
              height="2.5rem"
              borderRadius="0.25rem"
              variant="jade"
            />
            <SkeletonBase
              width="100%"
              height="2.5rem"
              borderRadius="0.25rem"
              variant="default"
            />
          </div>
        </div>
      </div>

      {/* 每日智慧部分 */}
      <div className="daily-tips-section-skeleton bg-white p-4 rounded-lg shadow-md border border-amber-200">
        <div className="flex items-center mb-4">
          <SkeletonBase
            width="1.5rem"
            height="1.5rem"
            borderRadius="50%"
            className="mr-2"
            variant="gold"
          />
          <SkeletonText
            lines={1}
            width="40%"
            height="1.5rem"
            variant="gold"
          />
        </div>
        
        <div className="daily-tip-skeleton p-3 bg-amber-50 rounded-lg">
          <div className="flex items-start">
            <SkeletonBase
              width="2rem"
              height="2rem"
              borderRadius="50%"
              className="mr-3"
              variant="gold"
            />
            <SkeletonText
              lines={3}
              width={['100%', '90%', '80%']}
              height="1rem"
              variant="default"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeaRoomPageSkeleton;
