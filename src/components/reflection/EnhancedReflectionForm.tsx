// src/components/reflection/EnhancedReflectionForm.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ReflectionRecord,
  ReflectionStatus,
  createReflection,
  updateReflection
} from '@/services/reflectionService';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import Button from '@/components/common/Button';
import EnhancedTextArea from '@/components/common/EnhancedTextArea';
import EnhancedInput from '@/components/common/EnhancedInput';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';
import MoodTracker from './MoodTracker';

interface EnhancedReflectionFormProps {
  initialReflection?: Partial<ReflectionRecord>;
  onSubmit: (reflection: Partial<ReflectionRecord>) => void;
  onCancel: () => void;
  className?: string;
  labels?: {
    title?: {
      create?: string;
      edit?: string;
    };
    fields?: {
      titleLabel?: string;
      titlePlaceholder?: string;
      contentLabel?: string;
      contentPlaceholder?: string;
      moodLabel?: string;
      tagsLabel?: string;
      tagsPlaceholder?: string;
      actionLabel?: string;
      actionPlaceholder?: string;
    };
    buttons?: {
      create?: string;
      save?: string;
      cancel?: string;
      showMoodTracker?: string;
      hideMoodTracker?: string;
    };
    errors?: {
      contentRequired?: string;
    };
  };
}

/**
 * 增强版反思表单组件
 * 用于创建和编辑反思，支持多语言和动画
 * 
 * @param initialReflection - 初始反思数据
 * @param onSubmit - 提交回调
 * @param onCancel - 取消回调
 * @param className - 自定义类名
 * @param labels - 本地化标签
 */
const EnhancedReflectionForm: React.FC<EnhancedReflectionFormProps> = ({
  initialReflection = {},
  onSubmit,
  onCancel,
  className = '',
  labels: propLabels
}) => {
  // 表单状态
  const [title, setTitle] = useState(initialReflection.title || '');
  const [content, setContent] = useState(initialReflection.content || '');
  const [mood, setMood] = useState(initialReflection.mood || '');
  const [tags, setTags] = useState<string[]>(initialReflection.tags || []);
  const [tagsInput, setTagsInput] = useState('');
  const [action, setAction] = useState(initialReflection.action || '');
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  
  // 错误状态
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    title: {
      create: propLabels?.title?.create || componentLabels?.reflectionForm?.title?.create || "Create New Reflection",
      edit: propLabels?.title?.edit || componentLabels?.reflectionForm?.title?.edit || "Edit Reflection"
    },
    fields: {
      titleLabel: propLabels?.fields?.titleLabel || componentLabels?.reflectionForm?.fields?.titleLabel || "Title",
      titlePlaceholder: propLabels?.fields?.titlePlaceholder || componentLabels?.reflectionForm?.fields?.titlePlaceholder || "Enter reflection title (optional)",
      contentLabel: propLabels?.fields?.contentLabel || componentLabels?.reflectionForm?.fields?.contentLabel || "Reflection",
      contentPlaceholder: propLabels?.fields?.contentPlaceholder || componentLabels?.reflectionForm?.fields?.contentPlaceholder || "Share your thoughts...",
      moodLabel: propLabels?.fields?.moodLabel || componentLabels?.reflectionForm?.fields?.moodLabel || "Mood",
      tagsLabel: propLabels?.fields?.tagsLabel || componentLabels?.reflectionForm?.fields?.tagsLabel || "Tags",
      tagsPlaceholder: propLabels?.fields?.tagsPlaceholder || componentLabels?.reflectionForm?.fields?.tagsPlaceholder || "Add tags separated by commas",
      actionLabel: propLabels?.fields?.actionLabel || componentLabels?.reflectionForm?.fields?.actionLabel || "Action",
      actionPlaceholder: propLabels?.fields?.actionPlaceholder || componentLabels?.reflectionForm?.fields?.actionPlaceholder || "What action will you take? (optional)"
    },
    buttons: {
      create: propLabels?.buttons?.create || componentLabels?.reflectionForm?.buttons?.create || "Create Reflection",
      save: propLabels?.buttons?.save || componentLabels?.reflectionForm?.buttons?.save || "Save Changes",
      cancel: propLabels?.buttons?.cancel || componentLabels?.reflectionForm?.buttons?.cancel || "Cancel",
      showMoodTracker: propLabels?.buttons?.showMoodTracker || componentLabels?.reflectionForm?.buttons?.showMoodTracker || "Show Mood Tracker",
      hideMoodTracker: propLabels?.buttons?.hideMoodTracker || componentLabels?.reflectionForm?.buttons?.hideMoodTracker || "Hide Mood Tracker"
    },
    errors: {
      contentRequired: propLabels?.errors?.contentRequired || componentLabels?.reflectionForm?.errors?.contentRequired || "Reflection content is required"
    }
  };

  // 处理标签输入
  const handleTagsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  // 处理标签输入按键
  const handleTagsInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  // 添加标签
  const addTag = () => {
    const newTag = tagsInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagsInput('');
    }
  };

  // 移除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 处理心情记录
  const handleMoodRecorded = (moodRecord: any) => {
    setMood(moodRecord.type);
    setShowMoodTracker(false);
  };

  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 验证内容
    if (!content.trim()) {
      newErrors.content = labels.errors.contentRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // 如果有标签输入，添加到标签列表
      if (tagsInput.trim()) {
        addTag();
      }

      // 准备反思数据
      const reflectionData: Partial<ReflectionRecord> = {
        title: title || undefined,
        content,
        mood: mood || undefined,
        tags: tags.length > 0 ? tags : undefined,
        action: action || undefined
      };

      // 提交反思数据
      onSubmit(reflectionData);
    } catch (err) {
      console.error('Failed to submit reflection:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    onCancel();
  };

  return (
    <OptimizedAnimatedContainer
      className={`enhanced-reflection-form ${className}`}
      priority="high"
    >
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {initialReflection.id ? labels.title.edit : labels.title.create}
        </h2>

        <div className="form-group mb-4">
          <EnhancedInput
            label={labels.fields.titleLabel}
            placeholder={labels.fields.titlePlaceholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            floatingLabel
            animateLabel
          />
        </div>

        <div className="form-group mb-4">
          <EnhancedTextArea
            label={labels.fields.contentLabel}
            placeholder={labels.fields.contentPlaceholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            status={errors.content ? 'error' : 'default'}
            errorMessage={errors.content}
            minRows={4}
            maxRows={8}
            autoResize
            required
            floatingLabel
            animateLabel
            animateError
          />
        </div>

        <div className="form-group mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {labels.fields.moodLabel}
            </label>
            <Button
              variant="text"
              size="small"
              onClick={() => setShowMoodTracker(!showMoodTracker)}
            >
              {showMoodTracker ? labels.buttons.hideMoodTracker : labels.buttons.showMoodTracker}
            </Button>
          </div>
          
          {showMoodTracker ? (
            <MoodTracker onMoodRecorded={handleMoodRecorded} />
          ) : (
            <div className="mood-display">
              {mood ? (
                <div className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 inline-block">
                  {mood}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No mood selected</p>
              )}
            </div>
          )}
        </div>

        <div className="form-group mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {labels.fields.tagsLabel}
          </label>
          
          <div className="tags-input-container">
            <div className="tags-list flex flex-wrap gap-1 mb-2">
              {tags.map((tag, index) => (
                <div key={index} className="tag px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-sm flex items-center">
                  <span>{tag}</span>
                  <button
                    type="button"
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    onClick={() => removeTag(tag)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            <EnhancedInput
              placeholder={labels.fields.tagsPlaceholder}
              value={tagsInput}
              onChange={handleTagsInputChange}
              onKeyDown={handleTagsInputKeyDown}
              onBlur={addTag}
            />
          </div>
        </div>

        <div className="form-group mb-4">
          <EnhancedTextArea
            label={labels.fields.actionLabel}
            placeholder={labels.fields.actionPlaceholder}
            value={action}
            onChange={(e) => setAction(e.target.value)}
            minRows={2}
            maxRows={4}
            autoResize
            floatingLabel
            animateLabel
          />
        </div>

        <div className="form-actions flex justify-end gap-2 mt-6">
          <Button
            variant="secondary"
            type="button"
            onClick={handleCancel}
          >
            {labels.buttons.cancel}
          </Button>
          <Button
            variant="jade"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner variant="white" size="small" />
            ) : (
              initialReflection.id ? labels.buttons.save : labels.buttons.create
            )}
          </Button>
        </div>
      </form>
    </OptimizedAnimatedContainer>
  );
};

export default EnhancedReflectionForm;
