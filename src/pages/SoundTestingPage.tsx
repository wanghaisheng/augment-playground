// src/pages/SoundTestingPage.tsx
import React, { useState } from 'react';
import { playSound, SoundType, playRewardSound, playTaskCompletionSound, playChallengeCompletionSound } from '@/utils/sound';
import { useBackgroundMusic } from '@/context/BackgroundMusicProvider';
import { BackgroundMusicType } from '@/utils/backgroundMusic';
import Button from '@/components/common/Button';
import PageTransition from '@/components/animation/PageTransition';
import { getAudioLoadStats } from '@/utils/soundLoader';

/**
 * 音效测试页面
 * 
 * 用于测试各种音效和背景音乐
 */
const SoundTestingPage: React.FC = () => {
  // 状态
  const [activeTab, setActiveTab] = useState<'sound' | 'music' | 'stats'>('sound');
  const [volume, setVolume] = useState<number>(0.5);
  const [loadStats, setLoadStats] = useState<any>(null);
  
  // 背景音乐上下文
  const { 
    playMusic, 
    pauseMusic, 
    resumeMusic, 
    stopMusic, 
    setVolume: setMusicVolume,
    toggleMute,
    currentMusic,
    isPlaying,
    isMuted,
    volume: musicVolume,
    availableTracks
  } = useBackgroundMusic();
  
  // 处理播放音效
  const handlePlaySound = (type: SoundType) => {
    playSound(type, volume);
  };
  
  // 处理播放奖励音效
  const handlePlayRewardSound = (rarity: string) => {
    playRewardSound(rarity, volume);
  };
  
  // 处理播放任务完成音效
  const handlePlayTaskSound = (taskType: string, priority: string) => {
    playTaskCompletionSound(taskType, priority, volume);
  };
  
  // 处理播放挑战完成音效
  const handlePlayChallengeSound = (difficulty: string) => {
    playChallengeCompletionSound(difficulty, volume);
  };
  
  // 处理播放背景音乐
  const handlePlayMusic = (type: BackgroundMusicType) => {
    playMusic(type, {
      volume: musicVolume,
      fadeIn: true
    });
  };
  
  // 处理获取加载统计信息
  const handleGetLoadStats = () => {
    try {
      const stats = getAudioLoadStats();
      setLoadStats(stats);
    } catch (error) {
      console.error('Failed to get audio load stats:', error);
      setLoadStats({ error: 'Failed to get audio load stats' });
    }
  };
  
  // 渲染音效测试面板
  const renderSoundTestPanel = () => (
    <div className="sound-test-panel">
      <h3 className="text-lg font-medium mb-4 text-jade-800">音效测试</h3>
      
      {/* 音量控制 */}
      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-2">音量: {volume.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      {/* 系统音效 */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2 text-jade-700">系统音效</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="filled" size="small" onClick={() => handlePlaySound(SoundType.BUTTON_CLICK)}>
            按钮点击
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlaySound(SoundType.SUCCESS)}>
            成功提示
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlaySound(SoundType.ERROR)}>
            错误提示
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlaySound(SoundType.NOTIFICATION)}>
            通知提示
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlaySound(SoundType.LEVEL_UP)}>
            等级提升
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlaySound(SoundType.ACHIEVEMENT)}>
            成就解锁
          </Button>
        </div>
      </div>
      
      {/* 奖励音效 */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2 text-jade-700">奖励音效</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="filled" size="small" onClick={() => handlePlayRewardSound('common')}>
            普通奖励
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlayRewardSound('uncommon')}>
            不常见奖励
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlayRewardSound('rare')}>
            稀有奖励
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlayRewardSound('epic')}>
            史诗奖励
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlayRewardSound('legendary')}>
            传说奖励
          </Button>
        </div>
      </div>
      
      {/* 任务音效 */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2 text-jade-700">任务音效</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="small" onClick={() => handlePlayTaskSound('normal', 'low')}>
            普通任务完成
          </Button>
          <Button variant="secondary" size="small" onClick={() => handlePlayTaskSound('normal', 'high')}>
            高优先级任务完成
          </Button>
          <Button variant="secondary" size="small" onClick={() => handlePlayTaskSound('main', 'low')}>
            主线任务完成
          </Button>
          <Button variant="secondary" size="small" onClick={() => handlePlaySound(SoundType.TASK_FAILED)}>
            任务失败
          </Button>
          <Button variant="secondary" size="small" onClick={() => handlePlaySound(SoundType.TASK_CREATED)}>
            任务创建
          </Button>
        </div>
      </div>
      
      {/* 挑战音效 */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2 text-jade-700">挑战音效</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="filled" size="small" onClick={() => handlePlayChallengeSound('normal')}>
            普通挑战完成
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlayChallengeSound('hard')}>
            困难挑战完成
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlayChallengeSound('expert')}>
            专家挑战完成
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlaySound(SoundType.CHALLENGE_FAILED)}>
            挑战失败
          </Button>
          <Button variant="filled" size="small" onClick={() => handlePlaySound(SoundType.CHALLENGE_UNLOCKED)}>
            挑战解锁
          </Button>
        </div>
      </div>
    </div>
  );
  
  // 渲染背景音乐测试面板
  const renderMusicTestPanel = () => (
    <div className="music-test-panel">
      <h3 className="text-lg font-medium mb-4 text-jade-800">背景音乐测试</h3>
      
      {/* 当前播放信息 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          当前状态: {isPlaying ? '播放中' : '已暂停'}
        </p>
        <p className="text-sm text-gray-600">
          当前音乐: {currentMusic ? availableTracks.find(t => t.type === currentMusic)?.name || currentMusic : '无'}
        </p>
        <p className="text-sm text-gray-600">
          音量: {musicVolume.toFixed(2)} {isMuted ? '(已静音)' : ''}
        </p>
      </div>
      
      {/* 音量控制 */}
      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-2">音量控制</label>
        <div className="flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={musicVolume}
            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <button
            onClick={toggleMute}
            className="ml-2 p-2 text-jade-600 hover:text-jade-800 focus:outline-none"
          >
            {isMuted ? '取消静音' : '静音'}
          </button>
        </div>
      </div>
      
      {/* 播放控制 */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2 text-jade-700">播放控制</h4>
        <div className="flex space-x-2">
          {isPlaying ? (
            <Button variant="jade" size="small" onClick={pauseMusic}>
              暂停
            </Button>
          ) : (
            <Button variant="jade" size="small" onClick={resumeMusic} disabled={!currentMusic}>
              恢复
            </Button>
          )}
          <Button variant="secondary" size="small" onClick={() => stopMusic({ fadeOut: true })}>
            停止
          </Button>
        </div>
      </div>
      
      {/* 音乐选择 */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2 text-jade-700">音乐选择</h4>
        
        {/* 按类别分组显示 */}
        {Object.entries(
          availableTracks.reduce((acc, track) => {
            if (!acc[track.category]) {
              acc[track.category] = [];
            }
            acc[track.category].push(track);
            return acc;
          }, {} as Record<string, typeof availableTracks>)
        ).map(([category, tracks]) => (
          <div key={category} className="mb-4">
            <h5 className="text-sm font-medium text-gray-600 mb-2">{category}</h5>
            <div className="grid grid-cols-2 gap-2">
              {tracks.map(track => (
                <Button
                  key={track.type}
                  variant={currentMusic === track.type ? 'gold' : 'secondary'}
                  size="small"
                  onClick={() => handlePlayMusic(track.type)}
                >
                  {track.name}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // 渲染统计信息面板
  const renderStatsPanel = () => (
    <div className="stats-panel">
      <h3 className="text-lg font-medium mb-4 text-jade-800">音效加载统计</h3>
      
      <Button variant="jade" size="small" onClick={handleGetLoadStats} className="mb-4">
        获取统计信息
      </Button>
      
      {loadStats && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          {loadStats.error ? (
            <p className="text-red-500">{loadStats.error}</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-2">总音效数: {loadStats.total}</p>
              <p className="text-sm text-gray-600 mb-2">已加载: {loadStats.loaded}</p>
              <p className="text-sm text-gray-600 mb-2">加载中: {loadStats.loading}</p>
              <p className="text-sm text-gray-600 mb-2">错误: {loadStats.error}</p>
              <p className="text-sm text-gray-600 mb-2">未加载: {loadStats.idle}</p>
              <p className="text-sm text-gray-600 mb-2">平均加载时间: {loadStats.averageLoadTime.toFixed(2)}ms</p>
              
              {/* 加载进度条 */}
              {loadStats.total > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-jade-600 h-2.5 rounded-full" 
                      style={{ width: `${(loadStats.loaded / loadStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {Math.round((loadStats.loaded / loadStats.total) * 100)}% 已加载
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
  
  return (
    <PageTransition>
      <div className="page-content">
        <div className="bamboo-frame">
          <h2>音效测试页面</h2>
          
          {/* 标签页切换 */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'sound' ? 'text-jade-600 border-b-2 border-jade-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('sound')}
            >
              音效测试
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'music' ? 'text-jade-600 border-b-2 border-jade-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('music')}
            >
              背景音乐测试
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'stats' ? 'text-jade-600 border-b-2 border-jade-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('stats')}
            >
              加载统计
            </button>
          </div>
          
          {/* 内容面板 */}
          <div className="content-panel">
            {activeTab === 'sound' && renderSoundTestPanel()}
            {activeTab === 'music' && renderMusicTestPanel()}
            {activeTab === 'stats' && renderStatsPanel()}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SoundTestingPage;
