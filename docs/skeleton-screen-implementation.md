# 骨架屏实现文档

## 概述

本文档记录了PandaHabit应用中骨架屏加载功能的实现情况。骨架屏是一种在内容加载过程中显示页面结构轮廓的技术，可以显著改善用户体验。

## 实现的骨架屏组件

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

### 页面骨架屏组件

1. **HomePageSkeleton** - 首页骨架屏
2. **TasksPageSkeleton** - 任务页面骨架屏
3. **ChallengesPageSkeleton** - 挑战页面骨架屏
4. **StorePageSkeleton** - 商店页面骨架屏
5. **BambooCollectionPageSkeleton** - 竹子收集页面骨架屏
6. **TeaRoomPageSkeleton** - 茶室页面骨架屏
7. **VipBenefitsPageSkeleton** - VIP福利页面骨架屏
8. **TimelyRewardsPageSkeleton** - 及时奖励页面骨架屏
9. **BattlePassPageSkeleton** - 通行证页面骨架屏

## 页面实现情况

| 页面 | 骨架屏实现 | 备注 |
|------|------------|------|
| HomePage | ✅ | 使用HomePageSkeleton |
| TasksPage | ✅ | 使用TasksPageSkeleton |
| ChallengesPage | ✅ | 使用ChallengesPageSkeleton |
| StorePage | ✅ | 使用StorePageSkeleton |
| BambooCollectionPage | ✅ | 使用BambooCollectionPageSkeleton |
| TeaRoomPage | ✅ | 使用TeaRoomPageSkeleton |
| VipBenefitsPage | ✅ | 使用VipBenefitsPageSkeleton |
| TimelyRewardsPage | ✅ | 使用TimelyRewardsPageSkeleton |
| AbilitiesPage | ✅ | 使用AbilityList组件的isLoading属性 |
| BattlePassPage | ✅ | 使用BattlePassPageSkeleton |

## 组件实现情况

| 组件 | 骨架屏实现 | 备注 |
|------|------------|------|
| AnimatedTaskList | ✅ | 使用TaskCardSkeleton |
| ChallengeList | ✅ | 使用ChallengeCardSkeleton |
| StoreItemList | ✅ | 使用StoreItemCardSkeleton |
| BambooCollectionPanel | ✅ | 使用BambooSpotCardSkeleton |
| AbilityList | ✅ | 使用AbilityCardSkeleton |
| DataLoader | ✅ | 支持自定义骨架屏组件 |

## 骨架屏设计原则

1. **匹配实际内容结构** - 骨架屏的布局和结构与实际内容保持一致，减少加载完成后的视觉跳跃。

2. **使用品牌色调** - 骨架屏使用应用的主题色调（jade、gold等），保持品牌一致性。

3. **动画效果** - 所有骨架屏组件都有脉动动画效果，提示用户内容正在加载。

4. **响应式设计** - 骨架屏组件适应不同屏幕尺寸，保持良好的响应式体验。

5. **渐进式加载** - 对于复杂页面，优先显示页面结构，然后逐步加载内容。

## 骨架屏使用示例

### 页面级骨架屏

```tsx
// 在页面组件中使用
import { HomePageSkeleton } from '@/components/skeleton';

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // ...加载数据的逻辑
  
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="bamboo-frame">
          <HomePageSkeleton />
        </div>
      </div>
    );
  }
  
  // 渲染实际内容
  return (
    // ...
  );
};
```

### 组件级骨架屏

```tsx
// 在列表组件中使用
import { TaskCardSkeleton } from '@/components/skeleton';

const TaskList: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="task-list-skeleton">
        <TaskCardSkeleton variant="jade" />
        <TaskCardSkeleton variant="jade" />
        <TaskCardSkeleton variant="jade" />
      </div>
    );
  }
  
  // 渲染实际任务列表
  return (
    // ...
  );
};
```

## 未来改进

1. **自动生成骨架屏** - 开发工具，根据实际组件结构自动生成匹配的骨架屏。

2. **更细粒度的骨架屏** - 为更多的UI组件创建专用骨架屏。

3. **骨架屏主题系统** - 扩展骨架屏的主题系统，支持更多的颜色变体和样式。

4. **性能优化** - 优化骨架屏的渲染性能，减少不必要的重绘。

5. **动画多样性** - 提供更多的动画选项，如波浪、渐变等效果。
