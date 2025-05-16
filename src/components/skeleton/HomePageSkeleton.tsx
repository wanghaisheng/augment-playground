// src/components/skeleton/HomePageSkeleton.tsx
import React from 'react';
import { SkeletonBase, SkeletonText, SkeletonImage } from '@/components/skeleton';

/**
 * 首页骨架屏组件
 * 模拟首页的加载状态
 */
const HomePageSkeleton: React.FC = () => {
  return (
    <div className="home-page-skeleton">
      {/* 顶部标题和指示器 */}
      <div className="flex justify-between items-center mb-6">
        <SkeletonText
          lines={1}
          width="40%"
          height="2rem"
          variant="jade"
        />
        <SkeletonBase
          width="3rem"
          height="3rem"
          borderRadius="50%"
          variant="gold"
        />
      </div>

      {/* 资源部分 */}
      <div className="resources-section-skeleton bg-white p-4 rounded-lg shadow-sm mb-6">
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

      {/* 欢迎部分 */}
      <div className="welcome-section-skeleton bg-white p-4 rounded-lg shadow-sm mb-6">
        <SkeletonText
          lines={1}
          width="70%"
          height="1.5rem"
          className="mb-3"
          variant="jade"
        />
        <SkeletonText
          lines={2}
          width={['90%', '60%']}
          height="1rem"
          variant="default"
        />
      </div>

      {/* 熊猫部分 */}
      <div className="panda-section-skeleton bg-white p-4 rounded-lg shadow-sm mb-6">
        <SkeletonText
          lines={1}
          width="50%"
          height="1.5rem"
          className="mb-3"
          variant="jade"
        />
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <SkeletonText
              lines={2}
              width={['80%', '60%']}
              height="1rem"
              variant="default"
            />
            <div className="mt-3">
              <SkeletonBase
                width="100%"
                height="0.75rem"
                borderRadius="0.25rem"
                className="mb-1"
                variant="jade"
              />
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
          </div>
          <SkeletonImage
            width="6rem"
            height="6rem"
            borderRadius="50%"
            variant="jade"
          />
        </div>
      </div>

      {/* 情绪部分 */}
      <div className="moods-section-skeleton bg-white p-4 rounded-lg shadow-sm mb-6">
        <SkeletonText
          lines={1}
          width="40%"
          height="1.5rem"
          className="mb-3"
          variant="jade"
        />
        <div className="flex justify-between mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonBase
              key={i}
              width="3rem"
              height="3rem"
              borderRadius="50%"
              variant={i % 2 === 0 ? 'jade' : 'default'}
            />
          ))}
        </div>
        <SkeletonText
          lines={2}
          width={['100%', '80%']}
          height="1rem"
          variant="default"
        />
      </div>

      {/* 按钮部分 */}
      <div className="buttons-section-skeleton flex justify-center">
        <SkeletonBase
          width="60%"
          height="2.5rem"
          borderRadius="0.25rem"
          variant="gold"
        />
      </div>
    </div>
  );
};

export default HomePageSkeleton;
