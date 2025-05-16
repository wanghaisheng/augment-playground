// src/pages/VipTaskSeriesPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  VipTaskSeriesRecord, 
  getActiveVipTaskSeries,
  canAccessVipTasks
} from '@/services/vipTaskService';
import { TaskRecord } from '@/services/taskService';
import VipTaskSeriesCard from '@/components/vip/VipTaskSeriesCard';
import VipTaskSeriesDetails from '@/components/vip/VipTaskSeriesDetails';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { playSound, SoundType } from '@/utils/sound';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import { usePandaState } from '@/context/PandaStateProvider';

/**
 * VIP任务系列页面
 */
const VipTaskSeriesPage: React.FC = () => {
  const [series, setSeries] = useState<VipTaskSeriesRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canAccess, setCanAccess] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<VipTaskSeriesRecord | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<TaskRecord[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  
  const { refreshEvents } = useDataRefreshContext();
  const { pandaState } = usePandaState();
  const navigate = useNavigate();
  
  // 加载VIP任务系列
  useEffect(() => {
    const loadVipTaskSeries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 检查用户是否可以访问VIP任务
        const userId = 'current-user'; // 在实际应用中，这应该是当前用户的ID
        const hasAccess = await canAccessVipTasks(userId);
        setCanAccess(hasAccess);
        
        if (hasAccess) {
          // 获取活跃的VIP任务系列
          const activeSeries = await getActiveVipTaskSeries();
          setSeries(activeSeries);
        }
      } catch (error) {
        console.error('Failed to load VIP task series:', error);
        setError('加载VIP任务系列失败');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVipTaskSeries();
  }, []);
  
  // 监听数据刷新
  useEffect(() => {
    const handleRefresh = (refreshType: string) => {
      if (refreshType === 'vipTaskSeries' || refreshType === 'tasks') {
        // 重新加载VIP任务系列
        const loadVipTaskSeries = async () => {
          try {
            // 获取活跃的VIP任务系列
            const activeSeries = await getActiveVipTaskSeries();
            setSeries(activeSeries);
          } catch (error) {
            console.error('Failed to load VIP task series:', error);
          }
        };
        
        loadVipTaskSeries();
      }
    };
    
    refreshEvents.on('dataRefreshed', handleRefresh);
    
    return () => {
      refreshEvents.off('dataRefreshed', handleRefresh);
    };
  }, [refreshEvents]);
  
  // 处理查看任务
  const handleViewTasks = (series: VipTaskSeriesRecord, tasks: TaskRecord[]) => {
    setSelectedSeries(series);
    setSelectedTasks(tasks);
    setShowDetails(true);
  };
  
  // 处理关闭详情
  const handleCloseDetails = () => {
    setShowDetails(false);
  };
  
  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.CLICK);
    navigate('/vip-benefits');
  };
  
  // 渲染加载状态
  const renderLoading = () => (
    <div className="flex justify-center items-center h-40">
      <LoadingSpinner variant="jade" size="medium" />
    </div>
  );
  
  // 渲染错误状态
  const renderError = () => (
    <div className="text-center p-4">
      <div className="text-red-500 mb-4">{error}</div>
      <Button
        variant="jade"
        onClick={() => window.location.reload()}
      >
        重试
      </Button>
    </div>
  );
  
  // 渲染VIP访问限制
  const renderVipRestriction = () => (
    <div className="vip-restriction text-center p-8 bg-gold-50 rounded-lg border border-gold-200">
      <div className="text-6xl mb-4">✨</div>
      <h2 className="text-xl font-bold text-gold-700 mb-2">
        VIP专属内容
      </h2>
      <p className="text-gray-600 mb-6">
        VIP任务系列是为我们的VIP会员提供的专属内容。升级到VIP会员，解锁这些特殊任务系列，获得额外的经验值和资源奖励。
      </p>
      <Button
        variant="gold"
        onClick={handleNavigateToVip}
      >
        升级到VIP
      </Button>
    </div>
  );
  
  // 渲染空状态
  const renderEmptyState = () => (
    <div className="empty-state text-center p-8 bg-gray-50 rounded-lg">
      <div className="text-6xl mb-4">📋</div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">
        暂无活跃的任务系列
      </h2>
      <p className="text-gray-600 mb-4">
        目前没有活跃的VIP任务系列。请稍后再来查看，我们会定期添加新的任务系列。
      </p>
    </div>
  );
  
  // 渲染任务系列列表
  const renderSeriesList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map(item => (
        <VipTaskSeriesCard
          key={item.id}
          series={item}
          onViewTasks={handleViewTasks}
        />
      ))}
    </div>
  );
  
  return (
    <div className="vip-task-series-page p-4">
      <div className="page-header mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          VIP任务系列
        </h1>
        <p className="text-gray-600">
          完成这些特殊的任务系列，获得额外的经验值和资源奖励
        </p>
      </div>
      
      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : !canAccess ? (
        renderVipRestriction()
      ) : series.length === 0 ? (
        renderEmptyState()
      ) : (
        renderSeriesList()
      )}
      
      {/* VIP任务系列详情 */}
      <VipTaskSeriesDetails
        isOpen={showDetails}
        onClose={handleCloseDetails}
        series={selectedSeries}
        tasks={selectedTasks}
      />
    </div>
  );
};

export default VipTaskSeriesPage;
