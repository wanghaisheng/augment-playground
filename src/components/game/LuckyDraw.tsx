// src/components/game/LuckyDraw.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getLuckyPointsTotal,
  performLuckyDraw,
  PrizeLevel
} from '@/services/timelyRewardService';
import { RewardRecord } from '@/services/rewardService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import LuckyPointsDisplay from './LuckyPointsDisplay';
import RewardAnimation from '@/components/animation/RewardAnimation';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { getLocalizedLabel, getLocalizedLabels } from '@/utils/localization';

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
  const [labels, setLabels] = useState({
    title: 'Lucky Draw',
    basicDrawLabel: 'Basic Draw',
    basicDrawDescription: 'Chance to get common rewards',
    premiumDrawLabel: 'Premium Draw',
    premiumDrawDescription: 'Higher chance to get rare rewards',
    deluxeDrawLabel: 'Deluxe Draw',
    deluxeDrawDescription: 'Highest chance to get epic and legendary rewards',
    notEnoughPointsError: 'Not enough lucky points',
    loadPointsError: 'Failed to load lucky points, please try again',
    drawError: 'Failed to perform lucky draw, please try again',
    continueDrawingButton: 'Continue Drawing',
    closeButton: 'Close',
    drawingButton: 'Drawing...',
    drawButton: 'Draw'
  });

  // 抽奖选项
  const drawOptions = [
    { points: 10, label: labels.basicDrawLabel, description: labels.basicDrawDescription },
    { points: 30, label: labels.premiumDrawLabel, description: labels.premiumDrawDescription },
    { points: 50, label: labels.deluxeDrawLabel, description: labels.deluxeDrawDescription }
  ];

  // 加载本地化标签
  useEffect(() => {
    const loadLocalizedLabels = async () => {
      const languageCode = localStorage.getItem('language') || 'en';
      const localizedLabels = await getLocalizedLabels('luckyDraw', languageCode);

      if (Object.keys(localizedLabels).length > 0) {
        setLabels(prev => ({
          ...prev,
          ...localizedLabels
        }));
      }
    };

    loadLocalizedLabels();
  }, []);

  // 加载幸运点数量
  const loadPoints = async () => {
    try {
      setIsLoading(true);
      const total = await getLuckyPointsTotal();
      setPoints(total);
    } catch (err) {
      console.error('Failed to load lucky points:', err);
      setError(labels.loadPointsError);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadPoints();
  }, []);

  // 定义幸运点数据更新处理函数
  const handleLuckyPointsUpdate = useCallback(() => {
    loadPoints();
  }, [loadPoints]);

  // 使用 useRegisterTableRefresh hook 监听幸运点表的变化
  useRegisterTableRefresh('luckyPoints', handleLuckyPointsUpdate);

  // 处理抽奖
  const handleDraw = async () => {
    if (points < selectedPoints) {
      setError(labels.notEnoughPointsError);
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
      setError(labels.drawError);
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
        <h2 className="lucky-draw-title">{labels.title}</h2>
        <LuckyPointsDisplay variant="large" />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : showRewards ? (
        <div className="lucky-draw-results">
          <RewardAnimation rewards={rewards} />
          <div className="lucky-draw-actions">
            <Button onClick={handleContinue}>{labels.continueDrawingButton}</Button>
            <Button onClick={handleClose}>{labels.closeButton}</Button>
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
                    <div className="draw-option-insufficient">{labels.notEnoughPointsError}</div>
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
              {isDrawing ? labels.drawingButton : labels.drawButton}
            </Button>
            <Button onClick={handleClose}>{labels.closeButton}</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LuckyDraw;
