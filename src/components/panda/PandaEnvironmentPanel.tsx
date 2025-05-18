// src/components/panda/PandaEnvironmentPanel.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PandaEnvironmentRecord,
  getOwnedEnvironments,
  getActiveEnvironment,
  activateEnvironment
} from '@/services/pandaCustomizationService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import ScrollDialog from '@/components/game/ScrollDialog';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';

interface PandaEnvironmentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEnvironmentChanged?: () => void;
}

/**
 * 熊猫环境面板组件
 * 用于选择和定制熊猫的环境，包括背景、互动元素等
 */
const PandaEnvironmentPanel: React.FC<PandaEnvironmentPanelProps> = ({
  isOpen,
  onClose,
  onEnvironmentChanged
}) => {
  const [environments, setEnvironments] = useState<PandaEnvironmentRecord[]>([]);
  const [activeEnvironment, setActiveEnvironment] = useState<PandaEnvironmentRecord | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewEnvironment, setPreviewEnvironment] = useState<PandaEnvironmentRecord | null>(null);

  // 加载环境数据
  const loadEnvironments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取已拥有的环境
      const ownedEnvironments = await getOwnedEnvironments();
      setEnvironments(ownedEnvironments);

      // 获取当前激活的环境
      const active = await getActiveEnvironment();
      if (active) {
        setActiveEnvironment(active);
      }
    } catch (err) {
      console.error('Failed to load environments:', err);
      setError('加载环境失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (isOpen) {
      loadEnvironments();
    }
  }, [isOpen]);

  // 注册数据刷新监听
  useRegisterTableRefresh('pandaEnvironments', loadEnvironments);

  // 处理激活环境
  const handleActivateEnvironment = async (environment: PandaEnvironmentRecord) => {
    try {
      setIsUpdating(true);

      // 激活环境
      await activateEnvironment(environment.id!);

      // 播放音效
      playSound(SoundType.SUCCESS, 0.5);

      // 重新加载数据
      await loadEnvironments();

      // 通知父组件
      if (onEnvironmentChanged) {
        onEnvironmentChanged();
      }
    } catch (err) {
      console.error('Failed to activate environment:', err);
      setError('激活环境失败，请重试');
    } finally {
      setIsUpdating(false);
    }
  };

  // 处理预览环境
  const handlePreviewEnvironment = (environment: PandaEnvironmentRecord) => {
    setPreviewEnvironment(environment);

    // 播放音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
  };

  // 获取稀有度标签和样式
  const getRarityInfo = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return { label: '普通', className: 'bg-gray-100 text-gray-800 border-gray-300' };
      case 'uncommon':
        return { label: '优秀', className: 'bg-green-100 text-green-800 border-green-300' };
      case 'rare':
        return { label: '稀有', className: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'epic':
        return { label: '史诗', className: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'legendary':
        return { label: '传说', className: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: '未知', className: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  // 获取主题标签
  const getThemeLabel = (theme: string): string => {
    switch (theme) {
      case '竹林':
        return '竹林';
      case '园林':
        return '园林';
      case '山水':
        return '山水';
      case '城市':
        return '城市';
      case '节日':
        return '节日';
      default:
        return theme;
    }
  };

  // 过滤环境
  const getFilteredEnvironments = (): PandaEnvironmentRecord[] => {
    if (selectedTheme === 'all') {
      return environments;
    }

    return environments.filter(environment => environment.themeType === selectedTheme);
  };

  // 获取所有主题
  const getAllThemes = (): string[] => {
    const themes = new Set<string>();
    themes.add('all');

    environments.forEach(environment => {
      if (environment.themeType) {
        themes.add(environment.themeType);
      }
    });

    return Array.from(themes);
  };

  // 容器变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // 项目变体
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title="环境定制"
      closeOnOutsideClick={!isUpdating}
      closeOnEsc={!isUpdating}
      showCloseButton={!isUpdating}
    >
      <div className="panda-environment-panel p-4">
        {isLoading ? (
          <div className="loading-container flex justify-center items-center h-32">
            <LoadingSpinner variant="jade" size="medium" />
          </div>
        ) : error ? (
          <div className="error-container text-center p-4">
            <div className="error-message text-red-500 mb-4">{error}</div>
            <Button variant="jade" onClick={loadEnvironments}>
              重试
            </Button>
          </div>
        ) : (
          <div className="environment-content">
            {/* 当前环境 */}
            {activeEnvironment && (
              <div className="current-environment mb-6">
                <h3 className="text-lg font-bold mb-3">当前环境</h3>
                <div className="active-environment p-3 border border-jade-300 rounded-lg bg-jade-50">
                  <div className="environment-header flex justify-between items-start mb-2">
                    <div className="environment-name font-medium">
                      {activeEnvironment.name}
                    </div>
                    <div className="environment-meta flex gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getRarityInfo(activeEnvironment.rarity).className}`}>
                        {getRarityInfo(activeEnvironment.rarity).label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                        {getThemeLabel(activeEnvironment.themeType)}
                      </span>
                    </div>
                  </div>

                  <div className="environment-image-container mb-2 relative overflow-hidden rounded-lg">
                    <img
                      src={activeEnvironment.backgroundPath}
                      alt={activeEnvironment.name}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/assets/environments/default.svg';
                      }}
                    />
                    {activeEnvironment.foregroundPath && (
                      <img
                        src={activeEnvironment.foregroundPath}
                        alt={`${activeEnvironment.name} foreground`}
                        className="absolute top-0 left-0 w-full h-40 object-cover pointer-events-none"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  <div className="environment-description text-sm text-gray-600">
                    {activeEnvironment.description}
                  </div>
                </div>
              </div>
            )}

            {/* 环境预览 */}
            {previewEnvironment && (
              <div className="environment-preview mb-6">
                <h3 className="text-lg font-bold mb-3">环境预览</h3>
                <div className="preview-environment p-3 border border-gray-200 rounded-lg">
                  <div className="environment-header flex justify-between items-start mb-2">
                    <div className="environment-name font-medium">
                      {previewEnvironment.name}
                    </div>
                    <div className="environment-meta flex gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getRarityInfo(previewEnvironment.rarity).className}`}>
                        {getRarityInfo(previewEnvironment.rarity).label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                        {getThemeLabel(previewEnvironment.themeType)}
                      </span>
                    </div>
                  </div>

                  <div className="environment-image-container mb-2 relative overflow-hidden rounded-lg">
                    <img
                      src={previewEnvironment.backgroundPath}
                      alt={previewEnvironment.name}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/assets/environments/default.svg';
                      }}
                    />
                    {previewEnvironment.foregroundPath && (
                      <img
                        src={previewEnvironment.foregroundPath}
                        alt={`${previewEnvironment.name} foreground`}
                        className="absolute top-0 left-0 w-full h-40 object-cover pointer-events-none"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  <div className="environment-description text-sm text-gray-600 mb-3">
                    {previewEnvironment.description}
                  </div>

                  <div className="environment-actions flex justify-end">
                    <Button
                      variant="jade"
                      onClick={() => handleActivateEnvironment(previewEnvironment)}
                      disabled={isUpdating || (activeEnvironment && activeEnvironment.id === previewEnvironment.id)}
                    >
                      {isUpdating ? (
                        <LoadingSpinner variant="white" size="small" />
                      ) : activeEnvironment && activeEnvironment.id === previewEnvironment.id ? (
                        '当前环境'
                      ) : (
                        '激活环境'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 主题过滤器 */}
            <div className="theme-filter mb-4">
              <h3 className="text-lg font-bold mb-2">主题</h3>
              <div className="flex flex-wrap gap-2">
                {getAllThemes().map((theme) => (
                  <button
                    key={theme}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTheme === theme ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}
                    onClick={() => setSelectedTheme(theme)}
                  >
                    {theme === 'all' ? '全部' : getThemeLabel(theme)}
                  </button>
                ))}
              </div>
            </div>

            {/* 环境列表 */}
            <div className="environments-list">
              <h3 className="text-lg font-bold mb-3">可用环境</h3>
              {getFilteredEnvironments().length === 0 ? (
                <div className="no-environments text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">暂无可用环境</p>
                </div>
              ) : (
                <motion.div
                  className="environments-grid grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {getFilteredEnvironments().map((environment) => {
                    const rarityInfo = getRarityInfo(environment.rarity);
                    const isActive = activeEnvironment && activeEnvironment.id === environment.id;

                    return (
                      <motion.div
                        key={environment.id}
                        className={`environment-item p-3 rounded-lg border cursor-pointer ${
                          isActive ? 'border-jade-500 bg-jade-50' : 'border-gray-200 bg-white'
                        }`}
                        variants={itemVariants}
                        onClick={() => handlePreviewEnvironment(environment)}
                      >
                        <div className="environment-header flex justify-between items-start mb-2">
                          <div className="environment-name font-medium">
                            {environment.name}
                          </div>
                          <div className="environment-meta flex gap-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${rarityInfo.className}`}>
                              {rarityInfo.label}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                              {getThemeLabel(environment.themeType)}
                            </span>
                          </div>
                        </div>

                        <div className="environment-image-container mb-2 relative overflow-hidden rounded-lg">
                          <img
                            src={environment.backgroundPath}
                            alt={environment.name}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/assets/environments/default.svg';
                            }}
                          />
                        </div>

                        <div className="environment-description text-sm text-gray-600 line-clamp-2">
                          {environment.description}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </ScrollDialog>
  );
};

export default PandaEnvironmentPanel;
