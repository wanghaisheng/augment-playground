# 音效文件目录

此目录用于存放游戏中使用的各种音效文件和背景音乐。

## 目录结构

- `/` - 短音效文件（按钮点击、任务完成等）
- `/music/` - 背景音乐文件（环境音乐、传统中国音乐等）

## 奖励音效

以下是奖励系统使用的音效文件：

- `reward_common.mp3` - 普通奖励音效
- `reward_uncommon.mp3` - 不常见奖励音效
- `reward_rare.mp3` - 稀有奖励音效
- `reward_epic.mp3` - 史诗奖励音效
- `reward_legendary.mp3` - 传说奖励音效

## 任务相关音效

- `task_complete.mp3` - 普通任务完成音效
- `task_complete_high.mp3` - 高优先级任务完成音效
- `task_complete_main.mp3` - 主线任务完成音效
- `task_failed.mp3` - 任务失败音效
- `task_created.mp3` - 任务创建音效

## 挑战相关音效

- `challenge_complete.mp3` - 普通挑战完成音效
- `challenge_complete_epic.mp3` - 史诗挑战完成音效
- `challenge_complete_legendary.mp3` - 传说挑战完成音效
- `challenge_failed.mp3` - 挑战失败音效
- `challenge_unlocked.mp3` - 挑战解锁音效

## 系统音效

- `level_up.mp3` - 等级提升音效
- `ability_unlocked.mp3` - 能力解锁音效
- `ability_activated.mp3` - 能力激活音效
- `button_click.mp3` - 按钮点击音效
- `error.mp3` - 错误提示音效
- `success.mp3` - 成功提示音效
- `notification.mp3` - 通知提示音效

## 音效格式

- 推荐使用 MP3 格式，文件大小应尽量小（建议小于 100KB）
- 音效时长应简短（通常 1-3 秒）
- 音量应适中，避免过大或过小

## 使用方法

在代码中使用 `sound.ts` 工具类播放音效：

```typescript
import { playSound, SoundType } from '@/utils/sound';

// 播放奖励音效
playSound(SoundType.REWARD_LEGENDARY);

// 控制音量（0-1）
playSound(SoundType.BUTTON_CLICK, 0.3);
```

## 背景音乐

以下是背景音乐文件：

### 环境音乐

- `bamboo_forest.mp3` - 竹林清风环境音乐
- `meditation_ambient.mp3` - 冥想氛围环境音乐
- `morning_nature.mp3` - 晨曦自然环境音乐
- `evening_calm.mp3` - 夜晚宁静环境音乐

### 传统中国音乐

- `traditional_guzheng.mp3` - 古筝独奏音乐
- `traditional_flute.mp3` - 竹笛清音音乐
- `traditional_ensemble.mp3` - 民乐合奏音乐

### 季节主题音乐

- `spring_theme.mp3` - 春日主题音乐
- `summer_theme.mp3` - 夏日主题音乐
- `autumn_theme.mp3` - 秋日主题音乐
- `winter_theme.mp3` - 冬日主题音乐

## 背景音乐使用方法

在代码中使用 `backgroundMusic.ts` 工具类播放背景音乐：

```typescript
import { playBackgroundMusic, BackgroundMusicType } from '@/utils/backgroundMusic';

// 播放背景音乐
playBackgroundMusic(BackgroundMusicType.BAMBOO_FOREST);

// 控制音量和淡入效果
playBackgroundMusic(BackgroundMusicType.TRADITIONAL_GUZHENG, {
  volume: 0.3,
  fadeIn: true,
  fadeInDuration: 2000
});
```

或者使用 React 上下文：

```typescript
import { useBackgroundMusic } from '@/context/BackgroundMusicProvider';

// 在组件中
const { playMusic, pauseMusic, resumeMusic, stopMusic } = useBackgroundMusic();

// 播放音乐
playMusic(BackgroundMusicType.BAMBOO_FOREST, { fadeIn: true });
```

## 注意事项

1. 添加新音效后，需要在 `sound.ts` 中更新 `SoundType` 枚举和 `soundPaths` 映射
2. 添加新背景音乐后，需要在 `backgroundMusic.ts` 中更新 `BackgroundMusicType` 枚举和 `musicPaths` 映射
3. 音效文件命名应与 `soundPaths` 中的路径一致
4. 背景音乐文件命名应与 `musicPaths` 中的路径一致
5. 考虑为用户提供音效开关和音量控制选项
