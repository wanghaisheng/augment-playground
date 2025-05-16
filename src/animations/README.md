# 动画库文档

## 概述

PandaHabit 动画库是一个基于 Framer Motion 的动画系统，提供了一系列预设的动画效果和组件，用于在应用中创建一致且美观的动画体验。动画库的设计理念是简单易用、可扩展、性能优良，并且与中国传统文化元素相结合，如水墨、卷轴等效果。

## 目录结构

```
src/animations/
├── index.ts          # 动画库入口文件
├── variants.ts       # 动画变体定义
├── presets.ts        # 动画预设函数
├── utils.ts          # 动画工具函数
├── components.tsx    # 动画组件
└── README.md         # 文档
```

## 动画变体

动画变体是预定义的动画状态集合，每个变体包含 `hidden`、`visible` 和 `exit` 三个状态，分别对应元素的初始状态、显示状态和退出状态。

### 基础变体

- `fadeIn`: 淡入淡出效果
- `fadeInScale`: 淡入缩放效果
- `slideUp`: 从下方滑入效果
- `slideDown`: 从上方滑入效果
- `slideInLeft`: 从左侧滑入效果
- `slideInRight`: 从右侧滑入效果
- `bounce`: 弹跳效果
- `rotate`: 旋转效果
- `pulse`: 脉冲效果
- `goldenGlow`: 金光闪烁效果
- `listItem`: 列表项效果（带有交错动画）
- `pageTransition`: 页面过渡效果
- `inkSpread`: 水墨扩散效果
- `scrollUnroll`: 卷轴展开效果

### 使用示例

```tsx
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/animations';

// 使用淡入效果
<motion.div
  variants={fadeIn}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  内容
</motion.div>

// 使用滑入效果
<motion.div
  variants={slideUp}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  内容
</motion.div>
```

## 动画预设

动画预设是一系列函数，用于创建自定义参数的动画变体。

### 预设函数

- `createContainerVariants`: 创建容器动画变体
- `createListItemVariants`: 创建列表项动画变体
- `createBounceVariants`: 创建弹跳动画变体
- `createFadeInVariants`: 创建淡入动画变体
- `createSlideVariants`: 创建滑入动画变体
- `createInkSpreadVariants`: 创建水墨扩散动画变体
- `createScrollUnrollVariants`: 创建卷轴展开动画变体
- `createPulseVariants`: 创建脉冲动画变体

### 使用示例

```tsx
import { motion } from 'framer-motion';
import { createContainerVariants, createSlideVariants } from '@/animations';

// 创建自定义容器动画变体
const containerVariants = createContainerVariants(0.2, 0.5);

// 创建自定义滑入动画变体
const slideVariants = createSlideVariants('left', 50);

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  <motion.div variants={slideVariants}>
    内容1
  </motion.div>
  <motion.div variants={slideVariants}>
    内容2
  </motion.div>
</motion.div>
```

## 动画工具函数

动画工具函数是一系列辅助函数，用于生成随机值和特殊动画效果。

### 工具函数

- `randomPosition`: 生成随机位置
- `randomColor`: 生成随机颜色
- `randomAngle`: 生成随机角度
- `randomSize`: 生成随机大小
- `randomDelay`: 生成随机延迟
- `randomDuration`: 生成随机持续时间
- `generateParticleVariants`: 生成粒子动画变体
- `generateInkDropVariants`: 生成水墨滴落动画变体
- `generateGlowVariants`: 生成闪烁动画变体

### 使用示例

```tsx
import { motion } from 'framer-motion';
import { generateParticleVariants, generateGlowVariants } from '@/animations';

// 生成粒子动画变体
const particleVariants = generateParticleVariants(0, 'confetti');

// 生成闪烁动画变体
const glowVariants = generateGlowVariants('high');

<motion.div
  variants={glowVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  内容
</motion.div>
```

## 动画组件

动画组件是一系列封装了常用动画效果的 React 组件，可以直接在 JSX 中使用。

### 组件列表

- `AnimatedContainer`: 动画容器组件
- `AnimatedItem`: 动画项组件
- `PageTransitionWrapper`: 页面过渡组件
- `FadeIn`: 淡入组件
- `SlideIn`: 滑入组件
- `InkAnimation`: 水墨动画组件
- `ScrollAnimation`: 卷轴动画组件

### 使用示例

```tsx
import { 
  AnimatedContainer, 
  AnimatedItem, 
  FadeIn, 
  SlideIn, 
  InkAnimation 
} from '@/animations';

// 使用动画容器和动画项
<AnimatedContainer>
  <AnimatedItem index={0}>项目1</AnimatedItem>
  <AnimatedItem index={1}>项目2</AnimatedItem>
  <AnimatedItem index={2}>项目3</AnimatedItem>
</AnimatedContainer>

// 使用淡入组件
<FadeIn duration={0.8}>
  内容
</FadeIn>

// 使用滑入组件
<SlideIn direction="left">
  内容
</SlideIn>

// 使用水墨动画组件
<InkAnimation>
  内容
</InkAnimation>

// 使用卷轴动画组件
<ScrollAnimation isOpen={isOpen}>
  内容
</ScrollAnimation>
```

## 最佳实践

1. **性能优化**：
   - 使用 `AnimatePresence` 组件管理元素的进入和退出动画
   - 对于大量元素的列表，考虑使用 `AnimatedContainer` 和 `AnimatedItem` 组件，而不是单独为每个元素设置动画
   - 避免在动画中使用复杂的 CSS 属性，如 `box-shadow`、`filter` 等，这些属性会导致性能下降

2. **一致性**：
   - 在整个应用中使用一致的动画效果，避免不同页面或组件使用不同的动画风格
   - 为不同类型的交互设置不同的动画效果，如点击、悬停、拖拽等

3. **可访问性**：
   - 考虑用户可能会禁用动画，提供 `prefers-reduced-motion` 媒体查询的支持
   - 避免使用过于激烈的动画效果，如快速闪烁、大幅度移动等

4. **中国传统文化元素**：
   - 使用水墨、卷轴等中国传统文化元素的动画效果，增强应用的文化氛围
   - 动画效果应该与应用的整体设计风格相协调，不要过于突兀

## 示例场景

### 页面过渡

```tsx
import { PageTransitionWrapper } from '@/animations';

const HomePage = () => {
  return (
    <PageTransitionWrapper>
      <h1>首页</h1>
      <p>欢迎来到熊猫习惯</p>
    </PageTransitionWrapper>
  );
};
```

### 列表动画

```tsx
import { AnimatedContainer, AnimatedItem } from '@/animations';

const TaskList = ({ tasks }) => {
  return (
    <AnimatedContainer>
      {tasks.map((task, index) => (
        <AnimatedItem key={task.id} index={index}>
          <TaskCard task={task} />
        </AnimatedItem>
      ))}
    </AnimatedContainer>
  );
};
```

### 水墨效果

```tsx
import { InkAnimation } from '@/animations';

const WelcomeMessage = () => {
  return (
    <InkAnimation>
      <h1>欢迎来到熊猫习惯</h1>
      <p>开始你的习惯养成之旅</p>
    </InkAnimation>
  );
};
```
