// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { useComponentLabels } from '@/hooks/useComponentLabels';

interface LoadingSpinnerProps {
  text?: string;
  variant?: 'default' | 'jade';
  type?: 'generic' | 'data' | 'content' | 'saving' | 'processing';
}

/**
 * Loading spinner component with support for game-themed style
 *
 * @param text - Optional text to display below the spinner (overrides default localized text)
 * @param variant - 'default' or 'jade' (game-themed)
 * @param type - Type of loading operation, used to select appropriate localized text if no text is provided
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text,
  variant = 'default',
  type = 'generic'
}) => {
  const { labels } = useComponentLabels();
  const spinnerClass = variant === 'jade' ? 'jade-spinner' : 'loading-spinner';

  // Use provided text or fall back to localized label based on type
  const displayText = text || labels.loading[type];

  return (
    <div className="loading-spinner-overlay">
      <div className={spinnerClass}></div>
      {displayText && <p className="loading-spinner-text">{displayText}</p>}
    </div>
  );
};

export default LoadingSpinner;