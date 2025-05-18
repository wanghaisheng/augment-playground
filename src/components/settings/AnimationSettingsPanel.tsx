// src/components/settings/AnimationSettingsPanel.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationPerformance } from '@/context/AnimationPerformanceProvider';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import OptimizedInkAnimation from '@/components/animation/OptimizedInkAnimation';

interface AnimationSettingsPanelProps {
  className?: string;
}

/**
 * 动画设置面板组件
 *
 * 允许用户调整动画性能设置
 */
const AnimationSettingsPanel: React.FC<AnimationSettingsPanelProps> = ({
  className = ''
}) => {
  const {
    config,
    resetConfig,
    devicePerformance,
    currentFps,
    toggleAnimations,
    toggleComplexAnimations,
    toggleBackgroundAnimations,
    setAnimationQuality,
    setMaxParticleCount,
    toggleHardwareAcceleration,
    toggleReducedMotion,
    toggleAnimationThrottling,
    setFrameRateLimit,
    toggleAnimationCaching
  } = useAnimationPerformance();

  // 处理切换动画
  const handleToggleAnimations = () => {
    playSound(SoundType.BUTTON_CLICK);
    toggleAnimations();
  };

  // 处理切换复杂动画
  const handleToggleComplexAnimations = () => {
    playSound(SoundType.BUTTON_CLICK);
    toggleComplexAnimations();
  };

  // 处理切换背景动画
  const handleToggleBackgroundAnimations = () => {
    playSound(SoundType.BUTTON_CLICK);
    toggleBackgroundAnimations();
  };

  // 处理设置动画质量
  const handleSetAnimationQuality = (quality: 'low' | 'medium' | 'high') => {
    playSound(SoundType.BUTTON_CLICK);
    setAnimationQuality(quality);
  };

  // 处理设置最大粒子数量
  const handleSetMaxParticleCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(event.target.value);
    setMaxParticleCount(count);
  };

  // 处理切换硬件加速
  const handleToggleHardwareAcceleration = () => {
    playSound(SoundType.BUTTON_CLICK);
    toggleHardwareAcceleration();
  };

  // 处理切换减少动作模式
  const handleToggleReducedMotion = () => {
    playSound(SoundType.BUTTON_CLICK);
    toggleReducedMotion();
  };

  // 处理切换动画节流
  const handleToggleAnimationThrottling = () => {
    playSound(SoundType.BUTTON_CLICK);
    toggleAnimationThrottling();
  };

  // 处理设置帧率限制
  const handleSetFrameRateLimit = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = parseInt(event.target.value);
    setFrameRateLimit(limit);
  };

  // 处理切换动画缓存
  const handleToggleAnimationCaching = () => {
    playSound(SoundType.BUTTON_CLICK);
    toggleAnimationCaching();
  };

  // 处理重置配置
  const handleResetConfig = () => {
    playSound(SoundType.BUTTON_CLICK);
    resetConfig();
  };

  // 渲染动画质量按钮
  const renderQualityButton = (quality: 'low' | 'medium' | 'high', label: string) => (
    <Button
      variant={config.animationQuality === quality ? 'jade' : 'secondary'}
      size="small"
      onClick={() => handleSetAnimationQuality(quality)}
      className="flex-1"
    >
      {label}
    </Button>
  );

  // 渲染动画预览
  const renderAnimationPreview = () => (
    <div className="animation-preview bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-base font-medium text-gray-700 mb-3">动画预览</h3>

      <div className="flex justify-center">
        <OptimizedInkAnimation
          type="spread"
          color="jade"
          count={5}
          size={80}
          autoPlay={true}
          loop={true}
          priority="high"
        >
          <motion.div
            className="w-20 h-20 bg-jade-500 rounded-lg flex items-center justify-center text-white font-bold"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop'
            }}
          >
            预览
          </motion.div>
        </OptimizedInkAnimation>
      </div>

      <div className="text-center mt-3">
        <div className="text-sm text-gray-500">
          当前帧率: <span className="font-medium">{currentFps} FPS</span>
        </div>
        <div className="text-sm text-gray-500">
          设备性能: <span className="font-medium">{
            devicePerformance === 'low' ? '低' :
            devicePerformance === 'medium' ? '中' : '高'
          }</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`animation-settings-panel ${className}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">动画设置</h2>

      {/* 动画预览 */}
      {renderAnimationPreview()}

      {/* 基本设置 */}
      <div className="basic-settings mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-3">基本设置</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 启用动画 */}
          <div className="setting-item flex items-center justify-between">
            <label className="text-sm text-gray-600">启用动画</label>
            <div className="form-switch">
              <input
                type="checkbox"
                checked={config.enableAnimations}
                onChange={handleToggleAnimations}
                className="toggle-checkbox"
              />
              <label className="toggle-label"></label>
            </div>
          </div>

          {/* 启用复杂动画 */}
          <div className="setting-item flex items-center justify-between">
            <label className="text-sm text-gray-600">启用复杂动画</label>
            <div className="form-switch">
              <input
                type="checkbox"
                checked={config.enableComplexAnimations}
                onChange={handleToggleComplexAnimations}
                className="toggle-checkbox"
                disabled={!config.enableAnimations}
              />
              <label className="toggle-label"></label>
            </div>
          </div>

          {/* 启用背景动画 */}
          <div className="setting-item flex items-center justify-between">
            <label className="text-sm text-gray-600">启用背景动画</label>
            <div className="form-switch">
              <input
                type="checkbox"
                checked={config.enableBackgroundAnimations}
                onChange={handleToggleBackgroundAnimations}
                className="toggle-checkbox"
                disabled={!config.enableAnimations}
              />
              <label className="toggle-label"></label>
            </div>
          </div>

          {/* 减少动作模式 */}
          <div className="setting-item flex items-center justify-between">
            <label className="text-sm text-gray-600">减少动作模式</label>
            <div className="form-switch">
              <input
                type="checkbox"
                checked={config.useReducedMotion}
                onChange={handleToggleReducedMotion}
                className="toggle-checkbox"
                disabled={!config.enableAnimations}
              />
              <label className="toggle-label"></label>
            </div>
          </div>
        </div>
      </div>

      {/* 动画质量 */}
      <div className="quality-settings mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-3">动画质量</h3>

        <div className="flex space-x-2 mb-4">
          {renderQualityButton('low', '低')}
          {renderQualityButton('medium', '中')}
          {renderQualityButton('high', '高')}
        </div>

        {/* 最大粒子数量 */}
        <div className="setting-item mb-4">
          <label className="text-sm text-gray-600 block mb-1">最大粒子数量: {config.maxParticleCount}</label>
          <input
            type="range"
            min="0"
            max="200"
            step="10"
            value={config.maxParticleCount}
            onChange={handleSetMaxParticleCount}
            className="w-full"
            disabled={!config.enableComplexAnimations || !config.enableAnimations}
          />
        </div>

        {/* 帧率限制 */}
        <div className="setting-item">
          <label className="text-sm text-gray-600 block mb-1">帧率限制</label>
          <select
            value={config.frameRateLimit}
            onChange={handleSetFrameRateLimit}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={!config.enableAnimations}
          >
            <option value="15">15 FPS (超低)</option>
            <option value="30">30 FPS (低)</option>
            <option value="60">60 FPS (标准)</option>
            <option value="120">120 FPS (高)</option>
          </select>
        </div>
      </div>

      {/* 高级设置 */}
      <div className="advanced-settings mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-3">高级设置</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 硬件加速 */}
          <div className="setting-item flex items-center justify-between">
            <label className="text-sm text-gray-600">硬件加速</label>
            <div className="form-switch">
              <input
                type="checkbox"
                checked={config.useHardwareAcceleration}
                onChange={handleToggleHardwareAcceleration}
                className="toggle-checkbox"
                disabled={!config.enableAnimations}
              />
              <label className="toggle-label"></label>
            </div>
          </div>

          {/* 动画节流 */}
          <div className="setting-item flex items-center justify-between">
            <label className="text-sm text-gray-600">动画节流</label>
            <div className="form-switch">
              <input
                type="checkbox"
                checked={config.enableAnimationThrottling}
                onChange={handleToggleAnimationThrottling}
                className="toggle-checkbox"
                disabled={!config.enableAnimations}
              />
              <label className="toggle-label"></label>
            </div>
          </div>

          {/* 动画缓存 */}
          <div className="setting-item flex items-center justify-between">
            <label className="text-sm text-gray-600">动画缓存</label>
            <div className="form-switch">
              <input
                type="checkbox"
                checked={config.enableAnimationCaching}
                onChange={handleToggleAnimationCaching}
                className="toggle-checkbox"
                disabled={!config.enableAnimations}
              />
              <label className="toggle-label"></label>
            </div>
          </div>
        </div>
      </div>

      {/* 重置按钮 */}
      <div className="reset-button">
        <Button
          variant="secondary"
          onClick={handleResetConfig}
          className="w-full"
        >
          重置为默认设置
        </Button>
      </div>
    </div>
  );
};

export default AnimationSettingsPanel;
