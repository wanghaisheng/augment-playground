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
import { Line, Doughnut } from 'react-chartjs-2';
import { fetchUserStatisticsView } from '@/services/localizedContentService';
import { useLanguage } from '@/context/LanguageProvider';

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

  // 获取语言
  const { language } = useLanguage();

  // 本地化视图
  const { labels } = useLocalizedView(
    'userStatisticsViewContent',
    fetchUserStatisticsView
  );

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
            {labels?.loading?.[language] || '加载统计数据中...'}
          </h3>
        </div>
      </div>
    );
  }

  // 获取任务类型数据
  const getTaskTypeData = () => {
    const labels = Object.keys(statistics.tasks.byType).map(key =>
      key === 'daily' ? (labels?.taskTypes?.daily?.[language] || '每日') :
      key === 'weekly' ? (labels?.taskTypes?.weekly?.[language] || '每周') :
      key === 'monthly' ? (labels?.taskTypes?.monthly?.[language] || '每月') : key
    );

    const data = Object.values(statistics.tasks.byType);

    return {
      labels,
      datasets: [
        {
          label: labels?.taskTypeChart?.[language] || '任务类型分布',
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
      key === 'high' ? (labels?.priorities?.high?.[language] || '高') :
      key === 'medium' ? (labels?.priorities?.medium?.[language] || '中') :
      key === 'low' ? (labels?.priorities?.low?.[language] || '低') : key
    );

    const data = Object.values(statistics.tasks.byPriority);

    return {
      labels,
      datasets: [
        {
          label: labels?.priorityChart?.[language] || '优先级分布',
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
      labels?.weekdays?.sunday?.[language] || '周日',
      labels?.weekdays?.monday?.[language] || '周一',
      labels?.weekdays?.tuesday?.[language] || '周二',
      labels?.weekdays?.wednesday?.[language] || '周三',
      labels?.weekdays?.thursday?.[language] || '周四',
      labels?.weekdays?.friday?.[language] || '周五',
      labels?.weekdays?.saturday?.[language] || '周六'
    ];

    return {
      labels,
      datasets: [
        {
          label: labels?.weeklyCompletionChart?.[language] || '每周任务完成情况',
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
      `${labels?.day?.[language] || '天'} ${i + 1}`
    );

    return {
      labels,
      datasets: [
        {
          label: labels?.moodChart?.[language] || '心情历史',
          data: statistics.panda.moodHistory,
          backgroundColor: 'rgba(156, 39, 176, 0.2)',
          borderColor: 'rgba(156, 39, 176, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        },
        {
          label: labels?.energyChart?.[language] || '能量历史',
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
          <div className="text-sm text-green-600">{labels?.tasksCompleted?.[language] || '已完成任务'}</div>
        </div>

        <div className="stat-card bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-2xl font-bold text-blue-700">{statistics.tasks.streak}</div>
          <div className="text-sm text-blue-600">{labels?.currentStreak?.[language] || '当前连续天数'}</div>
        </div>

        <div className="stat-card bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-2xl font-bold text-purple-700">{statistics.tasks.longestStreak}</div>
          <div className="text-sm text-purple-600">{labels?.longestStreak?.[language] || '最长连续天数'}</div>
        </div>

        <div className="stat-card bg-orange-50 p-4 rounded-lg border border-orange-100">
          <div className="text-2xl font-bold text-orange-700">
            {Math.round((statistics.tasks.completed / (statistics.tasks.completed + statistics.tasks.failed)) * 100)}%
          </div>
          <div className="text-sm text-orange-600">{labels?.completionRate?.[language] || '完成率'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="chart-card bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-4">{labels?.taskTypeDistribution?.[language] || '任务类型分布'}</h3>
          <div className="h-64">
            <Doughnut data={getTaskTypeData()} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-card bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-4">{labels?.taskPriorityDistribution?.[language] || '任务优先级分布'}</h3>
          <div className="h-64">
            <Doughnut data={getTaskPriorityData()} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="chart-card bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">{labels?.weeklyTaskCompletion?.[language] || '每周任务完成情况'}</h3>
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
          <div className="text-sm text-green-600">{labels?.pandaLevel?.[language] || '熊猫等级'}</div>
        </div>

        <div className="stat-card bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-2xl font-bold text-blue-700">{statistics.panda.interactions}</div>
          <div className="text-sm text-blue-600">{labels?.totalInteractions?.[language] || '总互动次数'}</div>
        </div>

        <div className="stat-card bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-2xl font-bold text-purple-700">{statistics.panda.feedings}</div>
          <div className="text-sm text-purple-600">{labels?.totalFeedings?.[language] || '总喂食次数'}</div>
        </div>

        <div className="stat-card bg-orange-50 p-4 rounded-lg border border-orange-100">
          <div className="text-2xl font-bold text-orange-700">{statistics.panda.evolutions}</div>
          <div className="text-sm text-orange-600">{labels?.totalEvolutions?.[language] || '总进化次数'}</div>
        </div>
      </div>

      <div className="chart-card bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">{labels?.pandaMoodEnergy?.[language] || '熊猫心情和能量历史'}</h3>
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
          {labels?.categories?.tasks?.[language] || '任务'}
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'challenges' ? 'bg-jade-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryChange('challenges')}
        >
          {labels?.categories?.challenges?.[language] || '挑战'}
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'panda' ? 'bg-jade-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryChange('panda')}
        >
          {labels?.categories?.panda?.[language] || '熊猫'}
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'resources' ? 'bg-jade-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryChange('resources')}
        >
          {labels?.categories?.resources?.[language] || '资源'}
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'achievements' ? 'bg-jade-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryChange('achievements')}
        >
          {labels?.categories?.achievements?.[language] || '成就'}
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
                {labels?.comingSoon?.[language] || '即将推出'}
              </h3>
              <p className="text-gray-600">
                {labels?.comingSoonDescription?.[language] || '此统计分类的详细数据正在开发中，敬请期待！'}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UserStatistics;
