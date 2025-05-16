// src/components/settings/BackgroundMusicControlsNew.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBackgroundMusic } from '@/context/BackgroundMusicProvider';
import { BackgroundMusicType } from '@/utils/backgroundMusic';
import { playSound, SoundType } from '@/utils/sound';
import Button from '@/components/common/Button';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import MusicPlayerWithVisualizer from '@/components/sound/MusicPlayerWithVisualizer';

/**
 * 背景音乐控制组件
 * 用于设置页面中控制背景音乐的播放、暂停、音量等
 */
const BackgroundMusicControlsNew: React.FC = () => {
  // 获取背景音乐上下文
  const {
    currentMusic,
    isPlaying,
    isMuted,
    volume,
    playMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    setVolume,
    toggleMute,
    availableTracks
  } = useBackgroundMusic();
  
  // 本地化标签
  const { labels } = useLocalizedView({
    scope: 'settings',
    labels: {
      backgroundMusic: {
        title: {
          en: 'Background Music',
          zh: '背景音乐'
        },
        volumeLabel: {
          en: 'Volume',
          zh: '音量'
        },
        muteButton: {
          en: 'Mute',
          zh: '静音'
        },
        unmuteButton: {
          en: 'Unmute',
          zh: '取消静音'
        },
        playButton: {
          en: 'Play',
          zh: '播放'
        },
        pauseButton: {
          en: 'Pause',
          zh: '暂停'
        },
        trackSelectLabel: {
          en: 'Select Music',
          zh: '选择音乐'
        },
        categoryLabels: {
          environment: {
            en: 'Environment',
            zh: '环境音乐'
          },
          traditional: {
            en: 'Traditional',
            zh: '传统音乐'
          },
          seasonal: {
            en: 'Seasonal',
            zh: '季节主题'
          }
        },
        noTrackSelected: {
          en: 'No music selected',
          zh: '未选择音乐'
        },
        currentlyPlaying: {
          en: 'Currently playing',
          zh: '正在播放'
        }
      }
    }
  });
  
  // 状态
  const [showTrackSelector, setShowTrackSelector] = useState(false);
  
  // 获取当前播放的音乐名称
  const getCurrentMusicName = () => {
    if (!currentMusic) return labels.backgroundMusic.noTrackSelected;
    
    const track = availableTracks.find(t => t.type === currentMusic);
    return track ? track.name : labels.backgroundMusic.noTrackSelected;
  };
  
  // 处理音量变化
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    playSound(SoundType.BUTTON_CLICK, 0.2);
  };
  
  // 处理静音切换
  const handleToggleMute = () => {
    toggleMute();
    playSound(SoundType.BUTTON_CLICK);
  };
  
  // 处理播放/暂停切换
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      if (currentMusic) {
        resumeMusic();
      } else if (availableTracks.length > 0) {
        // 如果没有选择音乐，默认播放第一首
        playMusic(availableTracks[0].type, { fadeIn: true });
      }
    }
    
    playSound(SoundType.BUTTON_CLICK);
  };
  
  // 处理音乐选择
  const handleSelectTrack = (type: BackgroundMusicType) => {
    playMusic(type, { fadeIn: true });
    setShowTrackSelector(false);
    playSound(SoundType.BUTTON_CLICK);
  };
  
  // 按类别分组音乐
  const tracksByCategory = availableTracks.reduce((acc, track) => {
    if (!acc[track.category]) {
      acc[track.category] = [];
    }
    
    acc[track.category].push(track);
    return acc;
  }, {} as Record<string, typeof availableTracks>);
  
  // 使用新的可视化播放器
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-4 text-jade-800">
        {labels.backgroundMusic.title}
      </h3>
      
      <MusicPlayerWithVisualizer
        showVisualizer={true}
        defaultVisualizerStyle="bamboo"
        colorTheme="jade"
      />
    </div>
  );
};

export default BackgroundMusicControlsNew;
