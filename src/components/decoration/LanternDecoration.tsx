// src/components/decoration/LanternDecoration.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface LanternDecorationProps {
  count?: number;
  character?: string;
  position?: 'top' | 'left' | 'right' | 'bottom';
}

/**
 * 中国风灯笼装饰组件
 * 用于特殊场合的装饰，如节日、成就解锁等
 *
 * @param count - 灯笼数量
 * @param character - 灯笼上的汉字
 * @param position - 灯笼位置
 */
const LanternDecoration: React.FC<LanternDecorationProps> = ({
  count = 2,
  character = '福',
  position = 'top'
}) => {
  // 根据位置确定灯笼的样式
  const getPositionStyle = (index: number) => {
    const baseStyle = {
      position: 'fixed' as const,
      zIndex: 10,
      pointerEvents: 'none' as const
    };

    const totalWidth = count * 60; // 每个灯笼宽度约60px
    const startPosition = `calc(50% - ${totalWidth / 2}px)`;

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          top: '10px',
          left: `calc(${startPosition} + ${index * 60}px)`
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: '80px', // 为底部导航留出空间
          left: `calc(${startPosition} + ${index * 60}px)`
        };
      case 'left':
        return {
          ...baseStyle,
          left: '10px',
          top: `calc(50% - ${totalWidth / 2}px + ${index * 60}px)`
        };
      case 'right':
        return {
          ...baseStyle,
          right: '10px',
          top: `calc(50% - ${totalWidth / 2}px + ${index * 60}px)`
        };
      default:
        return baseStyle;
    }
  };

  // 灯笼动画变体
  const lanternVariants = {
    initial: { y: -10, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: 'easeOut'
      }
    }),
    // Use a fixed variant instead of a function to match Framer Motion's Variants type
    swing: {
      rotate: [0, 3, 0, -3, 0],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse' as const
      }
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          style={{
            ...getPositionStyle(index),
            width: '50px',
            height: '75px',
            backgroundImage: "url('/assets/chinese-lantern.svg')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          custom={index}
          variants={lanternVariants}
          initial="initial"
          animate={['animate', 'swing']}
        >
          <motion.span
            style={{
              fontFamily: 'var(--font-title)',
              color: '#FFD700',
              fontSize: '18px',
              marginTop: '-5px'
            }}
            animate={{
              scale: [1, 1.1, 1],
              transition: {
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
          >
            {character}
          </motion.span>
        </motion.div>
      ))}
    </>
  );
};

export default LanternDecoration;
