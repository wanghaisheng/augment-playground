// src/components/skeleton/TasksPageSkeleton.tsx
import React from 'react';
import { SkeletonBase, SkeletonText } from '@/components/skeleton';
import { TaskCardSkeleton } from '@/components/skeleton';

/**
 * 任务页面骨架屏组件
 * 模拟任务页面的加载状态
 */
const TasksPageSkeleton: React.FC = () => {
  return (
    <div className="tasks-page-skeleton">
      {/* 页面标题 */}
      <SkeletonText
        lines={1}
        width="40%"
        height="2rem"
        className="mb-6"
        variant="jade"
      />

      {/* 任务管理器部分 */}
      <div className="task-manager-skeleton">
        {/* 任务过滤器 */}
        <div className="task-filters-skeleton mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
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
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <SkeletonBase
                  key={i}
                  width="4rem"
                  height="1.75rem"
                  borderRadius="0.25rem"
                  variant={i === 1 ? 'jade' : 'default'}
                />
              ))}
            </div>
            <SkeletonBase
              width="8rem"
              height="2.25rem"
              borderRadius="0.25rem"
              variant="jade"
            />
          </div>
        </div>

        {/* 任务列表 */}
        <div className="task-list-skeleton space-y-4">
          <TaskCardSkeleton variant="jade" />
          <TaskCardSkeleton variant="jade" />
          <TaskCardSkeleton variant="jade" />
          <TaskCardSkeleton variant="jade" />
        </div>

        {/* 任务统计 */}
        <div className="task-stats-skeleton mt-6 p-4 bg-gray-50 rounded-lg">
          <SkeletonText
            lines={1}
            width="30%"
            height="1.25rem"
            className="mb-3"
            variant="jade"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <SkeletonBase
                width="2rem"
                height="2rem"
                borderRadius="50%"
                className="mr-2"
                variant="jade"
              />
              <SkeletonText
                lines={1}
                width="60%"
                height="1rem"
                variant="default"
              />
            </div>
            <div className="flex items-center">
              <SkeletonBase
                width="2rem"
                height="2rem"
                borderRadius="50%"
                className="mr-2"
                variant="jade"
              />
              <SkeletonText
                lines={1}
                width="60%"
                height="1rem"
                variant="default"
              />
            </div>
            <div className="flex items-center">
              <SkeletonBase
                width="2rem"
                height="2rem"
                borderRadius="50%"
                className="mr-2"
                variant="jade"
              />
              <SkeletonText
                lines={1}
                width="60%"
                height="1rem"
                variant="default"
              />
            </div>
            <div className="flex items-center">
              <SkeletonBase
                width="2rem"
                height="2rem"
                borderRadius="50%"
                className="mr-2"
                variant="jade"
              />
              <SkeletonText
                lines={1}
                width="60%"
                height="1rem"
                variant="default"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPageSkeleton;
