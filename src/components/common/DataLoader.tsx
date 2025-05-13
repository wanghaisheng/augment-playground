// src/components/common/DataLoader.tsx
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

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
}

/**
 * 通用数据加载组件
 * 处理加载状态、错误状态和空数据状态
 * 
 * @param isLoading - 是否正在加载
 * @param isError - 是否出错
 * @param error - 错误对象
 * @param data - 数据
 * @param loadingText - 加载文本
 * @param errorTitle - 错误标题
 * @param onRetry - 重试回调
 * @param emptyState - 空数据状态组件
 * @param children - 渲染数据的函数
 * @param loadingComponent - 自定义加载组件
 * @param errorComponent - 自定义错误组件
 */
function DataLoader<T>({
  isLoading,
  isError,
  error,
  data,
  loadingText = '加载数据中...',
  errorTitle = '加载错误',
  onRetry,
  emptyState,
  children,
  loadingComponent,
  errorComponent
}: DataLoaderProps<T>) {
  // 加载状态
  if (isLoading && !data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="data-loader-container"
      >
        {loadingComponent || <LoadingSpinner variant="jade" text={loadingText} />}
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
        className="data-loader-container"
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
        className="data-loader-container"
      >
        {emptyState || (
          <div className="empty-state">
            <p>暂无数据</p>
          </div>
        )}
      </motion.div>
    );
  }

  // 渲染数据
  return <>{children(data)}</>;
}

export default DataLoader;
