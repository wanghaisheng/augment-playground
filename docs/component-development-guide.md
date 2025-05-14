# 组件开发指南

本文档提供了PandaHabit应用中组件开发的指南和最佳实践，特别关注多语言支持和组件复用。

## 目录

1. [多语言支持](#多语言支持)
2. [组件设计原则](#组件设计原则)
3. [通用组件](#通用组件)
4. [数据刷新与局部更新](#数据刷新与局部更新)
5. [最佳实践](#最佳实践)

## 多语言支持

PandaHabit应用支持中文和英文两种语言，所有面向用户的文本都应该使用多语言支持机制。

### 多语言架构

应用使用以下架构实现多语言支持：

1. **LanguageProvider**：管理全局语言状态（`en` | `zh`）
2. **localizedContentService**：提供本地化内容的服务
3. **useLocalizedView**：用于获取页面级别的本地化内容
4. **useComponentLabels**：用于获取组件级别的本地化内容

### 组件中使用多语言

对于通用组件，应使用`useComponentLabels`钩子获取本地化标签：

```tsx
import { useComponentLabels } from '@/hooks/useComponentLabels';

const MyComponent = () => {
  const { labels } = useComponentLabels();
  
  return (
    <div>
      <h2>{labels.someSection.title}</h2>
      <p>{labels.someSection.description}</p>
      <button>{labels.button.submit}</button>
    </div>
  );
};
```

对于页面组件，应使用`useLocalizedView`钩子获取页面级别的本地化内容：

```tsx
const {
  labels: pageLabels,
  isPending,
  isError,
  error,
  refetch
} = useLocalizedView<null, PageViewLabelsBundle>(
  'pageViewContent',
  fetchPageView
);

// 处理加载状态
if (isPending && !pageLabels) {
  return <LoadingSpinner variant="jade" type="content" />;
}

// 处理错误状态
if (isError && !pageLabels) {
  return (
    <div className="page-content">
      <ErrorDisplay error={error} onRetry={refetch} />
    </div>
  );
}
```

### 添加新的本地化标签

1. 在`src/types/index.ts`中定义标签类型
2. 在`src/services/localizedContentService.ts`中添加获取标签的函数
3. 在数据库中添加对应的标签记录

## 组件设计原则

### 1. 组件分类

PandaHabit应用中的组件分为以下几类：

- **通用组件**：如Button、LoadingSpinner、ErrorDisplay等，位于`components/common`目录
- **布局组件**：如AppShell、Header、Navigation等，位于`components/layout`目录
- **功能组件**：如TaskList、PandaAvatar等，位于对应功能的目录
- **页面组件**：如HomePage、SettingsPage等，位于`pages`目录

### 2. 组件接口设计

- 组件应该有明确的接口定义（TypeScript接口）
- 提供合理的默认值和可选参数
- 使用解构赋值接收props
- 使用函数组件和React Hooks

### 3. 组件文档

每个组件都应该有清晰的文档注释，包括：

- 组件的功能描述
- 参数说明
- 使用示例

```tsx
/**
 * 按钮组件，支持不同样式和加载状态
 *
 * @param variant - 按钮样式：'primary'（默认）, 'secondary', 'jade'（游戏风格绿色）, 'gold'（高级）
 * @param isLoading - 是否显示加载状态
 * @param loadingText - 加载状态显示的文本（覆盖默认本地化文本）
 */
```

## 通用组件

PandaHabit应用提供了以下通用组件，应优先使用这些组件以保持UI一致性：

### Button

按钮组件，支持不同样式和加载状态。

```tsx
<Button 
  variant="jade" 
  isLoading={isSubmitting} 
  onClick={handleSubmit}
>
  提交
</Button>
```

### LoadingSpinner

加载指示器组件，支持游戏风格。

```tsx
<LoadingSpinner 
  variant="jade" 
  type="data" 
  text="自定义加载文本" 
/>
```

### ErrorDisplay

错误显示组件，用于展示错误信息。

```tsx
<ErrorDisplay 
  error={error} 
  onRetry={handleRetry} 
  errorType="network" 
/>
```

### DataLoader

数据加载组件，处理加载、错误和空数据状态。

```tsx
<DataLoader
  isLoading={isLoading}
  isError={isError}
  error={error}
  data={data}
  onRetry={refetch}
>
  {(data) => (
    // 渲染数据
    <div>{data.name}</div>
  )}
</DataLoader>
```

### Modal

模态框组件，用于显示弹出内容。

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  closeOnOutsideClick={true}
>
  <div>模态框内容</div>
</Modal>
```

## 数据刷新与局部更新

PandaHabit应用使用DataRefreshProvider实现数据同步后的局部UI更新。

### 使用DataRefreshProvider

```tsx
// 监听多个表
useDataRefresh(['table1', 'table2'], (event) => {
  // 处理数据刷新
});

// 或监听单个表
useTableRefresh('tableName', (data) => {
  // 处理表数据刷新
});
```

## 最佳实践

### 1. 避免硬编码文本

❌ 错误示例：
```tsx
<button>提交</button>
<p>暂无数据</p>
```

✅ 正确示例：
```tsx
<button>{labels.button.submit}</button>
<p>{labels.emptyState.noData}</p>
```

### 2. 使用组件而非直接使用HTML元素

❌ 错误示例：
```tsx
<button className="button-primary" onClick={handleClick}>
  {isLoading ? "加载中..." : "提交"}
</button>
```

✅ 正确示例：
```tsx
<Button 
  variant="primary" 
  isLoading={isLoading} 
  onClick={handleClick}
>
  提交
</Button>
```

### 3. 处理加载和错误状态

❌ 错误示例：
```tsx
if (isLoading) return <div>加载中...</div>;
if (isError) return <div>出错了</div>;
```

✅ 正确示例：
```tsx
if (isLoading) return <LoadingSpinner type="data" />;
if (isError) return <ErrorDisplay error={error} onRetry={refetch} />;
```

### 4. 使用DataLoader组件处理数据加载

❌ 错误示例：
```tsx
if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorDisplay error={error} />;
if (!data) return <div>暂无数据</div>;
return <div>{data.name}</div>;
```

✅ 正确示例：
```tsx
<DataLoader
  isLoading={isLoading}
  isError={isError}
  error={error}
  data={data}
  onRetry={refetch}
>
  {(data) => <div>{data.name}</div>}
</DataLoader>
```

### 5. 使用局部刷新而非整页刷新

❌ 错误示例：
```tsx
// 数据变化时刷新整个组件
useEffect(() => {
  fetchData();
}, [someData]);
```

✅ 正确示例：
```tsx
// 监听特定表的变化
useTableRefresh('tableName', (updatedData) => {
  // 只更新受影响的部分
  updateLocalState(updatedData);
});
```
