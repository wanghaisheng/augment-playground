/**
 * @deprecated 此组件已废弃，请使用 EnhancedDataLoader 组件代替。
 * 此组件将在下一个主要版本中移除。
 *
 * EnhancedDataLoader 提供了以下优势：
 * 1. 与骨架屏上下文集成，自动管理骨架屏显示
 * 2. 支持更多骨架屏选项，如变体样式、布局方式、列数等
 * 3. 支持最小显示时间，确保骨架屏不会闪烁
 * 4. 使用AnimatePresence提供更流畅的过渡效果
 * 5. 支持自定义CSS类名和ID
 */

import { ReactNode } from 'react';
import EnhancedDataLoader from './EnhancedDataLoader';

interface DataLoaderProps<T> {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: T | undefined | null;
  loadingText?: string;
  errorTitle?: string;
  onRetry?: () => void;
  emptyState?: ReactNode;
  children: (data: T) => ReactNode;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  skeletonComponent?: ReactNode;
  useSkeleton?: boolean;
  skeletonCount?: number;
}

/**
 * Generic data loading component
 * Handles loading, error, and empty data states with localized text support
 *
 * @deprecated 此组件已废弃，请使用 EnhancedDataLoader 组件代替。
 *
 * @param isLoading - Whether data is currently loading
 * @param isError - Whether an error occurred
 * @param error - Error object
 * @param data - Data to render
 * @param loadingText - Optional custom loading text (overrides localized text)
 * @param errorTitle - Optional custom error title (overrides localized text)
 * @param onRetry - Optional retry callback
 * @param emptyState - Optional custom empty state component
 * @param children - Function to render data
 * @param loadingComponent - Optional custom loading component
 * @param errorComponent - Optional custom error component
 * @param skeletonComponent - Optional custom skeleton component
 * @param useSkeleton - Whether to use skeleton loading instead of spinner
 * @param skeletonCount - Number of skeleton items to display
 */
function DataLoader<T>({
  isLoading,
  isError,
  error,
  data,
  loadingText,
  errorTitle,
  onRetry,
  emptyState,
  children,
  loadingComponent,
  errorComponent,
  skeletonComponent,
  useSkeleton = false,
  skeletonCount = 3
}: DataLoaderProps<T>) {
  // 使用 EnhancedDataLoader 实现
  return (
    <EnhancedDataLoader
      isLoading={isLoading}
      isError={isError}
      error={error}
      data={data}
      loadingText={loadingText}
      errorTitle={errorTitle}
      onRetry={onRetry}
      emptyState={emptyState}
      skeletonComponent={loadingComponent || skeletonComponent}
      errorComponent={errorComponent}
      skeletonCount={skeletonCount}
      skeletonVariant="jade"
      skeletonLayout="list"
      skeletonMinDuration={500}
    >
      {children}
    </EnhancedDataLoader>
  );
}

export default DataLoader;
