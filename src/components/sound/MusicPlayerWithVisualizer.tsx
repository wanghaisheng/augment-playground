// src/components/sound/MusicPlayerWithVisualizer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBackgroundMusic } from '@/context/BackgroundMusicProvider';
import { BackgroundMusicType } from '@/utils/backgroundMusic';
import MusicVisualizer, { VisualizerStyle } from './MusicVisualizer';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';

// 播放器属性
interface MusicPlayerWithVisualizerProps {
  className?: string;
  compact?: boolean;
  showVisualizer?: boolean;
  defaultVisualizerStyle?: VisualizerStyle;
  colorTheme?: 'jade' | 'gold' | 'blue' | 'purple' | 'rainbow';
}

/**
 * 带可视化效果的音乐播放器组件
 *
 * 结合了背景音乐控制和音乐可视化效果
 */
const MusicPlayerWithVisualizer: React.FC<MusicPlayerWithVisualizerProps> = ({
  className = '',
  compact = false,
  showVisualizer = true,
  defaultVisualizerStyle = 'bamboo',
  colorTheme = 'jade'
}) => {
  // 背景音乐上下文
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

  // 状态
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [visualizerStyle, setVisualizerStyle] = useState<VisualizerStyle>(defaultVisualizerStyle);
  const [showTrackSelector, setShowTrackSelector] = useState(false);
  const [showVisualizerSettings, setShowVisualizerSettings] = useState(false);
  const [visualizerSensitivity, setVisualizerSensitivity] = useState(1.0);
  const [visualizerSmoothing, setVisualizerSmoothing] = useState(0.8);

  // 引用
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 当前播放的音乐信息
  const currentTrack = currentMusic
    ? availableTracks.find(track => track.type === currentMusic)
    : null;

  // 创建音频元素
  useEffect(() => {
    if (currentMusic && isPlaying) {
      // 获取音乐路径
      const musicPath = `/assets/sounds/music/${currentMusic}.mp3`;

      // 创建音频元素
      const audio = new Audio(musicPath);
      audio.loop = true;
      audio.volume = isMuted ? 0 : volume;
      audio.crossOrigin = 'anonymous'; // 允许跨域访问

      // 加载并播放
      audio.load();
      audio.play().catch(err => {
        console.warn('Failed to play audio:', err);
      });

      // 保存引用
      audioRef.current = audio;
      setAudioElement(audio);

      // 清理函数
      return () => {
        audio.pause();
        audio.src = '';
        audioRef.current = null;
        setAudioElement(null);
      };
    } else {
      // 如果没有音乐或暂停，清理音频元素
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      audioRef.current = null;
      setAudioElement(null);
    }
  }, [currentMusic, isPlaying]);

  // 更新音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // 处理播放/暂停
  const handlePlayPause = () => {
    playSound(SoundType.BUTTON_CLICK);

    if (isPlaying) {
      pauseMusic();
    } else {
      if (currentMusic) {
        resumeMusic();
      } else if (availableTracks.length > 0) {
        playMusic(availableTracks[0].type, { fadeIn: true });
      }
    }
  };

  // 处理停止
  const handleStop = () => {
    playSound(SoundType.BUTTON_CLICK);
    stopMusic({ fadeOut: true });
  };

  // 处理音乐选择
  const handleSelectTrack = (type: BackgroundMusicType) => {
    playSound(SoundType.BUTTON_CLICK);
    playMusic(type, { fadeIn: true });
    setShowTrackSelector(false);
  };

  // 处理音量变化
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // 处理可视化器样式变化
  const handleVisualizerStyleChange = (style: VisualizerStyle) => {
    playSound(SoundType.BUTTON_CLICK);
    setVisualizerStyle(style);
  };

  // 按类别分组音乐
  const tracksByCategory = availableTracks.reduce((acc, track) => {
    if (!acc[track.category]) {
      acc[track.category] = [];
    }

    acc[track.category].push(track);
    return acc;
  }, {} as Record<string, typeof availableTracks>);

  // 渲染紧凑模式
  if (compact) {
    return (
      <div className={`music-player-compact ${className}`}>
        <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm">
          {/* 播放/暂停按钮 */}
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-full bg-jade-50 text-jade-600 hover:bg-jade-100 focus:outline-none"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* 当前播放信息 */}
          <div className="flex-grow truncate">
            <p className="text-xs text-gray-500 truncate">
              {currentTrack ? currentTrack.name : '未播放'}
            </p>
          </div>

          {/* 静音按钮 */}
          <button
            onClick={toggleMute}
            className="p-2 text-gray-500 hover:text-jade-600 focus:outline-none"
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* 可视化器 */}
        {showVisualizer && (
          <div className="mt-2 h-16 overflow-hidden rounded-lg">
            <MusicVisualizer
              active={isPlaying && !isMuted && !!audioElement}
              audio={audioElement || undefined}
              style={visualizerStyle}
              colorTheme={colorTheme}
              sensitivity={visualizerSensitivity}
              smoothing={visualizerSmoothing}
              height={64}
            />
          </div>
        )}
      </div>
    );
  }

  // 渲染完整模式
  return (
    <div className={`music-player ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-medium mb-4 text-jade-800">
          音乐播放器
        </h3>

        {/* 当前播放信息 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {isPlaying
              ? `正在播放: ${currentTrack ? currentTrack.name : '未知音乐'}`
              : currentTrack ? `已暂停: ${currentTrack.name}` : '未播放'
            }
          </p>
        </div>

        {/* 可视化器 */}
        {showVisualizer && (
          <div className="mb-4 h-24 overflow-hidden rounded-lg">
            <MusicVisualizer
              active={isPlaying && !isMuted && !!audioElement}
              audio={audioElement || undefined}
              style={visualizerStyle}
              colorTheme={colorTheme}
              sensitivity={visualizerSensitivity}
              smoothing={visualizerSmoothing}
              height={96}
            />
          </div>
        )}

        {/* 音量控制 */}
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-600 mr-2">
            音量:
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
            onClick={toggleMute}
            className="ml-2 p-2 text-jade-600 hover:text-jade-800 focus:outline-none"
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
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
            {isPlaying ? '暂停' : '播放'}
          </Button>

          <Button
            variant="secondary"
            size="small"
            onClick={handleStop}
            disabled={!isPlaying}
          >
            停止
          </Button>

          <Button
            variant="gold"
            size="small"
            onClick={() => setShowTrackSelector(!showTrackSelector)}
          >
            选择音乐
          </Button>

          {showVisualizer && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowVisualizerSettings(!showVisualizerSettings)}
            >
              可视化设置
            </Button>
          )}
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
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 mb-4">
                {Object.entries(tracksByCategory).map(([category, tracks]) => (
                  <div key={category} className="mb-3 last:mb-0">
                    <h4 className="text-sm font-medium text-jade-700 mb-2">{category}</h4>
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
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 可视化器设置 */}
        <AnimatePresence>
          {showVisualizerSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <h4 className="text-sm font-medium text-jade-700 mb-2">可视化样式</h4>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {(['bars', 'wave', 'circle', 'particles', 'bamboo'] as VisualizerStyle[]).map(style => (
                    <button
                      key={style}
                      onClick={() => handleVisualizerStyleChange(style)}
                      className={`text-left text-sm p-2 rounded-md ${
                        visualizerStyle === style
                          ? 'bg-jade-100 text-jade-800 border border-jade-300'
                          : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {style === 'bars' && '频谱柱状图'}
                      {style === 'wave' && '波形图'}
                      {style === 'circle' && '圆形频谱'}
                      {style === 'particles' && '粒子效果'}
                      {style === 'bamboo' && '竹子风格'}
                    </button>
                  ))}
                </div>

                <h4 className="text-sm font-medium text-jade-700 mb-2">灵敏度</h4>
                <div className="mb-3">
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={visualizerSensitivity}
                    onChange={(e) => setVisualizerSensitivity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>低</span>
                    <span>{visualizerSensitivity.toFixed(1)}</span>
                    <span>高</span>
                  </div>
                </div>

                <h4 className="text-sm font-medium text-jade-700 mb-2">平滑度</h4>
                <div className="mb-2">
                  <input
                    type="range"
                    min="0"
                    max="0.95"
                    step="0.05"
                    value={visualizerSmoothing}
                    onChange={(e) => setVisualizerSmoothing(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>低</span>
                    <span>{visualizerSmoothing.toFixed(2)}</span>
                    <span>高</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MusicPlayerWithVisualizer;
