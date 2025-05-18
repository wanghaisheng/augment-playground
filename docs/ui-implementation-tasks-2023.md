# PandaHabit UI 实现任务清单 2023

## 概述

本文档基于对现有实现页面与设计文档的深入对比分析，以及对组件库中带有"optimized"、"enhanced"前缀或"Next"后缀组件的评估，整理了需要实现或更新的UI任务。

## 1. 组件迁移与整理

### 1.1 组件评估与废弃

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 1.1.1 | 创建`src/components/deprecated`目录 | P0 | 待开始 | 无 | 0.5 |
| 1.1.2 | 评估所有带有"optimized"、"enhanced"前缀的组件 | P0 | 待开始 | 1.1.1 | 4 |
| 1.1.3 | 评估所有带有"Next"后缀的组件 | P0 | 待开始 | 1.1.1 | 2 |
| 1.1.4 | 创建组件迁移计划文档 | P0 | 待开始 | 1.1.2, 1.1.3 | 2 |

### 1.2 核心组件迁移

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 1.2.1 | 迁移`Button`到`EnhancedAnimatedButton` | P1 | 待开始 | 1.1.4 | 3 |
| 1.2.2 | 迁移`TextArea`到`EnhancedTextArea` | P1 | 待开始 | 1.1.4 | 3 |
| 1.2.3 | 迁移`AnimatedItem`到`OptimizedAnimatedItem` | P1 | 待开始 | 1.1.4 | 3 |
| 1.2.4 | 迁移`PageTransition`到`EnhancedPageTransition` | P1 | 待开始 | 1.1.4 | 3 |
| 1.2.5 | 迁移`ReflectionModule`到`EnhancedReflectionModule` | P1 | 待开始 | 1.1.4 | 4 |

### 1.3 功能组件迁移

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 1.3.1 | 迁移任务相关组件 | P2 | 待开始 | 1.2.1-1.2.5 | 6 |
| 1.3.2 | 迁移反思相关组件 | P2 | 待开始 | 1.2.1-1.2.5 | 6 |
| 1.3.3 | 迁移熊猫相关组件 | P2 | 待开始 | 1.2.1-1.2.5 | 6 |

## 2. 页面实现与更新

### 2.1 熊猫互动/详情页

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 2.1.1 | 创建`src/components/panda/PandaStatusTab.tsx` | P1 | 待开始 | 1.2.3 | 4 |
| 2.1.2 | 创建`src/components/panda/PandaSkinTab.tsx` | P1 | 待开始 | 1.2.3 | 4 |
| 2.1.3 | 创建`src/components/panda/PandaInteractionTab.tsx` | P1 | 待开始 | 1.2.3 | 4 |
| 2.1.4 | 创建`src/pages/PandaInteractionPage.tsx` | P1 | 待开始 | 2.1.1-2.1.3 | 6 |
| 2.1.5 | 更新路由配置 | P1 | 待开始 | 2.1.4 | 1 |

### 2.2 心情打卡/反思模块

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 2.2.1 | 重构`TeaRoomPage`为`MoodCheckPage` | P1 | 待开始 | 1.2.5 | 8 |
| 2.2.2 | 创建`src/components/mood/MoodSelector.tsx` | P1 | 待开始 | 无 | 4 |
| 2.2.3 | 创建`src/components/mood/ReflectionInput.tsx` | P1 | 待开始 | 1.2.2 | 4 |
| 2.2.4 | 创建`src/components/mood/MoodHistory.tsx` | P1 | 待开始 | 1.2.3 | 4 |
| 2.2.5 | 更新路由配置 | P1 | 待开始 | 2.2.1 | 1 |

### 2.3 个人资料/设置页

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 2.3.1 | 创建`src/components/profile/UserInfoSection.tsx` | P1 | 待开始 | 无 | 3 |
| 2.3.2 | 创建`src/components/profile/UserStatsSection.tsx` | P1 | 待开始 | 无 | 3 |
| 2.3.3 | 创建`src/components/profile/AchievementsSection.tsx` | P1 | 待开始 | 无 | 4 |
| 2.3.4 | 更新`src/pages/SettingsPage.tsx` | P1 | 待开始 | 2.3.1-2.3.3 | 6 |
| 2.3.5 | 创建`src/pages/ProfilePage.tsx` | P1 | 待开始 | 2.3.1-2.3.3 | 6 |
| 2.3.6 | 更新路由配置 | P1 | 待开始 | 2.3.4, 2.3.5 | 1 |

### 2.4 订阅选择页

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 2.4.1 | 创建`src/components/subscription/SubscriptionPlanCard.tsx` | P2 | 待开始 | 无 | 4 |
| 2.4.2 | 创建`src/components/subscription/BonusGiftSection.tsx` | P2 | 待开始 | 无 | 3 |
| 2.4.3 | 创建`src/pages/SubscriptionPage.tsx` | P2 | 待开始 | 2.4.1, 2.4.2 | 6 |
| 2.4.4 | 更新路由配置 | P2 | 待开始 | 2.4.3 | 1 |

### 2.5 通知中心/消息页

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 2.5.1 | 创建`src/components/notification/SystemNotificationList.tsx` | P2 | 待开始 | 1.2.3 | 4 |
| 2.5.2 | 创建`src/components/notification/MessageList.tsx` | P2 | 待开始 | 1.2.3 | 4 |
| 2.5.3 | 创建`src/pages/NotificationPage.tsx` | P2 | 待开始 | 2.5.1, 2.5.2 | 6 |
| 2.5.4 | 更新路由配置 | P2 | 待开始 | 2.5.3 | 1 |

### 2.6 帮助与反馈/FAQ页

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 2.6.1 | 创建`src/components/help/FAQItem.tsx` | P3 | 待开始 | 无 | 2 |
| 2.6.2 | 创建`src/components/help/FAQList.tsx` | P3 | 待开始 | 2.6.1 | 3 |
| 2.6.3 | 创建`src/components/help/FeedbackForm.tsx` | P3 | 待开始 | 1.2.2 | 4 |
| 2.6.4 | 创建`src/pages/HelpPage.tsx` | P3 | 待开始 | 2.6.1-2.6.3 | 6 |
| 2.6.5 | 更新路由配置 | P3 | 待开始 | 2.6.4 | 1 |

## 3. 通用组件实现

### 3.1 传统窗棂样式弹窗

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 3.1.1 | 创建`src/components/common/TraditionalWindowModal.tsx` | P1 | 待开始 | 无 | 6 |
| 3.1.2 | 创建`src/components/common/TraditionalWindowModalProvider.tsx` | P1 | 待开始 | 3.1.1 | 4 |
| 3.1.3 | 创建`src/hooks/useTraditionalWindowModal.tsx` | P1 | 待开始 | 3.1.2 | 2 |
| 3.1.4 | 更新现有弹窗使用传统窗棂样式 | P2 | 待开始 | 3.1.1-3.1.3 | 8 |

### 3.2 水墨画风格图标

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 3.2.1 | 创建`src/components/icons/InkWashIcon.tsx` | P2 | 待开始 | 无 | 4 |
| 3.2.2 | 创建常用图标的水墨画风格版本 | P2 | 待开始 | 3.2.1 | 12 |
| 3.2.3 | 更新现有组件使用水墨画风格图标 | P3 | 待开始 | 3.2.1, 3.2.2 | 8 |

### 3.3 骨架屏组件

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 3.3.1 | 创建`src/components/skeleton/PandaInteractionPageSkeleton.tsx` | P2 | 待开始 | 无 | 3 |
| 3.3.2 | 创建`src/components/skeleton/MoodCheckPageSkeleton.tsx` | P2 | 待开始 | 无 | 3 |
| 3.3.3 | 创建`src/components/skeleton/ProfilePageSkeleton.tsx` | P2 | 待开始 | 无 | 3 |
| 3.3.4 | 创建`src/components/skeleton/SubscriptionPageSkeleton.tsx` | P2 | 待开始 | 无 | 3 |
| 3.3.5 | 创建`src/components/skeleton/NotificationPageSkeleton.tsx` | P2 | 待开始 | 无 | 3 |
| 3.3.6 | 创建`src/components/skeleton/HelpPageSkeleton.tsx` | P3 | 待开始 | 无 | 3 |

## 4. 多语言支持

### 4.1 类型定义

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 4.1.1 | 在`src/types/index.ts`中添加熊猫互动页面标签类型 | P1 | 待开始 | 无 | 1 |
| 4.1.2 | 在`src/types/index.ts`中添加心情打卡页面标签类型 | P1 | 待开始 | 无 | 1 |
| 4.1.3 | 在`src/types/index.ts`中添加个人资料页面标签类型 | P1 | 待开始 | 无 | 1 |
| 4.1.4 | 在`src/types/index.ts`中添加订阅页面标签类型 | P2 | 待开始 | 无 | 1 |
| 4.1.5 | 在`src/types/index.ts`中添加通知页面标签类型 | P2 | 待开始 | 无 | 1 |
| 4.1.6 | 在`src/types/index.ts`中添加帮助页面标签类型 | P3 | 待开始 | 无 | 1 |

### 4.2 本地化服务

| ID | 任务 | 优先级 | 状态 | 依赖 | 估计工时(小时) |
|----|------|--------|------|------|---------------|
| 4.2.1 | 创建`src/services/localizedContentService/fetchPandaInteractionPageView.ts` | P1 | 待开始 | 4.1.1 | 2 |
| 4.2.2 | 创建`src/services/localizedContentService/fetchMoodCheckPageView.ts` | P1 | 待开始 | 4.1.2 | 2 |
| 4.2.3 | 创建`src/services/localizedContentService/fetchProfilePageView.ts` | P1 | 待开始 | 4.1.3 | 2 |
| 4.2.4 | 创建`src/services/localizedContentService/fetchSubscriptionPageView.ts` | P2 | 待开始 | 4.1.4 | 2 |
| 4.2.5 | 创建`src/services/localizedContentService/fetchNotificationPageView.ts` | P2 | 待开始 | 4.1.5 | 2 |
| 4.2.6 | 创建`src/services/localizedContentService/fetchHelpPageView.ts` | P3 | 待开始 | 4.1.6 | 2 |

## 5. 实施计划

### 第一阶段（1-2周）

1. 完成组件评估与废弃（任务1.1.1-1.1.4）
2. 完成核心组件迁移（任务1.2.1-1.2.5）
3. 实现传统窗棂样式弹窗（任务3.1.1-3.1.3）
4. 开始熊猫互动页面和心情打卡页面的实现（任务2.1.1-2.1.3, 2.2.1-2.2.3）

### 第二阶段（2-3周）

1. 完成熊猫互动页面和心情打卡页面（任务2.1.4-2.1.5, 2.2.4-2.2.5）
2. 实现个人资料/设置页（任务2.3.1-2.3.6）
3. 开始功能组件迁移（任务1.3.1-1.3.3）
4. 开始水墨画风格图标实现（任务3.2.1-3.2.2）

### 第三阶段（3-4周）

1. 实现订阅选择页和通知中心页（任务2.4.1-2.4.4, 2.5.1-2.5.4）
2. 完成骨架屏组件（任务3.3.1-3.3.5）
3. 更新现有弹窗使用传统窗棂样式（任务3.1.4）
4. 开始帮助与反馈页面实现（任务2.6.1-2.6.3）

### 第四阶段（4-5周）

1. 完成帮助与反馈页面（任务2.6.4-2.6.5）
2. 完成水墨画风格图标更新（任务3.2.3）
3. 完成剩余骨架屏组件（任务3.3.6）
4. 最终测试和优化

## 6. 注意事项

1. **组件迁移**
   - 确保在迁移过程中不破坏现有功能
   - 为每个废弃的组件添加明确的废弃注释
   - 保留重定向导出，以避免破坏现有代码

2. **多语言支持**
   - 确保所有新组件和页面都支持多语言
   - 避免硬编码文本
   - 使用类型安全的标签定义

3. **性能考虑**
   - 使用React.memo优化渲染性能
   - 实现懒加载和代码分割
   - 使用骨架屏提高感知性能

4. **设计一致性**
   - 遵循华丽游戏风格设计规范
   - 保持视觉元素的一致性
   - 使用统一的动画和过渡效果
