# PandaHabit 多语言实现指南

本文档提供了在 PandaHabit 应用中实现和维护多语言支持的详细指南，包括组件级别的多语言支持、标签管理和最佳实践。

## 多语言架构概述

PandaHabit 使用以下架构来支持多语言：

1. **LanguageProvider**：全局语言上下文提供者，管理当前选择的语言
2. **useLocalizedView**：自定义钩子，用于获取特定页面或视图的本地化内容
3. **localizedContentService**：服务层，负责从数据库获取本地化标签
4. **标签数据库**：使用 Dexie.js 存储所有语言的标签

## 组件级别多语言支持实现

### 1. 组件接口定义

所有需要显示文本的组件都应该接受 `labels` 属性：

```typescript
interface ComponentProps {
  // 其他属性
  labels?: {
    // 组件需要的所有文本标签
    title?: string;
    description?: string;
    buttonText?: string;
    // 其他标签...
  };
}
```

### 2. 组件实现

组件应该使用传入的标签，并提供英文默认值作为回退：

```typescript
const MyComponent: React.FC<ComponentProps> = ({ labels, ...props }) => {
  return (
    <div>
      <h2>{labels?.title || "Default Title"}</h2>
      <p>{labels?.description || "Default description text."}</p>
      <button>{labels?.buttonText || "Click Me"}</button>
    </div>
  );
};
```

### 3. 嵌套组件

对于包含子组件的组件，应该将相关标签传递给子组件：

```typescript
const ParentComponent: React.FC<ParentProps> = ({ labels, ...props }) => {
  return (
    <div>
      <h1>{labels?.title || "Parent Title"}</h1>
      <ChildComponent 
        labels={labels?.childComponent}
        {...childProps} 
      />
    </div>
  );
};
```

## 页面级别多语言支持实现

### 1. 使用 useLocalizedView 钩子

所有页面组件都应该使用 `useLocalizedView` 钩子获取本地化内容：

```typescript
const MyPage: React.FC = () => {
  const {
    labels: pageLabels,
    data,
    isPending,
    isError,
    error,
    refetch
  } = useLocalizedView<MyPageDataType, MyPageLabelsBundle>(
    'myPageViewContent',
    fetchMyPageView
  );

  // 使用 pageLabels 渲染页面内容
  // ...
};
```

### 2. 传递标签给子组件

页面组件应该将相关标签传递给子组件：

```typescript
<MyComponent 
  labels={pageLabels?.myComponent}
  // 其他属性
/>
```

## 标签管理

### 1. 标签组织

标签应该按照以下层次结构组织：

```
[页面/视图].[组件].[标签]
```

例如：

- `homeView.welcomeSection.title`
- `challengesView.challengeCard.statusActive`
- `storeView.itemCard.buyButton`

### 2. 标签包类型定义

为每个页面或视图定义标签包类型：

```typescript
export interface ChallengesPageViewLabelsBundle {
  pageTitle: string;
  loadingMessage?: string;
  errorTitle?: string;
  retryButtonText?: string;
  filters?: {
    statusLabel?: string;
    typeLabel?: string;
    // 其他过滤器标签
  };
  challengeCard?: {
    statusActive?: string;
    statusCompleted?: string;
    // 其他卡片标签
  };
  // 其他组件标签
}
```

### 3. 添加新标签

当添加新标签时，需要：

1. 更新相关的标签包类型定义
2. 在数据库中添加所有支持语言的标签
3. 更新组件以使用新标签

## 最佳实践

### 1. 组件设计

- 所有显示文本的组件都应该支持多语言
- 组件应该接受 `labels` 属性，并为所有文本提供英文默认值
- 避免在组件中硬编码任何语言的文本

### 2. 错误处理

- 错误消息应该使用多语言标签
- 提供有意义的默认英文错误消息作为回退

### 3. 动态内容

- 对于动态生成的内容，考虑使用模板字符串和占位符
- 确保日期、数字和货币格式化考虑语言特定的格式

### 4. 测试

- 为每个组件编写测试，确保它们在不同语言设置下正确渲染
- 测试语言切换功能，确保所有组件正确更新

## 示例实现

### 组件示例：ChallengeCard

```typescript
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

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  onClick, 
  onComplete,
  labels 
}) => {
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

  // 组件其余部分...
};
```

### 页面示例：ChallengesPage

```typescript
const ChallengesPage: React.FC = () => {
  const {
    labels: pageLabels,
    data,
    isPending,
    isError,
    error,
    refetch
  } = useLocalizedView<ChallengesPageDataPayload, ChallengesPageViewLabelsBundle>(
    'challengesPageViewContent',
    fetchChallengesPageView
  );

  // 渲染挑战卡片
  const renderChallenges = () => {
    return challenges.map(challenge => (
      <ChallengeCard
        key={challenge.id}
        challenge={challenge}
        onClick={handleChallengeClick}
        onComplete={handleCompleteChallenge}
        labels={pageLabels?.challengeCard}
      />
    ));
  };

  // 页面其余部分...
};
```

## 结论

通过遵循本指南中的原则和最佳实践，PandaHabit 应用可以提供一致的多语言体验，并为未来添加更多语言支持奠定基础。正确实现多语言支持不仅提高了应用的可访问性，还增强了用户体验。
