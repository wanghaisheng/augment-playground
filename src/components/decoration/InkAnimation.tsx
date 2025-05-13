// src/components/decoration/InkAnimation.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InkAnimationProps {
  text: string;
  duration?: number;
  fontSize?: number;
  color?: string;
  onComplete?: () => void;
}

/**
 * 中国风水墨动画组件
 * 用于文字的水墨渲染效果
 * 
 * @param text - 要显示的文字
 * @param duration - 动画持续时间（毫秒）
 * @param fontSize - 字体大小
 * @param color - 文字颜色
 * @param onComplete - 动画完成回调
 */
const InkAnimation: React.FC<InkAnimationProps> = ({
  text,
  duration = 2000,
  fontSize = 36,
  color = 'var(--royal-jade)',
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const characters = text.split('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, duration + characters.length * 200);
    
    return () => clearTimeout(timer);
  }, [duration, characters.length, onComplete]);
  
  // 字符动画变体
  const characterVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.5,
      filter: 'blur(10px)'
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.17, 0.67, 0.83, 0.67] // 模拟水墨扩散效果
      }
    }),
    exit: (i: number) => ({
      opacity: 0,
      scale: 1.2,
      filter: 'blur(5px)',
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };
  
  // 墨滴动画变体
  const inkDropVariants = {
    hidden: { 
      opacity: 0,
      scale: 0
    },
    visible: (i: number) => ({
      opacity: [0, 0.7, 0.3],
      scale: [0, 1.5, 1],
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: 'easeOut'
      }
    }),
    exit: (i: number) => ({
      opacity: 0,
      scale: 1.5,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            padding: '20px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {characters.map((char, index) => (
            <motion.div
              key={`${char}-${index}`}
              style={{
                position: 'relative',
                margin: '0 2px'
              }}
              custom={index}
              variants={characterVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* 墨滴效果 */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: `${fontSize * 1.5}px`,
                  height: `${fontSize * 1.5}px`,
                  borderRadius: '50%',
                  backgroundColor: color,
                  transform: 'translate(-50%, -50%)',
                  zIndex: -1,
                  opacity: 0.2
                }}
                custom={index}
                variants={inkDropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
              
              {/* 文字 */}
              <motion.span
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: `${fontSize}px`,
                  color: color,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {char}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InkAnimation;
