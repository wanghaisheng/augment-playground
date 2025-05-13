// src/components/reflection/ReflectionHistory.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ReflectionRecord,
  getUserReflections
} from '@/services/reflectionService';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import ScrollDialog from '@/components/game/ScrollDialog';

interface ReflectionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onReflectionSelected?: (reflection: ReflectionRecord) => void;
}

/**
 * 反思历史组件
 * 用于显示用户的反思历史记录
 */
const ReflectionHistory: React.FC<ReflectionHistoryProps> = ({
  isOpen,
  onClose,
  onReflectionSelected
}) => {
  const [reflections, setReflections] = useState<ReflectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReflection, setSelectedReflection] = useState<ReflectionRecord | null>(null);
  const [filterTag, setFilterTag] = useState<string>('');
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // 当前用户ID（在实际应用中，这应该从用户会话中获取）
  const userId = 'current-user';

  // 加载反思历史
  const loadReflections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 获取用户的反思记录
      const userReflections = await getUserReflections(userId);
      setReflections(userReflections);
      
      // 提取所有标签
      const tags = new Set<string>();
      userReflections.forEach(reflection => {
        if (reflection.tags) {
          reflection.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
    } catch (err) {
      console.error('Failed to load reflections:', err);
      setError('加载反思历史失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (isOpen) {
      loadReflections();
    }
  }, [isOpen]);

  // 注册数据刷新监听
  useRegisterTableRefresh('reflections', loadReflections);

  // 处理选择反思
  const handleSelectReflection = (reflection: ReflectionRecord) => {
    setSelectedReflection(reflection);
    
    // 通知父组件
    if (onReflectionSelected) {
      onReflectionSelected(reflection);
    }
  };

  // 处理返回列表
  const handleBackToList = () => {
    setSelectedReflection(null);
  };

  // 处理筛选标签
  const handleFilterByTag = (tag: string) => {
    setFilterTag(tag === filterTag ? '' : tag);
  };

  // 获取筛选后的反思记录
  const getFilteredReflections = (): ReflectionRecord[] => {
    if (!filterTag) {
      return reflections;
    }
    
    return reflections.filter(reflection => 
      reflection.tags && reflection.tags.includes(filterTag)
    );
  };

  // 渲染反思列表
  const renderReflectionList = () => {
    const filteredReflections = getFilteredReflections();
    
    if (filteredReflections.length === 0) {
      return (
        <div className="empty-state text-center p-4">
          <p className="text-gray-500">
            {filterTag ? `没有包含"${filterTag}"标签的反思记录` : '暂无反思记录'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="reflections-list">
        {filteredReflections.map((reflection) => (
          <motion.div
            key={reflection.id}
            className="reflection-item p-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50"
            onClick={() => handleSelectReflection(reflection)}
            whileHover={{ x: 5 }}
          >
            <div className="reflection-header flex justify-between items-start mb-2">
              <div className="reflection-date text-sm text-gray-500">
                {new Date(reflection.createdAt).toLocaleString()}
              </div>
              <div className="reflection-mood px-2 py-1 rounded-full text-xs bg-gray-100">
                {reflection.mood}
              </div>
            </div>
            <div className="reflection-content mb-2">
              <p className="text-gray-700 line-clamp-2">{reflection.reflection}</p>
            </div>
            {reflection.tags && reflection.tags.length > 0 && (
              <div className="reflection-tags flex flex-wrap gap-1">
                {reflection.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag px-2 py-0.5 bg-gray-100 rounded-full text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterByTag(tag);
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  // 渲染反思详情
  const renderReflectionDetail = () => {
    if (!selectedReflection) return null;
    
    return (
      <div className="reflection-detail">
        <div className="reflection-header mb-4">
          <div className="flex justify-between items-center">
            <div className="reflection-date text-sm text-gray-500">
              {new Date(selectedReflection.createdAt).toLocaleString()}
            </div>
            <div className="reflection-mood px-2 py-1 rounded-full text-xs bg-gray-100">
              {selectedReflection.mood}
            </div>
          </div>
        </div>
        
        <div className="reflection-content mb-4">
          <h3 className="text-md font-bold mb-2">反思内容</h3>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-gray-700">{selectedReflection.reflection}</p>
          </div>
        </div>
        
        {selectedReflection.action && (
          <div className="reflection-action mb-4">
            <h3 className="text-md font-bold mb-2">行动计划</h3>
            <div className="p-3 bg-jade-50 rounded-md border border-jade-100">
              <p className="text-gray-700">{selectedReflection.action}</p>
            </div>
          </div>
        )}
        
        {selectedReflection.tags && selectedReflection.tags.length > 0 && (
          <div className="reflection-tags mb-4">
            <h3 className="text-md font-bold mb-2">标签</h3>
            <div className="flex flex-wrap gap-1">
              {selectedReflection.tags.map((tag) => (
                <span
                  key={tag}
                  className="tag px-2 py-1 bg-gray-100 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="reflection-actions flex justify-start">
          <Button variant="secondary" onClick={handleBackToList}>
            返回列表
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title="反思历史"
      closeOnOutsideClick={true}
      closeOnEsc={true}
      showCloseButton={true}
    >
      <div className="reflection-history p-4">
        {isLoading ? (
          <div className="loading-container flex justify-center items-center h-32">
            <LoadingSpinner variant="jade" size="medium" />
          </div>
        ) : error ? (
          <div className="error-container text-center p-4">
            <div className="error-message text-red-500 mb-4">{error}</div>
            <Button variant="jade" onClick={loadReflections}>
              重试
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {selectedReflection ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderReflectionDetail()}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* 标签筛选 */}
                {allTags.length > 0 && (
                  <div className="tags-filter mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">按标签筛选</h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <motion.div
                          key={tag}
                          className={`tag px-2 py-1 rounded-full text-xs cursor-pointer ${
                            filterTag === tag ? 'bg-jade-100 text-jade-800 border border-jade-300' : 'bg-gray-100 text-gray-800'
                          }`}
                          onClick={() => handleFilterByTag(tag)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {tag}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {renderReflectionList()}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </ScrollDialog>
  );
};

export default ReflectionHistory;
