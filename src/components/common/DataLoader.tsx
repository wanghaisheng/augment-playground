// src/components/common/DataLoader.tsx
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { useComponentLabels } from '@/hooks/useComponentLabels';

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
 * Generic data loading component
 * Handles loading, error, and empty data states with localized text support
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
  errorComponent
}: DataLoaderProps<T>) {
  // Get localized labels
  const { labels } = useComponentLabels();

  // Loading state
  if (isLoading && !data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="data-loader-container"
      >
        {loadingComponent || <LoadingSpinner variant="jade" text={loadingText} type="data" />}
      </motion.div>
    );
  }

  // Error state
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

  // Empty data state
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
            <p>{labels.emptyState.noData}</p>
          </div>
        )}
      </motion.div>
    );
  }

  // Render data
  return <>{children(data)}</>;
}

export default DataLoader;
