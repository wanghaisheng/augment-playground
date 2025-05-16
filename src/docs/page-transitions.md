# 页面转场动画文档

## 概述

PandaHabit 应用使用精美的中国风页面转场动画，为用户提供流畅且富有文化特色的页面切换体验。本文档描述了应用中使用的页面转场动画类型、实现方式和最佳实践。

## 页面转场动画类型

PandaHabit 应用提供了多种中国风页面转场动画类型，每种类型都有其独特的视觉效果和适用场景。

### 1. 基础转场 (Basic)

简单的淡入淡出和位移效果，适用于设置页面等功能性页面。

```tsx
<EnhancedPageTransition type="basic">
  <SettingsPage />
</EnhancedPageTransition>
```

### 2. 水墨扩散 (Ink Spread)

模拟水墨在宣纸上扩散的效果，适用于首页等重要页面。

```tsx
<EnhancedPageTransition type="inkSpread">
  <HomePage />
</EnhancedPageTransition>
```

### 3. 卷轴展开 (Scroll Unroll)

模拟中国传统卷轴展开的效果，适用于任务页面和通行证页面。

```tsx
<EnhancedPageTransition type="scrollUnroll">
  <TasksPage />
</EnhancedPageTransition>
```

### 4. 竹帘下降 (Bamboo Blind)

模拟竹帘从上方下降的效果，适用于挑战页面。

```tsx
<EnhancedPageTransition type="bambooBlind">
  <ChallengesPage />
</EnhancedPageTransition>
```

### 5. 金光闪耀 (Golden Glow)

模拟金光闪耀的效果，适用于能力页面、商店页面和VIP福利页面。

```tsx
<EnhancedPageTransition type="goldenGlow">
  <StorePage />
</EnhancedPageTransition>
```

### 6. 飘落的竹叶 (Falling Leaves)

页面内容显示时伴随着飘落的竹叶效果，适用于奖励页面。

```tsx
<EnhancedPageTransition type="fallingLeaves">
  <TimelyRewardsPage />
</EnhancedPageTransition>
```

### 7. 水波纹 (Ripple)

模拟水波纹扩散的效果，适用于茶室页面。

```tsx
<EnhancedPageTransition type="ripple">
  <TeaRoomPage />
</EnhancedPageTransition>
```

### 8. 云雾缭绕 (Misty)

模拟云雾缭绕的效果，适用于头像框展示页面。

```tsx
<EnhancedPageTransition type="misty">
  <AvatarFrameShowcase />
</EnhancedPageTransition>
```

### 9. 自动选择 (Auto)

根据页面路径自动选择适合的转场动画类型。

```tsx
<EnhancedPageTransition type="auto">
  <SomePage />
</EnhancedPageTransition>
```

## 实现方式

页面转场动画使用 Framer Motion 库实现，通过 `EnhancedPageTransition` 组件封装了各种转场效果。该组件接受以下属性：

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| type | PageTransitionType | 'auto' | 转场动画类型 |
| className | string | '' | CSS类名 |
| showDecorations | boolean | true | 是否显示装饰元素 |
| decorationColor | string | '#88B04B' | 装饰元素颜色 |
| decorationOpacity | number | 0.2 | 装饰元素透明度 |

## 路由配置

在 `router.tsx` 文件中，我们使用 `EnhancedPageTransition` 组件包装每个页面组件，并根据页面特性选择适合的转场动画类型。

```tsx
<Routes location={location} key={location.pathname}>
  <Route path="/" element={
    <EnhancedPageTransition type="auto" className={`page-type-inkSpread`}>
      <HomePage />
    </EnhancedPageTransition>
  } />
  <Route path="/tasks" element={
    <EnhancedPageTransition type="auto" className={`page-type-scrollUnroll`}>
      <TasksPage />
    </EnhancedPageTransition>
  } />
  {/* 其他路由... */}
</Routes>
```

## 页面组件修改

为了避免重复的动画效果，我们需要移除页面组件中原有的页面转场动画代码。例如，将：

```tsx
<motion.div
  className="page-container"
  variants={pageTransition}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  {/* 页面内容 */}
</motion.div>
```

修改为：

```tsx
<div className="page-container">
  {/* 页面内容 */}
</div>
```

## 性能优化

为了确保页面转场动画在各种设备上都能流畅运行，我们采取了以下优化措施：

1. **响应式调整**：在移动设备上降低装饰元素的不透明度，减少视觉干扰。
2. **减少动画**：对于偏好减少动画的用户，隐藏装饰元素，简化过渡效果。
3. **条件渲染**：只在需要时渲染装饰元素，减少不必要的DOM节点。
4. **优化动画属性**：优先使用 GPU 加速的动画属性，如 `transform` 和 `opacity`。

## 最佳实践

1. **保持一致性**：为同类型的页面使用相同的转场动画，保持用户体验的一致性。
2. **考虑页面内容**：根据页面内容选择适合的转场动画，例如，任务页面使用卷轴展开效果，茶室页面使用水波纹效果。
3. **避免过度使用**：不要在页面内部使用过多的动画效果，以免分散用户注意力。
4. **考虑可访问性**：为有特殊需求的用户提供关闭或简化动画的选项。

## 示例

### 基础示例

```tsx
import EnhancedPageTransition from '@/components/animation/EnhancedPageTransition';

const MyPage = () => {
  return (
    <EnhancedPageTransition type="inkSpread">
      <div className="page-content">
        <h1>页面标题</h1>
        <p>页面内容</p>
      </div>
    </EnhancedPageTransition>
  );
};
```

### 自定义装饰元素

```tsx
import EnhancedPageTransition from '@/components/animation/EnhancedPageTransition';

const MyPage = () => {
  return (
    <EnhancedPageTransition
      type="fallingLeaves"
      decorationColor="#FF6B6B"
      decorationOpacity={0.3}
    >
      <div className="page-content">
        <h1>页面标题</h1>
        <p>页面内容</p>
      </div>
    </EnhancedPageTransition>
  );
};
```

### 禁用装饰元素

```tsx
import EnhancedPageTransition from '@/components/animation/EnhancedPageTransition';

const MyPage = () => {
  return (
    <EnhancedPageTransition
      type="basic"
      showDecorations={false}
    >
      <div className="page-content">
        <h1>页面标题</h1>
        <p>页面内容</p>
      </div>
    </EnhancedPageTransition>
  );
};
```
