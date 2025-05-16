// src/components/profile/AchievementsShowcase.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAchievement } from '@/types/user';
import { playSound, SoundType } from '@/utils/sound';

// 组件属性
interface AchievementsShowcaseProps {
  achievements: UserAchievement[];
}

/**
 * 成就展示组件
 * 
 * 展示用户已解锁和进行中的成就
 */
const AchievementsShowcase: React.FC<AchievementsShowcaseProps> = ({
  achievements
}) => {
  // 状态
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'in-progress'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<UserAchievement | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'rarity' | 'type'>('recent');
  
  // 过滤成就
  const filteredAchievements = achievements.filter(achievement => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unlocked') return achievement.unlocked;
    if (activeFilter === 'in-progress') return !achievement.unlocked && achievement.progress > 0;
    return true;
  });
  
  // 排序成就
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sortBy === 'recent') {
      // 已解锁的按解锁时间排序，未解锁的按进度排序
      if (a.unlocked && b.unlocked) {
        return b.unlockedAt - a.unlockedAt;
      } else if (a.unlocked) {
        return -1;
      } else if (b.unlocked) {
        return 1;
      } else {
        return b.progress - a.progress;
      }
    } else if (sortBy === 'rarity') {
      // 按稀有度排序
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
      return rarityOrder[a.rarity as keyof typeof rarityOrder] - rarityOrder[b.rarity as keyof typeof rarityOrder];
    } else if (sortBy === 'type') {
      // 按类型排序
      return a.type.localeCompare(b.type);
    }
    return 0;
  });
  
  // 处理过滤器变化
  const handleFilterChange = (filter: 'all' | 'unlocked' | 'in-progress') => {
    playSound(SoundType.BUTTON_CLICK);
    setActiveFilter(filter);
  };
  
  // 处理排序方式变化
  const handleSortChange = (sort: 'recent' | 'rarity' | 'type') => {
    playSound(SoundType.BUTTON_CLICK);
    setSortBy(sort);
  };
  
  // 处理成就点击
  const handleAchievementClick = (achievement: UserAchievement) => {
    playSound(SoundType.BUTTON_CLICK);
    setSelectedAchievement(achievement);
  };
  
  // 处理关闭详情
  const handleCloseDetails = () => {
    playSound(SoundType.BUTTON_CLICK);
    setSelectedAchievement(null);
  };
  
  // 获取稀有度样式
  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-400',
          textColor: 'text-amber-800',
          gradientFrom: 'from-amber-400',
          gradientTo: 'to-amber-600'
        };
      case 'epic':
        return {
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-400',
          textColor: 'text-purple-800',
          gradientFrom: 'from-purple-400',
          gradientTo: 'to-purple-600'
        };
      case 'rare':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-400',
          textColor: 'text-blue-800',
          gradientFrom: 'from-blue-400',
          gradientTo: 'to-blue-600'
        };
      case 'uncommon':
        return {
          bgColor: 'bg-jade-50',
          borderColor: 'border-jade-400',
          textColor: 'text-jade-800',
          gradientFrom: 'from-jade-400',
          gradientTo: 'to-jade-600'
        };
      case 'common':
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-400',
          textColor: 'text-gray-800',
          gradientFrom: 'from-gray-400',
          gradientTo: 'to-gray-600'
        };
    }
  };
  
  // 获取类型名称
  const getTypeName = (type: string) => {
    switch (type) {
      case 'task':
        return '任务';
      case 'challenge':
        return '挑战';
      case 'panda':
        return '熊猫';
      case 'social':
        return '社交';
      case 'special':
        return '特殊';
      default:
        return type;
    }
  };
  
  // 格式化日期
  const formatDate = (timestamp: number) => {
    if (!timestamp) return '未解锁';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // 如果没有成就，显示空状态
  if (achievements.length === 0) {
    return (
      <div className="achievements-showcase bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">暂无成就</h3>
          <p className="text-gray-500 max-w-md">
            继续完成任务和挑战，解锁更多成就！
          </p>
        </div>
      </div>
    );
  }
  
  // 如果过滤后没有成就，显示空状态
  if (filteredAchievements.length === 0) {
    return (
      <div className="achievements-showcase">
        {/* 过滤器 */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                activeFilter === 'all' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
              onClick={() => handleFilterChange('all')}
            >
              全部
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                activeFilter === 'unlocked' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
              onClick={() => handleFilterChange('unlocked')}
            >
              已解锁
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                activeFilter === 'in-progress' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
              onClick={() => handleFilterChange('in-progress')}
            >
              进行中
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                sortBy === 'recent' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
              onClick={() => handleSortChange('recent')}
            >
              最近
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                sortBy === 'rarity' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
              onClick={() => handleSortChange('rarity')}
            >
              稀有度
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                sortBy === 'type' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
              onClick={() => handleSortChange('type')}
            >
              类型
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">没有符合条件的成就</h3>
            <p className="text-gray-500 max-w-md">
              尝试更改过滤条件以查看其他成就。
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="achievements-showcase">
      {/* 过滤器 */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              activeFilter === 'all' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            全部
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              activeFilter === 'unlocked' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}
            onClick={() => handleFilterChange('unlocked')}
          >
            已解锁
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              activeFilter === 'in-progress' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}
            onClick={() => handleFilterChange('in-progress')}
          >
            进行中
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              sortBy === 'recent' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}
            onClick={() => handleSortChange('recent')}
          >
            最近
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              sortBy === 'rarity' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}
            onClick={() => handleSortChange('rarity')}
          >
            稀有度
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              sortBy === 'type' ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}
            onClick={() => handleSortChange('type')}
          >
            类型
          </button>
        </div>
      </div>
      
      {/* 成就网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sortedAchievements.map((achievement) => {
          const rarityStyle = getRarityStyle(achievement.rarity);
          
          return (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`achievement-card ${rarityStyle.bgColor} border ${rarityStyle.borderColor} rounded-lg overflow-hidden cursor-pointer ${achievement.unlocked ? '' : 'opacity-75'}`}
              onClick={() => handleAchievementClick(achievement)}
            >
              <div className="p-3">
                <div className="relative mb-2">
                  <div className={`w-16 h-16 mx-auto rounded-full overflow-hidden ${achievement.unlocked ? 'bg-gradient-to-br ' + rarityStyle.gradientFrom + ' ' + rarityStyle.gradientTo : 'bg-gray-300'}`}>
                    {achievement.unlocked ? (
                      <img 
                        src={achievement.iconUrl} 
                        alt={achievement.name} 
                        className="w-full h-full object-cover p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* 进度环 */}
                  {!achievement.unlocked && (
                    <svg className="absolute top-0 left-0 w-16 h-16 mx-auto" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#4CAF50"
                        strokeWidth="2"
                        strokeDasharray={`${achievement.progress}, 100`}
                        className="stroke-current text-jade-500"
                      />
                    </svg>
                  )}
                </div>
                
                <h3 className={`text-sm font-medium ${rarityStyle.textColor} text-center truncate`}>
                  {achievement.name}
                </h3>
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>{getTypeName(achievement.type)}</span>
                  <span>{achievement.points}点</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* 成就详情弹窗 */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={handleCloseDetails}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 成就详情 */}
              {(() => {
                const rarityStyle = getRarityStyle(selectedAchievement.rarity);
                
                return (
                  <div>
                    {/* 头部 */}
                    <div className={`p-4 ${rarityStyle.bgColor} border-b ${rarityStyle.borderColor}`}>
                      <div className="flex items-center">
                        <div className={`w-16 h-16 rounded-full overflow-hidden ${selectedAchievement.unlocked ? 'bg-gradient-to-br ' + rarityStyle.gradientFrom + ' ' + rarityStyle.gradientTo : 'bg-gray-300'}`}>
                          {selectedAchievement.unlocked ? (
                            <img 
                              src={selectedAchievement.iconUrl} 
                              alt={selectedAchievement.name} 
                              className="w-full h-full object-cover p-2"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4">
                          <h3 className={`text-lg font-medium ${rarityStyle.textColor}`}>
                            {selectedAchievement.name}
                          </h3>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 mr-2">
                              {getTypeName(selectedAchievement.type)}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                              {selectedAchievement.rarity === 'legendary' && '传说'}
                              {selectedAchievement.rarity === 'epic' && '史诗'}
                              {selectedAchievement.rarity === 'rare' && '稀有'}
                              {selectedAchievement.rarity === 'uncommon' && '优秀'}
                              {selectedAchievement.rarity === 'common' && '普通'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 内容 */}
                    <div className="p-4">
                      <p className="text-gray-700 mb-4">
                        {selectedAchievement.description}
                      </p>
                      
                      {/* 进度 */}
                      {!selectedAchievement.unlocked && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">进度</span>
                            <span className="text-gray-800 font-medium">{selectedAchievement.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-jade-500 h-2.5 rounded-full" 
                              style={{ width: `${selectedAchievement.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {/* 解锁条件 */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">解锁条件</h4>
                        <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
                          {selectedAchievement.conditions.map((condition, index) => (
                            <li key={index}>{condition}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* 奖励 */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">奖励</h4>
                        <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
                          <li>{selectedAchievement.points} 成就点数</li>
                          <li>{selectedAchievement.rewards.experience} 经验值</li>
                          <li>{selectedAchievement.rewards.bamboo} 竹子</li>
                          {selectedAchievement.rewards.items.map((item, index) => (
                            <li key={index}>{item.name} x{item.quantity}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* 解锁时间 */}
                      {selectedAchievement.unlocked && (
                        <div className="text-sm text-gray-500">
                          解锁时间: {formatDate(selectedAchievement.unlockedAt)}
                        </div>
                      )}
                      
                      {/* 限时成就 */}
                      {selectedAchievement.limited && !selectedAchievement.unlocked && (
                        <div className="mt-4 text-sm text-red-600">
                          限时成就，将于 {formatDate(selectedAchievement.limitedEndDate || 0)} 结束
                        </div>
                      )}
                    </div>
                    
                    {/* 底部 */}
                    <div className="p-4 border-t border-gray-200">
                      <button
                        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                        onClick={handleCloseDetails}
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementsShowcase;
