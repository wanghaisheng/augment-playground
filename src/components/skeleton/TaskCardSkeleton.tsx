// src/components/skeleton/TaskCardSkeleton.tsx
import React from 'react';
import SkeletonBase from './SkeletonBase';
import SkeletonText from './SkeletonText';

interface TaskCardSkeletonProps {
  className?: string;
  variant?: 'default' | 'jade' | 'gold';
}

/**
 * 任务卡片骨架组件
 * 模拟任务卡片的加载状态
 * 
 * @param className - 自定义CSS类名
 * @param variant - 变体样式
 */
const TaskCardSkeleton: React.FC<TaskCardSkeletonProps> = ({
  className = '',
  variant = 'jade'
}) => {
  return (
    <div 
      className={`task-card-skeleton p-3 rounded-lg shadow-md bg-white ${className}`}
      style={{ 
        borderLeft: variant === 'jade' ? '4px solid rgba(0, 128, 0, 0.2)' : undefined
      }}
    >
      <div className="task-header-skeleton flex justify-between items-start mb-2">
        <div className="task-title-container-skeleton flex-1">
          <SkeletonText
            lines={1}
            height="1.25rem"
            className="mb-1"
            variant={variant}
          />
          
          <div className="task-meta-skeleton flex flex-wrap gap-1 mt-1">
            <SkeletonBase
              width="4rem"
              height="1rem"
              borderRadius="0.25rem"
              className="mr-2"
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
        
        <SkeletonBase
          width="2.5rem"
          height="2.5rem"
          borderRadius="50%"
          variant={variant}
        />
      </div>
      
      <div className="task-description-skeleton mb-3">
        <SkeletonText
          lines={2}
          width={['100%', '85%']}
          height="0.875rem"
          variant={variant}
        />
      </div>
      
      <div className="task-footer-skeleton flex justify-between items-center">
        <SkeletonBase
          width="5rem"
          height="1rem"
          borderRadius="0.25rem"
          variant={variant}
        />
        
        <div className="task-actions-skeleton flex space-x-2">
          <SkeletonBase
            width="5rem"
            height="2rem"
            borderRadius="0.25rem"
            variant={variant}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCardSkeleton;
