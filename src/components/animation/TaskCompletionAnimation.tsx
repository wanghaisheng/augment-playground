// src/components/animation/TaskCompletionAnimation.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskRecord } from '@/services/taskService';
import { playTaskCompletionSound } from '@/utils/sound';

interface TaskCompletionAnimationProps {
  task: TaskRecord;
  onAnimationComplete?: () => void;
  style?: 'default' | 'confetti' | 'fireworks' | 'stars';
  playSound?: boolean;
  soundVolume?: number;
}

/**
 * 任务完成动画组件
 * 在任务完成时显示动画效果
 */
const TaskCompletionAnimation: React.FC<TaskCompletionAnimationProps> = ({
  task,
  onAnimationComplete,
  style = 'default',
  playSound = true,
  soundVolume = 0.5
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);

  // 播放音效
  useEffect(() => {
    if (playSound) {
      playTaskCompletionSound(task.type, task.priority, soundVolume);
    }
  }, [playSound, task.type, task.priority, soundVolume]);

  // 生成粒子效果
  useEffect(() => {
    const particleCount = style === 'confetti' ? 50 : style === 'fireworks' ? 30 : style === 'stars' ? 20 : 10;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push(generateParticle(i, style));
    }

    setParticles(newParticles);
  }, [style]);

  // 生成单个粒子
  const generateParticle = (index: number, style: string) => {
    const colors = ['#FFD700', '#FF6347', '#7CFC00', '#00BFFF', '#FF69B4', '#9370DB'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // 根据样式生成不同的粒子
    if (style === 'confetti') {
      const angle = Math.random() * 360;
      const distance = Math.random() * 100 + 50;
      const size = Math.random() * 10 + 5;
      const delay = Math.random() * 0.3;
      const duration = Math.random() * 1 + 1;
      const rotation = Math.random() * 720 - 360;

      return (
        <motion.div
          key={`confetti-${index}`}
          style={{
            position: 'absolute',
            width: size,
            height: size / 2,
            backgroundColor: randomColor,
            top: '50%',
            left: '50%',
            margin: `-${size / 4}px 0 0 -${size / 2}px`,
            zIndex: 10
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            rotate: 0
          }}
          animate={{
            x: Math.cos(angle * Math.PI / 180) * distance,
            y: Math.sin(angle * Math.PI / 180) * distance,
            opacity: [0, 1, 1, 0],
            rotate: rotation,
            scale: [1, 1.2, 0.8, 0]
          }}
          transition={{
            duration: duration,
            delay: delay,
            ease: 'easeOut'
          }}
        />
      );
    } else if (style === 'fireworks') {
      const angle = (index / 30) * 360;
      const distance = Math.random() * 50 + 100;
      const size = Math.random() * 6 + 2;
      const delay = Math.random() * 0.2;
      const duration = Math.random() * 0.8 + 0.6;

      return (
        <motion.div
          key={`firework-${index}`}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: randomColor,
            boxShadow: `0 0 ${size * 2}px ${randomColor}`,
            top: '50%',
            left: '50%',
            margin: `-${size / 2}px 0 0 -${size / 2}px`,
            zIndex: 10
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            x: Math.cos(angle * Math.PI / 180) * distance,
            y: Math.sin(angle * Math.PI / 180) * distance,
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0]
          }}
          transition={{
            duration: duration,
            delay: delay,
            ease: 'easeOut'
          }}
        />
      );
    } else if (style === 'stars') {
      const angle = Math.random() * 360;
      const distance = Math.random() * 80 + 40;
      const size = Math.random() * 15 + 10;
      const delay = Math.random() * 0.5;
      const duration = Math.random() * 1 + 1;

      return (
        <motion.div
          key={`star-${index}`}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            top: '50%',
            left: '50%',
            margin: `-${size / 2}px 0 0 -${size / 2}px`,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            backgroundColor: randomColor,
            zIndex: 10
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            rotate: 0,
            scale: 0
          }}
          animate={{
            x: Math.cos(angle * Math.PI / 180) * distance,
            y: Math.sin(angle * Math.PI / 180) * distance,
            opacity: [0, 1, 0],
            rotate: 360,
            scale: [0, 1, 0]
          }}
          transition={{
            duration: duration,
            delay: delay,
            ease: 'easeOut'
          }}
        />
      );
    } else {
      // 默认样式
      const angle = Math.random() * 360;
      const distance = Math.random() * 60 + 30;
      const size = Math.random() * 8 + 4;
      const delay = Math.random() * 0.3;
      const duration = Math.random() * 0.7 + 0.5;

      return (
        <motion.div
          key={`default-${index}`}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: randomColor,
            top: '50%',
            left: '50%',
            margin: `-${size / 2}px 0 0 -${size / 2}px`,
            zIndex: 10
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0
          }}
          animate={{
            x: Math.cos(angle * Math.PI / 180) * distance,
            y: Math.sin(angle * Math.PI / 180) * distance,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: duration,
            delay: delay,
            ease: 'easeOut'
          }}
        />
      );
    }
  };

  // 处理动画完成
  const handleAnimationComplete = () => {
    setIsAnimating(false);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 粒子效果 */}
          {particles}

          {/* 中心文本 */}
          <motion.div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#fff',
              padding: '20px 40px',
              borderRadius: '10px',
              textAlign: 'center',
              zIndex: 20
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onAnimationComplete={handleAnimationComplete}
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              任务完成！
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              {task.title}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskCompletionAnimation;
