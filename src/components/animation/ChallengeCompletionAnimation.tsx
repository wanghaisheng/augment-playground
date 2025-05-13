// src/components/animation/ChallengeCompletionAnimation.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playChallengeCompletionSound } from '@/utils/sound';

interface ChallengeCompletionAnimationProps {
  challengeTitle: string;
  challengeDescription?: string;
  onAnimationComplete?: () => void;
  style?: 'default' | 'epic' | 'legendary';
  playSound?: boolean;
  soundVolume?: number;
}

/**
 * 挑战完成动画组件
 * 在挑战完成时显示动画效果
 */
const ChallengeCompletionAnimation: React.FC<ChallengeCompletionAnimationProps> = ({
  challengeTitle,
  challengeDescription,
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
      // 根据动画样式确定挑战难度
      const difficulty = style === 'legendary' ? 'legendary' :
                         style === 'epic' ? 'epic' : 'normal';
      playChallengeCompletionSound(difficulty, soundVolume);
    }
  }, [playSound, style, soundVolume]);

  // 生成粒子效果
  useEffect(() => {
    const particleCount = style === 'legendary' ? 100 : style === 'epic' ? 70 : 40;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push(generateParticle(i, style));
    }

    setParticles(newParticles);
  }, [style]);

  // 生成单个粒子
  const generateParticle = (index: number, style: string) => {
    // 传说级挑战完成动画
    if (style === 'legendary') {
      // 彩虹色粒子
      const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      // 随机选择粒子类型
      const particleType = Math.random() > 0.7 ? 'star' : Math.random() > 0.5 ? 'circle' : 'square';

      if (particleType === 'star') {
        const size = Math.random() * 20 + 10;
        const angle = Math.random() * 360;
        const distance = Math.random() * 150 + 100;
        const delay = Math.random() * 1;
        const duration = Math.random() * 2 + 2;

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
              boxShadow: `0 0 10px ${randomColor}`,
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
              opacity: [0, 1, 1, 0.8, 0],
              rotate: 360,
              scale: [0, 1.5, 1, 1.2, 0]
            }}
            transition={{
              duration: duration,
              delay: delay,
              ease: 'easeInOut',
              times: [0, 0.2, 0.4, 0.8, 1]
            }}
          />
        );
      } else if (particleType === 'circle') {
        const size = Math.random() * 15 + 5;
        const angle = Math.random() * 360;
        const distance = Math.random() * 200 + 50;
        const delay = Math.random() * 0.8;
        const duration = Math.random() * 2 + 1.5;

        return (
          <motion.div
            key={`circle-${index}`}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: randomColor,
              boxShadow: `0 0 10px ${randomColor}`,
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
              opacity: [0, 1, 0.8, 0],
              scale: [0.5, 1.5, 1, 0]
            }}
            transition={{
              duration: duration,
              delay: delay,
              ease: 'easeOut',
              times: [0, 0.3, 0.7, 1]
            }}
          />
        );
      } else {
        const size = Math.random() * 12 + 8;
        const angle = Math.random() * 360;
        const distance = Math.random() * 180 + 80;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 1.5 + 1;
        const rotation = Math.random() * 720 - 360;

        return (
          <motion.div
            key={`square-${index}`}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              backgroundColor: randomColor,
              boxShadow: `0 0 8px ${randomColor}`,
              top: '50%',
              left: '50%',
              margin: `-${size / 2}px 0 0 -${size / 2}px`,
              zIndex: 10
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              rotate: 0,
              scale: 0.5
            }}
            animate={{
              x: Math.cos(angle * Math.PI / 180) * distance,
              y: Math.sin(angle * Math.PI / 180) * distance,
              opacity: [0, 1, 0.7, 0],
              rotate: rotation,
              scale: [0.5, 1.2, 0.8, 0]
            }}
            transition={{
              duration: duration,
              delay: delay,
              ease: 'easeOut',
              times: [0, 0.3, 0.7, 1]
            }}
          />
        );
      }
    }
    // 史诗级挑战完成动画
    else if (style === 'epic') {
      const colors = ['#a335ee', '#9370DB', '#8A2BE2', '#9932CC', '#BA55D3'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const size = Math.random() * 15 + 5;
      const angle = Math.random() * 360;
      const distance = Math.random() * 150 + 50;
      const delay = Math.random() * 0.5;
      const duration = Math.random() * 1.5 + 1;

      return (
        <motion.div
          key={`epic-${index}`}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            backgroundColor: randomColor,
            boxShadow: `0 0 8px ${randomColor}`,
            top: '50%',
            left: '50%',
            margin: `-${size / 2}px 0 0 -${size / 2}px`,
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
            opacity: [0, 1, 0],
            rotate: Math.random() > 0.5 ? 360 : 0
          }}
          transition={{
            duration: duration,
            delay: delay,
            ease: 'easeOut'
          }}
        />
      );
    }
    // 默认挑战完成动画
    else {
      const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FF7F50', '#FF6347'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const size = Math.random() * 10 + 5;
      const angle = Math.random() * 360;
      const distance = Math.random() * 100 + 50;
      const delay = Math.random() * 0.3;
      const duration = Math.random() * 1 + 0.8;

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
              backgroundColor: style === 'legendary' ? 'rgba(0, 0, 0, 0.8)' :
                              style === 'epic' ? 'rgba(50, 0, 80, 0.8)' :
                              'rgba(50, 30, 0, 0.8)',
              color: '#fff',
              padding: '30px 50px',
              borderRadius: '15px',
              textAlign: 'center',
              zIndex: 20,
              border: style === 'legendary' ? '3px solid gold' :
                      style === 'epic' ? '2px solid #a335ee' :
                      '1px solid #FFA500',
              boxShadow: style === 'legendary' ? '0 0 20px gold' :
                         style === 'epic' ? '0 0 15px #a335ee' :
                         '0 0 10px #FFA500'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onAnimationComplete={handleAnimationComplete}
          >
            <motion.h2
              style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                color: style === 'legendary' ? 'gold' :
                       style === 'epic' ? '#a335ee' :
                       '#FFA500'
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              挑战完成！
            </motion.h2>
            <motion.h3
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              {challengeTitle}
            </motion.h3>
            {challengeDescription && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                {challengeDescription}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChallengeCompletionAnimation;
