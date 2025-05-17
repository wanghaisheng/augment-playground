// src/components/common/EnhancedDataLoader.tsx
import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkeleton } from '@/context/SkeletonProvider';
import ErrorDisplay from './ErrorDisplay';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { SkeletonList } from '@/components/skeleton';

interface EnhancedDataLoaderProps<T> {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: T | undefined | null;
  loadingText?: string;
  errorTitle?: string;
  onRetry?: () => void;
  emptyState?: ReactNode;
  children: (data: T) => ReactNode;
  skeletonComponent?: ReactNode;
  errorComponent?: ReactNode;
  skeletonCount?: number;
  skeletonVariant?: 'default' | 'jade' | 'gold';
  skeletonLayout?: 'grid' | 'list';
  skeletonColumns?: number;
  skeletonMinDuration?: number;
  className?: string;
  id?: string;
}

/**
 * 增强的数据加载组件
 * 使用骨架屏上下文处理加载状态，提供更一致的用户体验
 *
 * @param isLoading - 是否正在加载
 * @param isError - 是否发生错误
 * @param error - 错误对象
 * @param data - 要渲染的数据
 * @param loadingText - 可选的自定义加载文本
 * @param errorTitle - 可选的自定义错误标题
 * @param onRetry - 可选的重试回调
 * @param emptyState - 可选的自定义空状态组件
 * @param children - 渲染数据的函数
 * @param skeletonComponent - 可选的自定义骨架屏组件
 * @param errorComponent - 可选的自定义错误组件
 * @param skeletonCount - 骨架屏项目数量
 * @param skeletonVariant - 骨架屏变体样式
 * @param skeletonLayout - 骨架屏布局方式
 * @param skeletonColumns - 骨架屏网格列数
 * @param skeletonMinDuration - 骨架屏最小显示时间
 * @param className - 自定义CSS类名
 * @param id - 自定义ID
 */
function EnhancedDataLoader<T>({
  isLoading,
  isError,
  error,
  data,
  loadingText: _loadingText,
  errorTitle,
  onRetry,
  emptyState,
  children,
  skeletonComponent,
  errorComponent,
  skeletonCount = 3,
  skeletonVariant = 'jade',
  skeletonLayout = 'list',
  skeletonColumns = 2,
  skeletonMinDuration = 500,
  className = '',
  id
}: EnhancedDataLoaderProps<T>) {
  // 获取本地化标签
  const { labels } = useComponentLabels();

  // 获取骨架屏上下文
  const { showSkeleton, hideSkeleton, isVisible } = useSkeleton();

  // 监听加载状态
  useEffect(() => {
    if (isLoading && !data) {
      showSkeleton({
        variant: skeletonVariant,
        minDuration: skeletonMinDuration
      });
    } else {
      hideSkeleton();
    }
  }, [isLoading, data, showSkeleton, hideSkeleton, skeletonVariant, skeletonMinDuration]);

  // 加载状态
  if ((isLoading && !data) || isVisible) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`enhanced-data-loader ${className}`}
        id={id}
      >
        {skeletonComponent || (
          <SkeletonList
            count={skeletonCount}
            variant={skeletonVariant}
            layout={skeletonLayout}
            columns={skeletonColumns}
          />
        )}
      </motion.div>
    );
  }

  // 错误状态
  if (isError && !data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`enhanced-data-loader ${className}`}
        id={id}
      >
        {errorComponent || (
          <ErrorDisplay
            error={error}
            title={errorTitle}
            onRetry={onRetry}
          />
        )}
      </motion.div>
    );
  }

  // 空数据状态
  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`enhanced-data-loader ${className}`}
        id={id}
      >
        {emptyState || (
          <div className="empty-state">
            <p>{labels?.emptyState?.noData || "No data available"}</p>
          </div>
        )}
      </motion.div>
    );
  }

  // 渲染数据
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`enhanced-data-loader ${className}`}
        id={id}
      >
        {children(data)}
      </motion.div>
    </AnimatePresence>
  );
}

export default EnhancedDataLoader;
