// src/utils/sound.ts
/**
 * 声音工具类
 * 用于播放游戏中的各种音效
 */

// 音效类型枚举
export enum SoundType {
  // 奖励音效
  REWARD_COMMON = 'reward_common',
  REWARD_UNCOMMON = 'reward_uncommon',
  REWARD_RARE = 'reward_rare',
  REWARD_EPIC = 'reward_epic',
  REWARD_LEGENDARY = 'reward_legendary',

  // 任务相关音效
  TASK_COMPLETE = 'task_complete',
  TASK_COMPLETE_HIGH = 'task_complete_high',
  TASK_COMPLETE_MAIN = 'task_complete_main',
  TASK_FAILED = 'task_failed',
  TASK_CREATED = 'task_created',

  // 挑战相关音效
  CHALLENGE_COMPLETE = 'challenge_complete',
  CHALLENGE_COMPLETE_EPIC = 'challenge_complete_epic',
  CHALLENGE_COMPLETE_LEGENDARY = 'challenge_complete_legendary',
  CHALLENGE_FAILED = 'challenge_failed',
  CHALLENGE_UNLOCKED = 'challenge_unlocked',

  // 系统音效
  LEVEL_UP = 'level_up',
  ABILITY_UNLOCKED = 'ability_unlocked',
  ABILITY_ACTIVATED = 'ability_activated',
  BUTTON_CLICK = 'button_click',
  ERROR = 'error',
  SUCCESS = 'success',
  NOTIFICATION = 'notification'
}

// 音效文件路径映射
const soundPaths: Record<SoundType, string> = {
  // 奖励音效
  [SoundType.REWARD_COMMON]: '/assets/sounds/reward_common.mp3',
  [SoundType.REWARD_UNCOMMON]: '/assets/sounds/reward_uncommon.mp3',
  [SoundType.REWARD_RARE]: '/assets/sounds/reward_rare.mp3',
  [SoundType.REWARD_EPIC]: '/assets/sounds/reward_epic.mp3',
  [SoundType.REWARD_LEGENDARY]: '/assets/sounds/reward_legendary.mp3',

  // 任务相关音效
  [SoundType.TASK_COMPLETE]: '/assets/sounds/task_complete.mp3',
  [SoundType.TASK_COMPLETE_HIGH]: '/assets/sounds/task_complete_high.mp3',
  [SoundType.TASK_COMPLETE_MAIN]: '/assets/sounds/task_complete_main.mp3',
  [SoundType.TASK_FAILED]: '/assets/sounds/task_failed.mp3',
  [SoundType.TASK_CREATED]: '/assets/sounds/task_created.mp3',

  // 挑战相关音效
  [SoundType.CHALLENGE_COMPLETE]: '/assets/sounds/challenge_complete.mp3',
  [SoundType.CHALLENGE_COMPLETE_EPIC]: '/assets/sounds/challenge_complete_epic.mp3',
  [SoundType.CHALLENGE_COMPLETE_LEGENDARY]: '/assets/sounds/challenge_complete_legendary.mp3',
  [SoundType.CHALLENGE_FAILED]: '/assets/sounds/challenge_failed.mp3',
  [SoundType.CHALLENGE_UNLOCKED]: '/assets/sounds/challenge_unlocked.mp3',

  // 系统音效
  [SoundType.LEVEL_UP]: '/assets/sounds/level_up.mp3',
  [SoundType.ABILITY_UNLOCKED]: '/assets/sounds/ability_unlocked.mp3',
  [SoundType.ABILITY_ACTIVATED]: '/assets/sounds/ability_activated.mp3',
  [SoundType.BUTTON_CLICK]: '/assets/sounds/button_click.mp3',
  [SoundType.ERROR]: '/assets/sounds/error.mp3',
  [SoundType.SUCCESS]: '/assets/sounds/success.mp3',
  [SoundType.NOTIFICATION]: '/assets/sounds/notification.mp3'
};

// 音频对象缓存
const audioCache: Record<string, HTMLAudioElement> = {};

/**
 * 播放音效
 * @param type 音效类型
 * @param volume 音量（0-1）
 * @returns 是否成功播放
 */
export function playSound(type: SoundType, volume: number = 0.5): boolean {
  try {
    const soundPath = soundPaths[type];

    // 检查音频是否已缓存
    if (!audioCache[soundPath]) {
      audioCache[soundPath] = new Audio(soundPath);
    }

    const audio = audioCache[soundPath];

    // 设置音量
    audio.volume = Math.max(0, Math.min(1, volume));

    // 重置播放位置
    audio.currentTime = 0;

    // 播放音效
    audio.play().catch(error => {
      console.warn(`Failed to play sound: ${error.message}`);
      return false;
    });

    return true;
  } catch (error) {
    console.error('Error playing sound:', error);
    return false;
  }
}

/**
 * 根据奖励稀有度播放对应音效
 * @param rarity 奖励稀有度
 * @param volume 音量（0-1）
 * @returns 是否成功播放
 */
export function playRewardSound(rarity: string, volume: number = 0.5): boolean {
  switch (rarity) {
    case 'common':
      return playSound(SoundType.REWARD_COMMON, volume);
    case 'uncommon':
      return playSound(SoundType.REWARD_UNCOMMON, volume);
    case 'rare':
      return playSound(SoundType.REWARD_RARE, volume);
    case 'epic':
      return playSound(SoundType.REWARD_EPIC, volume);
    case 'legendary':
      return playSound(SoundType.REWARD_LEGENDARY, volume);
    default:
      return playSound(SoundType.REWARD_COMMON, volume);
  }
}

/**
 * 根据任务类型和优先级播放对应音效
 * @param taskType 任务类型
 * @param taskPriority 任务优先级
 * @param volume 音量（0-1）
 * @returns 是否成功播放
 */
export function playTaskCompletionSound(taskType: string, taskPriority: string, volume: number = 0.5): boolean {
  // 主线任务
  if (taskType === 'main') {
    return playSound(SoundType.TASK_COMPLETE_MAIN, volume);
  }

  // 高优先级任务
  if (taskPriority === 'high') {
    return playSound(SoundType.TASK_COMPLETE_HIGH, volume);
  }

  // 默认任务完成音效
  return playSound(SoundType.TASK_COMPLETE, volume);
}

/**
 * 根据挑战难度播放对应音效
 * @param difficulty 挑战难度
 * @param volume 音量（0-1）
 * @returns 是否成功播放
 */
export function playChallengeCompletionSound(difficulty: string, volume: number = 0.5): boolean {
  switch (difficulty) {
    case 'expert':
    case 'legendary':
      return playSound(SoundType.CHALLENGE_COMPLETE_LEGENDARY, volume);
    case 'hard':
    case 'epic':
      return playSound(SoundType.CHALLENGE_COMPLETE_EPIC, volume);
    default:
      return playSound(SoundType.CHALLENGE_COMPLETE, volume);
  }
}

/**
 * 预加载所有音效
 * 在游戏启动时调用，提前加载所有音效文件
 */
export function preloadAllSounds(): void {
  Object.values(SoundType).forEach(type => {
    const soundPath = soundPaths[type as SoundType];
    if (!audioCache[soundPath]) {
      audioCache[soundPath] = new Audio(soundPath);
      // 只加载元数据，不播放
      audioCache[soundPath].preload = 'metadata';
      audioCache[soundPath].load();
    }
  });
}

/**
 * 设置全局音量
 * @param volume 音量（0-1）
 */
export function setGlobalVolume(volume: number): void {
  const normalizedVolume = Math.max(0, Math.min(1, volume));
  Object.values(audioCache).forEach(audio => {
    audio.volume = normalizedVolume;
  });
}
