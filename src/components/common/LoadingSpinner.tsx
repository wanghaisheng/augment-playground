// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { useComponentLabels } from '@/hooks/useComponentLabels';

interface LoadingSpinnerProps {
  text?: string;
  variant?: 'default' | 'jade' | 'bamboo' | 'gold';
  type?: 'generic' | 'data' | 'content' | 'saving' | 'processing';
  size?: 'small' | 'medium' | 'large' | string;
  className?: string;
}

/**
 * Loading spinner component with support for game-themed style
 *
 * @param text - Optional text to display below the spinner (overrides default localized text)
 * @param variant - 'default', 'jade', 'bamboo', or 'gold' (game-themed)
 * @param type - Type of loading operation, used to select appropriate localized text if no text is provided
 * @param size - Size of the spinner: 'small', 'medium', 'large', or custom size
 * @param className - Additional CSS classes to apply
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text,
  variant = 'default',
  type = 'generic',
  size = 'medium',
  className = ''
}) => {
  const { labels } = useComponentLabels();

  // Determine spinner class based on variant
  let spinnerClass = 'loading-spinner';
  if (variant === 'jade') spinnerClass = 'jade-spinner';
  if (variant === 'bamboo') spinnerClass = 'bamboo-spinner';
  if (variant === 'gold') spinnerClass = 'gold-spinner';

  // Determine size class
  let sizeClass = '';
  if (size === 'small') sizeClass = 'spinner-small';
  if (size === 'medium') sizeClass = 'spinner-medium';
  if (size === 'large') sizeClass = 'spinner-large';
  if (typeof size === 'string' && !['small', 'medium', 'large'].includes(size)) {
    // Custom size - apply as inline style later
    sizeClass = 'spinner-custom';
  }

  // Use provided text or fall back to localized label based on type
  const displayText = text || (labels?.loading?.[type] || '加载中...');

  // Custom size style if needed
  const customStyle = (typeof size === 'string' && !['small', 'medium', 'large'].includes(size))
    ? { width: size, height: size }
    : {};

  return (
    <div className={`loading-spinner-overlay ${className}`}>
      <div
        className={`${spinnerClass} ${sizeClass}`}
        style={customStyle}
      ></div>
      {displayText && <p className="loading-spinner-text">{displayText}</p>}
    </div>
  );
};

export default LoadingSpinner;