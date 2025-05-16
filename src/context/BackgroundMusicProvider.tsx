// src/context/BackgroundMusicProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BackgroundMusicType,
  playBackgroundMusic,
  stopBackgroundMusic,
  pauseBackgroundMusic,
  resumeBackgroundMusic,
  setBackgroundMusicVolume,
} from '@/utils/backgroundMusic';

// 背景音乐上下文类型
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

// 创建上下文
const BackgroundMusicContext = createContext<BackgroundMusicContextType | undefined>(undefined);

// 可用音乐轨道
const availableTracks = [
  // 环境音乐
  { 
    type: BackgroundMusicType.BAMBOO_FOREST, 
    name: '竹林清风', 
    category: '环境音乐' 
  },
  { 
    type: BackgroundMusicType.MEDITATION_AMBIENT, 
    name: '冥想氛围', 
    category: '环境音乐' 
  },
  { 
    type: BackgroundMusicType.MORNING_NATURE, 
    name: '晨曦自然', 
    category: '环境音乐' 
  },
  { 
    type: BackgroundMusicType.EVENING_CALM, 
    name: '夜晚宁静', 
    category: '环境音乐' 
  },
  
  // 传统中国音乐
  { 
    type: BackgroundMusicType.TRADITIONAL_GUZHENG, 
    name: '古筝独奏', 
    category: '传统音乐' 
  },
  { 
    type: BackgroundMusicType.TRADITIONAL_FLUTE, 
    name: '竹笛清音', 
    category: '传统音乐' 
  },
  { 
    type: BackgroundMusicType.TRADITIONAL_ENSEMBLE, 
    name: '民乐合奏', 
    category: '传统音乐' 
  },
  
  // 季节主题音乐
  { 
    type: BackgroundMusicType.SPRING_THEME, 
    name: '春日主题', 
    category: '季节主题' 
  },
  { 
    type: BackgroundMusicType.SUMMER_THEME, 
    name: '夏日主题', 
    category: '季节主题' 
  },
  { 
    type: BackgroundMusicType.AUTUMN_THEME, 
    name: '秋日主题', 
    category: '季节主题' 
  },
  { 
    type: BackgroundMusicType.WINTER_THEME, 
    name: '冬日主题', 
    category: '季节主题' 
  }
];

// 背景音乐提供者组件
export const BackgroundMusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 状态
  const [currentMusic, setCurrentMusic] = useState<BackgroundMusicType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // 默认音量
  const [previousVolume, setPreviousVolume] = useState(0.3); // 记录静音前的音量
  
  // 初始化 - 从本地存储加载设置
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('backgroundMusicSettings');
        
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          
          // 应用保存的设置
          if (settings.volume !== undefined) {
            setVolume(settings.volume);
            setBackgroundMusicVolume(settings.volume);
          }
          
          if (settings.isMuted !== undefined) {
            setIsMuted(settings.isMuted);
            if (settings.isMuted) {
              setBackgroundMusicVolume(0);
            }
          }
          
          // 如果有保存的音乐类型且不是静音状态，自动播放
          if (settings.musicType && !settings.isMuted) {
            playBackgroundMusic(settings.musicType as BackgroundMusicType, {
              volume: settings.volume || 0.3,
              fadeIn: true
            });
            setCurrentMusic(settings.musicType as BackgroundMusicType);
            setIsPlaying(true);
          }
        }
      } catch (error) {
        console.error('Failed to load background music settings:', error);
      }
    };
    
    loadSettings();
    
    // 清理函数
    return () => {
      stopBackgroundMusic();
    };
  }, []);
  
  // 保存设置到本地存储
  useEffect(() => {
    const saveSettings = () => {
      try {
        const settings = {
          volume,
          isMuted,
          musicType: currentMusic
        };
        
        localStorage.setItem('backgroundMusicSettings', JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save background music settings:', error);
      }
    };
    
    saveSettings();
  }, [volume, isMuted, currentMusic]);
  
  // 播放音乐
  const playMusic = (
    type: BackgroundMusicType,
    options?: {
      volume?: number;
      loop?: boolean;
      fadeIn?: boolean;
      fadeInDuration?: number;
    }
  ) => {
    // 如果是静音状态，使用0音量
    const effectiveVolume = isMuted ? 0 : (options?.volume !== undefined ? options.volume : volume);
    
    const success = playBackgroundMusic(type, {
      ...options,
      volume: effectiveVolume
    });
    
    if (success) {
      setCurrentMusic(type);
      setIsPlaying(true);
    }
  };
  
  // 停止音乐
  const stopMusic = (
    options?: {
      fadeOut?: boolean;
      fadeOutDuration?: number;
    }
  ) => {
    stopBackgroundMusic(options);
    setIsPlaying(false);
    setCurrentMusic(null);
  };
  
  // 暂停音乐
  const pauseMusic = () => {
    pauseBackgroundMusic();
    setIsPlaying(false);
  };
  
  // 恢复音乐
  const resumeMusic = () => {
    if (currentMusic) {
      resumeBackgroundMusic();
      setIsPlaying(true);
    }
  };
  
  // 设置音量
  const handleSetVolume = (newVolume: number) => {
    const normalizedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(normalizedVolume);
    
    // 如果不是静音状态，应用新音量
    if (!isMuted) {
      setBackgroundMusicVolume(normalizedVolume);
    }
    
    // 如果新音量为0，自动设为静音
    if (normalizedVolume === 0 && !isMuted) {
      setIsMuted(true);
      setPreviousVolume(volume);
    }
    
    // 如果从0调高音量，自动取消静音
    if (normalizedVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  // 切换静音
  const toggleMute = () => {
    if (isMuted) {
      // 取消静音
      setIsMuted(false);
      setBackgroundMusicVolume(previousVolume);
    } else {
      // 静音
      setIsMuted(true);
      setPreviousVolume(volume);
      setBackgroundMusicVolume(0);
    }
  };
  
  // 上下文值
  const contextValue: BackgroundMusicContextType = {
    currentMusic,
    isPlaying,
    isMuted,
    volume,
    playMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    setVolume: handleSetVolume,
    toggleMute,
    availableTracks
  };
  
  return (
    <BackgroundMusicContext.Provider value={contextValue}>
      {children}
    </BackgroundMusicContext.Provider>
  );
};

// 自定义钩子
export const useBackgroundMusic = (): BackgroundMusicContextType => {
  const context = useContext(BackgroundMusicContext);
  
  if (context === undefined) {
    throw new Error('useBackgroundMusic must be used within a BackgroundMusicProvider');
  }
  
  return context;
};
