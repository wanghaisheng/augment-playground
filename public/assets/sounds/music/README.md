# 背景音乐文件目录

此目录用于存放游戏中使用的背景音乐文件。

## 环境音乐

- `bamboo_forest.mp3` - 竹林清风环境音乐
  - 描述：平静的竹林环境音，包含竹叶沙沙声和微风声
  - 推荐用途：主页、任务页面背景
  - 建议时长：3-5分钟（循环播放）

- `meditation_ambient.mp3` - 冥想氛围环境音乐
  - 描述：平静的冥想背景音乐，包含轻柔的自然声音和微妙的音调
  - 推荐用途：冥想页面、反思模块
  - 建议时长：5-10分钟（循环播放）

- `morning_nature.mp3` - 晨曦自然环境音乐
  - 描述：早晨的自然环境音，包含鸟鸣声和轻柔的流水声
  - 推荐用途：早晨使用应用时的背景音乐
  - 建议时长：3-5分钟（循环播放）

- `evening_calm.mp3` - 夜晚宁静环境音乐
  - 描述：夜晚的宁静环境音，包含蝉鸣声和微风声
  - 推荐用途：晚上使用应用时的背景音乐
  - 建议时长：3-5分钟（循环播放）

## 传统中国音乐

- `traditional_guzheng.mp3` - 古筝独奏音乐
  - 描述：传统古筝独奏曲，平静优雅
  - 推荐用途：通用背景音乐
  - 建议时长：3-5分钟（循环播放）

- `traditional_flute.mp3` - 竹笛清音音乐
  - 描述：传统竹笛独奏曲，清新悠扬
  - 推荐用途：通用背景音乐
  - 建议时长：3-5分钟（循环播放）

- `traditional_ensemble.mp3` - 民乐合奏音乐
  - 描述：传统民乐合奏曲，包含古筝、二胡、笛子等乐器
  - 推荐用途：特殊场景、成就解锁等
  - 建议时长：3-5分钟（循环播放）

## 季节主题音乐

- `spring_theme.mp3` - 春日主题音乐
  - 描述：春天主题音乐，轻快明亮
  - 推荐用途：春季主题活动
  - 建议时长：3-5分钟（循环播放）

- `summer_theme.mp3` - 夏日主题音乐
  - 描述：夏天主题音乐，活力充沛
  - 推荐用途：夏季主题活动
  - 建议时长：3-5分钟（循环播放）

- `autumn_theme.mp3` - 秋日主题音乐
  - 描述：秋天主题音乐，沉稳内敛
  - 推荐用途：秋季主题活动
  - 建议时长：3-5分钟（循环播放）

- `winter_theme.mp3` - 冬日主题音乐
  - 描述：冬天主题音乐，安静祥和
  - 推荐用途：冬季主题活动
  - 建议时长：3-5分钟（循环播放）

## 音乐格式

- 推荐使用 MP3 格式，文件大小应适中（建议小于 5MB）
- 音乐时长应适中（建议 3-10 分钟）
- 音量应适中，避免过大或过小
- 应支持无缝循环播放

## 使用方法

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

1. 背景音乐应支持循环播放，确保循环点平滑过渡
2. 音乐文件应具有良好的音质，但文件大小应适中
3. 考虑为用户提供背景音乐开关和音量控制选项
4. 添加新背景音乐后，需要在 `backgroundMusic.ts` 中更新 `BackgroundMusicType` 枚举和 `musicPaths` 映射
