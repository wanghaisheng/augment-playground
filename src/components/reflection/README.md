# 反思模块文档

本文档记录了PandaHabit应用中的反思模块，包括它的功能、组件和使用方法。

## 概述

反思模块是PandaHabit应用中的一个重要功能，它提供了一个温和、非判断性的对话系统，帮助用户探索困难并提供支持。反思模块包括情绪追踪、反思记录、支持性反馈和可行建议系统等功能。

## 组件

### EnhancedReflectionModule

`EnhancedReflectionModule` 是反思模块的核心组件，它提供了一个交互式的反思体验，包括情绪记录、反思输入、标签管理和行动建议。

#### 属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| isOpen | boolean | 控制模块是否显示 |
| onClose | () => void | 关闭模块的回调函数 |
| taskId | number | 相关任务ID（可选） |
| taskName | string | 相关任务名称（可选） |
| trigger | ReflectionTriggerRecord | 触发记录（可选） |
| onReflectionComplete | () => void | 反思完成后的回调函数（可选） |

#### 使用示例

```tsx
<EnhancedReflectionModule
  isOpen={showReflectionModule}
  onClose={() => setShowReflectionModule(false)}
  taskId={123}
  taskName="每日冥想"
  onReflectionComplete={handleReflectionComplete}
/>
```

### MoodTracker

`MoodTracker` 是一个用于记录和显示用户情绪状态的组件，它支持多种情绪类型和强度级别。

#### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| onMoodRecorded | (mood: MoodRecord) => void | undefined | 情绪记录后的回调函数 |
| compact | boolean | false | 是否使用紧凑模式 |
| className | string | '' | 自定义CSS类名 |

#### 使用示例

```tsx
<MoodTracker
  onMoodRecorded={handleMoodRecorded}
  compact={false}
/>
```

### ReflectionTriggerNotification

`ReflectionTriggerNotification` 是一个用于显示反思触发通知的组件，它会在特定条件下（如情绪变化、任务失败等）提示用户进行反思。

#### 属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| onTriggerAccepted | (trigger: ReflectionTriggerRecord) => void | 用户接受触发后的回调函数 |
| onTriggerDismissed | (trigger: ReflectionTriggerRecord) => void | 用户忽略触发后的回调函数 |

#### 使用示例

```tsx
<ReflectionTriggerNotification
  onTriggerAccepted={handleTriggerAccepted}
  onTriggerDismissed={handleTriggerDismissed}
/>
```

### ReflectionHistory

`ReflectionHistory` 是一个用于显示用户反思历史记录的组件，它支持按标签筛选和查看详情。

#### 属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| isOpen | boolean | 控制组件是否显示 |
| onClose | () => void | 关闭组件的回调函数 |
| onReflectionSelected | (reflection: ReflectionRecord) => void | 选择反思记录后的回调函数 |

#### 使用示例

```tsx
<ReflectionHistory
  isOpen={showReflectionHistory}
  onClose={() => setShowReflectionHistory(false)}
  onReflectionSelected={handleReflectionSelected}
/>
```

## 服务

### reflectionService

`reflectionService` 是反思模块的核心服务，它提供了管理反思记录、触发记录和情绪记录的功能。

#### 主要函数

| 函数名 | 描述 |
|--------|------|
| createReflection | 创建反思记录 |
| completeReflection | 完成反思记录 |
| getUserReflections | 获取用户的反思记录 |
| createReflectionTrigger | 创建反思触发记录 |
| getUnviewedReflectionTriggers | 获取未查看的反思触发记录 |
| markTriggerAsViewed | 标记触发记录为已查看 |
| markTriggerAsCompleted | 标记触发记录为已完成 |
| recordMood | 记录用户情绪 |
| getUserMoods | 获取用户的情绪记录 |
| checkTaskFailureTrigger | 检查任务失败是否需要触发反思 |
| checkDailyReflectionTrigger | 检查是否需要触发每日反思 |
| checkWeeklyReviewTrigger | 检查是否需要触发每周回顾 |

## 页面

### TeaRoomPage

`TeaRoomPage` 是反思模块的主页面，它集成了所有反思相关的组件，提供了一个完整的反思体验。

## 功能

### 反思机会的触发检测

反思模块会在以下情况下触发反思机会：

1. **情绪变化**：当用户记录负面情绪且强度较高时
2. **任务失败**：当任务过期且未完成时
3. **每日反思**：每天触发一次
4. **每周回顾**：每周触发一次
5. **手动触发**：用户主动开始反思

### 温和、非判断性的对话系统

反思模块使用温和、非判断性的语言与用户交流，帮助用户探索困难并提供支持。例如：

- "我注意到你最近心情不太好。想聊聊吗？"
- "任务未能按时完成。这没关系，我们可以一起反思一下。"
- "谢谢你的分享。以下是一些可能对你有帮助的小行动。"

### 用户输入收集和处理

反思模块收集用户的反思内容，并从中提取关键词和主题，用于生成标签和建议行动。

### 支持性反馈生成

反思模块根据用户的反思内容生成支持性反馈，帮助用户理解自己的感受和想法。

### 可行建议系统

反思模块根据用户的反思内容和标签生成可行的建议行动，帮助用户采取积极的步骤改善状况。

### 情绪跟踪和模式识别

反思模块通过情绪追踪功能记录用户的情绪状态，并识别情绪模式，帮助用户了解自己的情绪变化。

### 自我同情强化机制

反思模块通过温和的语言和支持性反馈，鼓励用户对自己保持同情和理解，减少自我批评。

### 静心茶室环境

反思模块提供了一个名为"静心茶室"的虚拟环境，营造一个安静、放松的氛围，帮助用户进行反思。

## 注意事项

1. 反思模块的所有组件都遵循华丽游戏风格设计，包括动画效果和音效。
2. 反思模块与数据服务集成，自动更新和同步数据。
3. 反思模块支持多语言，可以根据用户的语言设置显示相应的内容。
4. 反思模块的触发机制可以根据用户的使用情况进行调整，避免过于频繁的打扰。
5. 反思模块的建议行动应该是具体、可行的，帮助用户采取实际行动。
