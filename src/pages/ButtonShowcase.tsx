// src/pages/ButtonShowcase.tsx
import React, { useState } from 'react';
import Button, { ButtonColor, ButtonSize, ButtonShape, ButtonVariant } from '@/components/common/Button';
import AnimatedButton from '@/components/animation/AnimatedButton';
import ButtonGroup from '@/components/common/ButtonGroup';
import IconButton from '@/components/common/IconButton';
import EnhancedAnimatedButton from '@/components/animation/EnhancedAnimatedButton';

/**
 * 按钮展示页面
 * 展示各种按钮组件和样式
 */
const ButtonShowcase: React.FC = () => {
  // 状态
  const [selectedColor, setSelectedColor] = useState<ButtonColor>('jade');
  const [selectedSize, setSelectedSize] = useState<ButtonSize>('medium');
  const [selectedShape, setSelectedShape] = useState<ButtonShape>('rounded');
  const [selectedVariant, setSelectedVariant] = useState<ButtonVariant>('filled');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fullWidth, setFullWidth] = useState<boolean>(false);

  // 颜色选项
  const colorOptions: ButtonColor[] = [
    'jade',
    'gold',
    'silk',
    'cinnabar',
    'blue',
    'purple'
  ];

  // 大小选项
  const sizeOptions: ButtonSize[] = [
    'small',
    'medium',
    'large'
  ];

  // 形状选项
  const shapeOptions: ButtonShape[] = [
    'rounded',
    'pill',
    'square',
    'circle'
  ];

  // 变种选项
  const variantOptions: ButtonVariant[] = [
    'filled',
    'outlined',
    'text'
  ];

  // 动画预设选项
  const animationPresets = [
    'scale',
    'glow',
    'pulse',
    'bounce',
    'shake',
    'none'
  ];

  // 处理按钮点击
  const handleButtonClick = () => {
    console.log('Button clicked!');
  };

  // 渲染图标
  const renderIcon = (type: string) => {
    switch (type) {
      case 'search':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'plus':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'check':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div className="bamboo-frame">
        <h1>按钮组件展示</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">配置选项</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <h3 className="text-lg font-medium mb-2">颜色</h3>
              <ButtonGroup>
                {colorOptions.map((color) => (
                  <Button
                    key={color}
                    color={color}
                    size="small"
                    onClick={() => setSelectedColor(color)}
                    className={selectedColor === color ? 'ring-2 ring-offset-2' : ''}
                  >
                    {color}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">大小</h3>
              <ButtonGroup>
                {sizeOptions.map((size) => (
                  <Button
                    key={size}
                    color={selectedColor}
                    size="small"
                    onClick={() => setSelectedSize(size)}
                    className={selectedSize === size ? 'ring-2 ring-offset-2' : ''}
                  >
                    {size}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">形状</h3>
              <ButtonGroup>
                {shapeOptions.map((shape) => (
                  <Button
                    key={shape}
                    color={selectedColor}
                    size="small"
                    onClick={() => setSelectedShape(shape)}
                    className={selectedShape === shape ? 'ring-2 ring-offset-2' : ''}
                  >
                    {shape}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">变种</h3>
              <ButtonGroup>
                {variantOptions.map((variant) => (
                  <Button
                    key={variant}
                    color={selectedColor}
                    size="small"
                    onClick={() => setSelectedVariant(variant)}
                    className={selectedVariant === variant ? 'ring-2 ring-offset-2' : ''}
                  >
                    {variant}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isLoading}
                onChange={(e) => setIsLoading(e.target.checked)}
              />
              加载状态
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={fullWidth}
                onChange={(e) => setFullWidth(e.target.checked)}
              />
              全宽
            </label>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">基础按钮</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              color={selectedColor}
              size={selectedSize}
              shape={selectedShape}
              variant={selectedVariant}
              isLoading={isLoading}
              fullWidth={fullWidth}
              onClick={handleButtonClick}
            >
              基础按钮
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">带图标的按钮</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              color={selectedColor}
              size={selectedSize}
              shape={selectedShape}
              variant={selectedVariant}
              isLoading={isLoading}
              fullWidth={fullWidth}
              startIcon={renderIcon('search')}
              onClick={handleButtonClick}
            >
              左侧图标
            </Button>
            <Button
              color={selectedColor}
              size={selectedSize}
              shape={selectedShape}
              variant={selectedVariant}
              isLoading={isLoading}
              fullWidth={fullWidth}
              endIcon={renderIcon('check')}
              onClick={handleButtonClick}
            >
              右侧图标
            </Button>
            <Button
              color={selectedColor}
              size={selectedSize}
              shape={selectedShape}
              variant={selectedVariant}
              isLoading={isLoading}
              fullWidth={fullWidth}
              startIcon={renderIcon('search')}
              endIcon={renderIcon('check')}
              onClick={handleButtonClick}
            >
              两侧图标
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">图标按钮</h2>
          <div className="flex flex-wrap gap-4">
            <IconButton
              icon={renderIcon('search')}
              color={selectedColor}
              size={selectedSize}
              variant={selectedVariant}
              isLoading={isLoading}
              ariaLabel="搜索"
              tooltip="搜索"
              onClick={handleButtonClick}
            />
            <IconButton
              icon={renderIcon('plus')}
              color={selectedColor}
              size={selectedSize}
              variant={selectedVariant}
              isLoading={isLoading}
              ariaLabel="添加"
              tooltip="添加"
              onClick={handleButtonClick}
            />
            <IconButton
              icon={renderIcon('check')}
              color={selectedColor}
              size={selectedSize}
              variant={selectedVariant}
              isLoading={isLoading}
              ariaLabel="确认"
              tooltip="确认"
              onClick={handleButtonClick}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">按钮组</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">水平按钮组</h3>
            <ButtonGroup
              color={selectedColor}
              size={selectedSize}
              shape={selectedShape}
              variant={selectedVariant}
              fullWidth={fullWidth}
            >
              <Button onClick={handleButtonClick}>按钮 1</Button>
              <Button onClick={handleButtonClick}>按钮 2</Button>
              <Button onClick={handleButtonClick}>按钮 3</Button>
            </ButtonGroup>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">垂直按钮组</h3>
            <ButtonGroup
              direction="vertical"
              color={selectedColor}
              size={selectedSize}
              shape={selectedShape}
              variant={selectedVariant}
              fullWidth={fullWidth}
            >
              <Button onClick={handleButtonClick}>按钮 1</Button>
              <Button onClick={handleButtonClick}>按钮 2</Button>
              <Button onClick={handleButtonClick}>按钮 3</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">动画按钮</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {animationPresets.map((preset) => (
              <AnimatedButton
                key={preset}
                color={selectedColor}
                size={selectedSize}
                shape={selectedShape}
                variant={selectedVariant}
                isLoading={isLoading}
                fullWidth={fullWidth}
                animationPreset={preset as any}
                onClick={handleButtonClick}
              >
                {preset}
              </AnimatedButton>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">增强动画按钮</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedAnimatedButton
              variant={selectedColor as any}
              size={selectedSize as any}
              isLoading={isLoading}
              animationType="scale"
              particleType="burst"
              soundType="click"
              onClick={handleButtonClick}
            >
              粒子爆发效果
            </EnhancedAnimatedButton>
            <EnhancedAnimatedButton
              variant={selectedColor as any}
              size={selectedSize as any}
              isLoading={isLoading}
              animationType="glow"
              particleType="fountain"
              soundType="success"
              onClick={handleButtonClick}
            >
              喷泉粒子效果
            </EnhancedAnimatedButton>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">颜色变体</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {colorOptions.map((color) => (
              <Button
                key={color}
                color={color}
                size={selectedSize}
                shape={selectedShape}
                variant={selectedVariant}
                onClick={handleButtonClick}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">大小变体</h2>
          <div className="flex items-center gap-4">
            {sizeOptions.map((size) => (
              <Button
                key={size}
                color={selectedColor}
                size={size}
                shape={selectedShape}
                variant={selectedVariant}
                onClick={handleButtonClick}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">形状变体</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shapeOptions.map((shape) => (
              <Button
                key={shape}
                color={selectedColor}
                size={selectedSize}
                shape={shape}
                variant={selectedVariant}
                onClick={handleButtonClick}
              >
                {shape !== 'circle' ? shape : '●'}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">变种样式</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {variantOptions.map((variant) => (
              <Button
                key={variant}
                color={selectedColor}
                size={selectedSize}
                shape={selectedShape}
                variant={variant}
                onClick={handleButtonClick}
              >
                {variant}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;
