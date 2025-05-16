// src/components/vip/VipTaskSeriesCard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  VipTaskSeriesRecord, 
  getVipTaskSeriesTasks,
  checkVipTaskSeriesCompletion
} from '@/services/vipTaskService';
import { TaskRecord, TaskStatus } from '@/services/taskService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';

interface VipTaskSeriesCardProps {
  series: VipTaskSeriesRecord;
  onViewTasks: (series: VipTaskSeriesRecord, tasks: TaskRecord[]) => void;
}

/**
 * VIP任务系列卡片组件
 */
const VipTaskSeriesCard: React.FC<VipTaskSeriesCardProps> = ({
  series,
  onViewTasks
}) => {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { refreshEvents } = useDataRefreshContext();
  
  // 加载任务
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        
        // 获取系列任务
        const seriesTasks = await getVipTaskSeriesTasks(series.id!);
        setTasks(seriesTasks);
        
        // 计算进度
        if (seriesTasks.length > 0) {
          const completedTasks = seriesTasks.filter(task => task.status === TaskStatus.COMPLETED);
          const progressValue = Math.round((completedTasks.length / seriesTasks.length) * 100);
          setProgress(progressValue);
        }
        
        // 检查系列是否已完成
        await checkVipTaskSeriesCompletion(series.id!);
      } catch (error) {
        console.error('Failed to load VIP task series tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, [series]);
  
  // 监听任务更新
  useEffect(() => {
    const handleRefresh = (refreshType: string) => {
      if (refreshType === 'tasks' || refreshType === 'vipTaskSeries') {
        // 重新加载任务
        const loadTasks = async () => {
          try {
            // 获取系列任务
            const seriesTasks = await getVipTaskSeriesTasks(series.id!);
            setTasks(seriesTasks);
            
            // 计算进度
            if (seriesTasks.length > 0) {
              const completedTasks = seriesTasks.filter(task => task.status === TaskStatus.COMPLETED);
              const progressValue = Math.round((completedTasks.length / seriesTasks.length) * 100);
              setProgress(progressValue);
            }
            
            // 检查系列是否已完成
            await checkVipTaskSeriesCompletion(series.id!);
          } catch (error) {
            console.error('Failed to load VIP task series tasks:', error);
          }
        };
        
        loadTasks();
      }
    };
    
    refreshEvents.on('dataRefreshed', handleRefresh);
    
    return () => {
      refreshEvents.off('dataRefreshed', handleRefresh);
    };
  }, [refreshEvents, series]);
  
  // 处理查看任务
  const handleViewTasks = () => {
    playSound(SoundType.BUTTON_CLICK);
    onViewTasks(series, tasks);
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
  
  // 获取任务完成状态文本
  const getCompletionStatusText = () => {
    if (series.isCompleted) {
      return '已完成';
    }
    
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED);
    return `${completedTasks.length}/${tasks.length} 任务完成`;
  };
  
  return (
    <motion.div
      className={`vip-task-series-card rounded-lg overflow-hidden shadow-md ${
        series.isCompleted ? 'bg-gold-50 border border-gold-200' : 'bg-white border border-gray-200'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* 卡片头部 */}
      <div className="card-header p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="icon-container mr-3">
            <img
              src={getSeriesIcon()}
              alt={series.title}
              className="w-10 h-10 object-contain"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{series.title}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">{getCompletionStatusText()}</span>
              {getRemainingDays() !== null && !series.isCompleted && (
                <span className="text-jade-600">
                  {getRemainingDays()} 天剩余
                </span>
              )}
            </div>
          </div>
          
          {series.isCompleted && (
            <div className="completed-badge bg-gold-500 text-white text-xs px-2 py-1 rounded-full">
              已完成
            </div>
          )}
        </div>
      </div>
      
      {/* 卡片内容 */}
      <div className="card-content p-4">
        <p className="text-gray-600 text-sm mb-4">
          {series.description}
        </p>
        
        {/* 进度条 */}
        <div className="progress-container mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>进度</span>
            <span>{progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${series.isCompleted ? 'bg-gold-500' : 'bg-jade-500'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* 任务预览 */}
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner variant="jade" size="small" />
          </div>
        ) : (
          <div className="tasks-preview mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">任务预览</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {tasks.slice(0, 2).map(task => (
                <li key={task.id} className="flex items-start">
                  <span className={`mr-2 ${task.status === TaskStatus.COMPLETED ? 'text-jade-500' : 'text-gray-400'}`}>
                    {task.status === TaskStatus.COMPLETED ? '✓' : '○'}
                  </span>
                  <span className="truncate">{task.title}</span>
                </li>
              ))}
              {tasks.length > 2 && (
                <li className="text-jade-600 text-xs">
                  还有 {tasks.length - 2} 个任务...
                </li>
              )}
            </ul>
          </div>
        )}
        
        {/* 操作按钮 */}
        <Button
          variant={series.isCompleted ? 'gold' : 'jade'}
          onClick={handleViewTasks}
          className="w-full"
        >
          查看任务
        </Button>
      </div>
    </motion.div>
  );
};

export default VipTaskSeriesCard;
