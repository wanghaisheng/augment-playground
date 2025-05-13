# 游戏组件文档

本文档记录了PandaHabit应用中的游戏组件，包括它们的功能、属性和使用方法。

## 奖励和资源组件

### RewardModal

`RewardModal` 是一个用于展示任务完成后获得的奖励的模态框组件。它以卷轴风格展示奖励，并支持多个奖励的展示。

#### 属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| isOpen | boolean | 控制模态框是否显示 |
| onClose | () => void | 关闭模态框的回调函数 |
| rewards | RewardRecord[] | 要展示的奖励列表 |

#### 使用示例

```tsx
<RewardModal
  isOpen={showRewardModal}
  onClose={handleCloseRewardModal}
  rewards={rewards}
/>
```

### ResourceDisplay

`ResourceDisplay` 是一个用于显示各种类型资源（经验、金币、物品等）的组件。它支持不同的尺寸、动画效果和点击交互。

#### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| type | RewardType | 必填 | 资源类型 |
| amount | number | 必填 | 资源数量 |
| rarity | RewardRarity | COMMON | 资源稀有度 |
| iconPath | string | 根据类型自动选择 | 资源图标路径 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 组件尺寸 |
| showLabel | boolean | true | 是否显示资源类型标签 |
| showAnimation | boolean | false | 是否显示数量变化动画 |
| onClick | () => void | undefined | 点击回调函数 |
| className | string | '' | 自定义CSS类名 |

#### 使用示例

```tsx
<ResourceDisplay
  type={RewardType.COIN}
  amount={100}
  rarity={RewardRarity.RARE}
  size="large"
  showAnimation={true}
  onClick={() => console.log('Clicked on coins')}
/>
```

### ResourceList

`ResourceList` 是一个用于显示多种资源的列表组件。它可以水平或垂直排列多个ResourceDisplay组件。

#### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| resources | ResourceItem[] | 必填 | 资源列表 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 资源显示尺寸 |
| showLabels | boolean | true | 是否显示资源类型标签 |
| showAnimation | boolean | false | 是否显示数量变化动画 |
| onResourceClick | (resource: ResourceItem) => void | undefined | 资源点击回调函数 |
| orientation | 'horizontal' \| 'vertical' | 'horizontal' | 列表排列方向 |
| className | string | '' | 自定义CSS类名 |

#### 使用示例

```tsx
<ResourceList
  resources={[
    { id: 1, type: RewardType.EXPERIENCE, amount: 100 },
    { id: 2, type: RewardType.COIN, amount: 50 }
  ]}
  size="medium"
  showAnimation={true}
  onResourceClick={(resource) => console.log('Clicked on', resource)}
/>
```

### ResourceInventory

`ResourceInventory` 是一个用于显示玩家资源库存的组件。它自动从服务中获取最新的资源数据并显示。

#### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| showExperience | boolean | true | 是否显示经验值 |
| showCoins | boolean | true | 是否显示金币 |
| showItems | boolean | false | 是否显示物品 |
| showBadges | boolean | false | 是否显示徽章 |
| showAnimation | boolean | true | 是否显示数量变化动画 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 资源显示尺寸 |
| className | string | '' | 自定义CSS类名 |

#### 使用示例

```tsx
<ResourceInventory
  showExperience={true}
  showCoins={true}
  size="medium"
  showAnimation={true}
/>
```

## 抽奖和反思组件

### LuckyDraw

`LuckyDraw` 是一个用于实现幸运抽奖功能的组件。它允许用户使用幸运点进行抽奖，并显示抽奖结果。

#### 属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| onClose | () => void | 关闭抽奖组件的回调函数 |
| onRewardEarned | (rewards: RewardRecord[]) => void | 获得奖励后的回调函数 |

#### 使用示例

```tsx
<LuckyDraw
  onClose={handleCloseLuckyDraw}
  onRewardEarned={handleRewardEarned}
/>
```

### LuckyDrawWheel

`LuckyDrawWheel` 是一个带有旋转轮盘的幸运抽奖组件。它提供了更华丽的抽奖体验，包括轮盘旋转动画和奖励展示。

#### 属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| isOpen | boolean | 控制抽奖组件是否显示 |
| onClose | () => void | 关闭抽奖组件的回调函数 |
| onRewardEarned | (rewards: RewardRecord[]) => void | 获得奖励后的回调函数 |

#### 使用示例

```tsx
<LuckyDrawWheel
  isOpen={showLuckyDrawWheel}
  onClose={handleCloseLuckyDrawWheel}
  onRewardEarned={handleRewardEarned}
/>
```

### ReflectionModule

`ReflectionModule` 是一个用于帮助用户反思任务完成情况和情绪状态的组件。它提供了一个温和、非判断性的对话系统，帮助用户探索困难并提供支持。

#### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| isOpen | boolean | 必填 | 控制反思模块是否显示 |
| onClose | () => void | 必填 | 关闭反思模块的回调函数 |
| taskName | string | undefined | 相关任务名称 |
| taskId | number | undefined | 相关任务ID |
| mood | 'happy' \| 'neutral' \| 'sad' \| 'concerned' | undefined | 初始心情状态 |
| onReflectionComplete | (reflectionData) => void | undefined | 反思完成后的回调函数 |

#### 使用示例

```tsx
<ReflectionModule
  isOpen={showReflectionModule}
  onClose={handleCloseReflectionModule}
  taskName="每日冥想"
  taskId={123}
  mood="concerned"
  onReflectionComplete={handleReflectionComplete}
/>
```

## 注意事项

1. 所有组件都遵循华丽游戏风格设计，包括中国风元素、动画效果和音效。
2. 组件使用Framer Motion实现动画效果，确保流畅的用户体验。
3. 组件与数据服务集成，自动更新和同步数据。
4. 所有组件都支持自定义样式和行为，可以根据需要进行定制。
5. 组件使用TypeScript编写，提供类型安全和代码提示。
