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

interface TaskFormProps {
  initialTask?: Partial<TaskRecord>;
  onSubmit: (task: Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  onCancel: () => void;
}

/**
 * 任务表单组件，用于创建和编辑任务
 */
const TaskForm: React.FC<TaskFormProps> = ({
  initialTask = {},
  onSubmit,
  onCancel
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

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = '请输入任务标题';
    }
    
    if (!categoryId) {
      newErrors.categoryId = '请选择任务类别';
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
      <h2>{initialTask.id ? '编辑任务' : '创建新任务'}</h2>
      
      <div className="form-group">
        <label htmlFor="task-title">标题 *</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? 'error' : ''}
          placeholder="输入任务标题"
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="task-description">描述</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入任务描述（可选）"
          rows={3}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="task-category">类别 *</label>
        <select
          id="task-category"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className={errors.categoryId ? 'error' : ''}
          disabled={isLoading}
        >
          <option value="">选择类别</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="task-type">任务类型</label>
        <select
          id="task-type"
          value={type}
          onChange={(e) => setType(e.target.value as TaskType)}
        >
          <option value={TaskType.DAILY}>日常任务</option>
          <option value={TaskType.MAIN}>主线任务</option>
          <option value={TaskType.SIDE}>支线任务</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="task-priority">优先级</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          <option value={TaskPriority.LOW}>低</option>
          <option value={TaskPriority.MEDIUM}>中</option>
          <option value={TaskPriority.HIGH}>高</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="task-due-date">截止日期</label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="task-estimated-time">预计时间（分钟）</label>
        <input
          id="task-estimated-time"
          type="number"
          min="1"
          value={estimatedMinutes || ''}
          onChange={(e) => setEstimatedMinutes(e.target.value ? Number(e.target.value) : undefined)}
          placeholder="预计完成时间（可选）"
        />
      </div>
      
      <div className="form-actions">
        <Button variant="jade" type="submit">
          {initialTask.id ? '保存修改' : '创建任务'}
        </Button>
        <Button variant="secondary" type="button" onClick={onCancel}>
          取消
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
