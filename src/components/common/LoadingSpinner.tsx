// src/components/common/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  variant?: 'default' | 'jade';
}

/**
 * Loading spinner component with support for game-themed style
 *
 * @param text - Optional text to display below the spinner
 * @param variant - 'default' or 'jade' (game-themed)
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text,
  variant = 'default'
}) => {
  const spinnerClass = variant === 'jade' ? 'jade-spinner' : 'loading-spinner';

  return (
    <div className="loading-spinner-overlay">
      <div className={spinnerClass}></div>
      {text && <p className="loading-spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;