// src/components/settings/SoundSettingsPanel.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageProvider';
import { 
  getSoundSettings, 
  setSoundSettings, 
  enableSound, 
  disableSound, 
  setGlobalVolume,
  SoundCategory,
  setCategoryVolume,
  enableCategory,
  disableCategory
} from '@/utils/sound';
import { playSound, SoundType } from '@/utils/sound';
import Button from '@/components/common/Button';
import Switch from '@/components/common/Switch';

// Define label structure directly in the component for now
const panelLabels = {
      soundSettings: {
        title: {
          en: 'Sound Settings',
          zh: '音效设置'
        },
        globalSettings: {
          en: 'Global Settings',
          zh: '全局设置'
        },
        enableSound: {
          en: 'Enable Sound',
          zh: '启用音效'
        },
        volume: {
          en: 'Volume',
          zh: '音量'
        },
        categories: {
          en: 'Sound Categories',
          zh: '音效类别'
        },
        uiSounds: {
          en: 'UI Sounds',
          zh: '界面音效'
        },
        taskSounds: {
          en: 'Task Sounds',
          zh: '任务音效'
        },
        challengeSounds: {
          en: 'Challenge Sounds',
          zh: '挑战音效'
        },
        rewardSounds: {
          en: 'Reward Sounds',
          zh: '奖励音效'
        },
        pandaSounds: {
          en: 'Panda Sounds',
          zh: '熊猫音效'
        },
        testSound: {
          en: 'Test Sound',
          zh: '测试音效'
        },
        resetDefaults: {
          en: 'Reset to Defaults',
          zh: '恢复默认设置'
        }
      }
};

/**
 * 音效设置面板组件
 * 
 * 允许用户自定义音效设置，包括：
 * - 全局音效开关
 * - 全局音量控制
 * - 不同类别音效的音量控制
 * - 不同类别音效的开关控制
 */
const SoundSettingsPanel: React.FC = () => {
  const { language } = useLanguage();

  // Helper to get localized label
  const getLabel = (path: string) => {
    const keys = path.split('.');
    let current: any = panelLabels;
    for (const key of keys) {
      current = current[key];
      if (!current) return path; // Fallback to path if not found
    }
    return current[language] || current.en || path; // Prioritize current lang, then EN, then path
  };

  // 状态
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [globalVolume, setGlobalVolumeState] = useState(0.5);
  const [categoryVolumes, setCategoryVolumes] = useState<Record<SoundCategory, number>>({
    [SoundCategory.UI]: 0.5,
    [SoundCategory.TASK]: 0.5,
    [SoundCategory.CHALLENGE]: 0.5,
    [SoundCategory.REWARD]: 0.5,
    [SoundCategory.PANDA]: 0.5
  });
  const [categoryEnabled, setCategoryEnabled] = useState<Record<SoundCategory, boolean>>({
    [SoundCategory.UI]: true,
    [SoundCategory.TASK]: true,
    [SoundCategory.CHALLENGE]: true,
    [SoundCategory.REWARD]: true,
    [SoundCategory.PANDA]: true
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // 初始化 - 加载保存的设置
  useEffect(() => {
    const settings = getSoundSettings();
    setSoundEnabled(settings.enabled);
    setGlobalVolumeState(settings.globalVolume);
    
    // 设置类别音量
    const volumes: Record<SoundCategory, number> = {
      [SoundCategory.UI]: settings.categoryVolumes[SoundCategory.UI] || 0.5,
      [SoundCategory.TASK]: settings.categoryVolumes[SoundCategory.TASK] || 0.5,
      [SoundCategory.CHALLENGE]: settings.categoryVolumes[SoundCategory.CHALLENGE] || 0.5,
      [SoundCategory.REWARD]: settings.categoryVolumes[SoundCategory.REWARD] || 0.5,
      [SoundCategory.PANDA]: settings.categoryVolumes[SoundCategory.PANDA] || 0.5
    };
    setCategoryVolumes(volumes);
    
    // 设置类别启用状态
    const enabled: Record<SoundCategory, boolean> = {
      [SoundCategory.UI]: settings.categoryEnabled[SoundCategory.UI] !== false,
      [SoundCategory.TASK]: settings.categoryEnabled[SoundCategory.TASK] !== false,
      [SoundCategory.CHALLENGE]: settings.categoryEnabled[SoundCategory.CHALLENGE] !== false,
      [SoundCategory.REWARD]: settings.categoryEnabled[SoundCategory.REWARD] !== false,
      [SoundCategory.PANDA]: settings.categoryEnabled[SoundCategory.PANDA] !== false
    };
    setCategoryEnabled(enabled);
  }, []);

  // 处理全局音效开关变化
  const handleSoundEnabledChange = (enabled: boolean) => {
    setSoundEnabled(enabled);
    if (enabled) {
      enableSound();
      // 播放测试音效
      setTimeout(() => {
        playSound(SoundType.BUTTON_CLICK, globalVolume);
      }, 300);
    } else {
      disableSound();
    }
    
    // 保存设置
    setSoundSettings({
      enabled,
      globalVolume,
      categoryVolumes,
      categoryEnabled
    });
  };

  // 处理全局音量变化
  const handleGlobalVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setGlobalVolumeState(volume);
    setGlobalVolume(volume);
    
    // 保存设置
    setSoundSettings({
      enabled: soundEnabled,
      globalVolume: volume,
      categoryVolumes,
      categoryEnabled
    });
  };

  // 处理类别音量变化
  const handleCategoryVolumeChange = (category: SoundCategory, volume: number) => {
    const newCategoryVolumes = {
      ...categoryVolumes,
      [category]: volume
    };
    setCategoryVolumes(newCategoryVolumes);
    setCategoryVolume(category, volume);
    
    // 保存设置
    setSoundSettings({
      enabled: soundEnabled,
      globalVolume,
      categoryVolumes: newCategoryVolumes,
      categoryEnabled
    });
  };

  // 处理类别开关变化
  const handleCategoryEnabledChange = (category: SoundCategory, enabled: boolean) => {
    const newCategoryEnabled = {
      ...categoryEnabled,
      [category]: enabled
    };
    setCategoryEnabled(newCategoryEnabled);
    
    if (enabled) {
      enableCategory(category);
    } else {
      disableCategory(category);
    }
    
    // 保存设置
    setSoundSettings({
      enabled: soundEnabled,
      globalVolume,
      categoryVolumes,
      categoryEnabled: newCategoryEnabled
    });
  };

  // 测试音效
  const handleTestSound = (category: SoundCategory) => {
    let soundType: SoundType;
    
    switch (category) {
      case SoundCategory.UI:
        soundType = SoundType.BUTTON_CLICK;
        break;
      case SoundCategory.TASK:
        soundType = SoundType.TASK_COMPLETE;
        break;
      case SoundCategory.CHALLENGE:
        soundType = SoundType.CHALLENGE_COMPLETE;
        break;
      case SoundCategory.REWARD:
        soundType = SoundType.REWARD_COMMON;
        break;
      case SoundCategory.PANDA:
        soundType = SoundType.PANDA_HAPPY;
        break;
      default:
        soundType = SoundType.BUTTON_CLICK;
    }
    
    playSound(soundType, categoryVolumes[category] * globalVolume);
  };

  // 重置为默认设置
  const handleResetDefaults = () => {
    // 默认设置
    const defaultSettings = {
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
    
    // 更新状态
    setSoundEnabled(defaultSettings.enabled);
    setGlobalVolumeState(defaultSettings.globalVolume);
    setCategoryVolumes(defaultSettings.categoryVolumes);
    setCategoryEnabled(defaultSettings.categoryEnabled);
    
    // 应用设置
    if (defaultSettings.enabled) {
      enableSound();
    } else {
      disableSound();
    }
    setGlobalVolume(defaultSettings.globalVolume);
    
    Object.entries(defaultSettings.categoryVolumes).forEach(([category, volume]) => {
      setCategoryVolume(category as SoundCategory, volume);
    });
    
    Object.entries(defaultSettings.categoryEnabled).forEach(([category, enabled]) => {
      if (enabled) {
        enableCategory(category as SoundCategory);
      } else {
        disableCategory(category as SoundCategory);
      }
    });
    
    // 保存设置
    setSoundSettings(defaultSettings);
    
    // 播放测试音效
    playSound(SoundType.SUCCESS, defaultSettings.globalVolume);
  };

  // 获取类别名称
  const getCategoryName = (category: SoundCategory): string => {
    switch (category) {
      case SoundCategory.UI:
        return getLabel('soundSettings.uiSounds');
      case SoundCategory.TASK:
        return getLabel('soundSettings.taskSounds');
      case SoundCategory.CHALLENGE:
        return getLabel('soundSettings.challengeSounds');
      case SoundCategory.REWARD:
        return getLabel('soundSettings.rewardSounds');
      case SoundCategory.PANDA:
        return getLabel('soundSettings.pandaSounds');
      default:
        return category;
    }
  };

  return (
    <div className="sound-settings-panel">
      <h3 className="text-lg font-medium mb-4 text-jade-800">
        {getLabel('soundSettings.title')}
      </h3>
      
      {/* 全局设置 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-md font-medium mb-3 text-jade-700">
          {getLabel('soundSettings.globalSettings')}
        </h4>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {getLabel('soundSettings.enableSound')}
          </span>
          <Switch
            checked={soundEnabled}
            onChange={handleSoundEnabledChange}
            size="medium"
            color="jade"
          />
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">
              {getLabel('soundSettings.volume')}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(globalVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={globalVolume}
            onChange={handleGlobalVolumeChange}
            disabled={!soundEnabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          />
        </div>
      </div>
      
      {/* 高级设置切换 */}
      <div className="mb-4">
        <Button
          variant="text"
          color="jade"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="text-sm"
        >
          {showAdvancedSettings ? '隐藏高级设置' : '显示高级设置'}
        </Button>
      </div>
      
      {/* 高级设置 */}
      <AnimatePresence>
        {showAdvancedSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-md font-medium mb-3 text-jade-700">
                {getLabel('soundSettings.categories')}
              </h4>
              
              {/* 类别设置 */}
              {Object.values(SoundCategory).map(category => (
                <div key={category} className="mb-4 last:mb-0 pb-3 border-b border-gray-200 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {getCategoryName(category)}
                    </span>
                    <div className="flex items-center">
                      <Button
                        variant="text"
                        size="small"
                        color="jade"
                        onClick={() => handleTestSound(category)}
                        disabled={!soundEnabled || !categoryEnabled[category]}
                        className="mr-2 text-xs"
                      >
                        {getLabel('soundSettings.testSound')}
                      </Button>
                      <Switch
                        checked={categoryEnabled[category]}
                        onChange={(checked) => handleCategoryEnabledChange(category, checked)}
                        disabled={!soundEnabled}
                        size="small"
                        color="jade"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        {getLabel('soundSettings.volume')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(categoryVolumes[category] * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={categoryVolumes[category]}
                      onChange={(e) => handleCategoryVolumeChange(category, parseFloat(e.target.value))}
                      disabled={!soundEnabled || !categoryEnabled[category]}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                    />
                  </div>
                </div>
              ))}
              
              {/* 重置按钮 */}
              <div className="mt-4 text-center">
                <Button
                  variant="outlined"
                  color="jade"
                  size="small"
                  onClick={handleResetDefaults}
                >
                  {getLabel('soundSettings.resetDefaults')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoundSettingsPanel;
