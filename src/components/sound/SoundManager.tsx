// src/components/sound/SoundManager.tsx
import React, { useEffect, useState } from 'react';
import {
  preloadAllSounds,
  enableSound,
  getSoundSettings,
  setGlobalVolume,
  setCategoryVolume,
  enableCategory,
  disableCategory,
  SoundCategory
} from '@/utils/sound';
import { useBackgroundMusic } from '@/context/BackgroundMusicProvider';
import { BackgroundMusicType } from '@/utils/backgroundMusic';
import SoundLoadingIndicator from './SoundLoadingIndicator';

/**
 * 声音管理器组件
 *
 * 负责初始化和管理应用程序中的声音
 * - 预加载音效
 * - 自动播放背景音乐
 * - 处理用户交互以启用声音
 */
const SoundManager: React.FC = () => {
  // 状态
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // 背景音乐上下文
  const { playMusic, isPlaying, currentMusic } = useBackgroundMusic();

  // 预加载音效和加载设置
  useEffect(() => {
    // 加载音效设置
    const settings = getSoundSettings();

    // 应用设置
    if (settings.enabled) {
      enableSound();
    }
    setGlobalVolume(settings.globalVolume);

    // 应用类别设置
    Object.entries(settings.categoryVolumes).forEach(([category, volume]) => {
      setCategoryVolume(category as SoundCategory, volume);
    });

    Object.entries(settings.categoryEnabled).forEach(([category, enabled]) => {
      if (enabled) {
        enableCategory(category as SoundCategory);
      } else {
        disableCategory(category as SoundCategory);
      }
    });

    // 预加载所有音效
    preloadAllSounds({
      metadataOnly: true, // 只加载元数据，减少初始加载时间
      onProgress: () => {
        // 不再使用进度
      },
      onComplete: () => {
        console.log('All sounds preloaded successfully');
        setSoundsLoaded(true);
      },
      onError: (error) => {
        console.error('Error preloading sounds:', error);
        // 即使有错误，也标记为已加载，以便应用程序可以继续
        setSoundsLoaded(true);
      }
    });

    // 清理函数
    return () => {
      // 无需清理
    };
  }, []);

  // 监听用户交互以启用声音
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        enableSound();

        // 移除事件监听器
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };

    // 添加事件监听器
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    // 清理函数
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [userInteracted]);

  // 在用户交互后自动播放背景音乐
  useEffect(() => {
    // 如果用户已交互、音效已加载，且没有正在播放的背景音乐，则自动播放
    if (userInteracted && soundsLoaded && !isPlaying && !currentMusic) {
      // 从本地存储中获取上次播放的背景音乐
      try {
        const savedSettings = localStorage.getItem('backgroundMusicSettings');

        if (savedSettings) {
          const settings = JSON.parse(savedSettings);

          // 如果有保存的音乐类型且不是静音状态，自动播放
          if (settings.musicType && !settings.isMuted) {
            playMusic(settings.musicType as BackgroundMusicType, {
              volume: settings.volume || 0.3,
              fadeIn: true
            });
          } else {
            // 如果没有保存的音乐或者是静音状态，默认播放竹林清风
            playMusic(BackgroundMusicType.BAMBOO_FOREST, {
              volume: 0.3,
              fadeIn: true
            });
          }
        } else {
          // 如果没有保存的设置，默认播放竹林清风
          playMusic(BackgroundMusicType.BAMBOO_FOREST, {
            volume: 0.3,
            fadeIn: true
          });
        }
      } catch (error) {
        console.error('Failed to load background music settings:', error);

        // 出错时，默认播放竹林清风
        playMusic(BackgroundMusicType.BAMBOO_FOREST, {
          volume: 0.3,
          fadeIn: true
        });
      }
    }
  }, [userInteracted, soundsLoaded, isPlaying, currentMusic, playMusic]);

  // 渲染音效加载指示器
  return (
    <>
      {/* 只在加载过程中显示加载指示器 */}
      {!soundsLoaded && (
        <SoundLoadingIndicator
          position="bottom-right"
          showLabel={true}
          autoHide={true}
        />
      )}
    </>
  );
};

export default SoundManager;
