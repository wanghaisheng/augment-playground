# PandaHabit 硬编码文本检测工具指南

## 概述

硬编码文本检测工具是一个用于扫描代码库中可能存在的硬编码文本的实用工具，特别是那些应该使用多语言系统的文本。这个工具可以帮助开发者识别和修复多语言支持问题，确保应用程序在不同语言环境下提供一致的用户体验。

## 为什么需要检测硬编码文本？

在多语言应用程序中，所有面向用户的文本都应该通过多语言系统提供，而不是直接硬编码在组件中。硬编码文本会导致以下问题：

1. **不一致的用户体验**：即使用户选择了英语界面，部分文本仍可能显示为中文
2. **维护困难**：添加新语言或修改现有文本需要修改多个文件
3. **代码质量下降**：硬编码文本使代码更难理解和维护
4. **国际化障碍**：硬编码文本阻碍了应用程序的国际化扩展

## 使用方法

### 安装依赖

首先，确保已安装所需的依赖：

```bash
npm install
```

### 运行检测工具

使用以下命令运行硬编码文本检测工具：

```bash
npm run detect-hardcoded-text
```

这将扫描默认目录（`src/components`、`src/pages`、`src/features`）中的所有 `.tsx` 和 `.ts` 文件，并报告可能的硬编码文本。

### 命令行选项

检测工具支持以下命令行选项：

- `--dir=<directory>`：指定要扫描的目录（相对于 `src`）
  ```bash
  npm run detect-hardcoded-text -- --dir=components/task
  ```

- `--format=json`：以 JSON 格式输出结果
  ```bash
  npm run detect-hardcoded-text -- --format=json
  ```

- `--no-chinese`：不检测中文文本
  ```bash
  npm run detect-hardcoded-text -- --no-chinese
  ```

- `--no-english`：不检测英文文本
  ```bash
  npm run detect-hardcoded-text -- --no-english
  ```

- `--no-line-numbers`：不在输出中包含行号
  ```bash
  npm run detect-hardcoded-text -- --no-line-numbers
  ```

## 输出示例

工具的输出示例如下：

```
Scanning for hardcoded text...
Directories to scan: components, pages, features

Detected 15 potential hardcoded text issues in 5 files:

src/components/reflection/EnhancedReflectionModule.tsx (5 issues):
  Line 45: Chinese text "焦虑" in context: if (lowerText.includes('anxious') || lowerText.includes('worry') || lowerText.includes('nervous') ||
  Line 45: Chinese text "担心" in context: lowerText.includes('焦虑') || lowerText.includes('担心') || lowerText.includes('紧张')) {
  Line 48: Chinese text "压力" in context: if (lowerText.includes('stress') || lowerText.includes('pressure') || lowerText.includes('burden') ||
  Line 48: Chinese text "压抑" in context: lowerText.includes('压力') || lowerText.includes('压抑') || lowerText.includes('重担')) {
  Line 51: Chinese text "疲惫" in context: if (lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('fatigue') ||

src/components/task/TaskCard.tsx (3 issues):
  Line 78: Chinese text "完成" in context: <Button onClick={handleComplete}>{isCompleted ? "已完成" : "完成"}</Button>
  Line 78: Chinese text "已完成" in context: <Button onClick={handleComplete}>{isCompleted ? "已完成" : "完成"}</Button>
  Line 82: English text "Edit" in context: <Button onClick={handleEdit}>Edit</Button>

Suggestions:
1. Replace hardcoded text with labels from the multilingual system
2. Use the useLocalizedView hook for page components
3. Use the useComponentLabels hook for shared components
4. Define label types in the appropriate interface files
5. Add the new labels to the database for all supported languages
```

## 如何修复硬编码文本

### 1. 页面组件

对于页面级组件，使用 `useLocalizedView` 钩子获取本地化内容：

```tsx
// 修复前
const TaskPage = () => {
  return (
    <div>
      <h1>任务列表</h1>
      <p>这里显示您的所有任务</p>
      <Button>添加任务</Button>
    </div>
  );
};

// 修复后
const TaskPage = () => {
  const { labels } = useLocalizedView<TaskPageDataPayload, TaskPageLabelsBundle>(
    'taskPageViewContent',
    fetchTaskPageView
  );

  return (
    <div>
      <h1>{labels.title}</h1>
      <p>{labels.description}</p>
      <Button>{labels.addTaskButton}</Button>
    </div>
  );
};
```

### 2. 共享组件

对于共享组件，接受 `labels` 属性并提供默认值：

```tsx
// 修复前
const TaskCard = ({ task }) => {
  return (
    <div>
      <h3>{task.title}</h3>
      <Button>编辑</Button>
      <Button>删除</Button>
    </div>
  );
};

// 修复后
interface TaskCardProps {
  task: TaskRecord;
  labels?: {
    editButton?: string;
    deleteButton?: string;
  };
}

const TaskCard: React.FC<TaskCardProps> = ({ task, labels }) => {
  return (
    <div>
      <h3>{task.title}</h3>
      <Button>{labels?.editButton || "Edit"}</Button>
      <Button>{labels?.deleteButton || "Delete"}</Button>
    </div>
  );
};
```

### 3. 添加标签到数据库

确保为所有支持的语言添加相应的标签：

```typescript
// 在适当的标签文件中添加（如 src/data/taskLabels.ts）
export const taskLabels: UILabelRecord[] = [
  // 英文标签
  { 
    scopeKey: 'taskView', 
    labelKey: 'editButton', 
    languageCode: 'en', 
    translatedText: 'Edit' 
  },
  { 
    scopeKey: 'taskView', 
    labelKey: 'deleteButton', 
    languageCode: 'en', 
    translatedText: 'Delete' 
  },
  
  // 中文标签
  { 
    scopeKey: 'taskView', 
    labelKey: 'editButton', 
    languageCode: 'zh', 
    translatedText: '编辑' 
  },
  { 
    scopeKey: 'taskView', 
    labelKey: 'deleteButton', 
    languageCode: 'zh', 
    translatedText: '删除' 
  },
];
```

### 4. 更新标签类型定义

在相应的类型文件中更新标签类型定义：

```typescript
// 在 src/types/index.ts 或专用类型文件中
export interface TaskViewLabelsBundle {
  title: string;
  description: string;
  addTaskButton: string;
  taskCard: {
    editButton: string;
    deleteButton: string;
  };
}
```

## 最佳实践

1. **组件设计**：
   - 所有显示文本的组件都应该支持多语言
   - 组件应该接受 `labels` 属性，并为所有文本提供英文默认值
   - 避免在组件中硬编码任何语言的文本

2. **标签组织**：
   - 按功能区域组织标签（如 `homeView`、`taskView`、`settingsView`）
   - 使用嵌套结构表示组件层次（如 `taskView.taskCard.editButton`）
   - 为所有支持的语言提供完整的标签集

3. **类型安全**：
   - 为所有标签包定义类型接口
   - 使用 `RequiredLabels` 工具类型确保标签完整性
   - 使用 `createLabelValidator` 函数验证标签包

4. **定期检查**：
   - 在添加新功能后运行硬编码文本检测工具
   - 在代码审查过程中检查多语言支持
   - 在不同语言设置下测试应用程序

## 结论

硬编码文本检测工具是确保 PandaHabit 应用程序提供一致多语言体验的重要工具。通过定期使用此工具并遵循多语言最佳实践，我们可以提高代码质量，简化维护，并为用户提供更好的体验。
