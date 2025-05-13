# 熊猫习惯 - 数据同步与局部刷新架构

## 1. 概述

本文档描述了熊猫习惯应用中的数据同步和局部刷新架构，包括数据流、同步机制和UI更新策略。这种架构旨在提供高效的数据管理和响应式用户界面，同时保持良好的离线功能。

## 2. 核心组件

### 2.1 数据同步服务 (dataSyncService)

数据同步服务负责管理应用数据与后端服务器之间的同步。它提供以下功能：

- **同步队列管理**：跟踪需要同步的数据项
- **自动同步**：定期尝试同步待处理项目
- **手动同步**：允许用户手动触发同步
- **错误处理和重试**：处理同步失败并实现重试机制
- **网络状态监控**：在网络恢复时自动同步

关键函数：
- `initializeDataSync`: 初始化同步服务
- `addSyncItem`: 将项目添加到同步队列
- `syncPendingItems`: 同步待处理项目
- `getPendingSyncCount`: 获取待同步项目数量
- `getCurrentSyncStatus`: 获取当前同步状态

### 2.2 数据刷新钩子 (useDataRefresh)

`useDataRefresh` 是一个自定义 React Hook，用于监听数据变化并触发组件更新。它提供以下功能：

- **表特定监听**：监听特定数据表的变化
- **回调函数**：在数据变化时执行自定义逻辑
- **局部更新**：支持精确更新而非全页面刷新

变体：
- `useDataRefresh`: 监听多个表的变化
- `useTableRefresh`: 监听单个表的变化
- `triggerDataRefresh`: 手动触发数据刷新事件

## 3. 数据流程

### 3.1 数据创建/更新流程

1. 用户在UI中创建或更新数据（如任务）
2. 数据首先保存到本地数据库（Dexie.js）
3. 数据变更添加到同步队列（通过 `addSyncItem`）
4. 触发 `syncItemAdded` 事件，通知UI更新
5. 如果在线，立即尝试同步；否则等待网络恢复
6. 同步成功后，触发 `dataRefresh` 事件，通知相关组件更新

### 3.2 数据同步状态流程

1. 同步状态变化时，触发 `syncStatusChanged` 事件
2. SyncStatusIndicator 组件监听事件并更新显示
3. 同步完成后，触发 `dataRefresh` 事件
4. 使用 `useDataRefresh` 或 `useTableRefresh` 的组件接收更新并刷新UI

## 4. 组件集成

以下组件已集成数据同步和局部刷新机制：

### 4.1 任务管理相关组件

- **TaskManager**: 使用 `useDataRefresh` 监听任务数据变化
- **AnimatedTaskList**: 使用 `useTableRefresh` 监听任务表变化，实现任务列表的局部更新

### 4.2 熊猫状态相关组件

- **PandaStateProvider**: 使用 `useTableRefresh` 监听熊猫状态和能力变化
- **AbilityList**: 使用 `useTableRefresh` 监听能力表变化

### 4.3 奖励相关组件

- **RewardModal**: 使用 `useTableRefresh` 监听奖励表变化

### 4.4 UI反馈组件

- **SyncStatusIndicator**: 显示同步状态和待同步项目数量，监听 `syncItemAdded` 和 `syncStatusChanged` 事件

## 5. 错误处理

数据同步架构包含多层错误处理机制：

1. **同步错误处理**：
   - 记录失败的同步尝试
   - 实现指数退避重试策略
   - 在网络恢复时自动重试

2. **UI错误处理**：
   - 显示同步错误状态
   - 提供手动重试选项
   - 在错误状态下保持应用可用

3. **数据一致性**：
   - 使用乐观更新策略（先更新UI，后同步数据）
   - 在同步失败时回滚到服务器状态

## 6. 最佳实践

### 6.1 组件集成指南

要将新组件集成到数据同步架构中：

1. 导入适当的 Hook：
   ```typescript
   import { useDataRefresh } from '@/hooks/useDataRefresh';
   // 或
   import { useTableRefresh } from '@/hooks/useDataRefresh';
   ```

2. 在组件中使用 Hook：
   ```typescript
   // 监听多个表
   useDataRefresh(['table1', 'table2'], (event) => {
     // 处理数据刷新
   });
   
   // 或监听单个表
   useTableRefresh('tableName', (data) => {
     // 处理表数据刷新
   });
   ```

3. 实现数据变更时的局部更新逻辑

### 6.2 数据操作指南

在修改数据时：

1. 首先更新本地数据库
2. 使用 `addSyncItem` 将变更添加到同步队列
3. 依赖数据同步服务和 `useDataRefresh` 机制自动更新UI

## 7. 性能考虑

- **选择性更新**：只更新变更的数据，而不是整个列表
- **防抖动和节流**：限制短时间内的多次更新
- **懒加载**：仅在需要时加载数据
- **缓存**：缓存频繁访问的数据以减少数据库查询

## 8. 未来改进

- **冲突解决**：实现更复杂的冲突解决策略
- **批量同步优化**：改进批量同步性能
- **同步优先级**：实现基于优先级的同步队列
- **数据压缩**：减少同步数据的大小
- **增量同步**：只同步变更的字段而非整个记录
