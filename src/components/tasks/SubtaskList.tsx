// src/components/tasks/SubtaskList.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubtaskRecord } from '@/services/subtaskService';
import { TaskStatus } from '@/services/taskService';
import { getSubtasks, updateSubtask, completeSubtask, deleteSubtask, createSubtask } from '@/services/subtaskService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updateSubtaskOrder } from '@/services/subtaskService';
import { playSound, SoundType } from '@/utils/sound';

interface SubtaskListProps {
  parentTaskId: number;
  onSubtasksChange?: (hasSubtasks: boolean) => void;
}

/**
 * 子任务列表组件
 * 用于显示和管理任务的子任务
 */
const SubtaskList: React.FC<SubtaskListProps> = ({ parentTaskId, onSubtasksChange }) => {
  const [subtasks, setSubtasks] = useState<SubtaskRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  // 加载子任务
  const loadSubtasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedSubtasks = await getSubtasks(parentTaskId);
      setSubtasks(loadedSubtasks);
      
      // 通知父组件子任务状态变化
      if (onSubtasksChange) {
        onSubtasksChange(loadedSubtasks.length > 0);
      }
    } catch (err) {
      console.error('Failed to load subtasks:', err);
      setError('加载子任务失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadSubtasks();
  }, [parentTaskId]);

  // 注册数据刷新监听
  useRegisterTableRefresh('subtasks', loadSubtasks);

  // 处理添加子任务
  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;

    try {
      setIsAddingSubtask(true);
      await createSubtask({
        parentTaskId,
        title: newSubtaskTitle.trim()
      });
      setNewSubtaskTitle('');
      playSound(SoundType.BUTTON_CLICK, 0.3);
      await loadSubtasks();
    } catch (err) {
      console.error('Failed to add subtask:', err);
      setError('添加子任务失败，请重试');
    } finally {
      setIsAddingSubtask(false);
    }
  };

  // 处理完成子任务
  const handleCompleteSubtask = async (subtaskId: number) => {
    try {
      await completeSubtask(subtaskId);
      playSound(SoundType.SUCCESS, 0.3);
      // 数据会通过刷新机制自动更新
    } catch (err) {
      console.error('Failed to complete subtask:', err);
      setError('完成子任务失败，请重试');
    }
  };

  // 处理删除子任务
  const handleDeleteSubtask = async (subtaskId: number) => {
    try {
      await deleteSubtask(subtaskId);
      playSound(SoundType.BUTTON_CLICK, 0.3);
      // 数据会通过刷新机制自动更新
    } catch (err) {
      console.error('Failed to delete subtask:', err);
      setError('删除子任务失败，请重试');
    }
  };

  // 处理拖放结束
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    try {
      // 获取被拖动的子任务
      const draggedSubtask = subtasks[sourceIndex];
      
      // 更新子任务顺序
      await updateSubtaskOrder(draggedSubtask.id!, destinationIndex);
      
      // 重新加载子任务以获取最新顺序
      await loadSubtasks();
    } catch (err) {
      console.error('Failed to reorder subtasks:', err);
      setError('重新排序子任务失败，请重试');
    }
  };

  // 子任务项变体
  const subtaskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (isLoading && subtasks.length === 0) {
    return (
      <div className="subtask-list-loading flex justify-center items-center p-4">
        <LoadingSpinner variant="jade" size="small" />
      </div>
    );
  }

  return (
    <div className="subtask-list mt-4">
      <h3 className="text-lg font-bold mb-2">子任务</h3>
      
      {error && (
        <div className="error-message text-red-500 mb-2">{error}</div>
      )}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="subtasks-list">
          {(provided) => (
            <div
              className="subtasks-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <AnimatePresence>
                {subtasks.map((subtask, index) => (
                  <Draggable
                    key={subtask.id}
                    draggableId={`subtask-${subtask.id}`}
                    index={index}
                    isDragDisabled={subtask.status === TaskStatus.COMPLETED}
                  >
                    {(provided, snapshot) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`subtask-item flex items-center p-2 mb-2 rounded-md border ${
                          subtask.status === TaskStatus.COMPLETED
                            ? 'border-gray-300 bg-gray-50'
                            : 'border-jade-300 bg-white'
                        } ${snapshot.isDragging ? 'shadow-md' : ''}`}
                        variants={subtaskVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                      >
                        <div className="subtask-checkbox mr-2">
                          <input
                            type="checkbox"
                            checked={subtask.status === TaskStatus.COMPLETED}
                            onChange={() => {
                              if (subtask.status !== TaskStatus.COMPLETED) {
                                handleCompleteSubtask(subtask.id!);
                              }
                            }}
                            className="form-checkbox h-5 w-5 text-jade-500 rounded"
                          />
                        </div>
                        <div className="subtask-content flex-grow">
                          <p className={`subtask-title ${
                            subtask.status === TaskStatus.COMPLETED ? 'line-through text-gray-500' : 'text-gray-800'
                          }`}>
                            {subtask.title}
                          </p>
                        </div>
                        <div className="subtask-actions">
                          <button
                            onClick={() => handleDeleteSubtask(subtask.id!)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="删除子任务"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </AnimatePresence>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <div className="add-subtask-form mt-4">
        <div className="flex">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            placeholder="添加新子任务..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-jade-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSubtask();
              }
            }}
          />
          <Button
            variant="jade"
            onClick={handleAddSubtask}
            disabled={!newSubtaskTitle.trim() || isAddingSubtask}
            className="rounded-l-none"
          >
            {isAddingSubtask ? (
              <LoadingSpinner variant="white" size="small" />
            ) : (
              '添加'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubtaskList;
