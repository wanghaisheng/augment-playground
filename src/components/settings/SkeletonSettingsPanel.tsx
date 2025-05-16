// src/components/settings/SkeletonSettingsPanel.tsx
import React from 'react';
import { useSkeleton } from '@/context/SkeletonProvider';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import { SkeletonList } from '@/components/skeleton';

interface SkeletonSettingsPanelProps {
  className?: string;
}

/**
 * 骨架屏设置面板组件
 * 
 * 允许用户调整骨架屏设置
 */
const SkeletonSettingsPanel: React.FC<SkeletonSettingsPanelProps> = ({
  className = ''
}) => {
  const { 
    isEnabled, 
    setIsEnabled,
    duration,
    setDuration,
    minDuration,
    setMinDuration,
    variant,
    setVariant,
    showSkeleton,
    hideSkeleton
  } = useSkeleton();
  
  // 处理切换启用状态
  const handleToggleEnabled = () => {
    playSound(SoundType.BUTTON_CLICK);
    setIsEnabled(!isEnabled);
  };
  
  // 处理设置持续时间
  const handleSetDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(event.target.value);
    setDuration(newDuration);
  };
  
  // 处理设置最小持续时间
  const handleSetMinDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinDuration = parseInt(event.target.value);
    setMinDuration(newMinDuration);
  };
  
  // 处理设置变体样式
  const handleSetVariant = (newVariant: 'default' | 'jade' | 'gold') => {
    playSound(SoundType.BUTTON_CLICK);
    setVariant(newVariant);
  };
  
  // 处理预览骨架屏
  const handlePreviewSkeleton = () => {
    playSound(SoundType.BUTTON_CLICK);
    showSkeleton();
    
    // 3秒后隐藏骨架屏
    setTimeout(() => {
      hideSkeleton();
    }, 3000);
  };
  
  // 渲染变体按钮
  const renderVariantButton = (variantValue: 'default' | 'jade' | 'gold', label: string) => (
    <Button
      variant={variant === variantValue ? 'jade' : 'secondary'}
      size="small"
      onClick={() => handleSetVariant(variantValue)}
      className="flex-1"
    >
      {label}
    </Button>
  );
  
  return (
    <div className={`skeleton-settings-panel ${className}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">骨架屏设置</h2>
      
      {/* 骨架屏预览 */}
      <div className="skeleton-preview bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-3">骨架屏预览</h3>
        
        <div className="preview-container mb-4">
          <SkeletonList
            count={3}
            variant={variant}
            layout="list"
          />
        </div>
        
        <div className="text-center">
          <Button
            variant="jade"
            onClick={handlePreviewSkeleton}
          >
            预览加载效果 (3秒)
          </Button>
        </div>
      </div>
      
      {/* 基本设置 */}
      <div className="basic-settings mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-3">基本设置</h3>
        
        <div className="setting-item flex items-center justify-between mb-4">
          <label className="text-sm text-gray-600">启用骨架屏</label>
          <div className="form-switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggleEnabled}
              className="toggle-checkbox"
            />
            <label className="toggle-label"></label>
          </div>
        </div>
        
        {/* 变体样式 */}
        <div className="setting-item mb-4">
          <label className="text-sm text-gray-600 block mb-2">变体样式</label>
          <div className="flex space-x-2">
            {renderVariantButton('default', '默认')}
            {renderVariantButton('jade', '翡翠')}
            {renderVariantButton('gold', '金色')}
          </div>
        </div>
      </div>
      
      {/* 高级设置 */}
      <div className="advanced-settings mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-3">高级设置</h3>
        
        {/* 持续时间 */}
        <div className="setting-item mb-4">
          <label className="text-sm text-gray-600 block mb-1">持续时间: {duration}ms</label>
          <input
            type="range"
            min="0"
            max="3000"
            step="100"
            value={duration}
            onChange={handleSetDuration}
            className="w-full"
            disabled={!isEnabled}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0ms</span>
            <span>1500ms</span>
            <span>3000ms</span>
          </div>
        </div>
        
        {/* 最小持续时间 */}
        <div className="setting-item">
          <label className="text-sm text-gray-600 block mb-1">最小持续时间: {minDuration}ms</label>
          <input
            type="range"
            min="0"
            max="2000"
            step="100"
            value={minDuration}
            onChange={handleSetMinDuration}
            className="w-full"
            disabled={!isEnabled}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0ms</span>
            <span>1000ms</span>
            <span>2000ms</span>
          </div>
        </div>
      </div>
      
      {/* 说明 */}
      <div className="explanation bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium text-gray-700 mb-2">关于骨架屏</h4>
        <p className="mb-2">
          骨架屏是一种在内容加载过程中显示的占位符，可以提高用户体验，减少用户等待的焦虑感。
        </p>
        <p>
          <strong>持续时间</strong>：骨架屏的默认显示时间。<br />
          <strong>最小持续时间</strong>：骨架屏的最短显示时间，即使数据已加载完成，也会至少显示这么长时间，避免闪烁。
        </p>
      </div>
    </div>
  );
};

export default SkeletonSettingsPanel;
