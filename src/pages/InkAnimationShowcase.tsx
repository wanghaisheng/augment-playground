// src/pages/InkAnimationShowcase.tsx
import React, { useState } from 'react';
import EnhancedInkAnimation from '@/components/animation/EnhancedInkAnimation';
import InkTextAnimation from '@/components/animation/InkTextAnimation';
import InkButton from '@/components/animation/InkButton';
import InkCard from '@/components/animation/InkCard';
import InkLoading from '@/components/animation/InkLoading';
import { InkAnimationType, InkColorType } from '@/utils/inkAnimationUtils';
import { enableSound } from '@/utils/sound';

/**
 * 水墨动画展示页面
 * 展示各种水墨动画效果
 */
const InkAnimationShowcase: React.FC = () => {
  // 启用声音（用户交互后）
  React.useEffect(() => {
    enableSound();
  }, []);

  // 状态
  const [selectedAnimationType, setSelectedAnimationType] = useState<InkAnimationType>('spread');
  const [selectedColor, setSelectedColor] = useState<InkColorType>('black');
  const [count, setCount] = useState<number>(3);
  const [duration, setDuration] = useState<number>(2);
  const [size, setSize] = useState<number>(30);
  const [opacity, setOpacity] = useState<number>(0.6);
  const [blur, setBlur] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // 动画类型选项
  const animationTypes: InkAnimationType[] = [
    'spread',
    'stroke',
    'flow',
    'drop',
    'loading'
  ];

  // 颜色选项
  const colorTypes: InkColorType[] = [
    'black',
    'jade',
    'blue',
    'red',
    'gold'
  ];

  // 播放动画
  const playAnimation = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), duration * 1000 + 500);
  };

  return (
    <div className="page-container">
      <div className="bamboo-frame">
        <h1>水墨动画展示</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">水墨动画类型</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {animationTypes.map((type) => (
              <InkButton
                key={type}
                color={selectedColor}
                onClick={() => setSelectedAnimationType(type)}
                className={selectedAnimationType === type ? 'ring-2 ring-black' : ''}
              >
                {type}
              </InkButton>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">水墨颜色</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colorTypes.map((color) => (
              <InkButton
                key={color}
                color={color}
                onClick={() => setSelectedColor(color)}
                className={selectedColor === color ? 'ring-2 ring-black' : ''}
              >
                {color}
              </InkButton>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">参数调整</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">元素数量: {count}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-2">持续时间: {duration}秒</label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-2">大小: {size}px</label>
              <input
                type="range"
                min="10"
                max="100"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-2">不透明度: {opacity.toFixed(1)}</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-2">模糊量: {blur}px</label>
              <input
                type="range"
                min="0"
                max="10"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <InkButton
                color={selectedColor}
                size="large"
                onClick={playAnimation}
              >
                播放动画
              </InkButton>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">动画预览</h2>
          <div className="border border-gray-200 rounded-lg p-8 flex justify-center items-center h-64 relative">
            <EnhancedInkAnimation
              type={selectedAnimationType}
              color={selectedColor}
              count={count}
              duration={duration}
              size={[size / 2, size]}
              opacity={[opacity / 2, opacity]}
              blur={[blur / 2, blur]}
              autoPlay={isPlaying}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">水墨文字动画</h2>
          <div className="border border-gray-200 rounded-lg p-8 flex justify-center items-center">
            <InkTextAnimation
              text="熊猫习惯"
              color={selectedColor}
              fontSize={36}
              duration={2}
              autoPlay={false}
              loop={false}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">水墨按钮</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InkButton color={selectedColor} size="small">小按钮</InkButton>
            <InkButton color={selectedColor} size="medium">中按钮</InkButton>
            <InkButton color={selectedColor} size="large">大按钮</InkButton>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">水墨卡片</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InkCard color={selectedColor} height={150}>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">水墨卡片标题</h3>
                <p>点击卡片查看水墨飞溅效果</p>
              </div>
            </InkCard>
            <InkCard color={selectedColor} height={150} interactive={false}>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">静态水墨卡片</h3>
                <p>此卡片不可交互</p>
              </div>
            </InkCard>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">水墨加载</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            <InkLoading color={selectedColor} size="small" text="加载中..." />
            <InkLoading color={selectedColor} size="medium" text="加载中..." />
            <InkLoading color={selectedColor} size="large" text="加载中..." />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">组合示例</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InkCard color={selectedColor} height={200}>
              <div className="p-4 h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-2">任务完成</h3>
                <div className="flex-grow flex items-center justify-center">
                  <EnhancedInkAnimation
                    type="spread"
                    color={selectedColor}
                    count={5}
                    duration={2}
                    size={[20, 40]}
                    autoPlay={true}
                    loop={true}
                  >
                    <InkTextAnimation
                      text="完成!"
                      color={selectedColor}
                      fontSize={24}
                      autoPlay={true}
                      loop={true}
                    />
                  </EnhancedInkAnimation>
                </div>
              </div>
            </InkCard>
            <InkCard color={selectedColor} height={200}>
              <div className="p-4 h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-2">加载状态</h3>
                <div className="flex-grow flex items-center justify-center">
                  <InkLoading color={selectedColor} size="medium" text="正在加载任务..." />
                </div>
              </div>
            </InkCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InkAnimationShowcase;
