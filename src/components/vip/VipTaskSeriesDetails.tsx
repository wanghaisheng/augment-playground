// src/components/vip/VipTaskSeriesDetails.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VipTaskSeriesRecord } from '@/services/vipTaskService';
import { TaskRecord, TaskStatus, completeTask } from '@/services/taskService';
import LatticeDialog from '@/components/game/LatticeDialog';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';

interface VipTaskSeriesDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  series: VipTaskSeriesRecord | null;
  tasks: TaskRecord[];
}

/**
 * VIP任务系列详情组件
 */
const VipTaskSeriesDetails: React.FC<VipTaskSeriesDetailsProps> = ({
  isOpen,
  onClose,
  series,
  tasks
}) => {
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);
  const { refreshData } = useDataRefreshContext();
  
  // 如果没有系列，不显示
  if (!series) {
    return null;
  }
  
  // 处理关闭
  const handleClose = () => {
    playSound(SoundType.BUTTON_CLICK);
    onClose();
  };
  
  // 处理完成任务
  const handleCompleteTask = async (taskId: number) => {
    try {
      setCompletingTaskId(taskId);
      playSound(SoundType.BUTTON_CLICK);
      
      // 完成任务
      await completeTask(taskId);
      
      // 播放成功音效
      playSound(SoundType.SUCCESS);
      
      // 刷新数据
      refreshData('tasks');
      refreshData('vipTaskSeries');
    } catch (error) {
      console.error('Failed to complete task:', error);
      playSound(SoundType.ERROR);
    } finally {
      setCompletingTaskId(null);
    }
  };
  
  // 获取系列图标
  const getSeriesIcon = () => {
    return series.iconPath || '/assets/vip/default-series-icon.svg';
  };
  
  // 获取剩余天数
  const getRemainingDays = () => {
    if (!series.endDate) return null;
    
    const now = new Date();
    const endDate = new Date(series.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  // 计算进度
  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED);
    return Math.round((completedTasks.length / tasks.length) * 100);
  };
  
  // 获取任务完成状态文本
  const getCompletionStatusText = () => {
    if (series.isCompleted) {
      return '已完成';
    }
    
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED);
    return `${completedTasks.length}/${tasks.length} 任务完成`;
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <LatticeDialog
          isOpen={true}
          onClose={handleClose}
          title={series.title}
          showCloseButton={true}
          size="large"
        >
          <div className="vip-task-series-details p-4">
            {/* 系列信息 */}
            <div className="series-info flex items-center mb-6">
              <div className="icon-container mr-4">
                <img
                  src={getSeriesIcon()}
                  alt={series.title}
                  className="w-16 h-16 object-contain"
                />
              </div>
              
              <div className="flex-1">
                <p className="text-gray-600 mb-2">
                  {series.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-3">{getCompletionStatusText()}</span>
                  {getRemainingDays() !== null && !series.isCompleted && (
                    <span className="text-jade-600">
                      {getRemainingDays()} 天剩余
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* 进度条 */}
            <div className="progress-container mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>系列进度</span>
                <span>{calculateProgress()}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${series.isCompleted ? 'bg-gold-500' : 'bg-jade-500'}`}
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
            
            {/* 任务列表 */}
            <div className="tasks-list mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">系列任务</h3>
              
              {tasks.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  暂无任务
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <motion.div
                      key={task.id}
                      className={`task-item p-3 rounded-lg border ${
                        task.status === TaskStatus.COMPLETED
                          ? 'bg-jade-50 border-jade-200'
                          : 'bg-white border-gray-200'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start">
                        <div className={`task-status-icon mr-3 mt-1 ${
                          task.status === TaskStatus.COMPLETED ? 'text-jade-500' : 'text-gray-400'
                        }`}>
                          {task.status === TaskStatus.COMPLETED ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-800 mb-1">{task.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="mr-3">预计时间: {task.estimatedMinutes} 分钟</span>
                            <span>优先级: {task.priority}</span>
                          </div>
                        </div>
                        
                        {task.status !== TaskStatus.COMPLETED && (
                          <Button
                            variant="jade"
                            size="small"
                            onClick={() => handleCompleteTask(task.id!)}
                            disabled={completingTaskId === task.id}
                            className="ml-2"
                          >
                            {completingTaskId === task.id ? (
                              <LoadingSpinner variant="white" size="small" />
                            ) : (
                              '完成'
                            )}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 系列完成奖励 */}
            {series.isCompleted ? (
              <div className="series-completed bg-gold-50 border border-gold-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-gold-700 mb-2">系列已完成!</h3>
                <p className="text-gray-600">
                  恭喜您完成了 {series.title} 系列的所有任务！您已经获得了额外的经验值和资源奖励。
                </p>
              </div>
            ) : (
              <div className="series-rewards bg-jade-50 border border-jade-200 rounded-lg p-4 mb-6">
                <h3 className="text-base font-medium text-jade-700 mb-2">系列完成奖励</h3>
                <p className="text-sm text-gray-600">
                  完成所有任务后，您将获得额外的经验值和资源奖励。VIP会员的奖励将比普通用户高出50%！
                </p>
              </div>
            )}
            
            {/* 关闭按钮 */}
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={handleClose}
              >
                关闭
              </Button>
            </div>
          </div>
        </LatticeDialog>
      )}
    </AnimatePresence>
  );
};

export default VipTaskSeriesDetails;
