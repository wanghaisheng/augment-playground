# PandaHabit 音效系统实现文档

本文档详细说明了PandaHabit应用中音效系统的实现，包括音效管理、背景音乐和性能优化。

## 1. 系统架构

音效系统由以下几个主要部分组成：

### 1.1 核心工具类

- **sound.ts** - 管理短音效（如按钮点击、任务完成等）
- **backgroundMusic.ts** - 管理背景音乐（如环境音乐、传统中国音乐等）
- **soundLoader.ts** - 优化音效加载性能，提供预加载和缓存功能

### 1.2 React组件

- **BackgroundMusicProvider** - 提供背景音乐状态和控制方法的React上下文
- **SoundManager** - 管理音效初始化和自动播放
- **SoundLoadingIndicator** - 显示音效加载进度
- **BackgroundMusicControls** - 提供背景音乐控制界面

### 1.3 目录结构

```
src/
  ├── utils/
  │   ├── sound.ts              # 短音效管理
  │   ├── backgroundMusic.ts    # 背景音乐管理
  │   └── soundLoader.ts        # 音效加载优化
  ├── context/
  │   └── BackgroundMusicProvider.tsx  # 背景音乐上下文
  └── components/
      └── sound/
          ├── SoundManager.tsx          # 音效管理器
          └── SoundLoadingIndicator.tsx # 音效加载指示器
      └── settings/
          └── BackgroundMusicControls.tsx # 背景音乐控制界面
```

## 2. 音效管理 (sound.ts)

`sound.ts` 提供了播放短音效的功能，主要包括：

### 2.1 音效类型枚举

```typescript
export enum SoundType {
  // 奖励音效
  REWARD_COMMON = 'reward_common',
  REWARD_UNCOMMON = 'reward_uncommon',
  // ...其他音效类型
}
```

### 2.2 音效播放函数

```typescript
export function playSound(type: SoundType, volume: number = 0.5): boolean {
  // 播放指定类型的音效
}
```

### 2.3 特殊音效播放函数

```typescript
// 根据奖励稀有度播放对应音效
export function playRewardSound(rarity: string, volume: number = 0.5): boolean {
  // 根据稀有度选择并播放音效
}

// 根据任务类型和优先级播放对应音效
export function playTaskCompletionSound(
  taskType: string, 
  taskPriority: string, 
  volume: number = 0.5
): boolean {
  // 根据任务类型和优先级选择并播放音效
}
```

## 3. 背景音乐管理 (backgroundMusic.ts)

`backgroundMusic.ts` 提供了播放背景音乐的功能，主要包括：

### 3.1 背景音乐类型枚举

```typescript
export enum BackgroundMusicType {
  // 环境音乐
  BAMBOO_FOREST = 'bamboo_forest',
  MEDITATION_AMBIENT = 'meditation_ambient',
  // ...其他背景音乐类型
}
```

### 3.2 背景音乐播放函数

```typescript
export function playBackgroundMusic(
  type: BackgroundMusicType,
  options: {
    volume?: number;
    loop?: boolean;
    fadeIn?: boolean;
    fadeInDuration?: number;
  } = {}
): boolean {
  // 播放指定类型的背景音乐
}
```

### 3.3 背景音乐控制函数

```typescript
// 停止背景音乐
export function stopBackgroundMusic(
  options: {
    fadeOut?: boolean;
    fadeOutDuration?: number;
  } = {}
): void {
  // 停止当前播放的背景音乐
}

// 暂停背景音乐
export function pauseBackgroundMusic(): void {
  // 暂停当前播放的背景音乐
}

// 恢复背景音乐播放
export function resumeBackgroundMusic(): void {
  // 恢复当前暂停的背景音乐
}
```

## 4. 音效加载优化 (soundLoader.ts)

`soundLoader.ts` 提供了优化音效加载性能的功能，主要包括：

### 4.1 预加载函数

```typescript
// 预加载音效
export async function preloadSound(
  type: SoundType,
  config: PreloadConfig = {}
): Promise<AudioLoadState> {
  // 预加载指定类型的音效
}

// 预加载背景音乐
export async function preloadBackgroundMusic(
  type: BackgroundMusicType,
  config: PreloadConfig = {}
): Promise<AudioLoadState> {
  // 预加载指定类型的背景音乐
}

// 预加载所有音效
export async function preloadAllSounds(config: PreloadConfig = {}): Promise<void> {
  // 预加载所有音效
}

// 预加载所有背景音乐
export async function preloadAllBackgroundMusic(config: PreloadConfig = {}): Promise<void> {
  // 预加载所有背景音乐
}
```

### 4.2 加载优化策略

- **预加载** - 在应用启动时预加载音效，减少首次播放延迟
- **缓存** - 缓存已加载的音效，避免重复加载
- **优先级** - 根据优先级加载音效，重要音效优先加载
- **元数据加载** - 对于不常用的音效，只加载元数据，减少初始加载时间
- **Web Audio API** - 可选使用Web Audio API加载音效，提供更好的性能
- **加载进度** - 提供加载进度回调，可以显示加载进度
- **错误处理** - 提供错误处理和重试机制，提高加载成功率

## 5. 背景音乐上下文 (BackgroundMusicProvider.tsx)

`BackgroundMusicProvider.tsx` 提供了背景音乐状态和控制方法的React上下文，主要包括：

### 5.1 上下文类型

```typescript
interface BackgroundMusicContextType {
  // 当前状态
  currentMusic: BackgroundMusicType | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  
  // 控制方法
  playMusic: (type: BackgroundMusicType, options?: {
    volume?: number;
    loop?: boolean;
    fadeIn?: boolean;
    fadeInDuration?: number;
  }) => void;
  stopMusic: (options?: {
    fadeOut?: boolean;
    fadeOutDuration?: number;
  }) => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  
  // 音乐选择
  availableTracks: Array<{
    type: BackgroundMusicType;
    name: string;
    category: string;
  }>;
}
```

### 5.2 本地存储

背景音乐设置会保存到本地存储，包括：

- 当前播放的音乐类型
- 音量设置
- 静音状态

## 6. 音效管理器 (SoundManager.tsx)

`SoundManager.tsx` 管理音效初始化和自动播放，主要功能包括：

- 预加载所有音效
- 监听用户交互以启用声音
- 自动播放背景音乐
- 显示音效加载进度

## 7. 使用示例

### 7.1 播放短音效

```typescript
import { playSound, SoundType } from '@/utils/sound';

// 播放按钮点击音效
playSound(SoundType.BUTTON_CLICK);

// 播放成功音效，音量为0.7
playSound(SoundType.SUCCESS, 0.7);

// 根据奖励稀有度播放音效
playRewardSound('legendary');
```

### 7.2 播放背景音乐

```typescript
import { playBackgroundMusic, BackgroundMusicType } from '@/utils/backgroundMusic';

// 播放竹林清风背景音乐
playBackgroundMusic(BackgroundMusicType.BAMBOO_FOREST);

// 播放古筝独奏，音量为0.3，淡入效果
playBackgroundMusic(BackgroundMusicType.TRADITIONAL_GUZHENG, {
  volume: 0.3,
  fadeIn: true,
  fadeInDuration: 2000
});
```

### 7.3 使用背景音乐上下文

```typescript
import { useBackgroundMusic } from '@/context/BackgroundMusicProvider';

// 在组件中
const { 
  playMusic, 
  pauseMusic, 
  resumeMusic, 
  stopMusic,
  setVolume,
  toggleMute,
  currentMusic,
  isPlaying,
  isMuted,
  volume
} = useBackgroundMusic();

// 播放音乐
playMusic(BackgroundMusicType.BAMBOO_FOREST, { fadeIn: true });

// 暂停音乐
pauseMusic();

// 恢复音乐
resumeMusic();

// 停止音乐
stopMusic({ fadeOut: true });

// 设置音量
setVolume(0.5);

// 切换静音
toggleMute();
```

## 8. 性能考虑

### 8.1 音效加载优化

- 使用预加载和缓存减少首次播放延迟
- 对于不常用的音效，只加载元数据
- 使用加载优先级，重要音效优先加载
- 提供加载进度回调，可以显示加载进度

### 8.2 音效播放优化

- 使用音频对象池，避免频繁创建和销毁音频对象
- 使用Web Audio API提供更好的性能（可选）
- 限制同时播放的音效数量，避免音频混叠
- 根据设备性能自动调整音效质量

## 9. 未来改进

- 添加音效分组和优先级管理
- 实现3D音效支持
- 添加音效过滤器和效果器
- 实现音效序列和音效队列
- 添加音效可视化
- 实现音效响应式设计，根据用户行为自动调整音效
