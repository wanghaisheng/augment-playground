# 骨架屏加载指南

## 概述

骨架屏是一种在内容加载过程中显示页面结构轮廓的技术，可以显著改善用户体验。相比于传统的加载指示器（如旋转图标），骨架屏能够：

1. 减少用户感知的加载时间
2. 提供更平滑的视觉过渡
3. 减少布局偏移，提高页面稳定性
4. 为用户提供即将加载内容的预期

本指南介绍如何在PandaHabit应用中使用骨架屏组件。

## 可用的骨架屏组件

### 基础组件

1. **SkeletonBase** - 基础骨架组件，提供脉动动画效果
2. **SkeletonText** - 文本骨架组件，用于文本内容的占位
3. **SkeletonImage** - 图像骨架组件，用于图像的占位
4. **SkeletonCard** - 卡片骨架组件，用于卡片的占位
5. **SkeletonList** - 列表骨架组件，用于列表的占位

### 专用组件

1. **TaskCardSkeleton** - 任务卡片骨架
2. **ChallengeCardSkeleton** - 挑战卡片骨架
3. **StoreItemCardSkeleton** - 商店物品卡片骨架
4. **BambooSpotCardSkeleton** - 竹子收集点卡片骨架
5. **AbilityCardSkeleton** - 能力卡片骨架

## 使用方法

### 基础用法

```tsx
import { SkeletonText, SkeletonImage } from '@/components/skeleton';

// 在加载状态中使用
const MyComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  // ...加载数据的逻辑

  return (
    <div>
      {isLoading ? (
        <div>
          <SkeletonImage width="100%" height="200px" />
          <SkeletonText lines={3} />
        </div>
      ) : (
        // 渲染实际内容
        <div>实际内容</div>
      )}
    </div>
  );
};
```

### 使用专用组件

```tsx
import { TaskCardSkeleton } from '@/components/skeleton';

// 在任务列表加载状态中使用
const TaskListComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  // ...加载任务数据的逻辑

  return (
    <div>
      {isLoading ? (
        <div className="task-list-skeleton">
          <TaskCardSkeleton variant="jade" />
          <TaskCardSkeleton variant="jade" />
          <TaskCardSkeleton variant="jade" />
        </div>
      ) : (
        // 渲染实际任务列表
        <div>实际任务列表</div>
      )}
    </div>
  );
};
```

### 与DataLoader组件集成

```tsx
import { DataLoader } from '@/components/common';
import { TaskCardSkeleton } from '@/components/skeleton';

const MyComponent = () => {
  const { data, isLoading, isError, error } = useMyData();

  return (
    <DataLoader
      isLoading={isLoading}
      isError={isError}
      error={error}
      data={data}
      useSkeleton={true} // 启用骨架屏
      skeletonComponent={
        <div className="my-skeleton-container">
          <TaskCardSkeleton variant="jade" />
          <TaskCardSkeleton variant="jade" />
        </div>
      }
    >
      {(loadedData) => (
        // 渲染实际内容
        <div>实际内容</div>
      )}
    </DataLoader>
  );
};
```

## 组件API

### SkeletonBase

```tsx
interface SkeletonBaseProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  animate?: boolean;
  variant?: 'default' | 'jade' | 'gold';
}
```

### SkeletonText

```tsx
interface SkeletonTextProps {
  lines?: number;
  width?: string | number | (string | number)[];
  height?: string | number;
  className?: string;
  variant?: 'default' | 'jade' | 'gold';
  lineClassName?: string;
  lastLineWidth?: string | number;
}
```

### SkeletonImage

```tsx
interface SkeletonImageProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'default' | 'jade' | 'gold';
  showIcon?: boolean;
}
```

### SkeletonCard

```tsx
interface SkeletonCardProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'default' | 'jade' | 'gold';
  hasImage?: boolean;
  imageHeight?: string | number;
  hasHeader?: boolean;
  hasFooter?: boolean;
  headerHeight?: string | number;
  footerHeight?: string | number;
  contentLines?: number;
  rounded?: string | number;
  padding?: string | number;
}
```

### SkeletonList

```tsx
interface SkeletonListProps {
  count?: number;
  component?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  gap?: string | number;
  layout?: 'grid' | 'list';
  columns?: number;
  variant?: 'default' | 'jade' | 'gold';
}
```

## 最佳实践

1. **匹配实际内容结构** - 骨架屏应尽可能匹配实际内容的结构和布局，以减少加载完成后的视觉跳跃。

2. **使用适当的变体** - 根据应用的主题选择适当的变体颜色（default、jade、gold）。

3. **避免过度使用** - 骨架屏适用于需要较长加载时间的内容。对于加载时间极短的内容，可能不需要骨架屏。

4. **考虑响应式设计** - 确保骨架屏在不同屏幕尺寸下都能正确显示。

5. **保持一致性** - 在整个应用中保持骨架屏的一致风格和行为。

## 示例

### 任务列表骨架屏

```tsx
<div className="task-list-skeleton">
  <TaskCardSkeleton variant="jade" />
  <TaskCardSkeleton variant="jade" />
  <TaskCardSkeleton variant="jade" />
</div>
```

### 商店物品网格骨架屏

```tsx
<div className="store-item-grid-skeleton grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <StoreItemCardSkeleton variant="jade" />
  <StoreItemCardSkeleton variant="jade" />
  <StoreItemCardSkeleton variant="jade" isVip={true} />
  <StoreItemCardSkeleton variant="jade" />
</div>
```

### 自定义骨架屏

```tsx
<div className="custom-skeleton-container p-4">
  <div className="flex items-center mb-4">
    <SkeletonBase width="4rem" height="4rem" borderRadius="50%" className="mr-4" variant="jade" />
    <div className="flex-1">
      <SkeletonText lines={1} height="1.5rem" className="mb-2" variant="jade" />
      <SkeletonText lines={1} width="60%" height="1rem" variant="jade" />
    </div>
  </div>
  <SkeletonText lines={3} className="mb-4" variant="jade" />
  <div className="flex justify-between">
    <SkeletonBase width="30%" height="2rem" borderRadius="0.25rem" variant="jade" />
    <SkeletonBase width="30%" height="2rem" borderRadius="0.25rem" variant="jade" />
  </div>
</div>
```
