# 示例音效文件

由于无法直接上传音频文件，这个文档提供了获取示例音效文件的指导。

## 获取音效文件

以下是获取音效文件的几种方法：

### 1. 使用免费音效库

以下是一些提供免费音效的网站：

- [Freesound](https://freesound.org/) - 大量免费音效，需要注册
- [Mixkit](https://mixkit.co/free-sound-effects/) - 高质量免费音效
- [ZapSplat](https://www.zapsplat.com/) - 免费音效库，需要注册
- [SoundBible](https://soundbible.com/) - 免费音效，大部分为公共领域或知识共享许可

### 2. 使用音效包

可以在以下平台购买专业音效包：

- [Unity Asset Store](https://assetstore.unity.com/) - 游戏音效包
- [Envato Elements](https://elements.envato.com/) - 订阅制音效库
- [Pond5](https://www.pond5.com/) - 单独购买音效

### 3. 自行录制或创建

可以使用以下工具自行创建音效：

- [Audacity](https://www.audacityteam.org/) - 免费开源音频编辑软件
- [BFXR](https://www.bfxr.net/) - 简单的游戏音效生成器
- [ChipTone](https://sfbgames.itch.io/chiptone) - 复古游戏音效生成器

## 音效文件命名

下载或创建音效后，请按照以下命名规则保存到相应目录：

### 奖励音效

- `reward_common.mp3` - 普通奖励音效
- `reward_uncommon.mp3` - 不常见奖励音效
- `reward_rare.mp3` - 稀有奖励音效
- `reward_epic.mp3` - 史诗奖励音效
- `reward_legendary.mp3` - 传说奖励音效

### 任务相关音效

- `task_complete.mp3` - 普通任务完成音效
- `task_complete_high.mp3` - 高优先级任务完成音效
- `task_complete_main.mp3` - 主线任务完成音效
- `task_failed.mp3` - 任务失败音效
- `task_created.mp3` - 任务创建音效

### 挑战相关音效

- `challenge_complete.mp3` - 普通挑战完成音效
- `challenge_complete_epic.mp3` - 史诗挑战完成音效
- `challenge_complete_legendary.mp3` - 传说挑战完成音效
- `challenge_failed.mp3` - 挑战失败音效
- `challenge_unlocked.mp3` - 挑战解锁音效

### 系统音效

- `level_up.mp3` - 等级提升音效
- `ability_unlocked.mp3` - 能力解锁音效
- `ability_activated.mp3` - 能力激活音效
- `button_click.mp3` - 按钮点击音效
- `error.mp3` - 错误提示音效
- `success.mp3` - 成功提示音效
- `notification.mp3` - 通知提示音效
- `achievement.mp3` - 成就解锁音效

### 背景音乐

- `/music/bamboo_forest.mp3` - 竹林清风环境音乐
- `/music/meditation_ambient.mp3` - 冥想氛围环境音乐
- `/music/traditional_guzheng.mp3` - 古筝独奏音乐
- `/music/traditional_flute.mp3` - 竹笛清音音乐

## 音效风格指南

为了保持一致的音效风格，请遵循以下指南：

### 界面音效

- 简短（0.5-1秒）
- 清脆、轻快
- 使用传统中国乐器音色（如古筝拨弦、竹笛短音等）
- 避免过于刺耳或突兀的声音

### 成就音效

- 中等长度（1-2秒）
- 庆祝性质，给人成就感
- 使用传统中国乐器的华丽音色
- 可以有层次感和渐强效果

### 背景音乐

- 较长（3-5分钟，支持循环）
- 平静、舒缓
- 使用传统中国乐器（古筝、二胡、笛子等）
- 与自然声音（如流水声、竹林风声等）结合
- 避免过于复杂或情绪化的旋律

## 音效处理建议

- 确保所有音效格式一致（推荐MP3格式，44.1kHz采样率）
- 标准化音量，避免不同音效之间音量差异过大
- 添加淡入淡出效果，避免爆音
- 压缩文件大小，优化加载性能（建议小于100KB）
- 确保音效可以无缝循环（特别是背景音乐）
