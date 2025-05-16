// src/utils/backgroundMusic.ts
/**
 * 背景音乐工具类
 * 用于管理游戏中的背景音乐播放
 */

// 背景音乐类型枚举
export enum BackgroundMusicType {
  // 环境音乐
  BAMBOO_FOREST = 'bamboo_forest',
  MEDITATION_AMBIENT = 'meditation_ambient',
  MORNING_NATURE = 'morning_nature',
  EVENING_CALM = 'evening_calm',

  // 传统中国音乐
  TRADITIONAL_GUZHENG = 'traditional_guzheng',
  TRADITIONAL_FLUTE = 'traditional_flute',
  TRADITIONAL_ENSEMBLE = 'traditional_ensemble',

  // 季节主题音乐
  SPRING_THEME = 'spring_theme',
  SUMMER_THEME = 'summer_theme',
  AUTUMN_THEME = 'autumn_theme',
  WINTER_THEME = 'winter_theme'
}

// 音乐文件路径映射
export const musicPaths: Record<BackgroundMusicType, string> = {
  // 环境音乐
  [BackgroundMusicType.BAMBOO_FOREST]: '/assets/sounds/music/bamboo_forest.mp3',
  [BackgroundMusicType.MEDITATION_AMBIENT]: '/assets/sounds/music/meditation_ambient.mp3',
  [BackgroundMusicType.MORNING_NATURE]: '/assets/sounds/music/morning_nature.mp3',
  [BackgroundMusicType.EVENING_CALM]: '/assets/sounds/music/evening_calm.mp3',

  // 传统中国音乐
  [BackgroundMusicType.TRADITIONAL_GUZHENG]: '/assets/sounds/music/traditional_guzheng.mp3',
  [BackgroundMusicType.TRADITIONAL_FLUTE]: '/assets/sounds/music/traditional_flute.mp3',
  [BackgroundMusicType.TRADITIONAL_ENSEMBLE]: '/assets/sounds/music/traditional_ensemble.mp3',

  // 季节主题音乐
  [BackgroundMusicType.SPRING_THEME]: '/assets/sounds/music/spring_theme.mp3',
  [BackgroundMusicType.SUMMER_THEME]: '/assets/sounds/music/summer_theme.mp3',
  [BackgroundMusicType.AUTUMN_THEME]: '/assets/sounds/music/autumn_theme.mp3',
  [BackgroundMusicType.WINTER_THEME]: '/assets/sounds/music/winter_theme.mp3'
};

// 音乐播放器实例
let musicPlayer: HTMLAudioElement | null = null;

// 当前播放的音乐类型
let currentMusic: BackgroundMusicType | null = null;

// 音乐播放状态
let musicEnabled = true;
let musicVolume = 0.3; // 默认音量较低，避免干扰

/**
 * 播放背景音乐
 * @param type 音乐类型
 * @param options 播放选项
 * @returns 是否成功播放
 */
export function playBackgroundMusic(
  type: BackgroundMusicType,
  options: {
    volume?: number;
    loop?: boolean;
    fadeIn?: boolean;
    fadeInDuration?: number;
  } = {}
): boolean {
  // 如果音乐被禁用，直接返回
  if (!musicEnabled) {
    return false;
  }

  try {
    // 如果已经在播放相同的音乐，不做任何操作
    if (currentMusic === type && musicPlayer && !musicPlayer.paused) {
      return true;
    }

    // 如果有正在播放的音乐，先停止
    stopBackgroundMusic(options.fadeIn ? { fadeOut: true } : undefined);

    const musicPath = musicPaths[type];

    // 尝试从soundLoader获取已加载的音频
    let audio: HTMLAudioElement | null = null;

    // 导入是异步的，但我们需要同步播放
    try {
      // 尝试从soundLoader获取已加载的音频
      const { getLoadedAudio } = require('./soundLoader');
      audio = getLoadedAudio(musicPath);
    } catch (importError) {
      // 如果导入失败，忽略错误并创建新的Audio
      console.debug('Could not import soundLoader, using fallback method', importError);
    }

    // 如果soundLoader没有加载的音频，创建新的Audio
    if (!audio) {
      audio = new Audio(musicPath);
    }

    musicPlayer = audio;
    currentMusic = type;

    // 设置选项
    musicPlayer.loop = options.loop !== undefined ? options.loop : true;

    // 设置音量
    const targetVolume = options.volume !== undefined ? options.volume : musicVolume;

    // 是否淡入
    if (options.fadeIn) {
      const fadeInDuration = options.fadeInDuration || 2000; // 默认2秒淡入
      musicPlayer.volume = 0;

      // 开始播放
      musicPlayer.play().catch(handlePlaybackError);

      // 淡入效果
      const startTime = Date.now();
      const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const ratio = Math.min(elapsed / fadeInDuration, 1);

        if (musicPlayer) {
          musicPlayer.volume = ratio * targetVolume;

          if (ratio >= 1) {
            clearInterval(fadeInterval);
          }
        } else {
          clearInterval(fadeInterval);
        }
      }, 50);
    } else {
      musicPlayer.volume = targetVolume;
      musicPlayer.play().catch(handlePlaybackError);
    }

    // 添加结束事件监听
    musicPlayer.addEventListener('ended', () => {
      if (!musicPlayer?.loop) {
        currentMusic = null;
      }
    });

    // 尝试预加载其他背景音乐
    try {
      import('./soundLoader').then(({ preloadBackgroundMusic }) => {
        // 预加载其他背景音乐，但优先级较低
        Object.values(BackgroundMusicType)
          .filter(musicType => musicType !== type) // 排除当前播放的音乐
          .forEach(musicType => {
            preloadBackgroundMusic(musicType as BackgroundMusicType, {
              priority: 1, // 低优先级
              metadataOnly: true // 只加载元数据
            }).catch(error => {
              console.debug(`Failed to preload background music: ${musicType}`, error);
            });
          });
      }).catch(error => {
        console.debug('Failed to import soundLoader for preloading', error);
      });
    } catch (error) {
      console.debug('Error in background music preloading', error);
    }

    return true;
  } catch (error) {
    console.error('Error playing background music:', error);
    return false;
  }
}

/**
 * 停止背景音乐
 * @param options 停止选项
 */
export function stopBackgroundMusic(
  options: {
    fadeOut?: boolean;
    fadeOutDuration?: number;
  } = {}
): void {
  if (!musicPlayer) return;

  if (options.fadeOut) {
    const fadeOutDuration = options.fadeOutDuration || 1000; // 默认1秒淡出
    const startVolume = musicPlayer.volume;

    const startTime = Date.now();
    const fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(elapsed / fadeOutDuration, 1);

      if (musicPlayer) {
        musicPlayer.volume = startVolume * (1 - ratio);

        if (ratio >= 1) {
          clearInterval(fadeInterval);
          musicPlayer.pause();
          musicPlayer.currentTime = 0;
        }
      } else {
        clearInterval(fadeInterval);
      }
    }, 50);
  } else {
    musicPlayer.pause();
    musicPlayer.currentTime = 0;
  }

  if (!options.fadeOut) {
    currentMusic = null;
  }
}

/**
 * 暂停背景音乐
 */
export function pauseBackgroundMusic(): void {
  if (musicPlayer) {
    musicPlayer.pause();
  }
}

/**
 * 恢复背景音乐播放
 */
export function resumeBackgroundMusic(): void {
  if (musicPlayer && currentMusic && musicEnabled) {
    musicPlayer.play().catch(handlePlaybackError);
  }
}

/**
 * 设置背景音乐音量
 * @param volume 音量（0-1）
 */
export function setBackgroundMusicVolume(volume: number): void {
  musicVolume = Math.max(0, Math.min(1, volume));

  if (musicPlayer) {
    musicPlayer.volume = musicVolume;
  }
}

/**
 * 启用背景音乐
 */
export function enableBackgroundMusic(): void {
  musicEnabled = true;

  // 如果有当前音乐，恢复播放
  if (currentMusic && musicPlayer) {
    musicPlayer.play().catch(handlePlaybackError);
  }
}

/**
 * 禁用背景音乐
 */
export function disableBackgroundMusic(): void {
  musicEnabled = false;

  if (musicPlayer) {
    musicPlayer.pause();
  }
}

/**
 * 获取当前背景音乐状态
 */
export function getBackgroundMusicState(): {
  enabled: boolean;
  currentMusic: BackgroundMusicType | null;
  volume: number;
  isPlaying: boolean;
} {
  return {
    enabled: musicEnabled,
    currentMusic,
    volume: musicVolume,
    isPlaying: !!(musicPlayer && !musicPlayer.paused)
  };
}

/**
 * 处理播放错误
 */
function handlePlaybackError(error: Error): void {
  console.warn(`Failed to play background music: ${error.message}`);

  // 如果是自动播放限制，禁用音乐功能
  if (error.name === 'NotAllowedError') {
    console.log('Music autoplay is restricted by the browser. Music will be disabled until user interaction.');
    musicEnabled = false;
  }
}
