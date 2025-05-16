// src/pages/ButtonAnimationShowcase.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedAnimatedButton from '@/components/animation/EnhancedAnimatedButton';
import AnimatedButton from '@/components/animation/AnimatedButton';
import Button from '@/components/common/Button';
import { enableSound } from '@/utils/sound';
import { ButtonAnimationType, ButtonParticleType, ButtonSoundType } from '@/components/animation/EnhancedAnimatedButton';

/**
 * 按钮动画展示页面
 * 展示各种按钮动画效果
 */
const ButtonAnimationShowcase: React.FC = () => {
  // 启用声音（用户交互后）
  React.useEffect(() => {
    enableSound();
  }, []);

  // 状态
  const [selectedAnimationType, setSelectedAnimationType] = useState<ButtonAnimationType>('scale');
  const [selectedParticleType, setSelectedParticleType] = useState<ButtonParticleType>('burst');
  const [selectedSoundType, setSelectedSoundType] = useState<ButtonSoundType>('click');
  const [particleCount, setParticleCount] = useState<number>(20);
  const [soundVolume, setSoundVolume] = useState<number>(0.5);
  const [disableAnimation, setDisableAnimation] = useState<boolean>(false);
  const [disableParticles, setDisableParticles] = useState<boolean>(false);
  const [disableSound, setDisableSound] = useState<boolean>(false);

  // 动画类型选项
  const animationTypes: ButtonAnimationType[] = [
    'scale',
    'glow',
    'pulse',
    'bounce',
    'shake',
    'ripple',
    'ink'
  ];

  // 粒子类型选项
  const particleTypes: ButtonParticleType[] = [
    'burst',
    'fountain',
    'ink',
    'sparkle',
    'none'
  ];

  // 音效类型选项
  const soundTypes: ButtonSoundType[] = [
    'click',
    'success',
    'error',
    'none'
  ];

  // 按钮变体
  const buttonVariants = [
    'primary',
    'secondary',
    'jade',
    'gold'
  ] as const;

  // 按钮大小
  const buttonSizes = [
    'small',
    'medium',
    'large'
  ] as const;

  // 处理按钮点击
  const handleButtonClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div className="page-container">
      <div className="bamboo-frame">
        <h1>按钮动画展示</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">按钮动画类型</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {animationTypes.map((type) => (
              <EnhancedAnimatedButton
                key={type}
                variant="jade"
                animationType={type}
                particleType={selectedParticleType}
                soundType={selectedSoundType}
                particleCount={particleCount}
                soundVolume={soundVolume}
                disableAnimation={disableAnimation}
                disableParticles={disableParticles}
                disableSound={disableSound}
                onClick={() => setSelectedAnimationType(type)}
                className={selectedAnimationType === type ? 'ring-2 ring-jade-500' : ''}
              >
                {type}
              </EnhancedAnimatedButton>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">粒子效果类型</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {particleTypes.map((type) => (
              <EnhancedAnimatedButton
                key={type}
                variant="gold"
                animationType={selectedAnimationType}
                particleType={type}
                soundType={selectedSoundType}
                particleCount={particleCount}
                soundVolume={soundVolume}
                disableAnimation={disableAnimation}
                disableParticles={disableParticles}
                disableSound={disableSound}
                onClick={() => setSelectedParticleType(type)}
                className={selectedParticleType === type ? 'ring-2 ring-gold-500' : ''}
              >
                {type}
              </EnhancedAnimatedButton>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">音效类型</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {soundTypes.map((type) => (
              <EnhancedAnimatedButton
                key={type}
                variant="primary"
                animationType={selectedAnimationType}
                particleType={selectedParticleType}
                soundType={type}
                particleCount={particleCount}
                soundVolume={soundVolume}
                disableAnimation={disableAnimation}
                disableParticles={disableParticles}
                disableSound={disableSound}
                onClick={() => setSelectedSoundType(type)}
                className={selectedSoundType === type ? 'ring-2 ring-blue-500' : ''}
              >
                {type}
              </EnhancedAnimatedButton>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">粒子数量</h2>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="50"
              value={particleCount}
              onChange={(e) => setParticleCount(Number(e.target.value))}
              className="w-full"
            />
            <span>{particleCount}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">音效音量</h2>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={soundVolume}
              onChange={(e) => setSoundVolume(Number(e.target.value))}
              className="w-full"
            />
            <span>{soundVolume}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">禁用选项</h2>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={disableAnimation}
                onChange={(e) => setDisableAnimation(e.target.checked)}
              />
              禁用动画
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={disableParticles}
                onChange={(e) => setDisableParticles(e.target.checked)}
              />
              禁用粒子
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={disableSound}
                onChange={(e) => setDisableSound(e.target.checked)}
              />
              禁用音效
            </label>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">按钮变体</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {buttonVariants.map((variant) => (
              <EnhancedAnimatedButton
                key={variant}
                variant={variant}
                animationType={selectedAnimationType}
                particleType={selectedParticleType}
                soundType={selectedSoundType}
                particleCount={particleCount}
                soundVolume={soundVolume}
                disableAnimation={disableAnimation}
                disableParticles={disableParticles}
                disableSound={disableSound}
                onClick={handleButtonClick}
              >
                {variant}
              </EnhancedAnimatedButton>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">按钮大小</h2>
          <div className="grid grid-cols-3 gap-4">
            {buttonSizes.map((size) => (
              <EnhancedAnimatedButton
                key={size}
                variant="jade"
                size={size}
                animationType={selectedAnimationType}
                particleType={selectedParticleType}
                soundType={selectedSoundType}
                particleCount={particleCount}
                soundVolume={soundVolume}
                disableAnimation={disableAnimation}
                disableParticles={disableParticles}
                disableSound={disableSound}
                onClick={handleButtonClick}
              >
                {size}
              </EnhancedAnimatedButton>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">按钮状态</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <EnhancedAnimatedButton
              variant="jade"
              animationType={selectedAnimationType}
              particleType={selectedParticleType}
              soundType={selectedSoundType}
              particleCount={particleCount}
              soundVolume={soundVolume}
              disableAnimation={disableAnimation}
              disableParticles={disableParticles}
              disableSound={disableSound}
              onClick={handleButtonClick}
            >
              正常
            </EnhancedAnimatedButton>
            <EnhancedAnimatedButton
              variant="jade"
              isLoading={true}
              loadingText="加载中..."
              animationType={selectedAnimationType}
              particleType={selectedParticleType}
              soundType={selectedSoundType}
              particleCount={particleCount}
              soundVolume={soundVolume}
              disableAnimation={disableAnimation}
              disableParticles={disableParticles}
              disableSound={disableSound}
              onClick={handleButtonClick}
            >
              正常
            </EnhancedAnimatedButton>
            <EnhancedAnimatedButton
              variant="jade"
              disabled={true}
              animationType={selectedAnimationType}
              particleType={selectedParticleType}
              soundType={selectedSoundType}
              particleCount={particleCount}
              soundVolume={soundVolume}
              disableAnimation={disableAnimation}
              disableParticles={disableParticles}
              disableSound={disableSound}
              onClick={handleButtonClick}
            >
              禁用
            </EnhancedAnimatedButton>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">对比</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">普通按钮</h3>
              <Button variant="jade" onClick={handleButtonClick}>
                普通按钮
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">动画按钮</h3>
              <AnimatedButton variant="jade" onClick={handleButtonClick}>
                动画按钮
              </AnimatedButton>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">增强动画按钮</h3>
              <EnhancedAnimatedButton
                variant="jade"
                animationType={selectedAnimationType}
                particleType={selectedParticleType}
                soundType={selectedSoundType}
                particleCount={particleCount}
                soundVolume={soundVolume}
                disableAnimation={disableAnimation}
                disableParticles={disableParticles}
                disableSound={disableSound}
                onClick={handleButtonClick}
              >
                增强动画按钮
              </EnhancedAnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonAnimationShowcase;
