// src/components/skeleton/VipBenefitsPageSkeleton.tsx
import React from 'react';
import { SkeletonBase, SkeletonText } from '@/components/skeleton';

/**
 * VIP福利页面骨架屏组件
 * 模拟VIP福利页面的加载状态
 */
const VipBenefitsPageSkeleton: React.FC = () => {
  return (
    <div className="vip-benefits-page-skeleton">
      {/* 头部部分 */}
      <div className="vip-header-skeleton">
        <div className="flex justify-between items-center mb-4">
          <SkeletonBase
            width="5rem"
            height="2.5rem"
            borderRadius="0.25rem"
            variant="jade"
          />
          <SkeletonBase
            width="3rem"
            height="3rem"
            borderRadius="50%"
            variant="gold"
          />
        </div>
        <SkeletonText
          lines={1}
          width="60%"
          height="2.5rem"
          className="mb-2"
          variant="gold"
        />
        <SkeletonText
          lines={2}
          width={['80%', '60%']}
          height="1rem"
          className="mb-6"
          variant="default"
        />
      </div>

      {/* 福利内容 */}
      <div className="vip-benefits-content-skeleton">
        {/* 福利类别：身份 */}
        <div className="benefit-category-skeleton mb-6">
          <SkeletonText
            lines={1}
            width="30%"
            height="1.5rem"
            className="mb-4"
            variant="gold"
          />
          
          {/* 福利卡片 */}
          {[1, 2].map((i) => (
            <div key={i} className="benefit-card-skeleton bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <SkeletonText
                lines={1}
                width="40%"
                height="1.25rem"
                className="mb-3"
                variant="gold"
              />
              <div className="flex justify-between">
                <div className="free-benefit-skeleton">
                  <SkeletonText
                    lines={1}
                    width="20%"
                    height="0.75rem"
                    className="mb-1"
                    variant="default"
                  />
                  <SkeletonText
                    lines={1}
                    width="60%"
                    height="1rem"
                    variant="default"
                  />
                </div>
                <div className="vip-benefit-skeleton">
                  <SkeletonText
                    lines={1}
                    width="20%"
                    height="0.75rem"
                    className="mb-1"
                    variant="gold"
                  />
                  <SkeletonText
                    lines={1}
                    width="60%"
                    height="1rem"
                    variant="gold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 福利类别：资源 */}
        <div className="benefit-category-skeleton mb-6">
          <SkeletonText
            lines={1}
            width="30%"
            height="1.5rem"
            className="mb-4"
            variant="gold"
          />
          
          {/* 福利卡片 */}
          {[1, 2].map((i) => (
            <div key={i} className="benefit-card-skeleton bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <SkeletonText
                lines={1}
                width="40%"
                height="1.25rem"
                className="mb-3"
                variant="gold"
              />
              <div className="flex justify-between">
                <div className="free-benefit-skeleton">
                  <SkeletonText
                    lines={1}
                    width="20%"
                    height="0.75rem"
                    className="mb-1"
                    variant="default"
                  />
                  <SkeletonText
                    lines={1}
                    width="60%"
                    height="1rem"
                    variant="default"
                  />
                </div>
                <div className="vip-benefit-skeleton">
                  <SkeletonText
                    lines={1}
                    width="20%"
                    height="0.75rem"
                    className="mb-1"
                    variant="gold"
                  />
                  <SkeletonText
                    lines={1}
                    width="60%"
                    height="1rem"
                    variant="gold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 福利类别：功能 */}
        <div className="benefit-category-skeleton mb-6">
          <SkeletonText
            lines={1}
            width="30%"
            height="1.5rem"
            className="mb-4"
            variant="gold"
          />
          
          {/* 福利卡片 */}
          {[1, 2].map((i) => (
            <div key={i} className="benefit-card-skeleton bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <SkeletonText
                lines={1}
                width="40%"
                height="1.25rem"
                className="mb-3"
                variant="gold"
              />
              <div className="flex justify-between">
                <div className="free-benefit-skeleton">
                  <SkeletonText
                    lines={1}
                    width="20%"
                    height="0.75rem"
                    className="mb-1"
                    variant="default"
                  />
                  <SkeletonText
                    lines={1}
                    width="60%"
                    height="1rem"
                    variant="default"
                  />
                </div>
                <div className="vip-benefit-skeleton">
                  <SkeletonText
                    lines={1}
                    width="20%"
                    height="0.75rem"
                    className="mb-1"
                    variant="gold"
                  />
                  <SkeletonText
                    lines={1}
                    width="60%"
                    height="1rem"
                    variant="gold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 订阅按钮 */}
      <div className="vip-actions-skeleton flex justify-center">
        <SkeletonBase
          width="60%"
          height="3rem"
          borderRadius="0.25rem"
          variant="gold"
        />
      </div>
    </div>
  );
};

export default VipBenefitsPageSkeleton;
