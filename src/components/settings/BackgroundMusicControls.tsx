// src/components/settings/BackgroundMusicControls.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBackgroundMusic } from '@/context/BackgroundMusicProvider';
import { BackgroundMusicType } from '@/utils/backgroundMusic';
import { playSound, SoundType } from '@/utils/sound';
import Button from '@/components/common/Button';
import { useLanguage } from '@/context/LanguageProvider';
import { Language } from '@/types';

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
const BackgroundMusicControls: React.FC = () => {
  // 获取背景音乐上下文
  const {
    currentMusic,
    isPlaying,
    isMuted,
    volume,
    playMusic,
    pauseMusic,
    resumeMusic,
    setVolume,
    toggleMute,
    availableTracks
  } = useBackgroundMusic();

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

  // 状态
  const [showTrackSelector, setShowTrackSelector] = useState(false);

  // 获取当前播放的音乐名称
  const getCurrentMusicName = () => {
    if (!currentMusic) return labels.backgroundMusic.noTrackSelected[language];

    const track = availableTracks.find(t => t.type === currentMusic);
    return track ? track.name : labels.backgroundMusic.noTrackSelected[language];
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-medium mb-4 text-jade-800">
        {labels.backgroundMusic.title[language]}
      </h3>

      {/* 当前播放信息 */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {isPlaying
            ? `${labels.backgroundMusic.currentlyPlaying[language]}: ${getCurrentMusicName()}`
            : getCurrentMusicName()
          }
        </p>
      </div>

      {/* 音量控制 */}
      <div className="flex items-center mb-4">
        <span className="text-sm text-gray-600 mr-2">
          {labels.backgroundMusic.volumeLabel[language]}:
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <button
          onClick={handleToggleMute}
          className="ml-2 p-2 text-jade-600 hover:text-jade-800 focus:outline-none"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* 播放控制 */}
      <div className="flex justify-between mb-4">
        <Button
          variant="jade"
          size="small"
          onClick={handlePlayPause}
        >
          {isPlaying ? labels.backgroundMusic.pauseButton[language] : labels.backgroundMusic.playButton[language]}
        </Button>

        <Button
          variant="gold"
          size="small"
          onClick={() => setShowTrackSelector(!showTrackSelector)}
        >
          {labels.backgroundMusic.trackSelectLabel[language]}
        </Button>
      </div>

      {/* 音乐选择器 */}
      <AnimatePresence>
        {showTrackSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              {Object.entries(tracksByCategory).map(([category, tracks]) => {
                // 获取类别的本地化名称
                const categoryLabel = labels.backgroundMusic.categoryLabels[category as keyof typeof labels.backgroundMusic.categoryLabels];
                const localizedCategory = categoryLabel ? categoryLabel[language] : category;

                return (
                  <div key={category} className="mb-3 last:mb-0">
                    <h4 className="text-sm font-medium text-jade-700 mb-2">{localizedCategory}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {tracks.map(track => (
                        <button
                          key={track.type}
                          onClick={() => handleSelectTrack(track.type)}
                          className={`text-left text-sm p-2 rounded-md ${
                            currentMusic === track.type
                              ? 'bg-jade-100 text-jade-800 border border-jade-300'
                              : 'bg-white hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {track.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackgroundMusicControls;
