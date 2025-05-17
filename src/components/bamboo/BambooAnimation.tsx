// src/components/bamboo/BambooAnimation.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, SoundType } from '@/utils/sound';

interface BambooAnimationProps {
  amount: number;
  duration?: number;
  onComplete?: () => void;
  className?: string;
}

/**
 * 竹子收集动画组件
 */
const BambooAnimation: React.FC<BambooAnimationProps> = ({
  amount,
  duration = 2,
  onComplete,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  // 粒子显示状态 - 始终为true，但保留变量以便未来可能的扩展
  // We track particle visibility but don't directly use the setter
  const [showParticles, _setShowParticles] = useState(true);

  // 播放音效
  useEffect(() => {
    playSound(SoundType.BAMBOO_COLLECT, 0.5);

    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (onComplete) {
        onComplete();
      }
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  // 生成粒子
  const generateParticles = () => {
    // 粒子数量基于收集的竹子数量，但有上限
    const particleCount = Math.min(Math.ceil(amount / 10), 20);

    return Array.from({ length: particleCount }).map((_, index) => {
      // 随机角度和距离
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;

      // 计算终点位置
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      // 随机延迟
      const delay = Math.random() * 0.5;

      // 随机持续时间
      const particleDuration = 0.8 + Math.random() * 0.7;

      // 随机大小
      const size = 10 + Math.random() * 20;

      // 随机旋转
      const rotation = Math.random() * 360;

      return (
        <motion.div
          key={`particle-${index}`}
          className="absolute"
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0,
            rotate: 0
          }}
          animate={{
            x,
            y,
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
            rotate: rotation
          }}
          transition={{
            duration: particleDuration,
            delay,
            ease: 'easeOut'
          }}
        >
          <img
            src="/assets/bamboo/bamboo_particle.svg"
            alt="Bamboo"
            className="w-full h-full object-contain"
            style={{ width: size, height: size }}
          />
        </motion.div>
      );
    });
  };

  return (
    <div className={`bamboo-animation relative ${className}`}>
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative bg-white bg-opacity-90 rounded-full p-8 shadow-lg"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(72, 187, 120, 0)',
                  '0 0 0 20px rgba(72, 187, 120, 0.3)',
                  '0 0 0 40px rgba(72, 187, 120, 0)'
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: 1,
                repeatType: 'loop'
              }}
            >
              <img
                src="/assets/bamboo/bamboo_bundle.svg"
                alt="Bamboo Bundle"
                className="w-24 h-24 object-contain"
              />

              {showParticles && generateParticles()}

              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.div
                  className="text-3xl font-bold text-jade-600"
                  animate={{ y: [0, -20], opacity: [1, 0] }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  +{amount}
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-4 text-xl font-semibold text-white bg-jade-600 px-4 py-2 rounded-full shadow-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              竹子收集成功！
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BambooAnimation;
