// src/components/settings/BackgroundMusicControlsNew.tsx
import React from 'react';
import { useBackgroundMusic } from '@/context/BackgroundMusicProvider';
import { useLanguage } from '@/context/LanguageProvider';
import { Language } from '@/types';
import MusicPlayerWithVisualizer from '@/components/sound/MusicPlayerWithVisualizer';

/**
 * 定义背景音乐控制组件的标签类型
 */
interface BackgroundMusicLabels {
  backgroundMusic: {
    title: Record<Language, string>;
    volumeLabel: Record<Language, string>;
    muteButton: Record<Language, string>;
    unmuteButton: Record<Language, string>;
    playButton: Record<Language, string>;
    pauseButton: Record<Language, string>;
    trackSelectLabel: Record<Language, string>;
    categoryLabels: {
      environment: Record<Language, string>;
      traditional: Record<Language, string>;
      seasonal: Record<Language, string>;
    };
    noTrackSelected: Record<Language, string>;
    currentlyPlaying: Record<Language, string>;
  }
}

/**
 * 背景音乐控制组件
 * 用于设置页面中控制背景音乐的播放、暂停、音量等
 */
const BackgroundMusicControlsNew: React.FC = () => {
  // 获取背景音乐上下文
  useBackgroundMusic();

  // 获取当前语言
  const { language } = useLanguage();

  // 本地化标签
  const labels: BackgroundMusicLabels = {
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
  };

  // 使用新的可视化播放器
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-4 text-jade-800">
        {labels.backgroundMusic.title[language]}
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
