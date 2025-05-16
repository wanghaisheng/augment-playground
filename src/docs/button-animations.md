# 按钮反馈动画文档

## 概述

PandaHabit 应用使用精美的按钮反馈动画，为用户提供流畅且富有趣味性的交互体验。本文档描述了应用中使用的按钮反馈动画类型、实现方式和最佳实践。

## 按钮反馈动画类型

PandaHabit 应用提供了多种按钮反馈动画类型，每种类型都有其独特的视觉效果和适用场景。

### 1. 缩放动画 (Scale)

简单的缩放效果，悬停时放大，点击时缩小，适用于大多数按钮。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  animationType="scale"
>
  缩放按钮
</EnhancedAnimatedButton>
```

### 2. 发光动画 (Glow)

悬停时按钮周围出现发光效果，适用于重要按钮。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  animationType="glow"
>
  发光按钮
</EnhancedAnimatedButton>
```

### 3. 脉冲动画 (Pulse)

悬停时按钮呈现脉冲效果，适用于需要引起注意的按钮。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  animationType="pulse"
>
  脉冲按钮
</EnhancedAnimatedButton>
```

### 4. 弹跳动画 (Bounce)

悬停时按钮上下弹跳，适用于游戏化场景。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  animationType="bounce"
>
  弹跳按钮
</EnhancedAnimatedButton>
```

### 5. 抖动动画 (Shake)

悬停时按钮左右抖动，适用于提示用户进行操作的场景。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  animationType="shake"
>
  抖动按钮
</EnhancedAnimatedButton>
```

### 6. 涟漪动画 (Ripple)

点击时按钮产生涟漪效果，适用于扁平化设计。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  animationType="ripple"
>
  涟漪按钮
</EnhancedAnimatedButton>
```

### 7. 水墨动画 (Ink)

点击时按钮产生水墨扩散效果，适用于中国风设计。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  animationType="ink"
>
  水墨按钮
</EnhancedAnimatedButton>
```

## 粒子效果类型

除了按钮动画，PandaHabit 应用还提供了多种粒子效果，用于增强按钮点击的视觉反馈。

### 1. 爆发粒子 (Burst)

点击时从按钮中心向四周爆发粒子，适用于大多数按钮。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  particleType="burst"
>
  爆发粒子按钮
</EnhancedAnimatedButton>
```

### 2. 喷泉粒子 (Fountain)

点击时从按钮底部向上喷射粒子，适用于成功操作。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  particleType="fountain"
>
  喷泉粒子按钮
</EnhancedAnimatedButton>
```

### 3. 水墨粒子 (Ink)

点击时产生水墨扩散效果的粒子，适用于中国风设计。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  particleType="ink"
>
  水墨粒子按钮
</EnhancedAnimatedButton>
```

### 4. 闪烁粒子 (Sparkle)

点击时产生闪烁效果的粒子，适用于重要操作。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  particleType="sparkle"
>
  闪烁粒子按钮
</EnhancedAnimatedButton>
```

## 音效类型

PandaHabit 应用还提供了多种按钮音效，用于增强按钮点击的听觉反馈。

### 1. 点击音效 (Click)

标准的按钮点击音效，适用于大多数按钮。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  soundType="click"
>
  点击音效按钮
</EnhancedAnimatedButton>
```

### 2. 成功音效 (Success)

操作成功时的音效，适用于提交、确认等操作。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  soundType="success"
>
  成功音效按钮
</EnhancedAnimatedButton>
```

### 3. 错误音效 (Error)

操作失败时的音效，适用于取消、拒绝等操作。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  soundType="error"
>
  错误音效按钮
</EnhancedAnimatedButton>
```

## 实现方式

按钮反馈动画使用 Framer Motion 库实现，通过 `EnhancedAnimatedButton` 组件封装了各种动画效果、粒子效果和音效。该组件接受以下属性：

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| variant | 'primary' \| 'secondary' \| 'jade' \| 'gold' | 'primary' | 按钮变体 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 按钮大小 |
| isLoading | boolean | false | 是否显示加载状态 |
| loadingText | string | undefined | 加载状态文本 |
| animationType | ButtonAnimationType | 'scale' | 动画类型 |
| particleType | ButtonParticleType | 'burst' | 粒子效果类型 |
| soundType | ButtonSoundType | 'click' | 音效类型 |
| particleCount | number | 20 | 粒子数量 |
| soundVolume | number | 0.5 | 音效音量 |
| disabled | boolean | false | 是否禁用按钮 |
| disableAnimation | boolean | false | 是否禁用动画 |
| disableParticles | boolean | false | 是否禁用粒子效果 |
| disableSound | boolean | false | 是否禁用音效 |

## 性能优化

为了确保按钮反馈动画在各种设备上都能流畅运行，我们采取了以下优化措施：

1. **响应式调整**：在移动设备上调整按钮大小和动画效果，减少视觉干扰。
2. **减少动画**：对于偏好减少动画的用户，提供禁用动画、粒子效果和音效的选项。
3. **条件渲染**：只在需要时渲染粒子效果，减少不必要的DOM节点。
4. **优化动画属性**：优先使用 GPU 加速的动画属性，如 `transform` 和 `opacity`。

## 最佳实践

1. **保持一致性**：为同类型的按钮使用相同的动画效果，保持用户体验的一致性。
2. **考虑按钮功能**：根据按钮功能选择适合的动画效果，例如，提交按钮使用成功音效，取消按钮使用错误音效。
3. **避免过度使用**：不要在页面上使用过多的动画按钮，以免分散用户注意力。
4. **考虑可访问性**：为有特殊需求的用户提供关闭或简化动画的选项。

## 示例

### 基础示例

```tsx
import EnhancedAnimatedButton from '@/components/animation/EnhancedAnimatedButton';

const MyComponent = () => {
  return (
    <EnhancedAnimatedButton
      variant="jade"
      animationType="scale"
      particleType="burst"
      soundType="click"
      onClick={handleClick}
    >
      点击我
    </EnhancedAnimatedButton>
  );
};
```

### 自定义粒子效果

```tsx
import EnhancedAnimatedButton from '@/components/animation/EnhancedAnimatedButton';

const MyComponent = () => {
  return (
    <EnhancedAnimatedButton
      variant="gold"
      animationType="glow"
      particleType="sparkle"
      particleCount={30}
      onClick={handleClick}
    >
      闪耀按钮
    </EnhancedAnimatedButton>
  );
};
```

### 禁用特定效果

```tsx
import EnhancedAnimatedButton from '@/components/animation/EnhancedAnimatedButton';

const MyComponent = () => {
  return (
    <EnhancedAnimatedButton
      variant="jade"
      animationType="scale"
      disableParticles={true}
      disableSound={true}
      onClick={handleClick}
    >
      无粒子和音效
    </EnhancedAnimatedButton>
  );
};
```

## 按钮动画展示页面

PandaHabit 应用提供了一个按钮动画展示页面，用于展示各种按钮动画效果、粒子效果和音效。可以通过访问 `/button-animations` 路径查看。

在这个页面上，你可以：

1. 选择不同的动画类型
2. 选择不同的粒子效果类型
3. 选择不同的音效类型
4. 调整粒子数量和音效音量
5. 禁用特定效果
6. 查看不同按钮变体和大小的效果
7. 对比普通按钮、动画按钮和增强动画按钮的效果
