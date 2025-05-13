// src/components/game/LuckyDraw.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getLuckyPointsTotal, 
  performLuckyDraw,
  PrizeLevel
} from '@/services/timelyRewardService';
import { RewardRecord } from '@/services/rewardService';
import { useTableRefresh } from '@/hooks/useDataRefresh';
import LuckyPointsDisplay from './LuckyPointsDisplay';
import RewardAnimation from '@/components/animation/RewardAnimation';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface LuckyDrawProps {
  onClose?: () => void;
  onRewardEarned?: (rewards: RewardRecord[]) => void;
}

/**
 * 幸运抽奖组件
 * 允许用户使用幸运点进行抽奖
 */
const LuckyDraw: React.FC<LuckyDrawProps> = ({ onClose, onRewardEarned }) => {
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [showRewards, setShowRewards] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState(10); // 默认使用10点
  const [error, setError] = useState<string | null>(null);

  // 抽奖选项
  const drawOptions = [
    { points: 10, label: '基础抽奖', description: '获得普通奖励的机会' },
    { points: 30, label: '高级抽奖', description: '获得稀有奖励的更高机会' },
    { points: 50, label: '豪华抽奖', description: '获得史诗和传说奖励的最高机会' }
  ];

  // 加载幸运点数量
  const loadPoints = async () => {
    try {
      setIsLoading(true);
      const total = await getLuckyPointsTotal();
      setPoints(total);
    } catch (err) {
      console.error('Failed to load lucky points:', err);
      setError('加载幸运点失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadPoints();
  }, []);

  // 使用 useTableRefresh 监听幸运点表的变化
  useTableRefresh('luckyPoints', () => {
    loadPoints();
  });

  // 处理抽奖
  const handleDraw = async () => {
    if (points < selectedPoints) {
      setError('幸运点不足');
      return;
    }

    try {
      setIsDrawing(true);
      setError(null);

      // 执行抽奖
      const result = await performLuckyDraw(selectedPoints);
      
      // 更新幸运点
      setPoints(prev => prev - selectedPoints);
      
      // 设置奖励
      setRewards(result.rewards);
      
      // 显示奖励动画
      setTimeout(() => {
        setShowRewards(true);
      }, 1000);
      
      // 通知父组件
      if (onRewardEarned) {
        onRewardEarned(result.rewards);
      }
    } catch (err) {
      console.error('Failed to perform lucky draw:', err);
      setError('抽奖失败，请重试');
    } finally {
      setIsDrawing(false);
    }
  };

  // 处理关闭
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // 处理选择抽奖选项
  const handleSelectOption = (points: number) => {
    setSelectedPoints(points);
  };

  // 处理继续抽奖
  const handleContinue = () => {
    setShowRewards(false);
    setRewards([]);
  };

  return (
    <div className="lucky-draw-container">
      <div className="lucky-draw-header">
        <h2 className="lucky-draw-title">幸运抽奖</h2>
        <LuckyPointsDisplay variant="large" />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : showRewards ? (
        <div className="lucky-draw-results">
          <RewardAnimation rewards={rewards} />
          <div className="lucky-draw-actions">
            <Button onClick={handleContinue}>继续抽奖</Button>
            <Button onClick={handleClose}>关闭</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="lucky-draw-options">
            <AnimatePresence>
              {drawOptions.map(option => (
                <motion.div
                  key={option.points}
                  className={`draw-option ${selectedPoints === option.points ? 'selected' : ''} ${points < option.points ? 'disabled' : ''}`}
                  onClick={() => handleSelectOption(option.points)}
                  whileHover={{ scale: points >= option.points ? 1.05 : 1 }}
                  whileTap={{ scale: points >= option.points ? 0.95 : 1 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="draw-option-header">
                    <div className="draw-option-points">
                      <span className="lucky-points-icon">🍀</span>
                      <span>{option.points}</span>
                    </div>
                    <h3 className="draw-option-label">{option.label}</h3>
                  </div>
                  <p className="draw-option-description">{option.description}</p>
                  {points < option.points && (
                    <div className="draw-option-insufficient">幸运点不足</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <div className="lucky-draw-actions">
            <Button 
              onClick={handleDraw}
              disabled={isDrawing || points < selectedPoints}
              className="draw-button"
            >
              {isDrawing ? '抽奖中...' : '抽奖'}
            </Button>
            <Button onClick={handleClose}>关闭</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LuckyDraw;
