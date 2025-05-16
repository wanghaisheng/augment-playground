// src/components/meditation/MeditationCourseCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  MeditationCourseRecord, 
  MeditationDifficulty 
} from '@/services/meditationService';
import { playSound, SoundType } from '@/utils/sound';

interface MeditationCourseCardProps {
  course: MeditationCourseRecord;
  onClick: (course: MeditationCourseRecord) => void;
  isVipUser: boolean;
}

/**
 * 冥想课程卡片组件
 */
const MeditationCourseCard: React.FC<MeditationCourseCardProps> = ({
  course,
  onClick,
  isVipUser
}) => {
  // 处理点击
  const handleClick = () => {
    playSound(SoundType.BUTTON_CLICK);
    onClick(course);
  };
  
  // 获取难度标签
  const getDifficultyLabel = (difficulty: MeditationDifficulty) => {
    switch (difficulty) {
      case MeditationDifficulty.BEGINNER:
        return '初级';
      case MeditationDifficulty.INTERMEDIATE:
        return '中级';
      case MeditationDifficulty.ADVANCED:
        return '高级';
      case MeditationDifficulty.MASTER:
        return '大师';
      default:
        return '未知';
    }
  };
  
  // 获取难度颜色
  const getDifficultyColor = (difficulty: MeditationDifficulty) => {
    switch (difficulty) {
      case MeditationDifficulty.BEGINNER:
        return 'bg-green-100 text-green-800';
      case MeditationDifficulty.INTERMEDIATE:
        return 'bg-blue-100 text-blue-800';
      case MeditationDifficulty.ADVANCED:
        return 'bg-purple-100 text-purple-800';
      case MeditationDifficulty.MASTER:
        return 'bg-gold-100 text-gold-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 获取评分星星
  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-gold-500">★</span>
        ))}
        {hasHalfStar && <span className="text-gold-500">✭</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
        <span className="ml-1 text-xs text-gray-500">
          ({course.completionCount > 0 ? course.averageRating.toFixed(1) : '无评分'})
        </span>
      </div>
    );
  };
  
  // 获取默认封面图片
  const getDefaultCoverImage = () => {
    return '/assets/meditation/default-cover.jpg';
  };
  
  // 检查是否可以访问
  const canAccess = !course.isVipExclusive || isVipUser;
  
  return (
    <motion.div
      className={`meditation-course-card rounded-lg overflow-hidden shadow-md ${
        course.isVipExclusive ? 'border-2 border-gold-300' : 'border border-gray-200'
      } ${canAccess ? 'bg-white' : 'bg-gray-50'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={canAccess ? { y: -5, transition: { duration: 0.2 } } : {}}
      onClick={canAccess ? handleClick : undefined}
    >
      {/* 课程封面 */}
      <div className="relative">
        <img
          src={course.coverImagePath || getDefaultCoverImage()}
          alt={course.title}
          className={`w-full h-40 object-cover ${!canAccess && 'opacity-50'}`}
        />
        
        {/* VIP标签 */}
        {course.isVipExclusive && (
          <div className="absolute top-2 right-2 bg-gold-500 text-white text-xs px-2 py-1 rounded-full">
            VIP专属
          </div>
        )}
        
        {/* 锁定图标 */}
        {course.isVipExclusive && !isVipUser && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="text-white text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm">升级到VIP解锁</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 课程信息 */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-bold ${!canAccess && 'text-gray-500'}`}>
            {course.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
            {getDifficultyLabel(course.difficulty)}
          </span>
        </div>
        
        <p className={`text-sm mb-3 line-clamp-2 ${!canAccess && 'text-gray-500'}`}>
          {course.description}
        </p>
        
        <div className="flex justify-between items-center text-sm">
          <div className={`flex items-center ${!canAccess && 'text-gray-500'}`}>
            <span className="mr-1">🕒</span>
            <span>{course.durationMinutes} 分钟</span>
          </div>
          
          {course.completionCount > 0 && canAccess && (
            <div className="text-xs">
              {getRatingStars(course.averageRating)}
            </div>
          )}
        </div>
        
        {/* 讲师信息 */}
        <div className={`mt-3 text-xs ${!canAccess && 'text-gray-500'}`}>
          <span>讲师: {course.instructorName}</span>
        </div>
        
        {/* 标签 */}
        {canAccess && (
          <div className="mt-3 flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{course.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MeditationCourseCard;
