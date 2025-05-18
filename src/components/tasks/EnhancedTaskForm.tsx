// src/components/tasks/EnhancedTaskForm.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TaskRecord,
  TaskStatus,
  TaskPriority,
  TaskType,
  getAllTaskCategories,
  TaskCategoryRecord
} from '@/services/taskService';
import { playSound, SoundType } from '@/utils/sound';
import { useComponentLabels } from '@/hooks/useComponentLabels';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import Button from '@/components/common/Button';
import EnhancedTextArea from '@/components/common/EnhancedTextArea';
import EnhancedInput from '@/components/common/EnhancedInput';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OptimizedAnimatedContainer from '@/components/animation/OptimizedAnimatedContainer';

interface EnhancedTaskFormProps {
  initialTask?: Partial<TaskRecord>;
  onSubmit: (task: Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
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
      descriptionLabel?: string;
      descriptionPlaceholder?: string;
      categoryLabel?: string;
      categoryPlaceholder?: string;
      typeLabel?: string;
      priorityLabel?: string;
      dueDateLabel?: string;
      dueDatePlaceholder?: string;
      estimatedTimeLabel?: string;
      estimatedTimePlaceholder?: string;
    };
    buttons?: {
      create?: string;
      save?: string;
      cancel?: string;
    };
    errors?: {
      titleRequired?: string;
      categoryRequired?: string;
      invalidDate?: string;
    };
  };
}

/**
 * 增强版任务表单组件
 * 用于创建和编辑任务，支持多语言和动画
 * 
 * @param initialTask - 初始任务数据
 * @param onSubmit - 提交回调
 * @param onCancel - 取消回调
 * @param className - 自定义类名
 * @param labels - 本地化标签
 */
const EnhancedTaskForm: React.FC<EnhancedTaskFormProps> = ({
  initialTask = {},
  onSubmit,
  onCancel,
  className = '',
  labels: propLabels
}) => {
  // 表单状态
  const [title, setTitle] = useState(initialTask.title || '');
  const [description, setDescription] = useState(initialTask.description || '');
  const [categoryId, setCategoryId] = useState<number | undefined>(initialTask.categoryId);
  const [type, setType] = useState<TaskType>(initialTask.type || TaskType.DAILY);
  const [priority, setPriority] = useState<TaskPriority>(initialTask.priority || TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState<string>(
    initialTask.dueDate
      ? new Date(initialTask.dueDate).toISOString().split('T')[0]
      : ''
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(
    initialTask.estimatedMinutes
  );
  
  // 错误状态
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 类别列表
  const [categories, setCategories] = useState<TaskCategoryRecord[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  
  // 获取本地化标签
  const { labels: componentLabels } = useComponentLabels();
  const labels = {
    title: {
      create: propLabels?.title?.create || componentLabels?.taskForm?.title?.create || "Create New Task",
      edit: propLabels?.title?.edit || componentLabels?.taskForm?.title?.edit || "Edit Task"
    },
    fields: {
      titleLabel: propLabels?.fields?.titleLabel || componentLabels?.taskForm?.fields?.titleLabel || "Title",
      titlePlaceholder: propLabels?.fields?.titlePlaceholder || componentLabels?.taskForm?.fields?.titlePlaceholder || "Enter task title",
      descriptionLabel: propLabels?.fields?.descriptionLabel || componentLabels?.taskForm?.fields?.descriptionLabel || "Description",
      descriptionPlaceholder: propLabels?.fields?.descriptionPlaceholder || componentLabels?.taskForm?.fields?.descriptionPlaceholder || "Enter task description (optional)",
      categoryLabel: propLabels?.fields?.categoryLabel || componentLabels?.taskForm?.fields?.categoryLabel || "Category",
      categoryPlaceholder: propLabels?.fields?.categoryPlaceholder || componentLabels?.taskForm?.fields?.categoryPlaceholder || "Select a category",
      typeLabel: propLabels?.fields?.typeLabel || componentLabels?.taskForm?.fields?.typeLabel || "Type",
      priorityLabel: propLabels?.fields?.priorityLabel || componentLabels?.taskForm?.fields?.priorityLabel || "Priority",
      dueDateLabel: propLabels?.fields?.dueDateLabel || componentLabels?.taskForm?.fields?.dueDateLabel || "Due Date",
      dueDatePlaceholder: propLabels?.fields?.dueDatePlaceholder || componentLabels?.taskForm?.fields?.dueDatePlaceholder || "Select due date (optional)",
      estimatedTimeLabel: propLabels?.fields?.estimatedTimeLabel || componentLabels?.taskForm?.fields?.estimatedTimeLabel || "Estimated Time (minutes)",
      estimatedTimePlaceholder: propLabels?.fields?.estimatedTimePlaceholder || componentLabels?.taskForm?.fields?.estimatedTimePlaceholder || "Estimated completion time (optional)"
    },
    buttons: {
      create: propLabels?.buttons?.create || componentLabels?.taskForm?.buttons?.create || "Create Task",
      save: propLabels?.buttons?.save || componentLabels?.taskForm?.buttons?.save || "Save Changes",
      cancel: propLabels?.buttons?.cancel || componentLabels?.taskForm?.buttons?.cancel || "Cancel"
    },
    errors: {
      titleRequired: propLabels?.errors?.titleRequired || componentLabels?.taskForm?.errors?.titleRequired || "Title is required",
      categoryRequired: propLabels?.errors?.categoryRequired || componentLabels?.taskForm?.errors?.categoryRequired || "Category is required",
      invalidDate: propLabels?.errors?.invalidDate || componentLabels?.taskForm?.errors?.invalidDate || "Invalid date format"
    }
  };

  // 加载任务类别
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const categoryList = await getAllTaskCategories();
        setCategories(categoryList);
        
        // 如果没有选择类别且有类别列表，默认选择第一个
        if (!categoryId && categoryList.length > 0 && categoryList[0].id) {
          setCategoryId(categoryList[0].id);
        }
      } catch (err) {
        console.error('Failed to load task categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // 注册数据刷新监听
  useRegisterTableRefresh('taskCategories', async () => {
    try {
      const categoryList = await getAllTaskCategories();
      setCategories(categoryList);
    } catch (err) {
      console.error('Failed to refresh task categories:', err);
    }
  });

  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 验证标题
    if (!title.trim()) {
      newErrors.title = labels.errors.titleRequired;
    }

    // 验证类别
    if (!categoryId) {
      newErrors.categoryId = labels.errors.categoryRequired;
    }

    // 验证日期格式
    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      newErrors.dueDate = labels.errors.invalidDate;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);

    if (!validateForm()) {
      return;
    }

    const taskData: Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
      title,
      description: description || undefined,
      categoryId: categoryId!,
      type,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      estimatedMinutes: estimatedMinutes || undefined
    };

    onSubmit(taskData);
  };

  // 处理取消
  const handleCancel = () => {
    // 播放点击音效
    playSound(SoundType.BUTTON_CLICK, 0.3);
    onCancel();
  };

  return (
    <OptimizedAnimatedContainer
      className={`enhanced-task-form ${className}`}
      priority="high"
    >
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {initialTask.id ? labels.title.edit : labels.title.create}
        </h2>

        <div className="form-group mb-4">
          <EnhancedInput
            label={labels.fields.titleLabel}
            placeholder={labels.fields.titlePlaceholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            status={errors.title ? 'error' : 'default'}
            errorMessage={errors.title}
            required
            floatingLabel
            animateLabel
            animateError
          />
        </div>

        <div className="form-group mb-4">
          <EnhancedTextArea
            label={labels.fields.descriptionLabel}
            placeholder={labels.fields.descriptionPlaceholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={3}
            maxRows={6}
            autoResize
            floatingLabel
            animateLabel
          />
        </div>

        <div className="form-group mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {labels.fields.categoryLabel}
          </label>
          <select
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
            className={`w-full p-2 border rounded-md ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isLoadingCategories}
          >
            <option value="" disabled>
              {isLoadingCategories ? 'Loading categories...' : labels.fields.categoryPlaceholder}
            </option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
          )}
        </div>

        <div className="form-row grid grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {labels.fields.typeLabel}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={TaskType.DAILY}>Daily</option>
              <option value={TaskType.WEEKLY}>Weekly</option>
              <option value={TaskType.MONTHLY}>Monthly</option>
              <option value={TaskType.ONE_TIME}>One-time</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {labels.fields.priorityLabel}
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value) as TaskPriority)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.URGENT}>Urgent</option>
            </select>
          </div>
        </div>

        <div className="form-row grid grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <EnhancedInput
              type="date"
              label={labels.fields.dueDateLabel}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              status={errors.dueDate ? 'error' : 'default'}
              errorMessage={errors.dueDate}
              floatingLabel
              animateLabel
              animateError
            />
          </div>

          <div className="form-group">
            <EnhancedInput
              type="number"
              label={labels.fields.estimatedTimeLabel}
              placeholder={labels.fields.estimatedTimePlaceholder}
              value={estimatedMinutes?.toString() || ''}
              onChange={(e) => setEstimatedMinutes(e.target.value ? Number(e.target.value) : undefined)}
              min="1"
              floatingLabel
              animateLabel
            />
          </div>
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
          >
            {initialTask.id ? labels.buttons.save : labels.buttons.create}
          </Button>
        </div>
      </form>
    </OptimizedAnimatedContainer>
  );
};

export default EnhancedTaskForm;
