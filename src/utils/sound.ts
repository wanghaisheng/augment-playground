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
  CHALLENGE_COMPLETE_HARD = 'challenge_complete_hard',
  CHALLENGE_COMPLETE_EXPERT = 'challenge_complete_expert',
  CHALLENGE_FAILED = 'challenge_failed',
  CHALLENGE_UNLOCKED = 'challenge_unlocked',

  // 系统音效
  LEVEL_UP = 'level_up',
  ABILITY_UNLOCKED = 'ability_unlocked',
  ABILITY_ACTIVATED = 'ability_activated',
  BUTTON_CLICK = 'button_click',
  ERROR = 'error',
  SUCCESS = 'success',
  NOTIFICATION = 'notification',
  ACHIEVEMENT = 'achievement',

  // 熊猫互动音效
  PANDA_HAPPY = 'panda_happy',
  PANDA_SAD = 'panda_sad',
  PANDA_EAT = 'panda_eat',
  PANDA_PLAY = 'panda_play',
  PANDA_TRAIN = 'panda_train',
  PANDA_TALK = 'panda_talk',

  // 环境音效
  WATER_SPLASH = 'water_splash',
  CAMERA_SHUTTER = 'camera_shutter',
  LULLABY = 'lullaby',
  MORNING_BELL = 'morning_bell',

  // 竹子系统音效
  BAMBOO_COLLECT = 'bamboo_collect',
  WATER = 'water',
  FERTILIZE = 'fertilize'
}

// 音效文件路径映射
export const soundPaths: Record<SoundType, string> = {
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
  [SoundType.CHALLENGE_COMPLETE_HARD]: '/assets/sounds/challenge_complete_hard.mp3',
  [SoundType.CHALLENGE_COMPLETE_EXPERT]: '/assets/sounds/challenge_complete_expert.mp3',
  [SoundType.CHALLENGE_FAILED]: '/assets/sounds/challenge_failed.mp3',
  [SoundType.CHALLENGE_UNLOCKED]: '/assets/sounds/challenge_unlocked.mp3',

  // 系统音效
  [SoundType.LEVEL_UP]: '/assets/sounds/level_up.mp3',
  [SoundType.ABILITY_UNLOCKED]: '/assets/sounds/ability_unlocked.mp3',
  [SoundType.ABILITY_ACTIVATED]: '/assets/sounds/ability_activated.mp3',
  [SoundType.BUTTON_CLICK]: '/assets/sounds/button_click.mp3',
  [SoundType.ERROR]: '/assets/sounds/error.mp3',
  [SoundType.SUCCESS]: '/assets/sounds/success.mp3',
  [SoundType.NOTIFICATION]: '/assets/sounds/notification.mp3',
  [SoundType.ACHIEVEMENT]: '/assets/sounds/achievement.mp3',

  // 熊猫互动音效
  [SoundType.PANDA_HAPPY]: '/assets/sounds/panda_happy.mp3',
  [SoundType.PANDA_SAD]: '/assets/sounds/panda_sad.mp3',
  [SoundType.PANDA_EAT]: '/assets/sounds/panda_eat.mp3',
  [SoundType.PANDA_PLAY]: '/assets/sounds/panda_play.mp3',
  [SoundType.PANDA_TRAIN]: '/assets/sounds/panda_train.mp3',
  [SoundType.PANDA_TALK]: '/assets/sounds/panda_talk.mp3',

  // 环境音效
  [SoundType.WATER_SPLASH]: '/assets/sounds/water_splash.mp3',
  [SoundType.CAMERA_SHUTTER]: '/assets/sounds/camera_shutter.mp3',
  [SoundType.LULLABY]: '/assets/sounds/lullaby.mp3',
  [SoundType.MORNING_BELL]: '/assets/sounds/morning_bell.mp3',

  // 竹子系统音效
  [SoundType.BAMBOO_COLLECT]: '/assets/sounds/bamboo_collect.mp3',
  [SoundType.WATER]: '/assets/sounds/water.mp3',
  [SoundType.FERTILIZE]: '/assets/sounds/fertilize.mp3'
};

// 兼容性映射
export const soundTypeAliases: Record<string, SoundType> = {
  REWARD: SoundType.REWARD_COMMON,
  UNLOCK: SoundType.CHALLENGE_UNLOCKED,
  CLICK: SoundType.BUTTON_CLICK,
  BAMBOO_PLANT: SoundType.BAMBOO_COLLECT,
  BAMBOO_HARVEST: SoundType.BAMBOO_COLLECT,
  COMPLETE: SoundType.TASK_COMPLETE,
  FAIL: SoundType.TASK_FAILED,
  CREATE: SoundType.TASK_CREATED
};

// 音频对象缓存
const audioCache: Record<string, HTMLAudioElement> = {};

// 音效类别枚举
export enum SoundCategory {
  UI = 'ui',
  TASK = 'task',
  CHALLENGE = 'challenge',
  REWARD = 'reward',
  PANDA = 'panda'
}

// 音效设置接口
export interface SoundSettings {
  enabled: boolean;
  globalVolume: number;
  categoryVolumes: Record<SoundCategory, number>;
  categoryEnabled: Record<SoundCategory, boolean>;
}

// 默认音效设置
const defaultSoundSettings: SoundSettings = {
  enabled: true,
  globalVolume: 0.5,
  categoryVolumes: {
    [SoundCategory.UI]: 0.5,
    [SoundCategory.TASK]: 0.5,
    [SoundCategory.CHALLENGE]: 0.5,
    [SoundCategory.REWARD]: 0.5,
    [SoundCategory.PANDA]: 0.5
  },
  categoryEnabled: {
    [SoundCategory.UI]: true,
    [SoundCategory.TASK]: true,
    [SoundCategory.CHALLENGE]: true,
    [SoundCategory.REWARD]: true,
    [SoundCategory.PANDA]: true
  }
};

// 音频播放状态
let soundEnabled = true;

// 全局音量
let globalVolume = 0.5;

// 类别音量
const categoryVolumes: Record<SoundCategory, number> = {
  [SoundCategory.UI]: 0.5,
  [SoundCategory.TASK]: 0.5,
  [SoundCategory.CHALLENGE]: 0.5,
  [SoundCategory.REWARD]: 0.5,
  [SoundCategory.PANDA]: 0.5
};

// 类别启用状态
const categoryEnabled: Record<SoundCategory, boolean> = {
  [SoundCategory.UI]: true,
  [SoundCategory.TASK]: true,
  [SoundCategory.CHALLENGE]: true,
  [SoundCategory.REWARD]: true,
  [SoundCategory.PANDA]: true
};

/**
 * 播放音效
 * @param type 音效类型
 * @param volume 音量（0-1）
 * @returns 是否成功播放
 */
export function playSound(type: SoundType | string, volume: number = 0.5): boolean {
  // 如果声音被全局禁用，直接返回
  if (!soundEnabled) {
    return false;
  }

  // 处理兼容性别名
  const soundType = typeof type === 'string' ? soundTypeAliases[type] || type : type;
  if (!soundType) {
    console.warn(`Unknown sound type: ${type}`);
    return false;
  }

  // 获取音效类别
  const category = getSoundCategory(soundType as SoundType);

  // 如果该类别被禁用，直接返回
  if (!categoryEnabled[category]) {
    return false;
  }

  try {
    const soundPath = soundPaths[soundType as SoundType];
    if (!soundPath) {
      console.warn(`No sound path found for type: ${soundType}`);
      return false;
    }

    // 尝试从soundLoader获取已加载的音频
    let audio: HTMLAudioElement | null = null;

    // 导入是异步的，但我们需要同步播放
    try {
      // 尝试从soundLoader获取已加载的音频
      const { getLoadedAudio } = require('./soundLoader');
      audio = getLoadedAudio(soundPath);
    } catch (importError) {
      // 如果导入失败，忽略错误并使用缓存或创建新的Audio
      console.debug('Could not import soundLoader, using fallback method', importError);
    }

    // 如果soundLoader没有加载的音频，使用缓存或创建新的Audio
    if (!audio) {
      // 检查音频是否已缓存
      if (!audioCache[soundPath]) {
        audioCache[soundPath] = new Audio(soundPath);
      }

      audio = audioCache[soundPath];
    }

    // 计算最终音量 = 用户指定音量 * 全局音量 * 类别音量
    const finalVolume = volume * globalVolume * categoryVolumes[category];

    // 设置音量
    audio.volume = Math.max(0, Math.min(1, finalVolume));

    // 重置播放位置
    audio.currentTime = 0;

    // 播放音效
    audio.play().catch(error => {
      console.warn(`Failed to play sound: ${error.message}`);

      // 如果是自动播放限制，禁用声音功能
      if (error.name === 'NotAllowedError') {
        console.log('Sound autoplay is restricted by the browser. Sound will be disabled until user interaction.');
        soundEnabled = false;
      }

      return false;
    });

    return true;
  } catch (error) {
    console.error('Error playing sound:', error);
    return false;
  }
}

/**
 * 启用声音
 * 在用户交互后调用此函数可以重新启用声音
 */
export function enableSound(): void {
  soundEnabled = true;
  console.log('Sound has been enabled');
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
  if (taskType.toLowerCase() === 'main') {
    return playSound(SoundType.TASK_COMPLETE_MAIN, volume);
  }

  // 高优先级任务
  if (taskPriority.toLowerCase() === 'high') {
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
  switch (difficulty.toLowerCase()) {
    case 'expert':
      return playSound(SoundType.CHALLENGE_COMPLETE_EXPERT, volume);
    case 'hard':
      return playSound(SoundType.CHALLENGE_COMPLETE_HARD, volume);
    default:
      return playSound(SoundType.CHALLENGE_COMPLETE, volume);
  }
}

/**
 * 预加载所有音效
 * 在游戏启动时调用，提前加载所有音效文件
 * @param options 预加载选项
 */
export function preloadAllSounds(options: {
  metadataOnly?: boolean;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
} = {}): void {
  try {
    // 尝试使用优化的soundLoader
    import('./soundLoader').then(({ preloadAllSounds: preloadAll }) => {
      preloadAll({
        metadataOnly: options.metadataOnly !== false, // 默认只加载元数据
        onProgress: options.onProgress ? (path, progress) => {
          // Calculate overall progress
          const totalSounds = Object.values(SoundType).length;
          const soundIndex = Object.values(soundPaths).indexOf(path);
          const overallProgress = (soundIndex + progress) / totalSounds;
          options.onProgress?.(overallProgress);
        } : undefined,
        onLoad: options.onComplete ? (_path) => {
          // Check if all sounds are loaded
          const allLoaded = Object.values(SoundType).every(type => {
            const { getLoadedAudio } = require('./soundLoader');
            return getLoadedAudio(soundPaths[type as SoundType]) !== null;
          });

          if (allLoaded) {
            options.onComplete?.();
          }
        } : undefined,
        onError: options.onError ? (_path, error) => {
          options.onError?.(error);
        } : undefined
      }).catch(error => {
        console.error('Error preloading sounds with soundLoader:', error);
        options.onError?.(error);
        // 回退到传统方法
        preloadAllSoundsFallback();
      });
    }).catch(error => {
      console.error('Error importing soundLoader:', error);
      options.onError?.(error);
      // 回退到传统方法
      preloadAllSoundsFallback();
    });
  } catch (error) {
    console.error('Error in preloadAllSounds:', error);
    options.onError?.(error as Error);
    // 回退到传统方法
    preloadAllSoundsFallback();
  }
}

/**
 * 预加载所有音效的传统方法（回退）
 */
function preloadAllSoundsFallback(): void {
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
  globalVolume = normalizedVolume;

  // 更新所有音频对象的音量
  Object.values(audioCache).forEach(audio => {
    audio.volume = normalizedVolume;
  });
}

/**
 * 设置类别音量
 * @param category 音效类别
 * @param volume 音量（0-1）
 */
export function setCategoryVolume(category: SoundCategory, volume: number): void {
  const normalizedVolume = Math.max(0, Math.min(1, volume));
  categoryVolumes[category] = normalizedVolume;
}

/**
 * 启用音效类别
 * @param category 音效类别
 */
export function enableCategory(category: SoundCategory): void {
  categoryEnabled[category] = true;
}

/**
 * 禁用音效类别
 * @param category 音效类别
 */
export function disableCategory(category: SoundCategory): void {
  categoryEnabled[category] = false;
}

/**
 * 获取音效类别
 * @param type 音效类型
 * @returns 音效类别
 */
function getSoundCategory(type: SoundType): SoundCategory {
  // UI音效
  if ([
    SoundType.BUTTON_CLICK,
    SoundType.ERROR,
    SoundType.SUCCESS,
    SoundType.NOTIFICATION
  ].includes(type)) {
    return SoundCategory.UI;
  }

  // 任务音效
  if ([
    SoundType.TASK_COMPLETE,
    SoundType.TASK_COMPLETE_HIGH,
    SoundType.TASK_COMPLETE_MAIN,
    SoundType.TASK_FAILED,
    SoundType.TASK_CREATED
  ].includes(type)) {
    return SoundCategory.TASK;
  }

  // 挑战音效
  if ([
    SoundType.CHALLENGE_COMPLETE,
    SoundType.CHALLENGE_COMPLETE_HARD,
    SoundType.CHALLENGE_COMPLETE_EXPERT,
    SoundType.CHALLENGE_FAILED,
    SoundType.CHALLENGE_UNLOCKED
  ].includes(type)) {
    return SoundCategory.CHALLENGE;
  }

  // 奖励音效
  if ([
    SoundType.REWARD_COMMON,
    SoundType.REWARD_UNCOMMON,
    SoundType.REWARD_RARE,
    SoundType.REWARD_EPIC,
    SoundType.REWARD_LEGENDARY,
    SoundType.ACHIEVEMENT,
    SoundType.LEVEL_UP,
    SoundType.ABILITY_UNLOCKED,
    SoundType.ABILITY_ACTIVATED
  ].includes(type)) {
    return SoundCategory.REWARD;
  }

  // 熊猫音效
  if ([
    SoundType.PANDA_HAPPY,
    SoundType.PANDA_SAD,
    SoundType.PANDA_EAT,
    SoundType.PANDA_PLAY,
    SoundType.PANDA_TRAIN,
    SoundType.PANDA_TALK
  ].includes(type)) {
    return SoundCategory.PANDA;
  }

  // 默认为UI音效
  return SoundCategory.UI;
}

/**
 * 获取音效设置
 * @returns 音效设置
 */
export function getSoundSettings(): SoundSettings {
  try {
    // 尝试从本地存储获取设置
    const savedSettings = localStorage.getItem('soundSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings) as SoundSettings;

      // 确保所有必要的字段都存在
      return {
        enabled: parsedSettings.enabled !== undefined ? parsedSettings.enabled : defaultSoundSettings.enabled,
        globalVolume: parsedSettings.globalVolume !== undefined ? parsedSettings.globalVolume : defaultSoundSettings.globalVolume,
        categoryVolumes: {
          [SoundCategory.UI]: parsedSettings.categoryVolumes?.[SoundCategory.UI] !== undefined ?
            parsedSettings.categoryVolumes[SoundCategory.UI] : defaultSoundSettings.categoryVolumes[SoundCategory.UI],
          [SoundCategory.TASK]: parsedSettings.categoryVolumes?.[SoundCategory.TASK] !== undefined ?
            parsedSettings.categoryVolumes[SoundCategory.TASK] : defaultSoundSettings.categoryVolumes[SoundCategory.TASK],
          [SoundCategory.CHALLENGE]: parsedSettings.categoryVolumes?.[SoundCategory.CHALLENGE] !== undefined ?
            parsedSettings.categoryVolumes[SoundCategory.CHALLENGE] : defaultSoundSettings.categoryVolumes[SoundCategory.CHALLENGE],
          [SoundCategory.REWARD]: parsedSettings.categoryVolumes?.[SoundCategory.REWARD] !== undefined ?
            parsedSettings.categoryVolumes[SoundCategory.REWARD] : defaultSoundSettings.categoryVolumes[SoundCategory.REWARD],
          [SoundCategory.PANDA]: parsedSettings.categoryVolumes?.[SoundCategory.PANDA] !== undefined ?
            parsedSettings.categoryVolumes[SoundCategory.PANDA] : defaultSoundSettings.categoryVolumes[SoundCategory.PANDA]
        },
        categoryEnabled: {
          [SoundCategory.UI]: parsedSettings.categoryEnabled?.[SoundCategory.UI] !== undefined ?
            parsedSettings.categoryEnabled[SoundCategory.UI] : defaultSoundSettings.categoryEnabled[SoundCategory.UI],
          [SoundCategory.TASK]: parsedSettings.categoryEnabled?.[SoundCategory.TASK] !== undefined ?
            parsedSettings.categoryEnabled[SoundCategory.TASK] : defaultSoundSettings.categoryEnabled[SoundCategory.TASK],
          [SoundCategory.CHALLENGE]: parsedSettings.categoryEnabled?.[SoundCategory.CHALLENGE] !== undefined ?
            parsedSettings.categoryEnabled[SoundCategory.CHALLENGE] : defaultSoundSettings.categoryEnabled[SoundCategory.CHALLENGE],
          [SoundCategory.REWARD]: parsedSettings.categoryEnabled?.[SoundCategory.REWARD] !== undefined ?
            parsedSettings.categoryEnabled[SoundCategory.REWARD] : defaultSoundSettings.categoryEnabled[SoundCategory.REWARD],
          [SoundCategory.PANDA]: parsedSettings.categoryEnabled?.[SoundCategory.PANDA] !== undefined ?
            parsedSettings.categoryEnabled[SoundCategory.PANDA] : defaultSoundSettings.categoryEnabled[SoundCategory.PANDA]
        }
      };
    }
  } catch (error) {
    console.error('Failed to load sound settings:', error);
  }

  // 如果没有保存的设置或加载失败，返回默认设置
  return { ...defaultSoundSettings };
}

/**
 * 设置音效设置
 * @param settings 音效设置
 */
export function setSoundSettings(settings: SoundSettings): void {
  try {
    // 应用设置
    soundEnabled = settings.enabled;
    globalVolume = settings.globalVolume;

    // 应用类别音量
    Object.entries(settings.categoryVolumes).forEach(([category, volume]) => {
      categoryVolumes[category as SoundCategory] = volume;
    });

    // 应用类别启用状态
    Object.entries(settings.categoryEnabled).forEach(([category, enabled]) => {
      categoryEnabled[category as SoundCategory] = enabled;
    });

    // 保存到本地存储
    localStorage.setItem('soundSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save sound settings:', error);
  }
}

/**
 * 播放熊猫互动音效
 * @param mood 熊猫心情
 * @param volume 音量（0-1）
 * @returns 是否成功播放
 */
export function playPandaMoodSound(mood: 'happy' | 'sad', volume: number = 0.5): boolean {
  const soundType = mood === 'happy' ? SoundType.PANDA_HAPPY : SoundType.PANDA_SAD;
  return playSound(soundType, volume);
}
