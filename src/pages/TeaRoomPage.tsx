// src/pages/TeaRoomPage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ReflectionTriggerRecord, 
  ReflectionTriggerType,
  getUnviewedReflectionTriggers,
  markTriggerAsViewed,
  createReflectionTrigger
} from '@/services/reflectionService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import EnhancedReflectionModule from '@/components/reflection/EnhancedReflectionModule';
import ReflectionHistory from '@/components/reflection/ReflectionHistory';
import MoodTracker from '@/components/reflection/MoodTracker';
import ReflectionTriggerNotification from '@/components/reflection/ReflectionTriggerNotification';
import { playSound, SoundType } from '@/utils/sound';

/**
 * 静心茶室页面
 * 用于提供反思、情绪追踪和支持性反馈
 */
const TeaRoomPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReflectionModule, setShowReflectionModule] = useState(false);
  const [showReflectionHistory, setShowReflectionHistory] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<ReflectionTriggerRecord | null>(null);
  
  // 当前用户ID（在实际应用中，这应该从用户会话中获取）
  const userId = 'current-user';

  // 加载页面数据
  const loadPageData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 在这里可以加载其他数据
      
    } catch (err) {
      console.error('Failed to load tea room data:', err);
      setError('加载数据失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadPageData();
  }, []);

  // 注册数据刷新监听
  useRegisterTableRefresh('reflections', loadPageData);
  useRegisterTableRefresh('reflectionTriggers', loadPageData);
  useRegisterTableRefresh('moods', loadPageData);

  // 处理开始反思
  const handleStartReflection = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.5);
    
    // 创建手动触发记录
    createReflectionTrigger({
      userId,
      type: ReflectionTriggerType.MANUAL
    });
    
    // 显示反思模块
    setShowReflectionModule(true);
  };

  // 处理查看历史
  const handleViewHistory = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.5);
    
    // 显示反思历史
    setShowReflectionHistory(true);
  };

  // 处理触发接受
  const handleTriggerAccepted = (trigger: ReflectionTriggerRecord) => {
    setSelectedTrigger(trigger);
    setShowReflectionModule(true);
  };

  // 处理反思完成
  const handleReflectionComplete = () => {
    // 重置选中的触发记录
    setSelectedTrigger(null);
    
    // 重新加载页面数据
    loadPageData();
  };

  // 渲染页面内容
  const renderPageContent = () => {
    return (
      <div className="tea-room-content">
        <div className="tea-room-header mb-6">
          <h1 className="text-2xl font-bold text-jade-800 mb-2">静心茶室</h1>
          <p className="text-gray-600">
            这是一个安静的空间，你可以在这里反思、记录情绪，并获得支持和建议。
          </p>
        </div>
        
        <div className="tea-room-sections grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 情绪追踪区域 */}
          <div className="mood-tracking-section bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-jade-700 mb-4">情绪追踪</h2>
            <MoodTracker />
          </div>
          
          {/* 反思区域 */}
          <div className="reflection-section bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-amber-700 mb-4">反思</h2>
            <p className="text-gray-600 mb-4">
              花点时间反思你的经历、感受和想法，可以帮助你更好地了解自己，并找到前进的方向。
            </p>
            <div className="reflection-actions flex flex-col gap-2">
              <Button
                variant="jade"
                onClick={handleStartReflection}
                className="w-full"
              >
                开始反思
              </Button>
              <Button
                variant="secondary"
                onClick={handleViewHistory}
                className="w-full"
              >
                查看历史反思
              </Button>
            </div>
          </div>
        </div>
        
        {/* 每日提示区域 */}
        <div className="daily-tips-section bg-white p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold text-amber-700 mb-4">今日提示</h2>
          <div className="daily-tip p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start">
              <div className="tip-icon mr-3">
                <span className="text-2xl">💡</span>
              </div>
              <div className="tip-content">
                <p className="text-gray-700">
                  自我同情是心理健康的重要组成部分。当你面对困难时，试着用对待好朋友的方式对待自己，给自己一些理解和宽容。
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 反思模块 */}
        {showReflectionModule && (
          <EnhancedReflectionModule
            isOpen={showReflectionModule}
            onClose={() => setShowReflectionModule(false)}
            trigger={selectedTrigger || undefined}
            onReflectionComplete={handleReflectionComplete}
          />
        )}
        
        {/* 反思历史 */}
        {showReflectionHistory && (
          <ReflectionHistory
            isOpen={showReflectionHistory}
            onClose={() => setShowReflectionHistory(false)}
          />
        )}
        
        {/* 反思触发通知 */}
        <ReflectionTriggerNotification
          onTriggerAccepted={handleTriggerAccepted}
        />
      </div>
    );
  };

  return (
    <div className="tea-room-page bg-gray-50 min-h-screen p-4">
      {isLoading ? (
        <div className="loading-container flex justify-center items-center h-64">
          <LoadingSpinner variant="jade" size="large" />
        </div>
      ) : error ? (
        <div className="error-container text-center p-4">
          <div className="error-message text-red-500 mb-4">{error}</div>
          <Button variant="jade" onClick={loadPageData}>
            重试
          </Button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {renderPageContent()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default TeaRoomPage;
