// src/components/animation/StandaloneAnimatedButton.ts
import * as React from 'react';

// Button color types
export type ButtonColor =
  | 'jade'
  | 'gold'
  | 'silk'
  | 'cinnabar'
  | 'blue'
  | 'purple'
  | 'bamboo'
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info';

// Button size types
export type ButtonSize = 'small' | 'medium' | 'large';

// Button shape types
export type ButtonShape = 'rounded' | 'pill' | 'square' | 'circle';

// Button variant types
export type ButtonVariant =
  | 'filled'
  | 'outlined'
  | 'text'
  | 'jade'
  | 'gold'
  | 'bamboo'
  | 'contained'
  | 'standard'
  | 'ghost'
  | 'secondary';

// Animated button props
interface AnimatedButtonProps {
  // Motion props
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  style?: React.CSSProperties;
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  whileHover?: any;
  whileTap?: any;
  className?: string;
  buttonClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  animationPreset?: 'scale' | 'glow' | 'pulse' | 'bounce' | 'shake' | 'none';
  initialAnimation?: boolean;
  disableAnimation?: boolean;
}

/**
 * Standalone animated button component
 * This is a simplified version that doesn't use JSX or import external components
 */
const StandaloneAnimatedButton = (props: AnimatedButtonProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    color = 'jade',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    size = 'medium',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shape = 'rounded',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    variant = 'filled',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isLoading = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadingText = 'Loading...',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    disabled = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startIcon,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endIcon,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fullWidth = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    children,
    whileHover,
    whileTap,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    className = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buttonClassName = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onClick,
    animationPreset = 'scale',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    initialAnimation = true,
    disableAnimation = false
  } = props;

  // Get animation props based on preset and color
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getAnimationProps = () => {
    if (disableAnimation) {
      return {};
    }

    // If custom animations are provided, use them
    if (whileHover || whileTap) {
      return {
        whileHover,
        whileTap
      };
    }

    // Set animation based on preset
    switch (animationPreset) {
      case 'scale':
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        };
      case 'glow':
        return {
          whileHover: {
            boxShadow: color === 'jade'
              ? '0 0 15px rgba(136, 176, 75, 0.7)'
              : color === 'gold'
                ? '0 0 15px rgba(212, 175, 55, 0.7)'
                : color === 'cinnabar'
                  ? '0 0 15px rgba(215, 62, 53, 0.7)'
                  : color === 'blue'
                    ? '0 0 15px rgba(26, 109, 176, 0.7)'
                    : color === 'purple'
                      ? '0 0 15px rgba(93, 57, 84, 0.7)'
                      : '0 0 15px rgba(248, 200, 220, 0.7)'
          },
          whileTap: { scale: 0.98 }
        };
      case 'pulse':
        return {
          whileHover: {
            scale: [1, 1.05, 1.03],
            transition: {
              duration: 0.8,
              repeat: Infinity,
              repeatType: 'reverse'
            }
          },
          whileTap: { scale: 0.95 }
        };
      case 'bounce':
        return {
          whileHover: {
            y: [0, -5, 0],
            transition: {
              duration: 0.6,
              repeat: Infinity
            }
          },
          whileTap: { y: 2 }
        };
      case 'shake':
        return {
          whileHover: {
            x: [0, -2, 2, -2, 0],
            transition: {
              duration: 0.4,
              repeat: Infinity
            }
          },
          whileTap: { scale: 0.95 }
        };
      case 'none':
        return {};
      default:
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        };
    }
  };

  // This is a simplified version that just returns null
  // In a real implementation, this would create a button element
  return null;
};

export default StandaloneAnimatedButton;
