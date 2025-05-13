// src/components/common/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'jade' | 'gold';
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * Button component with support for different styles including game-themed variants
 *
 * @param variant - 'primary' (default), 'secondary', 'jade' (game-themed green), 'gold' (premium)
 * @param isLoading - Whether to show loading state
 * @param loadingText - Text to display when loading
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText = "Loading...",
  ...props
}) => {
  // Determine the appropriate CSS class based on variant
  let variantStyle = '';

  switch (variant) {
    case 'jade':
      variantStyle = 'jade-button';
      break;
    case 'gold':
      variantStyle = 'gold-button';
      break;
    case 'secondary':
      variantStyle = 'button-secondary';
      break;
    case 'primary':
    default:
      variantStyle = 'button-primary';
  }

  // Only add button-common class for non-game-themed buttons
  const baseStyle = !['jade', 'gold'].includes(variant) ? 'button-common' : '';

  return (
    <button
      className={`${baseStyle} ${variantStyle}`.trim()}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

export default Button;