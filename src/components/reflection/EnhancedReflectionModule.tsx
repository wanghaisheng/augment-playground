// src/components/reflection/EnhancedReflectionModule.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';
import ScrollDialog from '@/components/game/ScrollDialog';
import { playSound, SoundType } from '@/utils/sound';
import { TaskRecord } from '@/services/taskService';
import { 
  ReflectionTriggerRecord, 
  ReflectionTriggerType,
  createReflection,
  completeReflection,
  markTriggerAsCompleted
} from '@/services/reflectionService';
import { getPandaMood, updatePandaMood } from '@/services/pandaStateService';
import MoodTracker from './MoodTracker';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface EnhancedReflectionModuleProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: number;
  taskName?: string;
  trigger?: ReflectionTriggerRecord;
  onReflectionComplete?: () => void;
}

/**
 * 增强版反思模块组件
 * 用于帮助用户反思任务完成情况和情绪状态
 */
const EnhancedReflectionModule: React.FC<EnhancedReflectionModuleProps> = ({
  isOpen,
  onClose,
  taskId,
  taskName,
  trigger,
  onReflectionComplete
}) => {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<string>('neutral');
  const [reflection, setReflection] = useState('');
  const [action, setAction] = useState('');
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pandaMessage, setPandaMessage] = useState('');
  const [reflectionId, setReflectionId] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [customTag, setCustomTag] = useState('');
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  
  // 当前用户ID（在实际应用中，这应该从用户会话中获取）
  const userId = 'current-user';

  // 根据触发类型设置初始状态
  useEffect(() => {
    if (trigger) {
      switch (trigger.type) {
        case ReflectionTriggerType.MOOD_CHANGE:
          if (trigger.data?.mood) {
            setMood(trigger.data.mood);
          }
          setPandaMessage('我注意到你的情绪有些波动。想聊聊吗？');
          break;
        case ReflectionTriggerType.TASK_FAILURE:
          setPandaMessage(
            trigger.data?.taskTitle
              ? `任务"${trigger.data.taskTitle}"未能按时完成。这没关系，我们可以一起反思一下。`
              : '有一个任务未能按时完成。这没关系，我们可以一起反思一下。'
          );
          setTaskId(trigger.data?.taskId);
          setTaskName(trigger.data?.taskTitle);
          break;
        case ReflectionTriggerType.DAILY_REFLECTION:
          setPandaMessage('今天过得如何？花点时间反思一下今天的经历吧。');
          break;
        case ReflectionTriggerType.WEEKLY_REVIEW:
          setPandaMessage('这周过得如何？让我们一起回顾一下这周的经历。');
          break;
        default:
          setPandaMessage('欢迎来到静心茶室。想聊聊你的感受吗？');
      }
    } else if (taskName) {
      setPandaMessage(`关于任务"${taskName}"，你有什么想分享的吗？`);
    } else {
      setPandaMessage('欢迎来到静心茶室。想聊聊你的感受吗？');
    }
  }, [trigger, taskName]);

  // 根据反思内容生成建议行动和标签
  useEffect(() => {
    if (reflection && step === 2) {
      // 生成标签
      const extractedTags = extractTags(reflection);
      setTags(extractedTags);
      
      // 生成建议行动
      const suggestedActions = generateSuggestedActions(reflection, extractedTags);
      setSuggestedActions(suggestedActions);
    }
  }, [reflection, step]);

  // 从反思内容中提取标签
  const extractTags = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    const extractedTags: string[] = [];
    
    // 情绪标签
    if (lowerText.includes('开心') || lowerText.includes('高兴') || lowerText.includes('快乐')) {
      extractedTags.push('开心');
    }
    if (lowerText.includes('难过') || lowerText.includes('伤心') || lowerText.includes('悲伤')) {
      extractedTags.push('难过');
    }
    if (lowerText.includes('焦虑') || lowerText.includes('担心') || lowerText.includes('紧张')) {
      extractedTags.push('焦虑');
    }
    if (lowerText.includes('压力') || lowerText.includes('压抑') || lowerText.includes('重担')) {
      extractedTags.push('压力');
    }
    if (lowerText.includes('疲惫') || lowerText.includes('累') || lowerText.includes('疲劳')) {
      extractedTags.push('疲惫');
    }
    
    // 主题标签
    if (lowerText.includes('工作') || lowerText.includes('职场') || lowerText.includes('事业')) {
      extractedTags.push('工作');
    }
    if (lowerText.includes('学习') || lowerText.includes('考试') || lowerText.includes('课程')) {
      extractedTags.push('学习');
    }
    if (lowerText.includes('家庭') || lowerText.includes('亲人') || lowerText.includes('父母')) {
      extractedTags.push('家庭');
    }
    if (lowerText.includes('朋友') || lowerText.includes('友谊') || lowerText.includes('社交')) {
      extractedTags.push('社交');
    }
    if (lowerText.includes('健康') || lowerText.includes('身体') || lowerText.includes('疾病')) {
      extractedTags.push('健康');
    }
    
    return extractedTags;
  };

  // 根据反思内容和标签生成建议行动
  const generateSuggestedActions = (text: string, tags: string[]): string[] => {
    const actions: string[] = [];
    const lowerText = text.toLowerCase();
    
    // 根据标签添加建议
    if (tags.includes('焦虑') || tags.includes('压力')) {
      actions.push('尝试5分钟的深呼吸冥想');
      actions.push('出去散步15分钟');
      actions.push('与朋友聊天分享感受');
      actions.push('写下三件让你感到感激的事情');
    }
    
    if (tags.includes('疲惫')) {
      actions.push('确保今晚早点休息');
      actions.push('尝试20分钟的午休');
      actions.push('减少今天的任务量');
      actions.push('喝足够的水，吃些健康的食物');
    }
    
    // 根据文本内容添加建议
    if (lowerText.includes('拖延') || lowerText.includes('专注') || lowerText.includes('分心')) {
      actions.push('使用番茄工作法，专注25分钟');
      actions.push('将大任务分解成小步骤');
      actions.push('创建一个无干扰的工作环境');
      actions.push('设置一个小的、可实现的目标');
    }
    
    if (lowerText.includes('孤独') || lowerText.includes('寂寞')) {
      actions.push('给一位久未联系的朋友打电话');
      actions.push('参加一个社区活动或线上聚会');
      actions.push('尝试一项可以认识新朋友的爱好');
    }
    
    // 如果没有匹配到任何建议，添加一些通用建议
    if (actions.length === 0) {
      actions.push('花5分钟进行深呼吸冥想');
      actions.push('写下三件让你感到感激的事情');
      actions.push('设定一个小的、可实现的目标');
      actions.push('与朋友或家人分享你的感受');
    }
    
    return actions;
  };

  // 处理创建反思记录
  const handleCreateReflection = async () => {
    try {
      // 创建反思记录
      const newReflection = await createReflection({
        userId,
        taskId,
        mood,
        reflection,
        action: '',
        tags
      });
      
      // 保存反思ID
      setReflectionId(newReflection.id!);
      
      return newReflection.id!;
    } catch (err) {
      console.error('Failed to create reflection:', err);
      throw err;
    }
  };

  // 处理完成反思
  const handleCompleteReflection = async () => {
    try {
      setIsSubmitting(true);
      
      // 如果还没有创建反思记录，先创建
      let id = reflectionId;
      if (!id) {
        id = await handleCreateReflection();
      }
      
      // 完成反思记录
      await completeReflection(id, action);
      
      // 如果是从触发记录打开的，标记触发记录为已完成
      if (trigger && trigger.id) {
        await markTriggerAsCompleted(trigger.id);
      }
      
      // 播放成功音效
      playSound(SoundType.SUCCESS, 0.5);
      
      // 如果心情不好，尝试更新为中性
      if (mood === 'sad' || mood === 'anxious' || mood === 'stressed') {
        await updatePandaMood('neutral');
      }
      
      // 通知父组件
      if (onReflectionComplete) {
        onReflectionComplete();
      }
      
      // 重置状态
      setStep(1);
      setReflection('');
      setAction('');
      setReflectionId(null);
      
      // 关闭对话框
      onClose();
    } catch (err) {
      console.error('Failed to complete reflection:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理选择建议行动
  const handleSelectAction = (selectedAction: string) => {
    setAction(selectedAction);
  };

  // 处理添加标签
  const handleAddTag = () => {
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
      setSelectedTag('');
    } else if (customTag && !tags.includes(customTag)) {
      setTags([...tags, customTag]);
      setCustomTag('');
    }
  };

  // 处理移除标签
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // 渲染步骤1：反思输入
  const renderStep1 = () => (
    <div className="reflection-step">
      <div className="panda-message mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start">
          <div className="panda-avatar mr-2">
            <span className="text-2xl">🐼</span>
          </div>
          <div className="panda-text">
            <p>{pandaMessage}</p>
          </div>
        </div>
      </div>
      
      {/* 情绪追踪器切换按钮 */}
      <div className="mood-tracker-toggle mb-4">
        <Button
          variant="secondary"
          onClick={() => setShowMoodTracker(!showMoodTracker)}
          className="w-full"
        >
          {showMoodTracker ? '隐藏情绪追踪器' : '显示情绪追踪器'}
        </Button>
      </div>
      
      {/* 情绪追踪器 */}
      <AnimatePresence>
        {showMoodTracker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mood-tracker-container mb-4 overflow-hidden"
          >
            <MoodTracker
              onMoodRecorded={(moodRecord) => {
                setMood(moodRecord.mood);
                setShowMoodTracker(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="reflection-input mb-4">
        <label htmlFor="reflection" className="block text-sm font-medium text-gray-700 mb-1">
          分享你的想法（可以是任何感受、困难或成就）
        </label>
        <textarea
          id="reflection"
          className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="今天我感觉..."
        />
      </div>
      
      <div className="reflection-actions flex justify-end">
        <Button 
          variant="jade" 
          onClick={async () => {
            // 创建反思记录
            try {
              await handleCreateReflection();
              setStep(2);
            } catch (err) {
              console.error('Failed to proceed to next step:', err);
            }
          }} 
          disabled={!reflection.trim()}
        >
          继续
        </Button>
      </div>
    </div>
  );

  // 渲染步骤2：行动选择
  const renderStep2 = () => (
    <div className="reflection-step">
      <div className="panda-message mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start">
          <div className="panda-avatar mr-2">
            <span className="text-2xl">🐼</span>
          </div>
          <div className="panda-text">
            <p>谢谢你的分享。以下是一些可能对你有帮助的小行动，你可以选择一个尝试，或者创建自己的行动。</p>
          </div>
        </div>
      </div>
      
      {/* 标签区域 */}
      <div className="tags-section mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">标签</h3>
        <div className="tags-container flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="tag px-2 py-1 bg-gray-100 rounded-full text-xs flex items-center"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <span>×</span>
              </button>
            </div>
          ))}
        </div>
        <div className="add-tag-container flex gap-2">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="flex-grow p-1 text-sm border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
          >
            <option value="">选择标签...</option>
            <option value="开心">开心</option>
            <option value="难过">难过</option>
            <option value="焦虑">焦虑</option>
            <option value="压力">压力</option>
            <option value="疲惫">疲惫</option>
            <option value="工作">工作</option>
            <option value="学习">学习</option>
            <option value="家庭">家庭</option>
            <option value="社交">社交</option>
            <option value="健康">健康</option>
          </select>
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="自定义标签"
            className="flex-grow p-1 text-sm border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
          />
          <Button
            variant="secondary"
            size="small"
            onClick={handleAddTag}
            disabled={!selectedTag && !customTag}
          >
            添加
          </Button>
        </div>
      </div>
      
      <div className="suggested-actions mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">建议的行动</h3>
        <div className="grid grid-cols-1 gap-2">
          {suggestedActions.map((suggestedAction, index) => (
            <motion.div
              key={index}
              className={`p-2 border rounded-md cursor-pointer ${action === suggestedAction ? 'border-jade-500 bg-jade-50' : 'border-gray-300'}`}
              onClick={() => handleSelectAction(suggestedAction)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {suggestedAction}
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="custom-action mb-4">
        <label htmlFor="custom-action" className="block text-sm font-medium text-gray-700 mb-1">
          或者，创建你自己的行动
        </label>
        <input
          id="custom-action"
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-jade-500 focus:border-jade-500"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="我将..."
        />
      </div>
      
      <div className="reflection-actions flex justify-between">
        <Button variant="secondary" onClick={() => setStep(1)}>
          返回
        </Button>
        <Button variant="gold" onClick={handleCompleteReflection} disabled={!action.trim() || isSubmitting}>
          {isSubmitting ? (
            <LoadingSpinner variant="white" size="small" />
          ) : (
            '完成反思'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title="静心茶室"
      closeOnOutsideClick={false}
      closeOnEsc={true}
      showCloseButton={true}
    >
      <div className="reflection-module p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 ? renderStep1() : renderStep2()}
          </motion.div>
        </AnimatePresence>
      </div>
    </ScrollDialog>
  );
};

export default EnhancedReflectionModule;
