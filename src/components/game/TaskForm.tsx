// src/components/game/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import {
  TaskRecord,
  TaskPriority,
  TaskType,
  TaskCategoryRecord,
  getAllTaskCategories
} from '@/services/taskService';
import Button from '@/components/common/Button';

interface TaskFormLabels {
  title?: {
    create?: string;
    edit?: string;
  };
  fields?: {
    titleLabel?: string;
    titlePlaceholder?: string;
    titleRequired?: string;
    descriptionLabel?: string;
    descriptionPlaceholder?: string;
    categoryLabel?: string;
    categoryPlaceholder?: string;
    categoryRequired?: string;
    typeLabel?: string;
    priorityLabel?: string;
    dueDateLabel?: string;
    estimatedTimeLabel?: string;
    estimatedTimePlaceholder?: string;
  };
  types?: {
    daily?: string;
    main?: string;
    side?: string;
  };
  priorities?: {
    low?: string;
    medium?: string;
    high?: string;
  };
  buttons?: {
    create?: string;
    save?: string;
    cancel?: string;
  };
}

interface TaskFormProps {
  initialTask?: Partial<TaskRecord>;
  onSubmit: (task: Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  onCancel: () => void;
  labels?: TaskFormLabels;
}

/**
 * Task Form Component
 * Used for creating and editing tasks
 */
const TaskForm: React.FC<TaskFormProps> = ({
  initialTask = {},
  onSubmit,
  onCancel,
  labels
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
  const [categories, setCategories] = useState<TaskCategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 加载任务类别
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const allCategories = await getAllTaskCategories();
        setCategories(allCategories);

        // 如果没有选择类别，默认选择第一个
        if (!categoryId && allCategories.length > 0) {
          setCategoryId(allCategories[0].id);
        }
      } catch (error) {
        console.error('Failed to load task categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [categoryId]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = labels?.fields?.titleRequired || 'Please enter a task title';
    }

    if (!categoryId) {
      newErrors.categoryId = labels?.fields?.categoryRequired || 'Please select a task category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

  return (
    <form className="task-form bamboo-frame" onSubmit={handleSubmit}>
      <h2>{initialTask.id ? (labels?.title?.edit || "Edit Task") : (labels?.title?.create || "Create New Task")}</h2>

      <div className="form-group">
        <label htmlFor="task-title">{labels?.fields?.titleLabel || "Title"} *</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? 'error' : ''}
          placeholder={labels?.fields?.titlePlaceholder || "Enter task title"}
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="task-description">{labels?.fields?.descriptionLabel || "Description"}</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={labels?.fields?.descriptionPlaceholder || "Enter task description (optional)"}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-category">{labels?.fields?.categoryLabel || "Category"} *</label>
        <select
          id="task-category"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className={errors.categoryId ? 'error' : ''}
          disabled={isLoading}
        >
          <option value="">{labels?.fields?.categoryPlaceholder || "Select category"}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="task-type">{labels?.fields?.typeLabel || "Task Type"}</label>
        <select
          id="task-type"
          value={type}
          onChange={(e) => setType(e.target.value as TaskType)}
        >
          <option value={TaskType.DAILY}>{labels?.types?.daily || "Daily Task"}</option>
          <option value={TaskType.MAIN}>{labels?.types?.main || "Main Task"}</option>
          <option value={TaskType.SIDE}>{labels?.types?.side || "Side Task"}</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="task-priority">{labels?.fields?.priorityLabel || "Priority"}</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          <option value={TaskPriority.LOW}>{labels?.priorities?.low || "Low"}</option>
          <option value={TaskPriority.MEDIUM}>{labels?.priorities?.medium || "Medium"}</option>
          <option value={TaskPriority.HIGH}>{labels?.priorities?.high || "High"}</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="task-due-date">{labels?.fields?.dueDateLabel || "Due Date"}</label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-estimated-time">{labels?.fields?.estimatedTimeLabel || "Estimated Time (minutes)"}</label>
        <input
          id="task-estimated-time"
          type="number"
          min="1"
          value={estimatedMinutes || ''}
          onChange={(e) => setEstimatedMinutes(e.target.value ? Number(e.target.value) : undefined)}
          placeholder={labels?.fields?.estimatedTimePlaceholder || "Estimated completion time (optional)"}
        />
      </div>

      <div className="form-actions">
        <Button variant="jade" type="submit">
          {initialTask.id ? (labels?.buttons?.save || "Save Changes") : (labels?.buttons?.create || "Create Task")}
        </Button>
        <Button variant="secondary" type="button" onClick={onCancel}>
          {labels?.buttons?.cancel || "Cancel"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
