// src/pages/MeditationPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  type MeditationCourseRecord,
  MeditationDifficulty,
  MeditationType
} from '@/types/meditation';
import {
  getAccessibleMeditationCourses,
  getUserMeditationStats,
} from '@/services/meditationService';
import MeditationCourseCard from '@/components/meditation/MeditationCourseCard';
import MeditationPlayer from '@/components/meditation/MeditationPlayer';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { playSound, SoundType } from '@/utils/sound';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import { usePandaState } from '@/context/PandaStateProvider';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchMeditationPageView } from '@/services';
import type { MeditationPageViewLabelsBundle, MeditationPageViewDataPayload } from '@/types';

/**
 * 冥想页面
 */
const MeditationPage: React.FC = () => {
  const [courses, setCourses] = useState<MeditationCourseRecord[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<MeditationCourseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<MeditationCourseRecord | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<MeditationDifficulty | 'all'>('all');
  const [selectedType, setSelectedType] = useState<MeditationType | 'all'>('all');
  const [selectedDuration, setSelectedDuration] = useState<'short' | 'medium' | 'long' | 'all'>('all');
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    longestStreak: 0,
    currentStreak: 0,
    completedCourses: 0
  });
  
  const { pandaState } = usePandaState();
  const navigate = useNavigate();
  const {
    labels: pageLabels,
    isPending: isLabelsPending,
    isError: isLabelsError,
    error: labelsError,
    refetch: refetchLabels
  } = useLocalizedView<MeditationPageViewDataPayload | null, MeditationPageViewLabelsBundle>(
    'meditationPageViewContent',
    fetchMeditationPageView
  );
  
  const isVip = pandaState?.isVip || false;
  
  const applyFilters = useCallback((coursesToFilter: MeditationCourseRecord[]) => {
    let filtered = [...coursesToFilter];
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(course => course.type === selectedType);
    }
    if (selectedDuration !== 'all') {
      switch (selectedDuration) {
        case 'short':
          filtered = filtered.filter(course => course.durationMinutes <= 10);
          break;
        case 'medium':
          filtered = filtered.filter(course => course.durationMinutes > 10 && course.durationMinutes <= 20);
          break;
        case 'long':
          filtered = filtered.filter(course => course.durationMinutes > 20);
          break;
      }
    }
    setFilteredCourses(filtered);
  }, [selectedDifficulty, selectedType, selectedDuration]);

  // 加载冥想课程 (Initial Load)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = 'current-user';
        const accessibleCourses = await getAccessibleMeditationCourses(userId);
        setCourses(accessibleCourses);
        // applyFilters will be called by the useEffect below due to `courses` changing
        const userStats = await getUserMeditationStats(userId);
        setStats(userStats);
      } catch (err) {
        console.error('Failed to load meditation courses:', err);
        setError(pageLabels?.noCourseFound || '加载冥想课程失败');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (pageLabels) { // Ensure labels are loaded before fetching data that might use them for fallbacks
        loadInitialData();
    }
  }, [pageLabels]); // Reload initial data if labels change (e.g. language change)

  // Effect to apply filters whenever courses or filter criteria change
  useEffect(() => {
    if (courses.length > 0) {
        applyFilters(courses);
    } else {
        setFilteredCourses([]); // Ensure filteredCourses is empty if courses is empty
    }
  }, [courses, selectedDifficulty, selectedType, selectedDuration, applyFilters]);
  
  // Data refresh handler
  const handleMeditationDataRefresh = useCallback(async () => {
    console.log('Refreshing meditation data due to table update...');
    try {
      const userId = 'current-user';
      const accessibleCourses = await getAccessibleMeditationCourses(userId);
      setCourses(accessibleCourses); 
      // applyFilters will be triggered by the useEffect above due to `courses` change
      const userStats = await getUserMeditationStats(userId);
      setStats(userStats);
    } catch (err) {
      console.error('Failed to reload meditation data on refresh:', err);
      // Optionally set an error state here if needed for refresh-specific errors
    }
  }, []); // Empty dependency array as it fetches fresh data

  // Register table refresh listeners
  useRegisterTableRefresh('meditationCourses', handleMeditationDataRefresh);
  useRegisterTableRefresh('meditationSessions', handleMeditationDataRefresh);
  
  // 处理难度过滤
  const handleDifficultyFilter = (difficulty: MeditationDifficulty | 'all') => {
    setSelectedDifficulty(difficulty);
    // applyFilters will be called by the useEffect above
    playSound(SoundType.BUTTON_CLICK);
  };
  
  // 处理类型过滤
  const handleTypeFilter = (type: MeditationType | 'all') => {
    setSelectedType(type);
    // applyFilters will be called by the useEffect above
    playSound(SoundType.BUTTON_CLICK);
  };
  
  // 处理时长过滤
  const handleDurationFilter = (duration: 'short' | 'medium' | 'long' | 'all') => {
    setSelectedDuration(duration);
    // applyFilters will be called by the useEffect above
    playSound(SoundType.BUTTON_CLICK);
  };
  
  // 处理课程点击
  const handleCourseClick = (course: MeditationCourseRecord) => {
    setSelectedCourse(course);
    setShowPlayer(true);
  };
  
  // 处理关闭播放器
  const handleClosePlayer = () => {
    setShowPlayer(false);
  };
  
  // 处理导航到VIP页面
  const handleNavigateToVip = () => {
    playSound(SoundType.BUTTON_CLICK);
    navigate('/vip-benefits');
  };
  
  // 获取难度标签
  const getDifficultyLabel = (difficulty: MeditationDifficulty) => {
    switch (difficulty) {
      case MeditationDifficulty.BEGINNER:
        return pageLabels?.difficultyBeginner || '初级';
      case MeditationDifficulty.INTERMEDIATE:
        return pageLabels?.difficultyIntermediate || '中级';
      case MeditationDifficulty.ADVANCED:
        return pageLabels?.difficultyAdvanced || '高级';
      case MeditationDifficulty.MASTER:
        return pageLabels?.difficultyMaster || '大师';
      default:
        return '';
    }
  };
  
  // 获取类型标签
  const getTypeLabel = (type: MeditationType) => {
    switch (type) {
      case MeditationType.MINDFULNESS:
        return pageLabels?.typeMindfulness || '正念冥想';
      case MeditationType.BREATHWORK:
        return pageLabels?.typeBreathwork || '呼吸练习';
      case MeditationType.BODY_SCAN:
        return pageLabels?.typeBodyScan || '身体扫描';
      case MeditationType.LOVING_KINDNESS:
        return pageLabels?.typeLovingKindness || '慈心冥想';
      case MeditationType.VISUALIZATION:
        return pageLabels?.typeVisualization || '可视化冥想';
      case MeditationType.MANTRA:
        return pageLabels?.typeMantra || '咒语冥想';
      case MeditationType.GUIDED:
        return pageLabels?.typeGuided || '引导冥想';
      case MeditationType.ZEN:
        return pageLabels?.typeZen || '禅修';
      case MeditationType.TRANSCENDENTAL:
        return pageLabels?.typeTranscendental || '超觉冥想';
      case MeditationType.YOGA_NIDRA:
        return pageLabels?.typeYogaNidra || '瑜伽睡眠';
      default:
        return '';
    }
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
      <div className="text-red-500 mb-4">{error || (pageLabels?.error?.generic || 'An error occurred')}</div>
      <Button
        variant="jade"
        onClick={() => {
          refetchLabels(); // Refetch labels
          // Re-trigger initial data load logic if needed, or rely on useEffect for pageLabels
          const loadInitialData = async () => {
            try {
              setIsLoading(true);
              setError(null);
              const userId = 'current-user';
              const accessibleCourses = await getAccessibleMeditationCourses(userId);
              setCourses(accessibleCourses);
              const userStats = await getUserMeditationStats(userId);
              setStats(userStats);
            } catch (err) {
              console.error('Failed to load meditation courses:', err);
              setError(pageLabels?.noCourseFound || '加载冥想课程失败');
            } finally {
              setIsLoading(false);
            }
          };
          loadInitialData();
        }}
      >
        {pageLabels?.error?.retry || '重试'}
      </Button>
    </div>
  );
  
  // 渲染统计数据
  const renderStats = () => (
    <div className="stats-section bg-jade-50 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-bold text-jade-700 mb-3">
        {pageLabels?.statsTitle || '冥想统计'}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="stat-item text-center">
          <div className="text-2xl font-bold text-jade-600">{stats.totalSessions}</div>
          <div className="text-sm text-gray-600">{pageLabels?.statsTotalSessions || '总冥想次数'}</div>
        </div>
        
        <div className="stat-item text-center">
          <div className="text-2xl font-bold text-jade-600">{stats.totalMinutes}</div>
          <div className="text-sm text-gray-600">{pageLabels?.statsTotalMinutes || '总冥想分钟'}</div>
        </div>
        
        <div className="stat-item text-center">
          <div className="text-2xl font-bold text-jade-600">{stats.currentStreak}</div>
          <div className="text-sm text-gray-600">{pageLabels?.statsCurrentStreak || '当前连续天数'}</div>
        </div>
        
        <div className="stat-item text-center">
          <div className="text-2xl font-bold text-jade-600">{stats.longestStreak}</div>
          <div className="text-sm text-gray-600">{pageLabels?.statsLongestStreak || '最长连续天数'}</div>
        </div>
        
        <div className="stat-item text-center">
          <div className="text-2xl font-bold text-jade-600">{stats.completedCourses}</div>
          <div className="text-sm text-gray-600">{pageLabels?.statsCompletedCourses || '完成课程数'}</div>
        </div>
      </div>
    </div>
  );
  
  // 渲染VIP提示
  const renderVipPromotion = () => (
    <motion.div
      className="vip-promotion bg-gold-50 border border-gold-200 rounded-lg p-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-start">
        <div className="mr-4 text-4xl">✨</div>
        <div>
          <h3 className="text-lg font-bold text-gold-700 mb-2">
            {pageLabels?.vipPromotionTitle || 'VIP专属高级冥想课程'}
          </h3>
          <p className="text-gray-600 mb-4">
            {pageLabels?.vipPromotionDescription || '升级到VIP会员，解锁高级冥想课程，包括禅修、瑜伽睡眠和超觉冥想等专业技术，帮助您达到更深层次的冥想体验。'}
          </p>
          <Button
            variant="gold"
            onClick={handleNavigateToVip}
          >
            {pageLabels?.upgradeButton || '升级到VIP'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
  
  return (
    <div className="meditation-page p-4">
      <div className="page-header mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {pageLabels?.pageTitle || '冥想课程'}
        </h1>
        <p className="text-gray-600">
          {pageLabels?.pageDescription || '探索各种冥想课程，提升专注力和内心平静'}
        </p>
      </div>
      
      {/* If labels are loading, show a spinner */}
      {isLabelsPending && <LoadingSpinner variant="jade" size="large" text="Loading Meditation Space..." />}
      {/* If labels failed to load, show error */}
      {isLabelsError && !isLabelsPending && 
        <ErrorDisplay 
          error={labelsError} 
          title={pageLabels?.pageTitle || 'Meditation Area'}
          messageTemplate={(labelsError?.message && pageLabels?.error?.generic) ? `${pageLabels.error.generic}: {message}` : '{message}'} 
          onRetry={refetchLabels}
          retryButtonText={pageLabels?.error?.retry || 'Retry'}
        />
      }

      {/* Render content only if labels are successfully loaded */}
      {!isLabelsPending && !isLabelsError && pageLabels && (
        <>
      {/* 统计数据 */}
      {!isLoading && !error && renderStats()}
      
      {/* VIP提示 */}
      {!isLoading && !error && !isVip && renderVipPromotion()}
      
      {/* 过滤器 */}
      {!isLoading && !error && (
        <div className="filters-section mb-6">
          {/* 难度过滤器 */}
          <div className="difficulty-filter mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {pageLabels?.difficultyFilterTitle || '难度'}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedDifficulty === 'all' ? 'jade' : 'secondary'}
                size="small"
                onClick={() => handleDifficultyFilter('all')}
              >
                    {pageLabels?.allLabel || '全部'}
              </Button>
              {Object.values(MeditationDifficulty).map(difficulty => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? 'jade' : 'secondary'}
                  size="small"
                  onClick={() => handleDifficultyFilter(difficulty)}
                >
                  {getDifficultyLabel(difficulty)}
                </Button>
              ))}
            </div>
          </div>
          
          {/* 类型过滤器 */}
          <div className="type-filter mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {pageLabels?.typeFilterTitle || '类型'}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === 'all' ? 'jade' : 'secondary'}
                size="small"
                onClick={() => handleTypeFilter('all')}
              >
                    {pageLabels?.allLabel || '全部'}
              </Button>
              {Object.values(MeditationType).map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'jade' : 'secondary'}
                  size="small"
                  onClick={() => handleTypeFilter(type)}
                >
                  {getTypeLabel(type)}
                </Button>
              ))}
            </div>
          </div>
          
          {/* 时长过滤器 */}
          <div className="duration-filter">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {pageLabels?.durationFilterTitle || '时长'}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedDuration === 'all' ? 'jade' : 'secondary'}
                size="small"
                onClick={() => handleDurationFilter('all')}
              >
                    {pageLabels?.allLabel || '全部'}
              </Button>
              <Button
                variant={selectedDuration === 'short' ? 'jade' : 'secondary'}
                size="small"
                onClick={() => handleDurationFilter('short')}
              >
                    {pageLabels?.durationShort || '短 (≤10分钟)'}
              </Button>
              <Button
                variant={selectedDuration === 'medium' ? 'jade' : 'secondary'}
                size="small"
                onClick={() => handleDurationFilter('medium')}
              >
                    {pageLabels?.durationMedium || '中 (11-20分钟)'}
              </Button>
              <Button
                variant={selectedDuration === 'long' ? 'jade' : 'secondary'}
                size="small"
                onClick={() => handleDurationFilter('long')}
              >
                    {pageLabels?.durationLong || '长 (>20分钟)'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* 课程列表 */}
      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : filteredCourses.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">🧘</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">
                {error ? error : (pageLabels?.noCourseFound || '没有找到符合条件的课程')}
          </h2>
          <p className="text-gray-600">
                {error ? (pageLabels?.error?.retry ? <Button variant="jade" onClick={() => window.location.reload()}>{pageLabels.error.retry}</Button> : 'Please try again later.') : (pageLabels?.tryDifferentFilters || '请尝试不同的过滤条件')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
            <MeditationCourseCard
              key={course.id}
              course={course}
                  onClick={() => handleCourseClick(course)}
              isVipUser={isVip}
            />
          ))}
        </div>
      )}
      
      {/* 冥想播放器 */}
      <MeditationPlayer
        isOpen={showPlayer}
        onClose={handleClosePlayer}
        course={selectedCourse}
      />
        </>
      )}
    </div>
  );
};

export default MeditationPage;
