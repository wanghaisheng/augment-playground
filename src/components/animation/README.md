# 动画组件文档

## RewardAnimation 组件

`RewardAnimation` 是一个用于展示奖励获取动画的组件，支持多种动画效果和音效，根据奖励的稀有度提供不同的视觉效果。

## TaskCompletionAnimation 组件

`TaskCompletionAnimation` 是一个用于展示任务完成动画的组件，支持多种动画效果和音效，根据任务的优先级和类型提供不同的视觉效果。

## ChallengeCompletionAnimation 组件

`ChallengeCompletionAnimation` 是一个用于展示挑战完成动画的组件，支持多种动画效果和音效，根据挑战的难度提供不同的视觉效果。

### 使用方法

```tsx
import RewardAnimation from '@/components/animation/RewardAnimation';
import { RewardType, RewardRarity } from '@/services/rewardService';

// 基本用法
<RewardAnimation
  type={RewardType.COIN}
  rarity={RewardRarity.COMMON}
  iconPath="/assets/rewards/coin.svg"
  amount={10}
  size={100}
/>

// 高级用法
<RewardAnimation
  type={RewardType.ITEM}
  rarity={RewardRarity.LEGENDARY}
  iconPath="/assets/rewards/legendary_item.svg"
  amount={1}
  size={150}
  animationStyle="burst"
  playSound={true}
  soundVolume={0.7}
  onAnimationComplete={() => console.log('动画播放完成')}
/>
```

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| type | RewardType | 必填 | 奖励类型 |
| rarity | RewardRarity | 必填 | 奖励稀有度 |
| iconPath | string | 必填 | 奖励图标路径 |
| amount | number | 1 | 奖励数量 |
| size | number | 100 | 动画容器大小（像素） |
| animationStyle | 'default' \| 'burst' \| 'float' \| 'spin' \| 'pulse' | 'default' | 动画样式 |
| playSound | boolean | true | 是否播放音效 |
| soundVolume | number | 0.5 | 音效音量（0-1） |
| onAnimationComplete | () => void | undefined | 动画完成回调函数 |

### 动画样式说明

1. **default**: 默认动画，适用于普通奖励
2. **burst**: 爆发式动画，适用于传说级奖励
3. **spin**: 旋转动画，适用于史诗级奖励
4. **pulse**: 脉冲动画，适用于稀有奖励
5. **float**: 浮动动画，适用于不常见奖励

### 稀有度特效

- **传说级 (Legendary)**: 彩虹边框、星星粒子、金色光晕
- **史诗级 (Epic)**: 紫色边框、强烈光晕效果
- **稀有级 (Rare)**: 蓝色边框、中等光晕效果
- **不常见 (Uncommon)**: 绿色光晕
- **普通 (Common)**: 基础光晕

### 音效系统

组件使用 `sound.ts` 工具类播放音效，根据奖励稀有度播放不同的音效。音效文件应放置在 `/public/assets/sounds/` 目录下。

### 示例代码

```tsx
// 在奖励模态框中使用
const getAnimationStyleForRarity = (rarity: string): 'default' | 'burst' | 'float' | 'spin' | 'pulse' => {
  switch (rarity) {
    case 'legendary': return 'burst';
    case 'epic': return 'spin';
    case 'rare': return 'pulse';
    case 'uncommon': return 'float';
    default: return 'default';
  }
};

<RewardAnimation
  type={reward.type}
  rarity={reward.rarity}
  iconPath={reward.iconPath}
  amount={reward.amount}
  size={120}
  onAnimationComplete={handleAnimationComplete}
  animationStyle={getAnimationStyleForRarity(reward.rarity)}
  playSound={true}
  soundVolume={0.6}
/>
```

## TaskCompletionAnimation 使用方法

```tsx
import TaskCompletionAnimation from '@/components/animation/TaskCompletionAnimation';
import { TaskRecord, TaskPriority, TaskType } from '@/services/taskService';

// 基本用法
<TaskCompletionAnimation
  task={completedTask}
  onAnimationComplete={() => console.log('任务完成动画结束')}
/>

// 高级用法
<TaskCompletionAnimation
  task={completedTask}
  style={completedTask.priority === TaskPriority.HIGH ? 'fireworks' :
         completedTask.type === TaskType.MAIN ? 'stars' : 'confetti'}
  playSound={true}
  soundVolume={0.7}
  onAnimationComplete={handleAnimationComplete}
/>
```

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| task | TaskRecord | 必填 | 完成的任务 |
| onAnimationComplete | () => void | undefined | 动画完成回调函数 |
| style | 'default' \| 'confetti' \| 'fireworks' \| 'stars' | 'default' | 动画样式 |
| playSound | boolean | true | 是否播放音效 |
| soundVolume | number | 0.5 | 音效音量（0-1） |

## ChallengeCompletionAnimation 使用方法

```tsx
import ChallengeCompletionAnimation from '@/components/animation/ChallengeCompletionAnimation';

// 基本用法
<ChallengeCompletionAnimation
  challengeTitle="每周挑战：竹林探险"
  onAnimationComplete={() => console.log('挑战完成动画结束')}
/>

// 高级用法
<ChallengeCompletionAnimation
  challengeTitle="传说挑战：熊猫大师"
  challengeDescription="完成所有熊猫训练课程"
  style="legendary"
  playSound={true}
  soundVolume={0.8}
  onAnimationComplete={handleAnimationComplete}
/>
```

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| challengeTitle | string | 必填 | 挑战标题 |
| challengeDescription | string | undefined | 挑战描述 |
| onAnimationComplete | () => void | undefined | 动画完成回调函数 |
| style | 'default' \| 'epic' \| 'legendary' | 'default' | 动画样式 |
| playSound | boolean | true | 是否播放音效 |
| soundVolume | number | 0.5 | 音效音量（0-1） |

## 注意事项

1. 确保音效文件已正确放置在 `/public/assets/sounds/` 目录下
2. 对于高频率触发的动画，考虑设置 `playSound={false}` 以避免音效重叠
3. 动画完成后会调用 `onAnimationComplete` 回调函数，可用于触发后续操作
4. 组件内部使用 `AnimatePresence` 处理动画的进入和退出，确保在父组件中正确处理组件的挂载和卸载
5. 任务和挑战完成动画会根据任务/挑战的重要性自动选择不同的动画效果
6. 所有动画组件都支持自定义样式和音效
