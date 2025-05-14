# React Hooks 无限循环调用问题修复报告

## 问题描述

在 PandaHabit 应用中，我们发现了几个组件存在 React Hooks 的使用问题，导致无限循环渲染和以下错误：

1. **Invalid hook call 错误**：
   ```
   Uncaught Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
   ```

2. **Maximum update depth exceeded 警告**：
   ```
   Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
   ```

## 问题原因

这些问题主要由以下几个原因导致：

1. **违反 React Hooks 规则**：在非函数组件顶层或自定义 Hook 内部调用 Hooks
2. **依赖数组不正确**：在 useEffect 中使用了会在每次渲染时变化的依赖
3. **循环依赖**：组件之间存在循环依赖关系
4. **直接在组件函数体内调用 Hook**：而不是在 useEffect 或其他 Hook 中调用

## 修复方案

### 1. 修复 `registerTableRefreshListener` 函数

**问题**：
`registerTableRefreshListener` 函数不是一个自定义 Hook（不以 "use" 开头），但它内部使用了 `useDataRefreshContext` Hook。

**修复**：
将其改为自定义 Hook `useRegisterTableRefresh`，并在内部使用 useEffect 处理订阅和清理：

```typescript
// 修改前
export function registerTableRefreshListener(
  table: string,
  callback: (data: any) => void
): () => void {
  const { registerRefreshListener } = useDataRefreshContext();
  return registerRefreshListener(table, callback);
}

// 修改后 (第一次尝试)
export function useRegisterTableRefresh(
  table: string,
  callback: (data: any) => void
): () => void {
  const { registerRefreshListener } = useDataRefreshContext();

  useEffect(() => {
    // 注册表监听器
    const unregister = registerRefreshListener(table, callback);

    // 清理函数
    return unregister;
  }, [table, callback, registerRefreshListener]);

  return () => {}; // 返回一个空函数，实际的取消注册在 useEffect 的清理函数中完成
}

// 最终修复 (使用 useRef 避免依赖变化)
export function useRegisterTableRefresh(
  table: string,
  callback: (data: any) => void
): () => void {
  const { registerRefreshListener } = useDataRefreshContext();

  // 使用 ref 来存储最新的回调函数，避免依赖变化
  const callbackRef = useRef(callback);

  // 更新 callbackRef 当 callback 变化时
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // 使用 ref 来存储最新的 table 值
  const tableRef = useRef(table);

  // 更新 tableRef 当 table 变化时
  useEffect(() => {
    tableRef.current = table;
  }, [table]);

  // 使用 ref 来存储最新的 registerRefreshListener 函数
  const registerRefreshListenerRef = useRef(registerRefreshListener);

  // 更新 registerRefreshListenerRef 当 registerRefreshListener 变化时
  useEffect(() => {
    registerRefreshListenerRef.current = registerRefreshListener;
  }, [registerRefreshListener]);

  // 只在组件挂载时注册一次监听器
  useEffect(() => {
    // 创建一个稳定的回调函数，它总是使用最新的 callback
    const stableCallback = (data: any) => {
      // 使用 ref 获取最新的 callback
      callbackRef.current(data);
    };

    // 注册表监听器
    const unregister = registerRefreshListenerRef.current(tableRef.current, stableCallback);

    // 清理函数
    return unregister;
  }, []); // 没有依赖项，使用 ref 获取最新的值

  return () => {}; // 返回一个空函数，实际的取消注册在 useEffect 的清理函数中完成
}
```

### 2. 修复 `ChallengeList` 组件

**问题**：
直接在组件函数体内调用 `registerTableRefreshListener`，导致每次渲染都会重新注册监听器。

**修复**：
1. 使用 `useCallback` 包装回调函数
2. 使用新的 `useRegisterTableRefresh` Hook

```typescript
// 修改前
useTableRefresh('challenges', (challengeData) => {
  // 处理逻辑...
});

// 修改后
const handleChallengeDataUpdate = useCallback((challengeData: any) => {
  // 处理逻辑...
}, [loadChallenges, filter]);

// 使用 useRegisterTableRefresh hook 监听挑战表的变化
useRegisterTableRefresh('challenges', handleChallengeDataUpdate);
```

### 3. 修复 `AnimatedTaskList` 组件

**问题**：
与 `ChallengeList` 组件类似，直接在组件函数体内调用 `useTableRefresh`。

**修复**：
1. 使用 `useCallback` 包装回调函数
2. 使用新的 `useRegisterTableRefresh` Hook
3. 使用 `useRef` 避免依赖变化

```typescript
// 修改前
useTableRefresh('tasks', (taskData) => {
  // 处理逻辑...
});

// 修改后 (第一次尝试)
const handleTaskDataUpdate = useCallback((taskData: any) => {
  // 处理逻辑...
}, [loadTasks, filter]);

// 使用 useRegisterTableRefresh hook 监听任务表的变化
useRegisterTableRefresh('tasks', handleTaskDataUpdate);

// 最终修复 (使用 useRef)
// 定义任务数据更新处理函数 - 使用 useRef 来避免依赖变化
const filterRef = React.useRef(filter);
const loadTasksRef = React.useRef(loadTasks);

// 更新 refs 当依赖变化时
React.useEffect(() => {
  filterRef.current = filter;
  loadTasksRef.current = loadTasks;
}, [filter, loadTasks]);

// 使用稳定的回调函数，不依赖于 filter 或 loadTasks
const handleTaskDataUpdate = useCallback((taskData: any) => {
  // 使用 ref 值而不是直接依赖
  const currentFilter = filterRef.current;
  const currentLoadTasks = loadTasksRef.current;

  // 如果有特定任务数据，则更新该任务
  if (taskData && taskData.id) {
    setTasks(prevTasks => {
      // 处理逻辑...
    });
  } else {
    // 如果没有特定任务数据，则重新加载所有任务
    currentLoadTasks();
  }
}, [/* 没有依赖项，使用 ref 来获取最新值 */]);

// 使用 useRegisterTableRefresh hook 监听任务表的变化
useRegisterTableRefresh('tasks', handleTaskDataUpdate);
```

### 4. 修复 `TaskManager` 组件

**问题**：
使用 `useDataRefresh` 监听任务表变化，但没有正确处理依赖关系，导致无限循环。

**修复**：
1. 使用 `useRegisterTableRefresh` 代替 `useDataRefresh`
2. 使用 `useRef` 来避免依赖变化

```typescript
// 修改前
const handleDataRefresh = useCallback(() => {
  setRefreshTrigger(prev => prev + 1);
}, []);

// 监听 'tasks' 表的数据刷新
useDataRefresh(['tasks'], () => handleDataRefresh());

// 修改后 (第一次尝试)
const handleDataRefresh = useCallback(() => {
  setRefreshTrigger(prev => prev + 1);
}, [setRefreshTrigger]); // 明确依赖 setRefreshTrigger

// 使用 useRegisterTableRefresh 监听 'tasks' 表的数据刷新
useRegisterTableRefresh('tasks', handleDataRefresh);

// 最终修复 (使用 useRef)
// 使用 useRef 来避免依赖变化
const setRefreshTriggerRef = React.useRef(setRefreshTrigger);

// 更新 ref 当依赖变化时
React.useEffect(() => {
  setRefreshTriggerRef.current = setRefreshTrigger;
}, [setRefreshTrigger]);

// 使用稳定的回调函数，不依赖于 setRefreshTrigger
const handleDataRefresh = useCallback(() => {
  // 只需要触发刷新，不需要重新获取所有数据
  setRefreshTriggerRef.current(prev => prev + 1);
}, []); // 没有依赖项，使用 ref 来获取最新值

// 使用 useRegisterTableRefresh 监听 'tasks' 表的数据刷新
useRegisterTableRefresh('tasks', handleDataRefresh);
```

### 5. 修复循环依赖问题

**问题**：
`App.tsx` 和 `dataSyncService.ts` 之间存在循环依赖。

**修复**：
创建单独的 `queryClient.ts` 文件，将 `queryClient` 实例移出 `App.tsx`：

```typescript
// src/services/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

## 全局检查类似问题的方法

为了全局检查类似的问题，可以采取以下步骤：

1. **检查所有直接使用 Hook 的非 Hook 函数**：
   - 搜索所有不以 "use" 开头但内部调用了 React Hooks 的函数
   - 将这些函数改为自定义 Hook（以 "use" 开头）或移除内部的 Hook 调用

2. **检查所有组件中直接在函数体内调用的 Hook**：
   - 搜索所有在组件函数体内直接调用的 Hook（不在 useEffect 等其他 Hook 内部）
   - 将这些调用移到 useEffect 或其他适当的 Hook 中

3. **检查所有 useEffect 的依赖数组**：
   - 确保所有 useEffect 都有正确的依赖数组
   - 使用 ESLint 的 exhaustive-deps 规则检查依赖项是否完整

4. **检查循环依赖**：
   - 分析模块导入关系，找出可能的循环依赖
   - 重构代码，将共享的逻辑或数据移到单独的模块中

5. **使用 React DevTools 的 Profiler**：
   - 监控组件的重新渲染次数
   - 识别渲染次数异常多的组件

## 预防措施

1. **遵循 React Hooks 规则**：
   - 只在 React 函数组件或自定义 Hook 中调用 Hooks
   - 不要在条件语句、循环或嵌套函数中调用 Hooks
   - 确保自定义 Hook 名称以 "use" 开头

2. **正确使用 useEffect 依赖数组**：
   - 包含 effect 中使用的所有外部变量
   - 使用 useCallback 和 useMemo 稳定化依赖项

3. **避免循环依赖**：
   - 设计清晰的模块结构
   - 将共享逻辑抽取到单独的模块

4. **使用 ESLint 插件**：
   - 安装 eslint-plugin-react-hooks
   - 启用 rules-of-hooks 和 exhaustive-deps 规则

通过以上措施，可以有效预防和解决 React Hooks 相关的无限循环渲染问题。

## 多语言支持更新

为了确保所有页面都使用一致的多语言支持方式，我们进行了以下更新：

1. **更新 ChallengesPage**：
   - 使用 `useLocalizedView` 获取多语言标签
   - 将硬编码的文本替换为标签
   - 添加错误处理和加载状态的多语言支持

2. **更新 AbilitiesPage**：
   - 添加 `useLocalizedView` 获取多语言标签
   - 创建相应的类型定义
   - 将硬编码的文本替换为标签
   - 添加错误处理和加载状态的多语言支持

3. **更新 TasksPage**：
   - 修复条件判断和错误处理
   - 添加错误处理和加载状态的多语言支持

4. **更新类型定义**：
   - 为 `TasksPageViewLabelsBundle` 添加缺失的属性
   - 为 `ChallengesPageViewLabelsBundle` 添加缺失的属性
   - 创建 `AbilitiesPageViewLabelsBundle` 类型定义

5. **添加本地化服务函数**：
   - 添加 `fetchAbilitiesPageView` 函数

通过这些更新，所有页面现在都使用了一致的多语言支持方式，并且正确使用了 DataRefreshProvider 来管理数据同步后的局部刷新。
