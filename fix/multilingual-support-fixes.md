# PandaHabit 多语言支持修复文档

## 问题概述

在对 PandaHabit 应用进行多语言支持检查时，发现许多组件中存在硬编码的中文文本，导致即使用户选择了英语作为界面语言，部分界面元素仍然显示中文。这种不一致性影响了用户体验，需要系统性地修复。

## 问题分类

### 1. 组件级别的本地化缺失

- 许多组件没有接收或正确使用多语言标签
- 组件内部的文本（按钮、标签、描述等）直接硬编码为中文
- 错误消息和状态文本通常是硬编码的中文

### 2. 标签作用域不完整

- 数据库中可能缺少某些组件的英文标签
- 标签的作用域（scopeKey）设置不正确，导致组件无法获取正确的标签

### 3. 组件未使用本地化钩子

- 一些组件没有使用 `useLocalizedView` 钩子
- 父组件获取了本地化标签，但没有正确地将这些标签传递给子组件

## 问题组件清单

### 反思和情绪相关组件

1. **MoodTracker.tsx**
   - 虽然已添加 labels 参数，但仍有部分中文文本未使用标签
   - 例如："强度:"、"暂无情绪记录"等

2. **EnhancedReflectionModule.tsx**
   - 包含大量硬编码中文文本
   - 例如："我注意到你的情绪有些波动。想聊聊吗？"、"任务未能按时完成。这没关系，我们可以一起反思一下。"
   - 生成建议行动的函数中有硬编码中文标签如"焦虑"、"压力"、"疲惫"等

3. **ReflectionModule.tsx**
   - 包含硬编码中文文本
   - 例如："分享你的想法（可以是任何感受、困难或成就）"、"继续"、"谢谢你的分享"等

### 游戏和挑战相关组件

1. **ChallengeCard.tsx**
   - 状态文本硬编码为中文："进行中"、"已完成"、"已过期"、"即将开始"
   - 日期标签硬编码为中文："开始:"、"结束:"、"完成于:"
   - 按钮文本硬编码为中文："完成挑战"、"进行中..."

2. **ChallengeDiscoveryCard.tsx**
   - 错误信息和提示信息硬编码为中文："无法加载挑战数据"、"加载挑战失败，请重试"等
   - 日期标签硬编码为中文："开始日期:"、"结束日期:"
   - 按钮文本硬编码为中文："稍后再说"、"接受挑战"

3. **StoreItemCard.tsx**
   - 错误信息硬编码为中文："需要VIP会员才能购买"、"金币不足"、"玉石不足"
   - VIP标签硬编码为中文："VIP专属"
   - 促销标签硬编码为中文："促销"
   - 按钮文本硬编码为中文："购买"

### 任务相关组件

1. **TaskManager.tsx**
   - 默认标签硬编码为中文："任务管理"、"创建新任务"、"全部"、"待办"、"进行中"、"已完成"、"暂无任务"

2. **SubtaskList.tsx**
   - 错误信息硬编码为中文："加载子任务失败，请重试"、"添加子任务失败，请重试"等
   - 按钮和输入框占位符硬编码为中文："添加新子任务..."、"添加"
   - 删除按钮的aria-label硬编码为中文："删除子任务"

3. **TasksPage.tsx**
   - 加载消息硬编码为中文："加载任务页面内容..."

## 解决方案

### 1. 组件级别修复

为每个组件添加标准化的多语言支持：

1. **添加 labels 参数**：
   ```typescript
   interface ComponentProps {
     // 其他属性
     labels?: {
       // 组件需要的所有文本标签
     };
   }
   ```

2. **替换硬编码文本**：
   ```typescript
   // 替换前
   <Button onClick={handleSubmit}>购买</Button>
   
   // 替换后
   <Button onClick={handleSubmit}>{labels?.buyButton || "Buy"}</Button>
   ```

3. **确保英文默认值**：所有标签都应提供英文默认值作为回退

### 2. 类型定义更新

为每个页面视图的标签包添加所有需要的标签：

```typescript
// 例如，为挑战页面添加标签
export interface ChallengesPageViewLabelsBundle {
  pageTitle: string;
  loadingMessage?: string;
  errorTitle?: string;
  retryButtonText?: string;
  filters?: {
    statusLabel?: string;
    typeLabel?: string;
    difficultyLabel?: string;
    allLabel?: string;
    activeLabel?: string;
    completedLabel?: string;
    upcomingLabel?: string;
    // 其他过滤器标签
  };
  challengeCard?: {
    statusActive?: string;
    statusCompleted?: string;
    statusExpired?: string;
    statusUpcoming?: string;
    startLabel?: string;
    endLabel?: string;
    completedOnLabel?: string;
    completeButtonText?: string;
    inProgressText?: string;
  };
  // 其他标签
}
```

### 3. 数据库更新

在 `db.ts` 中添加所有新标签的英文和中文翻译：

```typescript
// 英文标签
{ id: generateId(), languageCode: 'en', scopeKey: 'challengesView.challengeCard.statusActive', value: 'Active' },
{ id: generateId(), languageCode: 'en', scopeKey: 'challengesView.challengeCard.statusCompleted', value: 'Completed' },
// ...

// 中文标签
{ id: generateId(), languageCode: 'zh', scopeKey: 'challengesView.challengeCard.statusActive', value: '进行中' },
{ id: generateId(), languageCode: 'zh', scopeKey: 'challengesView.challengeCard.statusCompleted', value: '已完成' },
// ...
```

### 4. 页面组件更新

确保页面组件正确传递标签给子组件：

```typescript
// 例如，在 ChallengesPage 中
<ChallengeCard 
  challenge={challenge}
  onClick={handleChallengeClick}
  onComplete={handleCompleteChallenge}
  labels={pageLabels?.challengeCard}
/>
```

## 修复优先级

根据用户界面的重要性，建议按以下顺序优先处理：

1. **核心游戏组件**：
   - ChallengeCard.tsx
   - StoreItemCard.tsx
   - TaskCard.tsx

2. **用户交互频繁的组件**：
   - SubtaskList.tsx
   - MoodTracker.tsx
   - TaskManager.tsx

3. **其他支持组件**：
   - EnhancedReflectionModule.tsx
   - ChallengeDiscoveryCard.tsx
   - VipSubscriptionCard.tsx

## 修复示例

以 ChallengeCard.tsx 为例，修复方式如下：

### 修复前：

```typescript
// 获取挑战状态对应的文本
const getStatusText = () => {
  switch (challenge.status) {
    case ChallengeStatus.ACTIVE:
      return '进行中';
    case ChallengeStatus.COMPLETED:
      return '已完成';
    case ChallengeStatus.EXPIRED:
      return '已过期';
    case ChallengeStatus.UPCOMING:
      return '即将开始';
    default:
      return '';
  }
};

// JSX 中
<span>开始: {formatTime(challenge.startDate, false)}</span>
{challenge.endDate && (
  <span>结束: {formatTime(challenge.endDate, false)}</span>
)}

// 按钮文本
{challenge.progress >= 100 ? '完成挑战' : '进行中...'}
```

### 修复后：

```typescript
// 添加 labels 参数到接口
interface ChallengeCardProps {
  challenge: ChallengeRecord;
  onClick?: (challenge: ChallengeRecord) => void;
  onComplete?: (challengeId: number) => void;
  labels?: {
    statusActive?: string;
    statusCompleted?: string;
    statusExpired?: string;
    statusUpcoming?: string;
    startLabel?: string;
    endLabel?: string;
    completedOnLabel?: string;
    completeButtonText?: string;
    inProgressText?: string;
  };
}

// 获取挑战状态对应的文本
const getStatusText = () => {
  switch (challenge.status) {
    case ChallengeStatus.ACTIVE:
      return labels?.statusActive || 'Active';
    case ChallengeStatus.COMPLETED:
      return labels?.statusCompleted || 'Completed';
    case ChallengeStatus.EXPIRED:
      return labels?.statusExpired || 'Expired';
    case ChallengeStatus.UPCOMING:
      return labels?.statusUpcoming || 'Upcoming';
    default:
      return '';
  }
};

// JSX 中
<span>{labels?.startLabel || 'Start'}: {formatTime(challenge.startDate, false)}</span>
{challenge.endDate && (
  <span>{labels?.endLabel || 'End'}: {formatTime(challenge.endDate, false)}</span>
)}

// 按钮文本
{challenge.progress >= 100 ? (labels?.completeButtonText || 'Complete Challenge') : (labels?.inProgressText || 'In Progress...')}
```

## 测试计划

1. **组件级测试**：
   - 为每个修复的组件编写单元测试，确保它们正确使用标签
   - 测试不同语言设置下的组件渲染

2. **集成测试**：
   - 测试页面组件是否正确传递标签给子组件
   - 测试语言切换功能是否正确更新所有组件的文本

3. **用户界面测试**：
   - 在不同语言设置下手动测试应用
   - 确保所有文本都正确显示为选定的语言

## 结论

通过系统性地修复多语言支持问题，PandaHabit 应用将能够为用户提供一致的多语言体验。这些修复不仅提高了应用的质量，还为未来添加更多语言支持奠定了基础。
