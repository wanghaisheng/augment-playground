# 按钮组件文档

## 概述

PandaHabit 应用使用增强的按钮组件，为用户提供美观、功能丰富的交互体验。本文档描述了应用中使用的按钮组件类型、实现方式和最佳实践。

## 按钮组件类型

PandaHabit 应用提供了四种主要的按钮组件，每种组件都有其独特的功能和适用场景。

### 1. 基础按钮 (Button)

基础按钮组件，支持多种颜色、大小、形状和变种。

```tsx
<Button
  color="jade"
  size="medium"
  shape="rounded"
  variant="filled"
  onClick={handleClick}
>
  按钮文本
</Button>
```

### 2. 动画按钮 (AnimatedButton)

为基础按钮添加动画效果，如缩放、发光、脉冲等。

```tsx
<AnimatedButton
  color="jade"
  size="medium"
  shape="rounded"
  variant="filled"
  animationPreset="scale"
  onClick={handleClick}
>
  动画按钮
</AnimatedButton>
```

### 3. 图标按钮 (IconButton)

只显示图标的按钮，适用于工具栏、操作栏等场景。

```tsx
<IconButton
  icon={<SearchIcon />}
  color="jade"
  size="medium"
  variant="filled"
  ariaLabel="搜索"
  tooltip="搜索"
  onClick={handleSearch}
/>
```

### 4. 按钮组 (ButtonGroup)

将多个按钮组合在一起，形成一个整体，适用于相关操作的分组。

```tsx
<ButtonGroup
  direction="horizontal"
  color="jade"
  size="medium"
  shape="rounded"
  variant="filled"
>
  <Button onClick={handleClick1}>按钮 1</Button>
  <Button onClick={handleClick2}>按钮 2</Button>
  <Button onClick={handleClick3}>按钮 3</Button>
</ButtonGroup>
```

## 按钮颜色

PandaHabit 应用提供了多种按钮颜色，用于表示不同的操作类型和重要程度。

### 1. 翡翠绿 (jade)

主要操作按钮，用于表示积极、确认等操作。

```tsx
<Button color="jade">翡翠绿按钮</Button>
```

### 2. 黄金 (gold)

高级操作按钮，用于表示重要、高价值的操作。

```tsx
<Button color="gold">黄金按钮</Button>
```

### 3. 丝绸 (silk)

次要操作按钮，用于表示辅助、次要的操作。

```tsx
<Button color="silk">丝绸按钮</Button>
```

### 4. 朱砂 (cinnabar)

警告操作按钮，用于表示删除、警告等操作。

```tsx
<Button color="cinnabar">朱砂按钮</Button>
```

### 5. 青花 (blue)

信息操作按钮，用于表示信息、提示等操作。

```tsx
<Button color="blue">青花按钮</Button>
```

### 6. 紫檀 (purple)

特殊操作按钮，用于表示特殊、独特的操作。

```tsx
<Button color="purple">紫檀按钮</Button>
```

## 按钮大小

PandaHabit 应用提供了三种按钮大小，用于适应不同的场景和布局。

### 1. 小型 (small)

适用于紧凑布局或次要操作。

```tsx
<Button size="small">小型按钮</Button>
```

### 2. 中型 (medium)

默认大小，适用于大多数场景。

```tsx
<Button size="medium">中型按钮</Button>
```

### 3. 大型 (large)

适用于强调重要操作或主要操作。

```tsx
<Button size="large">大型按钮</Button>
```

## 按钮形状

PandaHabit 应用提供了四种按钮形状，用于适应不同的设计风格和场景。

### 1. 圆角 (rounded)

默认形状，四个角都是圆角。

```tsx
<Button shape="rounded">圆角按钮</Button>
```

### 2. 胶囊 (pill)

两端完全圆形的按钮，适用于强调或特殊操作。

```tsx
<Button shape="pill">胶囊按钮</Button>
```

### 3. 方形 (square)

四个角都是直角的按钮，适用于紧凑布局或特定设计风格。

```tsx
<Button shape="square">方形按钮</Button>
```

### 4. 圆形 (circle)

完全圆形的按钮，通常用于图标按钮。

```tsx
<Button shape="circle">●</Button>
```

## 按钮变种

PandaHabit 应用提供了三种按钮变种，用于表示不同的强调程度。

### 1. 填充 (filled)

默认变种，背景色为主色，文字为对比色。

```tsx
<Button variant="filled">填充按钮</Button>
```

### 2. 轮廓 (outlined)

轮廓变种，背景透明，边框和文字为主色。

```tsx
<Button variant="outlined">轮廓按钮</Button>
```

### 3. 文本 (text)

文本变种，背景透明，无边框，文字为主色。

```tsx
<Button variant="text">文本按钮</Button>
```

## 按钮状态

PandaHabit 应用的按钮组件支持多种状态，用于表示按钮的不同状态。

### 1. 默认状态

按钮的正常状态。

```tsx
<Button>默认状态</Button>
```

### 2. 悬停状态

鼠标悬停在按钮上时的状态，通常会有轻微的视觉变化。

### 3. 点击状态

鼠标点击按钮时的状态，通常会有明显的视觉变化。

### 4. 加载状态

按钮正在执行操作时的状态，通常会显示加载指示器。

```tsx
<Button isLoading={true} loadingText="加载中...">按钮文本</Button>
```

### 5. 禁用状态

按钮不可用时的状态，通常会变灰并且不可点击。

```tsx
<Button disabled={true}>禁用按钮</Button>
```

## 按钮动画

PandaHabit 应用的动画按钮组件支持多种动画预设，用于增强用户体验。

### 1. 缩放 (scale)

悬停时按钮轻微放大，点击时轻微缩小。

```tsx
<AnimatedButton animationPreset="scale">缩放动画</AnimatedButton>
```

### 2. 发光 (glow)

悬停时按钮周围出现发光效果。

```tsx
<AnimatedButton animationPreset="glow">发光动画</AnimatedButton>
```

### 3. 脉冲 (pulse)

悬停时按钮呈现脉冲效果，大小周期性变化。

```tsx
<AnimatedButton animationPreset="pulse">脉冲动画</AnimatedButton>
```

### 4. 弹跳 (bounce)

悬停时按钮上下弹跳。

```tsx
<AnimatedButton animationPreset="bounce">弹跳动画</AnimatedButton>
```

### 5. 抖动 (shake)

悬停时按钮左右抖动。

```tsx
<AnimatedButton animationPreset="shake">抖动动画</AnimatedButton>
```

## 增强动画按钮

PandaHabit 应用还提供了增强动画按钮组件，支持粒子效果和音效反馈。

```tsx
<EnhancedAnimatedButton
  variant="jade"
  animationType="scale"
  particleType="burst"
  soundType="click"
  onClick={handleClick}
>
  增强动画按钮
</EnhancedAnimatedButton>
```

## 实现方式

按钮组件使用 React 和 Framer Motion 库实现，通过 CSS 和 JavaScript 实现各种特性和效果。主要实现方式包括：

1. **组件封装**：将原生 HTML 按钮元素封装为 React 组件，提供更丰富的功能和更好的开发体验。
2. **状态管理**：使用 React 的状态管理功能，跟踪按钮的状态，如加载状态、禁用状态等。
3. **动画效果**：使用 Framer Motion 库实现各种动画效果，如缩放、发光、脉冲等。
4. **样式变体**：通过 CSS 类和样式对象实现不同的颜色、大小、形状和变种。
5. **辅助功能**：添加适当的 ARIA 属性，提高按钮的可访问性。

## 性能优化

为了确保按钮组件在各种设备上都能流畅运行，我们采取了以下优化措施：

1. **响应式设计**：在不同屏幕尺寸上调整按钮大小和样式，提供一致的用户体验。
2. **减少重渲染**：使用 React 的 `useRef` 和 `useEffect` 钩子，减少不必要的重渲染。
3. **条件渲染**：只在需要时渲染辅助元素，如加载指示器、图标等。
4. **优化动画**：使用 Framer Motion 的性能优化功能，减少动画对性能的影响。
5. **减少动画**：对于偏好减少动画的用户，提供禁用动画的选项。

## 最佳实践

1. **保持一致性**：在整个应用中使用一致的按钮样式和行为，提供一致的用户体验。
2. **适当使用颜色**：根据操作的类型和重要程度选择适当的按钮颜色。
3. **考虑可访问性**：确保按钮组件对所有用户都可访问，包括使用屏幕阅读器的用户。
4. **提供反馈**：为用户操作提供适当的视觉和听觉反馈，如动画效果、音效等。
5. **避免过度使用**：避免在页面上使用过多的按钮，特别是强调色按钮，以免分散用户注意力。

## 示例

### 基础示例

```tsx
import Button from '@/components/common/Button';

const MyComponent = () => {
  const handleClick = () => {
    console.log('Button clicked!');
  };
  
  return (
    <Button
      color="jade"
      size="medium"
      shape="rounded"
      variant="filled"
      onClick={handleClick}
    >
      点击我
    </Button>
  );
};
```

### 带图标的按钮

```tsx
import Button from '@/components/common/Button';
import { SearchIcon } from '@/components/icons';

const MyComponent = () => {
  const handleSearch = () => {
    console.log('Search button clicked!');
  };
  
  return (
    <Button
      color="jade"
      size="medium"
      startIcon={<SearchIcon />}
      onClick={handleSearch}
    >
      搜索
    </Button>
  );
};
```

### 按钮组

```tsx
import Button from '@/components/common/Button';
import ButtonGroup from '@/components/common/ButtonGroup';

const MyComponent = () => {
  return (
    <ButtonGroup
      direction="horizontal"
      color="jade"
      size="medium"
    >
      <Button onClick={() => console.log('Button 1 clicked!')}>按钮 1</Button>
      <Button onClick={() => console.log('Button 2 clicked!')}>按钮 2</Button>
      <Button onClick={() => console.log('Button 3 clicked!')}>按钮 3</Button>
    </ButtonGroup>
  );
};
```

## 按钮组件展示页面

PandaHabit 应用提供了一个按钮组件展示页面，用于展示各种按钮组件和样式。可以通过访问 `/button-showcase` 路径查看。

在这个页面上，你可以：

1. 选择不同的按钮颜色
2. 选择不同的按钮大小
3. 选择不同的按钮形状
4. 选择不同的按钮变种
5. 启用或禁用加载状态和全宽选项
6. 查看基础按钮、带图标的按钮、图标按钮、按钮组和动画按钮的示例
7. 查看不同颜色、大小、形状和变种的按钮示例
