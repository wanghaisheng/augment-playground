// src/components/profile/UserStatistics.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserStatistics as UserStatsType } from '@/types/user';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { playSound, SoundType } from '@/utils/sound';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// 组件属性
interface UserStatisticsProps {
  statistics: UserStatsType | null;
}

/**
 * 用户统计数据组件
 * 
 * 展示用户的各项统计数据，包括任务、挑战、熊猫互动等
 */
const UserStatistics: React.FC<UserStatisticsProps> = ({
  statistics
}) => {
  // 状态
  const [activeCategory, setActiveCategory] = useState<
    'tasks' | 'challenges' | 'panda' | 'resources' | 'time' | 'social' | 'achievements'
  >('tasks');
  
  // 本地化视图
  const { content } = useLocalizedView('userStatistics');
  
  // 处理分类切换
  const handleCategoryChange = (category: typeof activeCategory) => {
    playSound(SoundType.BUTTON_CLICK);
    setActiveCategory(category);
  };
  
  // 如果没有统计数据，显示加载状态
  if (!statistics) {
    return (
      <div className="user-statistics bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-jade-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {content?.loading || '加载统计数据中...'}
          </h3>
        </div>
      </div>
    );
  }
  
  // 获取任务类型数据
  const getTaskTypeData = () => {
    const labels = Object.keys(statistics.tasks.byType).map(key => 
      key === 'daily' ? (content?.taskTypes?.daily || '每日') :
      key === 'weekly' ? (content?.taskTypes?.weekly || '每周') :
      key === 'monthly' ? (content?.taskTypes?.monthly || '每月') : key
    );
    
    const data = Object.values(statistics.tasks.byType);
    
    return {
      labels,
      datasets: [
        {
          label: content?.taskTypeChart || '任务类型分布',
          data,
          backgroundColor: [
            'rgba(76, 175, 80, 0.6)',
            'rgba(33, 150, 243, 0.6)',
            'rgba(156, 39, 176, 0.6)'
          ],
          borderColor: [
            'rgba(76, 175, 80, 1)',
            'rgba(33, 150, 243, 1)',
            'rgba(156, 39, 176, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  // 获取任务优先级数据
  const getTaskPriorityData = () => {
    const labels = Object.keys(statistics.tasks.byPriority).map(key => 
      key === 'high' ? (content?.priorities?.high || '高') :
      key === 'medium' ? (content?.priorities?.medium || '中') :
      key === 'low' ? (content?.priorities?.low || '低') : key
    );
    
    const data = Object.values(statistics.tasks.byPriority);
    
    return {
      labels,
      datasets: [
        {
          label: content?.priorityChart || '优先级分布',
          data,
          backgroundColor: [
            'rgba(244, 67, 54, 0.6)',
            'rgba(255, 152, 0, 0.6)',
            'rgba(76, 175, 80, 0.6)'
          ],
          borderColor: [
            'rgba(244, 67, 54, 1)',
            'rgba(255, 152, 0, 1)',
            'rgba(76, 175, 80, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  // 获取每周完成情况数据
  const getWeeklyCompletionData = () => {
    const labels = [
      content?.weekdays?.sunday || '周日',
      content?.weekdays?.monday || '周一',
      content?.weekdays?.tuesday || '周二',
      content?.weekdays?.wednesday || '周三',
      content?.weekdays?.thursday || '周四',
      content?.weekdays?.friday || '周五',
      content?.weekdays?.saturday || '周六'
    ];
    
    return {
      labels,
      datasets: [
        {
          label: content?.weeklyCompletionChart || '每周任务完成情况',
          data: statistics.tasks.weeklyCompletion,
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    };
  };
  
  // 获取熊猫心情历史数据
  const getPandaMoodData = () => {
    const labels = Array.from({ length: statistics.panda.moodHistory.length }, (_, i) => 
      `${content?.day || '天'} ${i + 1}`
    );
    
    return {
      labels,
      datasets: [
        {
          label: content?.moodChart || '心情历史',
          data: statistics.panda.moodHistory,
          backgroundColor: 'rgba(156, 39, 176, 0.2)',
          borderColor: 'rgba(156, 39, 176, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        },
        {
          label: content?.energyChart || '能量历史',
          data: statistics.panda.energyHistory,
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    };
  };
  
  // 渲染任务统计
  const renderTasksStats = () => (
    <div className="tasks-stats">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-2xl font-bold text-green-700">{statistics.tasks.completed}</div>
          <div className="text-sm text-green-600">{content?.tasksCompleted || '已完成任务'}</div>
        </div>
        
        <div className="stat-card bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-2xl font-bold text-blue-700">{statistics.tasks.streak}</div>
          <div className="text-sm text-blue-600">{content?.currentStreak || '当前连续天数'}</div>
        </div>
        
        <div className="stat-card bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-2xl font-bold text-purple-700">{statistics.tasks.longestStreak}</div>
          <div className="text-sm text-purple-600">{content?.longestStreak || '最长连续天数'}</div>
        </div>
        
        <div className="stat-card bg-orange-50 p-4 rounded-lg border border-orange-100">
          <div className="text-2xl font-bold text-orange-700">
            {Math.round((statistics.tasks.completed / (statistics.tasks.completed + statistics.tasks.failed)) * 100)}%
          </div>
          <div className="text-sm text-orange-600">{content?.completionRate || '完成率'}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="chart-card bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-4">{content?.taskTypeDistribution || '任务类型分布'}</h3>
          <div className="h-64">
            <Doughnut data={getTaskTypeData()} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="chart-card bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-4">{content?.taskPriorityDistribution || '任务优先级分布'}</h3>
          <div className="h-64">
            <Doughnut data={getTaskPriorityData()} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
      
      <div className="chart-card bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">{content?.weeklyTaskCompletion || '每周任务完成情况'}</h3>
        <div className="h-64">
          <Line data={getWeeklyCompletionData()} options={{ 
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
  
  // 渲染熊猫统计
  const renderPandaStats = () => (
    <div className="panda-stats">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-2xl font-bold text-green-700">{statistics.panda.level}</div>
          <div className="text-sm text-green-600">{content?.pandaLevel || '熊猫等级'}</div>
        </div>
        
        <div className="stat-card bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-2xl font-bold text-blue-700">{statistics.panda.interactions}</div>
          <div className="text-sm text-blue-600">{content?.totalInteractions || '总互动次数'}</div>
        </div>
        
        <div className="stat-card bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-2xl font-bold text-purple-700">{statistics.panda.feedings}</div>
          <div className="text-sm text-purple-600">{content?.totalFeedings || '总喂食次数'}</div>
        </div>
        
        <div className="stat-card bg-orange-50 p-4 rounded-lg border border-orange-100">
          <div className="text-2xl font-bold text-orange-700">{statistics.panda.evolutions}</div>
          <div className="text-sm text-orange-600">{content?.totalEvolutions || '总进化次数'}</div>
        </div>
      </div>
      
      <div className="chart-card bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">{content?.pandaMoodEnergy || '熊猫心情和能量历史'}</h3>
        <div className="h-64">
          <Line data={getPandaMoodData()} options={{ 
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="user-statistics bg-white rounded-lg shadow-md p-6">
      <div className="category-tabs flex overflow-x-auto mb-6 pb-2">
        <button
          className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'tasks' ? 'bg-jade-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryChange('tasks')}
        >
          {content?.categories?.tasks || '任务'}
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'challenges' ? 'bg-jade-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryChange('challenges')}
        >
          {content?.categories?.challenges || '挑战'}
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'panda' ? 'bg-jade-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryChange('panda')}
        >
          {content?.categories?.panda || '熊猫'}
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'resources' ? 'bg-jade-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryChange('resources')}
        >
          {content?.categories?.resources || '资源'}
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'achievements' ? 'bg-jade-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryChange('achievements')}
        >
          {content?.categories?.achievements || '成就'}
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeCategory === 'tasks' && renderTasksStats()}
          {activeCategory === 'panda' && renderPandaStats()}
          {/* 其他分类的统计数据将在后续实现 */}
          {(activeCategory === 'challenges' || 
            activeCategory === 'resources' || 
            activeCategory === 'time' || 
            activeCategory === 'social' || 
            activeCategory === 'achievements') && (
            <div className="coming-soon text-center p-8">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {content?.comingSoon || '即将推出'}
              </h3>
              <p className="text-gray-600">
                {content?.comingSoonDescription || '此统计分类的详细数据正在开发中，敬请期待！'}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UserStatistics;
