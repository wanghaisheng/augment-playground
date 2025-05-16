// src/utils/soundLoader.ts
/**
 * 音效加载优化工具
 * 用于优化音效加载性能
 */

import { SoundType, soundPaths } from './sound';
import { BackgroundMusicType, musicPaths } from './backgroundMusic';

// 音频加载状态
export enum AudioLoadState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error'
}

// 音频加载信息
interface AudioLoadInfo {
  state: AudioLoadState;
  audio: HTMLAudioElement | null;
  error?: Error;
  loadStartTime?: number;
  loadEndTime?: number;
}

// 音频加载缓存
const audioLoadCache: Record<string, AudioLoadInfo> = {};

// 音频预加载配置
interface PreloadConfig {
  // 是否使用Web Audio API (更好的性能，但更复杂)
  useWebAudio?: boolean;
  // 是否只加载元数据 (更快，但首次播放可能有延迟)
  metadataOnly?: boolean;
  // 优先级 (1-5，5为最高)
  priority?: number;
  // 超时时间 (毫秒)
  timeout?: number;
  // 重试次数
  retries?: number;
  // 重试延迟 (毫秒)
  retryDelay?: number;
  // 加载回调
  onLoad?: (path: string) => void;
  // 错误回调
  onError?: (path: string, error: Error) => void;
  // 进度回调
  onProgress?: (path: string, progress: number) => void;
}

// 默认预加载配置
const defaultPreloadConfig: PreloadConfig = {
  useWebAudio: false,
  metadataOnly: true,
  priority: 3,
  timeout: 10000,
  retries: 2,
  retryDelay: 1000
};

// Web Audio API 上下文
let audioContext: AudioContext | null = null;

// 音频缓冲区缓存 (用于Web Audio API)
const audioBufferCache: Record<string, AudioBuffer> = {};

/**
 * 初始化Web Audio API上下文
 */
function initAudioContext(): AudioContext {
  if (!audioContext) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContextClass();
    } catch (error) {
      console.error('Web Audio API is not supported in this browser', error);
      throw error;
    }
  }
  return audioContext;
}

/**
 * 预加载音效
 * @param type 音效类型
 * @param config 预加载配置
 * @returns 加载状态Promise
 */
export async function preloadSound(
  type: SoundType,
  config: PreloadConfig = {}
): Promise<AudioLoadState> {
  const path = soundPaths[type];
  return preloadAudio(path, { ...defaultPreloadConfig, ...config });
}

/**
 * 预加载背景音乐
 * @param type 背景音乐类型
 * @param config 预加载配置
 * @returns 加载状态Promise
 */
export async function preloadBackgroundMusic(
  type: BackgroundMusicType,
  config: PreloadConfig = {}
): Promise<AudioLoadState> {
  const path = musicPaths[type];
  // 背景音乐默认加载完整文件，不只是元数据
  return preloadAudio(path, { 
    ...defaultPreloadConfig, 
    metadataOnly: false,
    ...config 
  });
}

/**
 * 预加载音频文件
 * @param path 音频文件路径
 * @param config 预加载配置
 * @returns 加载状态Promise
 */
async function preloadAudio(
  path: string,
  config: PreloadConfig
): Promise<AudioLoadState> {
  // 合并配置
  const finalConfig = { ...defaultPreloadConfig, ...config };
  
  // 检查是否已加载
  if (audioLoadCache[path] && audioLoadCache[path].state === AudioLoadState.LOADED) {
    return AudioLoadState.LOADED;
  }
  
  // 初始化加载信息
  if (!audioLoadCache[path]) {
    audioLoadCache[path] = {
      state: AudioLoadState.IDLE,
      audio: null
    };
  }
  
  // 设置加载状态
  audioLoadCache[path].state = AudioLoadState.LOADING;
  audioLoadCache[path].loadStartTime = Date.now();
  
  try {
    // 使用Web Audio API加载
    if (finalConfig.useWebAudio) {
      return await loadWithWebAudio(path, finalConfig);
    } 
    // 使用HTML Audio元素加载
    else {
      return await loadWithHtmlAudio(path, finalConfig);
    }
  } catch (error) {
    // 处理加载错误
    audioLoadCache[path].state = AudioLoadState.ERROR;
    audioLoadCache[path].error = error as Error;
    
    // 调用错误回调
    if (finalConfig.onError) {
      finalConfig.onError(path, error as Error);
    }
    
    console.error(`Failed to preload audio: ${path}`, error);
    return AudioLoadState.ERROR;
  }
}

/**
 * 使用HTML Audio元素加载音频
 * @param path 音频文件路径
 * @param config 预加载配置
 * @returns 加载状态Promise
 */
async function loadWithHtmlAudio(
  path: string,
  config: PreloadConfig
): Promise<AudioLoadState> {
  return new Promise((resolve, reject) => {
    // 创建Audio元素
    const audio = new Audio();
    
    // 设置预加载模式
    audio.preload = config.metadataOnly ? 'metadata' : 'auto';
    
    // 设置超时
    const timeoutId = setTimeout(() => {
      handleError(new Error(`Timeout loading audio: ${path}`));
    }, config.timeout);
    
    // 加载成功处理
    const handleLoad = () => {
      clearTimeout(timeoutId);
      audioLoadCache[path].state = AudioLoadState.LOADED;
      audioLoadCache[path].audio = audio;
      audioLoadCache[path].loadEndTime = Date.now();
      
      // 调用加载回调
      if (config.onLoad) {
        config.onLoad(path);
      }
      
      resolve(AudioLoadState.LOADED);
    };
    
    // 加载错误处理
    const handleError = (error: Error) => {
      clearTimeout(timeoutId);
      
      // 尝试重试
      if ((config.retries || 0) > 0) {
        setTimeout(() => {
          preloadAudio(path, {
            ...config,
            retries: (config.retries || 0) - 1
          }).then(resolve).catch(reject);
        }, config.retryDelay);
      } else {
        audioLoadCache[path].state = AudioLoadState.ERROR;
        audioLoadCache[path].error = error;
        reject(error);
      }
    };
    
    // 进度处理
    const handleProgress = (event: ProgressEvent) => {
      if (event.lengthComputable && config.onProgress) {
        const progress = event.loaded / event.total;
        config.onProgress(path, progress);
      }
    };
    
    // 添加事件监听
    audio.addEventListener('canplaythrough', handleLoad, { once: true });
    audio.addEventListener('error', () => handleError(new Error(`Failed to load audio: ${path}`)), { once: true });
    
    // 如果只加载元数据，则在loadedmetadata事件时就认为加载完成
    if (config.metadataOnly) {
      audio.addEventListener('loadedmetadata', handleLoad, { once: true });
    }
    
    // 监听进度
    if (config.onProgress) {
      audio.addEventListener('progress', handleProgress);
    }
    
    // 开始加载
    audio.src = path;
    audio.load();
  });
}

/**
 * 使用Web Audio API加载音频
 * @param path 音频文件路径
 * @param config 预加载配置
 * @returns 加载状态Promise
 */
async function loadWithWebAudio(
  path: string,
  config: PreloadConfig
): Promise<AudioLoadState> {
  try {
    // 初始化AudioContext
    const context = initAudioContext();
    
    // 加载音频文件
    const response = await fetch(path);
    
    // 检查响应
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 获取ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    
    // 解码音频数据
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    
    // 缓存音频缓冲区
    audioBufferCache[path] = audioBuffer;
    
    // 更新加载状态
    audioLoadCache[path].state = AudioLoadState.LOADED;
    audioLoadCache[path].loadEndTime = Date.now();
    
    // 调用加载回调
    if (config.onLoad) {
      config.onLoad(path);
    }
    
    return AudioLoadState.LOADED;
  } catch (error) {
    // 处理加载错误
    audioLoadCache[path].state = AudioLoadState.ERROR;
    audioLoadCache[path].error = error as Error;
    
    // 调用错误回调
    if (config.onError) {
      config.onError(path, error as Error);
    }
    
    throw error;
  }
}

/**
 * 获取已加载的音频元素
 * @param path 音频文件路径
 * @returns 音频元素或null
 */
export function getLoadedAudio(path: string): HTMLAudioElement | null {
  if (
    audioLoadCache[path] && 
    audioLoadCache[path].state === AudioLoadState.LOADED &&
    audioLoadCache[path].audio
  ) {
    return audioLoadCache[path].audio;
  }
  return null;
}

/**
 * 获取已加载的音频缓冲区
 * @param path 音频文件路径
 * @returns 音频缓冲区或null
 */
export function getLoadedAudioBuffer(path: string): AudioBuffer | null {
  return audioBufferCache[path] || null;
}

/**
 * 预加载所有音效
 * @param config 预加载配置
 */
export async function preloadAllSounds(config: PreloadConfig = {}): Promise<void> {
  const promises = Object.values(SoundType).map(type => 
    preloadSound(type as SoundType, config)
  );
  
  await Promise.all(promises);
}

/**
 * 预加载所有背景音乐
 * @param config 预加载配置
 */
export async function preloadAllBackgroundMusic(config: PreloadConfig = {}): Promise<void> {
  const promises = Object.values(BackgroundMusicType).map(type => 
    preloadBackgroundMusic(type as BackgroundMusicType, config)
  );
  
  await Promise.all(promises);
}

/**
 * 清除音频缓存
 * @param path 音频文件路径，如果不提供则清除所有缓存
 */
export function clearAudioCache(path?: string): void {
  if (path) {
    delete audioLoadCache[path];
    delete audioBufferCache[path];
  } else {
    Object.keys(audioLoadCache).forEach(key => {
      delete audioLoadCache[key];
    });
    
    Object.keys(audioBufferCache).forEach(key => {
      delete audioBufferCache[key];
    });
  }
}

/**
 * 获取音频加载统计信息
 */
export function getAudioLoadStats(): {
  total: number;
  loaded: number;
  loading: number;
  error: number;
  idle: number;
  averageLoadTime: number;
} {
  const stats = {
    total: 0,
    loaded: 0,
    loading: 0,
    error: 0,
    idle: 0,
    loadTimes: [] as number[]
  };
  
  Object.values(audioLoadCache).forEach(info => {
    stats.total++;
    
    if (info.state === AudioLoadState.LOADED) {
      stats.loaded++;
      
      if (info.loadStartTime && info.loadEndTime) {
        stats.loadTimes.push(info.loadEndTime - info.loadStartTime);
      }
    } else if (info.state === AudioLoadState.LOADING) {
      stats.loading++;
    } else if (info.state === AudioLoadState.ERROR) {
      stats.error++;
    } else {
      stats.idle++;
    }
  });
  
  const averageLoadTime = stats.loadTimes.length > 0
    ? stats.loadTimes.reduce((sum, time) => sum + time, 0) / stats.loadTimes.length
    : 0;
  
  return {
    total: stats.total,
    loaded: stats.loaded,
    loading: stats.loading,
    error: stats.error,
    idle: stats.idle,
    averageLoadTime
  };
}
