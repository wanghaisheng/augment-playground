# 水墨动画效果文档

## 概述

PandaHabit 应用使用精美的水墨动画效果，为用户提供富有中国传统文化特色的视觉体验。本文档描述了应用中使用的水墨动画效果类型、实现方式和最佳实践。

## 水墨动画效果类型

PandaHabit 应用提供了多种水墨动画效果类型，每种类型都有其独特的视觉效果和适用场景。

### 1. 水墨扩散 (Spread)

模拟水墨在宣纸上扩散的效果，适用于强调某个元素或表示成功完成操作。

```tsx
<EnhancedInkAnimation
  type="spread"
  color="black"
  count={3}
  duration={2}
>
  内容
</EnhancedInkAnimation>
```

### 2. 水墨笔触 (Stroke)

模拟毛笔在宣纸上留下笔触的效果，适用于强调线条或边框。

```tsx
<EnhancedInkAnimation
  type="stroke"
  color="jade"
  count={5}
  duration={1.5}
>
  内容
</EnhancedInkAnimation>
```

### 3. 水墨流动 (Flow)

模拟水墨在宣纸上流动的效果，适用于背景装饰或过渡效果。

```tsx
<EnhancedInkAnimation
  type="flow"
  color="blue"
  count={3}
  duration={3}
>
  内容
</EnhancedInkAnimation>
```

### 4. 水墨滴落 (Drop)

模拟水墨滴落在宣纸上的效果，适用于表示新内容的出现或提示用户注意。

```tsx
<EnhancedInkAnimation
  type="drop"
  color="red"
  count={5}
  duration={2}
>
  内容
</EnhancedInkAnimation>
```

### 5. 水墨加载 (Loading)

模拟水墨在宣纸上流动的加载效果，适用于表示加载状态。

```tsx
<EnhancedInkAnimation
  type="loading"
  color="black"
  count={3}
  duration={1.5}
>
  内容
</EnhancedInkAnimation>
```

## 水墨颜色类型

PandaHabit 应用提供了多种水墨颜色类型，用于适应不同的场景和情感表达。

### 1. 黑色 (Black)

传统水墨色，适用于大多数场景。

```tsx
<EnhancedInkAnimation
  type="spread"
  color="black"
>
  内容
</EnhancedInkAnimation>
```

### 2. 翡翠绿 (Jade)

翡翠绿色水墨，适用于表示成功、成长或与自然相关的场景。

```tsx
<EnhancedInkAnimation
  type="spread"
  color="jade"
>
  内容
</EnhancedInkAnimation>
```

### 3. 蓝色 (Blue)

蓝色水墨，适用于表示平静、专注或与水相关的场景。

```tsx
<EnhancedInkAnimation
  type="spread"
  color="blue"
>
  内容
</EnhancedInkAnimation>
```

### 4. 红色 (Red)

红色水墨，适用于表示热情、警告或重要信息。

```tsx
<EnhancedInkAnimation
  type="spread"
  color="red"
>
  内容
</EnhancedInkAnimation>
```

### 5. 金色 (Gold)

金色水墨，适用于表示珍贵、奖励或VIP相关的场景。

```tsx
<EnhancedInkAnimation
  type="spread"
  color="gold"
>
  内容
</EnhancedInkAnimation>
```

## 水墨组件

PandaHabit 应用提供了多种水墨组件，用于在不同场景中使用水墨动画效果。

### 1. 增强水墨动画 (EnhancedInkAnimation)

基础水墨动画组件，支持所有水墨动画效果类型。

```tsx
<EnhancedInkAnimation
  type="spread"
  color="black"
  count={3}
  duration={2}
  size={[20, 50]}
  opacity={[0.3, 0.8]}
  blur={[2, 5]}
  spread={360}
  originX={0.5}
  originY={0.5}
  autoPlay={true}
  loop={false}
  onAnimationComplete={() => console.log('动画完成')}
>
  内容
</EnhancedInkAnimation>
```

### 2. 水墨文字动画 (InkTextAnimation)

水墨文字动画组件，用于显示带有水墨效果的文字。

```tsx
<InkTextAnimation
  text="熊猫习惯"
  color="jade"
  fontSize={36}
  duration={2}
  delay={0}
  staggerDelay={0.1}
  autoPlay={true}
  loop={false}
  onComplete={() => console.log('动画完成')}
>
</InkTextAnimation>
```

### 3. 水墨按钮 (InkButton)

水墨按钮组件，用于显示带有水墨效果的按钮。

```tsx
<InkButton
  color="jade"
  size="medium"
  onClick={() => console.log('按钮点击')}
  disabled={false}
  playSound={true}
  splashEffect={true}
  hoverEffect={true}
>
  按钮文本
</InkButton>
```

### 4. 水墨卡片 (InkCard)

水墨卡片组件，用于显示带有水墨效果的卡片。

```tsx
<InkCard
  color="jade"
  width="100%"
  height="auto"
  onClick={() => console.log('卡片点击')}
  interactive={true}
  splashEffect={true}
  hoverEffect={true}
>
  卡片内容
</InkCard>
```

### 5. 水墨加载 (InkLoading)

水墨加载组件，用于显示带有水墨效果的加载动画。

```tsx
<InkLoading
  color="jade"
  size="medium"
  text="加载中..."
/>
```

## 实现方式

水墨动画效果使用 Framer Motion 库实现，通过 CSS 和 JavaScript 实现水墨扩散、流动等效果。主要实现方式包括：

1. **模糊滤镜**：使用 CSS 的 `filter: blur()` 属性模拟水墨的扩散效果。
2. **不规则形状**：使用 CSS 的 `border-radius` 属性创建不规则形状，模拟水墨的自然形态。
3. **透明度变化**：使用 CSS 的 `opacity` 属性模拟水墨的浓淡变化。
4. **缓动函数**：使用特定的缓动函数模拟水墨在宣纸上的扩散和流动。
5. **随机性**：添加随机性使每次动画效果都略有不同，增加自然感。

## 性能优化

为了确保水墨动画效果在各种设备上都能流畅运行，我们采取了以下优化措施：

1. **响应式调整**：在移动设备上缩小动画规模，减少视觉干扰。
2. **减少动画**：对于偏好减少动画的用户，提供简化的动画效果。
3. **条件渲染**：只在需要时渲染动画元素，减少不必要的DOM节点。
4. **优化动画属性**：优先使用 GPU 加速的动画属性，如 `transform` 和 `opacity`。
5. **限制元素数量**：限制同时显示的水墨元素数量，避免性能问题。

## 最佳实践

1. **保持一致性**：在整个应用中使用一致的水墨动画效果，保持用户体验的一致性。
2. **考虑场景**：根据场景选择适合的水墨动画效果和颜色，例如，成功操作使用翡翠绿色水墨扩散效果，警告使用红色水墨滴落效果。
3. **避免过度使用**：不要在页面上使用过多的水墨动画效果，以免分散用户注意力。
4. **考虑可访问性**：为有特殊需求的用户提供关闭或简化动画的选项。

## 示例

### 基础示例

```tsx
import EnhancedInkAnimation from '@/components/animation/EnhancedInkAnimation';

const MyComponent = () => {
  return (
    <EnhancedInkAnimation
      type="spread"
      color="jade"
      count={3}
      duration={2}
    >
      <div>内容</div>
    </EnhancedInkAnimation>
  );
};
```

### 任务完成示例

```tsx
import EnhancedInkAnimation from '@/components/animation/EnhancedInkAnimation';
import InkTextAnimation from '@/components/animation/InkTextAnimation';

const TaskComplete = () => {
  return (
    <EnhancedInkAnimation
      type="spread"
      color="jade"
      count={5}
      duration={2}
      autoPlay={true}
    >
      <InkTextAnimation
        text="任务完成!"
        color="jade"
        fontSize={24}
        autoPlay={true}
      />
    </EnhancedInkAnimation>
  );
};
```

### 加载示例

```tsx
import InkLoading from '@/components/animation/InkLoading';

const Loading = () => {
  return (
    <InkLoading
      color="black"
      size="medium"
      text="加载中..."
    />
  );
};
```

## 水墨动画展示页面

PandaHabit 应用提供了一个水墨动画展示页面，用于展示各种水墨动画效果。可以通过访问 `/ink-animations` 路径查看。

在这个页面上，你可以：

1. 选择不同的水墨动画类型
2. 选择不同的水墨颜色
3. 调整水墨元素数量、持续时间、大小、不透明度和模糊量
4. 预览水墨动画效果
5. 查看水墨文字动画、水墨按钮、水墨卡片和水墨加载组件的效果
6. 查看组合示例，如任务完成和加载状态
