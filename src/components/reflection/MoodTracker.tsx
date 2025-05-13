// src/components/reflection/MoodTracker.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodType, MoodIntensity, recordMood, getUserMoods, MoodRecord } from '@/services/reflectionService';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';

interface MoodTrackerProps {
  onMoodRecorded?: (mood: MoodRecord) => void;
  compact?: boolean;
  className?: string;
}

/**
 * 情绪追踪组件
 * 用于记录和显示用户的情绪状态
 */
const MoodTracker: React.FC<MoodTrackerProps> = ({
  onMoodRecorded,
  compact = false,
  className = ''
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState<MoodIntensity>(3);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentMoods, setRecentMoods] = useState<MoodRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // 当前用户ID（在实际应用中，这应该从用户会话中获取）
  const userId = 'current-user';

  // 加载最近的情绪记录
  const loadRecentMoods = async () => {
    try {
      const moods = await getUserMoods(userId, 5);
      setRecentMoods(moods);
    } catch (err) {
      console.error('Failed to load recent moods:', err);
    }
  };

  // 初始加载
  useEffect(() => {
    loadRecentMoods();
  }, []);

  // 注册数据刷新监听
  useRegisterTableRefresh('moods', loadRecentMoods);

  // 处理提交情绪
  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    try {
      setIsSubmitting(true);
      
      // 记录情绪
      const mood = await recordMood({
        userId,
        mood: selectedMood,
        intensity,
        note: note.trim() || undefined
      });
      
      // 播放音效
      playSound(SoundType.SUCCESS, 0.5);
      
      // 重置表单
      setSelectedMood(null);
      setIntensity(3);
      setNote('');
      
      // 重新加载最近的情绪记录
      await loadRecentMoods();
      
      // 通知父组件
      if (onMoodRecorded) {
        onMoodRecorded(mood);
      }
    } catch (err) {
      console.error('Failed to record mood:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 获取情绪图标和颜色
  const getMoodInfo = (mood: MoodType) => {
    switch (mood) {
      case MoodType.HAPPY:
        return { icon: '😄', color: 'bg-yellow-100 text-yellow-800', label: '开心' };
      case MoodType.CONTENT:
        return { icon: '😊', color: 'bg-green-100 text-green-800', label: '满足' };
      case MoodType.NEUTRAL:
        return { icon: '😐', color: 'bg-gray-100 text-gray-800', label: '平静' };
      case MoodType.SAD:
        return { icon: '😢', color: 'bg-blue-100 text-blue-800', label: '难过' };
      case MoodType.ANXIOUS:
        return { icon: '😰', color: 'bg-purple-100 text-purple-800', label: '焦虑' };
      case MoodType.STRESSED:
        return { icon: '😫', color: 'bg-red-100 text-red-800', label: '压力' };
      case MoodType.TIRED:
        return { icon: '😴', color: 'bg-gray-200 text-gray-800', label: '疲惫' };
      case MoodType.ENERGETIC:
        return { icon: '⚡', color: 'bg-yellow-200 text-yellow-800', label: '精力充沛' };
      case MoodType.MOTIVATED:
        return { icon: '🔥', color: 'bg-orange-100 text-orange-800', label: '有动力' };
      case MoodType.FRUSTRATED:
        return { icon: '😤', color: 'bg-red-200 text-red-800', label: '沮丧' };
      case MoodType.ANGRY:
        return { icon: '😠', color: 'bg-red-100 text-red-800', label: '生气' };
      case MoodType.CALM:
        return { icon: '😌', color: 'bg-blue-100 text-blue-800', label: '平静' };
      default:
        return { icon: '❓', color: 'bg-gray-100 text-gray-800', label: '未知' };
    }
  };

  // 获取强度标签
  const getIntensityLabel = (intensity: MoodIntensity) => {
    switch (intensity) {
      case 1: return '很轻微';
      case 2: return '轻微';
      case 3: return '中等';
      case 4: return '强烈';
      case 5: return '非常强烈';
      default: return '未知';
    }
  };

  // 渲染情绪选择器
  const renderMoodSelector = () => {
    const moods = [
      MoodType.HAPPY,
      MoodType.CONTENT,
      MoodType.NEUTRAL,
      MoodType.SAD,
      MoodType.ANXIOUS,
      MoodType.STRESSED,
      MoodType.TIRED,
      MoodType.ENERGETIC,
      MoodType.MOTIVATED,
      MoodType.FRUSTRATED,
      MoodType.ANGRY,
      MoodType.CALM
    ];
    
    return (
      <div className="mood-selector">
        <h3 className="text-lg font-bold mb-2">你现在感觉如何？</h3>
        <div className="grid grid-cols-4 gap-2">
          {moods.map((mood) => {
            const { icon, color, label } = getMoodInfo(mood);
            return (
              <motion.div
                key={mood}
                className={`mood-item p-2 rounded-lg cursor-pointer text-center ${
                  selectedMood === mood ? 'ring-2 ring-jade-500' : ''
                } ${color}`}
                onClick={() => setSelectedMood(mood)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="mood-icon text-2xl mb-1">{icon}</div>
                <div className="mood-label text-xs">{label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // 渲染强度选择器
  const renderIntensitySelector = () => {
    return (
      <div className="intensity-selector mt-4">
        <h3 className="text-lg font-bold mb-2">这种感觉有多强烈？</h3>
        <div className="flex items-center">
          <input
            type="range"
            min="1"
            max="5"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value) as MoodIntensity)}
            className="flex-grow"
          />
          <span className="ml-2 text-sm font-medium">{getIntensityLabel(intensity)}</span>
        </div>
      </div>
    );
  };

  // 渲染笔记输入框
  const renderNoteInput = () => {
    return (
      <div className="note-input mt-4">
        <h3 className="text-lg font-bold mb-2">有什么想记录的吗？（可选）</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500 h-24"
          placeholder="记录一下你的想法..."
        />
      </div>
    );
  };

  // 渲染最近的情绪记录
  const renderRecentMoods = () => {
    if (recentMoods.length === 0) {
      return (
        <div className="text-center text-gray-500 p-4">
          暂无情绪记录
        </div>
      );
    }
    
    return (
      <div className="recent-moods-list">
        {recentMoods.map((mood) => {
          const { icon, color } = getMoodInfo(mood.mood as MoodType);
          return (
            <div
              key={mood.id}
              className="mood-record flex items-center p-2 border-b border-gray-200 last:border-b-0"
            >
              <div className={`mood-icon p-2 rounded-full ${color} mr-3`}>
                <span className="text-xl">{icon}</span>
              </div>
              <div className="mood-info flex-grow">
                <div className="flex justify-between">
                  <span className="font-medium">{getMoodInfo(mood.mood as MoodType).label}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(mood.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    强度: {getIntensityLabel(mood.intensity as MoodIntensity)}
                  </span>
                </div>
                {mood.note && (
                  <p className="text-sm text-gray-700 mt-1">{mood.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 紧凑模式
  if (compact) {
    return (
      <div className={`mood-tracker-compact ${className}`}>
        <div className="flex items-center">
          <div className="mood-selector-compact flex-grow">
            <div className="flex flex-wrap gap-2">
              {[MoodType.HAPPY, MoodType.CONTENT, MoodType.NEUTRAL, MoodType.SAD, MoodType.ANXIOUS].map((mood) => {
                const { icon, color } = getMoodInfo(mood);
                return (
                  <motion.div
                    key={mood}
                    className={`mood-item p-2 rounded-full cursor-pointer ${
                      selectedMood === mood ? 'ring-2 ring-jade-500' : ''
                    } ${color}`}
                    onClick={() => setSelectedMood(mood)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="mood-icon text-xl">{icon}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <Button
            variant="jade"
            size="small"
            onClick={handleSubmit}
            disabled={!selectedMood || isSubmitting}
            className="ml-2"
          >
            记录
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mood-tracker ${className}`}>
      <div className="mood-tracker-header flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">情绪追踪</h2>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? '返回' : '历史记录'}
        </Button>
      </div>
      
      <AnimatePresence mode="wait">
        {showHistory ? (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mood-history"
          >
            <h3 className="text-lg font-bold mb-2">最近的情绪记录</h3>
            {renderRecentMoods()}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="mood-form"
          >
            {renderMoodSelector()}
            
            {selectedMood && (
              <>
                {renderIntensitySelector()}
                {renderNoteInput()}
                
                <div className="form-actions mt-4 flex justify-end">
                  <Button
                    variant="jade"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    记录情绪
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodTracker;
