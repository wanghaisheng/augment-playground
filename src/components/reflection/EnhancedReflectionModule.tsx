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
import { useComponentLabels } from '@/hooks/useComponentLabels';
import EnhancedTextArea from '@/components/common/EnhancedTextArea';
import EnhancedInput from '@/components/common/EnhancedInput';
import EnhancedSelect from '@/components/common/EnhancedSelect';

/**
 * Labels for the EnhancedReflectionModule component
 */
interface EnhancedReflectionModuleLabels {
  title?: string;
  // Trigger messages
  triggerMessages?: {
    moodChange?: string;
    taskFailureWithTitle?: string;
    taskFailureGeneric?: string;
    dailyReflection?: string;
    weeklyReview?: string;
    defaultWelcome?: string;
    taskSpecific?: string;
  };
  // Step 1 labels
  step1?: {
    toggleMoodTrackerShow?: string;
    toggleMoodTrackerHide?: string;
    reflectionInputLabel?: string;
    reflectionInputPlaceholder?: string;
    continueButton?: string;
  };
  // Step 2 labels
  step2?: {
    thankYouMessage?: string;
    tagsLabel?: string;
    selectTagPlaceholder?: string;
    customTagPlaceholder?: string;
    addTagButton?: string;
    suggestedActionsLabel?: string;
    customActionLabel?: string;
    customActionPlaceholder?: string;
    backButton?: string;
    completeButton?: string;
  };
  // Tag labels
  tags?: {
    happy?: string;
    sad?: string;
    anxious?: string;
    stressed?: string;
    tired?: string;
    work?: string;
    study?: string;
    family?: string;
    social?: string;
    health?: string;
  };
  // Suggested actions
  suggestedActions?: {
    meditation?: string;
    walking?: string;
    talkToFriend?: string;
    gratitude?: string;
    restEarly?: string;
    takeNap?: string;
    reduceTasks?: string;
    stayHydrated?: string;
    pomodoro?: string;
    breakDownTasks?: string;
    noDistractions?: string;
    smallGoal?: string;
    callFriend?: string;
    joinActivity?: string;
    newHobby?: string;
  };
}

interface EnhancedReflectionModuleProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: number;
  taskName?: string;
  trigger?: ReflectionTriggerRecord;
  onReflectionComplete?: () => void;
  labels?: EnhancedReflectionModuleLabels;
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
  onReflectionComplete,
  labels: propLabels
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

  // Get component labels with fallbacks
  const { labels: componentLabels } = useComponentLabels();

  // Merge provided labels with default fallbacks
  const labels = propLabels || {};

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
          setPandaMessage(labels.triggerMessages?.moodChange ||
            "I've noticed your mood has changed. Would you like to talk about it?");
          break;
        case ReflectionTriggerType.TASK_FAILURE:
          setPandaMessage(
            trigger.data?.taskTitle
              ? (labels.triggerMessages?.taskFailureWithTitle ||
                "Task '{0}' wasn't completed on time. That's okay, let's reflect on it together.").replace('{0}', trigger.data.taskTitle)
              : (labels.triggerMessages?.taskFailureGeneric ||
                "A task wasn't completed on time. That's okay, let's reflect on it together.")
          );
          setTaskId(trigger.data?.taskId);
          setTaskName(trigger.data?.taskTitle);
          break;
        case ReflectionTriggerType.DAILY_REFLECTION:
          setPandaMessage(labels.triggerMessages?.dailyReflection ||
            "How was your day? Take a moment to reflect on today's experiences.");
          break;
        case ReflectionTriggerType.WEEKLY_REVIEW:
          setPandaMessage(labels.triggerMessages?.weeklyReview ||
            "How was your week? Let's take some time to review this week's experiences.");
          break;
        default:
          setPandaMessage(labels.triggerMessages?.defaultWelcome ||
            "Welcome to the Tranquil Tea Room. Would you like to share your feelings?");
      }
    } else if (taskName) {
      setPandaMessage((labels.triggerMessages?.taskSpecific ||
        "About task '{0}', what would you like to share?").replace('{0}', taskName));
    } else {
      setPandaMessage(labels.triggerMessages?.defaultWelcome ||
        "Welcome to the Tranquil Tea Room. Would you like to share your feelings?");
    }
  }, [trigger, taskName, labels.triggerMessages]);

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

    // Get tag labels with fallbacks
    const happyTag = labels.tags?.happy || "Happy";
    const sadTag = labels.tags?.sad || "Sad";
    const anxiousTag = labels.tags?.anxious || "Anxious";
    const stressedTag = labels.tags?.stressed || "Stressed";
    const tiredTag = labels.tags?.tired || "Tired";
    const workTag = labels.tags?.work || "Work";
    const studyTag = labels.tags?.study || "Study";
    const familyTag = labels.tags?.family || "Family";
    const socialTag = labels.tags?.social || "Social";
    const healthTag = labels.tags?.health || "Health";

    // 情绪标签 - Check for both English and Chinese keywords
    if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('glad') ||
        lowerText.includes('开心') || lowerText.includes('高兴') || lowerText.includes('快乐')) {
      extractedTags.push(happyTag);
    }
    if (lowerText.includes('sad') || lowerText.includes('unhappy') || lowerText.includes('sorrow') ||
        lowerText.includes('难过') || lowerText.includes('伤心') || lowerText.includes('悲伤')) {
      extractedTags.push(sadTag);
    }
    if (lowerText.includes('anxious') || lowerText.includes('worry') || lowerText.includes('nervous') ||
        lowerText.includes('焦虑') || lowerText.includes('担心') || lowerText.includes('紧张')) {
      extractedTags.push(anxiousTag);
    }
    if (lowerText.includes('stress') || lowerText.includes('pressure') || lowerText.includes('burden') ||
        lowerText.includes('压力') || lowerText.includes('压抑') || lowerText.includes('重担')) {
      extractedTags.push(stressedTag);
    }
    if (lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('fatigue') ||
        lowerText.includes('疲惫') || lowerText.includes('累') || lowerText.includes('疲劳')) {
      extractedTags.push(tiredTag);
    }

    // 主题标签 - Check for both English and Chinese keywords
    if (lowerText.includes('work') || lowerText.includes('job') || lowerText.includes('career') ||
        lowerText.includes('工作') || lowerText.includes('职场') || lowerText.includes('事业')) {
      extractedTags.push(workTag);
    }
    if (lowerText.includes('study') || lowerText.includes('exam') || lowerText.includes('course') ||
        lowerText.includes('学习') || lowerText.includes('考试') || lowerText.includes('课程')) {
      extractedTags.push(studyTag);
    }
    if (lowerText.includes('family') || lowerText.includes('parent') || lowerText.includes('relative') ||
        lowerText.includes('家庭') || lowerText.includes('亲人') || lowerText.includes('父母')) {
      extractedTags.push(familyTag);
    }
    if (lowerText.includes('friend') || lowerText.includes('social') || lowerText.includes('relationship') ||
        lowerText.includes('朋友') || lowerText.includes('友谊') || lowerText.includes('社交')) {
      extractedTags.push(socialTag);
    }
    if (lowerText.includes('health') || lowerText.includes('body') || lowerText.includes('illness') ||
        lowerText.includes('健康') || lowerText.includes('身体') || lowerText.includes('疾病')) {
      extractedTags.push(healthTag);
    }

    return extractedTags;
  };

  // 根据反思内容和标签生成建议行动
  const generateSuggestedActions = (text: string, tags: string[]): string[] => {
    const actions: string[] = [];
    const lowerText = text.toLowerCase();

    // Get suggested action labels with fallbacks
    const meditationAction = labels.suggestedActions?.meditation || "Try 5 minutes of deep breathing meditation";
    const walkingAction = labels.suggestedActions?.walking || "Go for a 15-minute walk";
    const talkToFriendAction = labels.suggestedActions?.talkToFriend || "Talk to a friend about your feelings";
    const gratitudeAction = labels.suggestedActions?.gratitude || "Write down three things you're grateful for";
    const restEarlyAction = labels.suggestedActions?.restEarly || "Make sure to rest early tonight";
    const takeNapAction = labels.suggestedActions?.takeNap || "Try a 20-minute nap";
    const reduceTasksAction = labels.suggestedActions?.reduceTasks || "Reduce your tasks for today";
    const stayHydratedAction = labels.suggestedActions?.stayHydrated || "Drink enough water and eat healthy food";
    const pomodoroAction = labels.suggestedActions?.pomodoro || "Use the Pomodoro technique, focus for 25 minutes";
    const breakDownTasksAction = labels.suggestedActions?.breakDownTasks || "Break down big tasks into smaller steps";
    const noDistractionsAction = labels.suggestedActions?.noDistractions || "Create a distraction-free work environment";
    const smallGoalAction = labels.suggestedActions?.smallGoal || "Set a small, achievable goal";
    const callFriendAction = labels.suggestedActions?.callFriend || "Call a friend you haven't talked to in a while";
    const joinActivityAction = labels.suggestedActions?.joinActivity || "Join a community event or online gathering";
    const newHobbyAction = labels.suggestedActions?.newHobby || "Try a hobby where you can meet new people";

    // Get tag labels with fallbacks
    const anxiousTag = labels.tags?.anxious || "Anxious";
    const stressedTag = labels.tags?.stressed || "Stressed";
    const tiredTag = labels.tags?.tired || "Tired";

    // 根据标签添加建议
    if (tags.includes(anxiousTag) || tags.includes(stressedTag)) {
      actions.push(meditationAction);
      actions.push(walkingAction);
      actions.push(talkToFriendAction);
      actions.push(gratitudeAction);
    }

    if (tags.includes(tiredTag)) {
      actions.push(restEarlyAction);
      actions.push(takeNapAction);
      actions.push(reduceTasksAction);
      actions.push(stayHydratedAction);
    }

    // 根据文本内容添加建议 - Check for both English and Chinese keywords
    if (lowerText.includes('procrastinate') || lowerText.includes('focus') || lowerText.includes('distract') ||
        lowerText.includes('拖延') || lowerText.includes('专注') || lowerText.includes('分心')) {
      actions.push(pomodoroAction);
      actions.push(breakDownTasksAction);
      actions.push(noDistractionsAction);
      actions.push(smallGoalAction);
    }

    if (lowerText.includes('lonely') || lowerText.includes('alone') ||
        lowerText.includes('孤独') || lowerText.includes('寂寞')) {
      actions.push(callFriendAction);
      actions.push(joinActivityAction);
      actions.push(newHobbyAction);
    }

    // 如果没有匹配到任何建议，添加一些通用建议
    if (actions.length === 0) {
      actions.push(meditationAction);
      actions.push(gratitudeAction);
      actions.push(smallGoalAction);
      actions.push(talkToFriendAction);
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
          {showMoodTracker
            ? (labels.step1?.toggleMoodTrackerHide || "Hide Mood Tracker")
            : (labels.step1?.toggleMoodTrackerShow || "Show Mood Tracker")}
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
        <EnhancedTextArea
          id="reflection"
          label={labels.step1?.reflectionInputLabel || "Share your thoughts (any feelings, challenges, or achievements)"}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder={labels.step1?.reflectionInputPlaceholder || "Today I feel..."}
          minRows={4}
          maxRows={8}
          autoResize={true}
          variant="default"
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
          {labels.step1?.continueButton || "Continue"}
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
            <p>{labels.step2?.thankYouMessage || "Thank you for sharing. Here are some small actions that might help you. You can choose one to try, or create your own action."}</p>
          </div>
        </div>
      </div>

      {/* 标签区域 */}
      <div className="tags-section mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          {labels.step2?.tagsLabel || "Tags"}
        </h3>
        <div className="tags-container flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="tag px-2 py-1 bg-gray-100 rounded-full text-xs flex items-center"
            >
              <span>{tag}</span>
              <Button
                variant="text"
                size="xsmall"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-gray-500 hover:text-gray-700 p-0"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
        <div className="add-tag-container flex gap-2">
          <EnhancedSelect
            value={selectedTag}
            onChange={(value) => setSelectedTag(value as string)}
            placeholder={labels.step2?.selectTagPlaceholder || "Select a tag..."}
            options={[
              { value: labels.tags?.happy || "Happy", label: labels.tags?.happy || "Happy" },
              { value: labels.tags?.sad || "Sad", label: labels.tags?.sad || "Sad" },
              { value: labels.tags?.anxious || "Anxious", label: labels.tags?.anxious || "Anxious" },
              { value: labels.tags?.stressed || "Stressed", label: labels.tags?.stressed || "Stressed" },
              { value: labels.tags?.tired || "Tired", label: labels.tags?.tired || "Tired" },
              { value: labels.tags?.work || "Work", label: labels.tags?.work || "Work" },
              { value: labels.tags?.study || "Study", label: labels.tags?.study || "Study" },
              { value: labels.tags?.family || "Family", label: labels.tags?.family || "Family" },
              { value: labels.tags?.social || "Social", label: labels.tags?.social || "Social" },
              { value: labels.tags?.health || "Health", label: labels.tags?.health || "Health" }
            ]}
            variant="default"
            size="small"
            className="flex-grow"
          />
          <EnhancedInput
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder={labels.step2?.customTagPlaceholder || "Custom tag"}
            variant="default"
            size="small"
            className="flex-grow"
          />
          <Button
            variant="secondary"
            size="small"
            onClick={handleAddTag}
            disabled={!selectedTag && !customTag}
          >
            {labels.step2?.addTagButton || "Add"}
          </Button>
        </div>
      </div>

      <div className="suggested-actions mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          {labels.step2?.suggestedActionsLabel || "Suggested Actions"}
        </h3>
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
        <EnhancedInput
          id="custom-action"
          label={labels.step2?.customActionLabel || "Or, create your own action"}
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder={labels.step2?.customActionPlaceholder || "I will..."}
          variant="default"
        />
      </div>

      <div className="reflection-actions flex justify-between">
        <Button variant="secondary" onClick={() => setStep(1)}>
          {labels.step2?.backButton || "Back"}
        </Button>
        <Button variant="gold" onClick={handleCompleteReflection} disabled={!action.trim() || isSubmitting}>
          {isSubmitting ? (
            <LoadingSpinner variant="white" size="small" />
          ) : (
            labels.step2?.completeButton || "Complete Reflection"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title={labels.title || "Tranquil Tea Room"}
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
