// src/components/settings/SyncSettingsPanel.tsx
import React, { useState } from 'react';
import { useOptimizedSync } from '@/hooks/useOptimizedSync';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import OptimizedSyncStatusIndicator from '@/components/sync/OptimizedSyncStatusIndicator';
import { useLanguage } from '@/hooks/useLanguage';

interface SyncSettingsPanelProps {
  className?: string;
}

/**
 * 同步设置面板组件
 * 
 * 允许用户调整同步设置
 */
const SyncSettingsPanel: React.FC<SyncSettingsPanelProps> = ({
  className = ''
}) => {
  // 同步状态和配置
  const { 
    syncConfig, 
    updateConfig, 
    triggerSync, 
    isOnline,
    isSyncing,
    pendingCount
  } = useOptimizedSync();
  
  // 语言
  const { currentLanguage } = useLanguage();
  
  // 编辑状态
  const [editedConfig, setEditedConfig] = useState(syncConfig);
  
  // 处理配置变更
  const handleConfigChange = (key: keyof typeof editedConfig, value: any) => {
    setEditedConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 处理保存配置
  const handleSaveConfig = () => {
    playSound(SoundType.BUTTON_CLICK);
    updateConfig(editedConfig);
  };
  
  // 处理重置配置
  const handleResetConfig = () => {
    playSound(SoundType.BUTTON_CLICK);
    setEditedConfig(syncConfig);
  };
  
  // 处理手动同步
  const handleManualSync = () => {
    playSound(SoundType.BUTTON_CLICK);
    triggerSync();
  };
  
  // 获取本地化文本
  const getText = (zh: string, en: string) => {
    return currentLanguage === 'zh' ? zh : en;
  };
  
  return (
    <div className={`sync-settings-panel ${className}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {getText('数据同步设置', 'Data Sync Settings')}
      </h2>
      
      {/* 同步状态 */}
      <div className="sync-status bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-3">
          {getText('同步状态', 'Sync Status')}
        </h3>
        
        <OptimizedSyncStatusIndicator variant="full" position="inline" />
        
        <div className="mt-4">
          <Button
            variant="jade"
            onClick={handleManualSync}
            disabled={isSyncing || !isOnline}
            className="w-full"
          >
            {getText('立即同步', 'Sync Now')}
            {pendingCount > 0 && ` (${pendingCount})`}
          </Button>
        </div>
      </div>
      
      {/* 基本设置 */}
      <div className="basic-settings mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-3">
          {getText('基本设置', 'Basic Settings')}
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* 自动同步间隔 */}
          <div className="setting-item">
            <label className="text-sm text-gray-600 block mb-1">
              {getText('自动同步间隔', 'Auto Sync Interval')}
              : {editedConfig.autoSyncInterval / 1000}s
            </label>
            <input
              type="range"
              min="5000"
              max="300000"
              step="5000"
              value={editedConfig.autoSyncInterval}
              onChange={(e) => handleConfigChange('autoSyncInterval', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5s</span>
              <span>30s</span>
              <span>60s</span>
              <span>5m</span>
            </div>
          </div>
          
          {/* 批量同步大小 */}
          <div className="setting-item">
            <label className="text-sm text-gray-600 block mb-1">
              {getText('批量同步大小', 'Batch Size')}
              : {editedConfig.batchSize}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={editedConfig.batchSize}
              onChange={(e) => handleConfigChange('batchSize', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5</span>
              <span>20</span>
              <span>35</span>
              <span>50</span>
            </div>
          </div>
          
          {/* 最大重试次数 */}
          <div className="setting-item">
            <label className="text-sm text-gray-600 block mb-1">
              {getText('最大重试次数', 'Max Retry Count')}
              : {editedConfig.maxRetryCount}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={editedConfig.maxRetryCount}
              onChange={(e) => handleConfigChange('maxRetryCount', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>3</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 高级设置 */}
      <div className="advanced-settings mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-3">
          {getText('高级设置', 'Advanced Settings')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 增量同步 */}
          <div className="setting-item flex items-center justify-between">
            <label className="text-sm text-gray-600">
              {getText('增量同步', 'Incremental Sync')}
            </label>
            <div className="form-switch">
              <input
                type="checkbox"
                checked={editedConfig.enableIncrementalSync}
                onChange={(e) => handleConfigChange('enableIncrementalSync', e.target.checked)}
                className="toggle-checkbox"
              />
              <label className="toggle-label"></label>
            </div>
          </div>
          
          {/* 优先级同步 */}
          <div className="setting-item flex items-center justify-between">
            <label className="text-sm text-gray-600">
              {getText('优先级同步', 'Priority Sync')}
            </label>
            <div className="form-switch">
              <input
                type="checkbox"
                checked={editedConfig.enablePrioritySync}
                onChange={(e) => handleConfigChange('enablePrioritySync', e.target.checked)}
                className="toggle-checkbox"
              />
              <label className="toggle-label"></label>
            </div>
          </div>
          
          {/* 数据压缩 */}
          <div className="setting-item flex items-center justify-between">
            <label className="text-sm text-gray-600">
              {getText('数据压缩', 'Data Compression')}
            </label>
            <div className="form-switch">
              <input
                type="checkbox"
                checked={editedConfig.enableCompression}
                onChange={(e) => handleConfigChange('enableCompression', e.target.checked)}
                className="toggle-checkbox"
              />
              <label className="toggle-label"></label>
            </div>
          </div>
          
          {/* 同步日志 */}
          <div className="setting-item flex items-center justify-between">
            <label className="text-sm text-gray-600">
              {getText('同步日志', 'Sync Logging')}
            </label>
            <div className="form-switch">
              <input
                type="checkbox"
                checked={editedConfig.enableSyncLogging}
                onChange={(e) => handleConfigChange('enableSyncLogging', e.target.checked)}
                className="toggle-checkbox"
              />
              <label className="toggle-label"></label>
            </div>
          </div>
        </div>
      </div>
      
      {/* 冲突解决策略 */}
      <div className="conflict-resolution mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-3">
          {getText('冲突解决策略', 'Conflict Resolution')}
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="setting-item">
            <label className="text-sm text-gray-600 block mb-2">
              {getText('当本地和服务器数据冲突时', 'When local and server data conflict')}
            </label>
            
            <div className="flex flex-col space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="conflictResolution"
                  value="client-wins"
                  checked={editedConfig.conflictResolution === 'client-wins'}
                  onChange={() => handleConfigChange('conflictResolution', 'client-wins')}
                  className="form-radio"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {getText('本地优先', 'Client Wins')}
                </span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="conflictResolution"
                  value="server-wins"
                  checked={editedConfig.conflictResolution === 'server-wins'}
                  onChange={() => handleConfigChange('conflictResolution', 'server-wins')}
                  className="form-radio"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {getText('服务器优先', 'Server Wins')}
                </span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="conflictResolution"
                  value="manual"
                  checked={editedConfig.conflictResolution === 'manual'}
                  onChange={() => handleConfigChange('conflictResolution', 'manual')}
                  className="form-radio"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {getText('手动解决', 'Manual Resolution')}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* 按钮 */}
      <div className="buttons flex space-x-4">
        <Button
          variant="jade"
          onClick={handleSaveConfig}
          className="flex-1"
        >
          {getText('保存设置', 'Save Settings')}
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleResetConfig}
          className="flex-1"
        >
          {getText('重置', 'Reset')}
        </Button>
      </div>
      
      {/* 说明 */}
      <div className="explanation mt-6 bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium text-gray-700 mb-2">
          {getText('关于数据同步', 'About Data Synchronization')}
        </h4>
        <p className="mb-2">
          {getText(
            '数据同步确保您的数据在所有设备上保持一致。即使在离线状态下，您也可以继续使用应用，数据将在恢复网络连接后自动同步。',
            'Data synchronization ensures your data stays consistent across all devices. You can continue using the app even when offline, and your data will automatically sync when network connection is restored.'
          )}
        </p>
        <p>
          {getText(
            '增量同步只发送已更改的数据，节省流量和电池。优先级同步确保重要数据先同步。',
            'Incremental sync only sends changed data, saving bandwidth and battery. Priority sync ensures important data syncs first.'
          )}
        </p>
      </div>
    </div>
  );
};

export default SyncSettingsPanel;
