// src/components/game/LuckyDrawWheel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';
import { RewardRecord, RewardRarity } from '@/services/rewardService';
import { playSound, SoundType } from '@/utils/sound';
import RewardAnimation from '@/components/animation/RewardAnimation';
import ScrollDialog from './ScrollDialog';
import { getLuckyPointsTotal, performLuckyDraw } from '@/services/timelyRewardService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import LuckyPointsDisplay from './LuckyPointsDisplay';

interface LuckyDrawWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned?: (rewards: RewardRecord[]) => void;
}

/**
 * 幸运抽奖轮盘组件
 * 用于实现带有旋转轮盘的幸运抽奖功能
 */
const LuckyDrawWheel: React.FC<LuckyDrawWheelProps> = ({
  isOpen,
  onClose,
  onRewardEarned
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
  const [selectedPoints, setSelectedPoints] = useState(10); // 默认使用10点
  const wheelRef = useRef<HTMLDivElement>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);

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
    if (isOpen) {
      loadPoints();
    }
  }, [isOpen]);

  // 定义幸运点数据更新处理函数
  const handleLuckyPointsUpdate = () => {
    loadPoints();
  };

  // 使用 useRegisterTableRefresh hook 监听幸运点表的变化
  useRegisterTableRefresh('luckyPoints', handleLuckyPointsUpdate);

  // 处理抽奖
  const handleDraw = async () => {
    if (points < selectedPoints) {
      setError('幸运点不足');
      return;
    }

    try {
      setIsDrawing(true);
      setError(null);
      
      // 播放抽奖音效
      playSound(SoundType.BUTTON_CLICK, 0.5);
      
      // 旋转抽奖轮盘
      setIsWheelSpinning(true);
      const randomRotation = 1080 + Math.random() * 360; // 至少旋转3圈
      setWheelRotation(prevRotation => prevRotation + randomRotation);
      
      // 延迟获取奖励，模拟抽奖过程
      setTimeout(async () => {
        // 执行抽奖
        const result = await performLuckyDraw(selectedPoints);
        
        // 更新幸运点
        setPoints(prev => prev - selectedPoints);
        
        // 设置奖励
        setRewards(result.rewards);
        
        // 停止轮盘旋转
        setIsWheelSpinning(false);
        
        // 显示奖励
        setTimeout(() => {
          setShowReward(true);
          setCurrentRewardIndex(0);
          
          // 播放奖励音效（根据稀有度）
          if (result.rewards.length > 0) {
            const rarity = result.rewards[0].rarity;
            switch (rarity) {
              case RewardRarity.LEGENDARY:
                playSound(SoundType.REWARD_LEGENDARY, 0.7);
                break;
              case RewardRarity.EPIC:
                playSound(SoundType.REWARD_EPIC, 0.7);
                break;
              case RewardRarity.RARE:
                playSound(SoundType.REWARD_RARE, 0.7);
                break;
              case RewardRarity.UNCOMMON:
                playSound(SoundType.REWARD_UNCOMMON, 0.7);
                break;
              default:
                playSound(SoundType.REWARD_COMMON, 0.7);
                break;
            }
          }
          
          // 通知父组件
          if (onRewardEarned) {
            onRewardEarned(result.rewards);
          }
        }, 500);
      }, 3000); // 3秒后显示结果
    } catch (err) {
      console.error('Failed to perform lucky draw:', err);
      setError('抽奖失败，请重试');
      setIsWheelSpinning(false);
    } finally {
      setIsDrawing(false);
    }
  };

  // 处理下一个奖励
  const handleNextReward = () => {
    if (currentRewardIndex < rewards.length - 1) {
      setCurrentRewardIndex(prevIndex => prevIndex + 1);
      
      // 播放奖励音效（根据稀有度）
      const rarity = rewards[currentRewardIndex + 1].rarity;
      switch (rarity) {
        case RewardRarity.LEGENDARY:
          playSound(SoundType.REWARD_LEGENDARY, 0.7);
          break;
        case RewardRarity.EPIC:
          playSound(SoundType.REWARD_EPIC, 0.7);
          break;
        case RewardRarity.RARE:
          playSound(SoundType.REWARD_RARE, 0.7);
          break;
        case RewardRarity.UNCOMMON:
          playSound(SoundType.REWARD_UNCOMMON, 0.7);
          break;
        default:
          playSound(SoundType.REWARD_COMMON, 0.7);
          break;
      }
    } else {
      setShowReward(false);
      setRewards([]);
    }
  };

  // 处理选择抽奖选项
  const handleSelectOption = (points: number) => {
    setSelectedPoints(points);
  };

  // 处理继续抽奖
  const handleContinue = () => {
    setShowReward(false);
    setRewards([]);
  };

  // 渲染抽奖轮盘
  const renderWheel = () => {
    // 轮盘上的奖励类型
    const wheelItems = [
      { type: RewardRarity.COMMON, color: '#cccccc', label: '普通' },
      { type: RewardRarity.UNCOMMON, color: '#4caf50', label: '不常见' },
      { type: RewardRarity.RARE, color: '#2196f3', label: '稀有' },
      { type: RewardRarity.EPIC, color: '#9c27b0', label: '史诗' },
      { type: RewardRarity.LEGENDARY, color: '#ffc107', label: '传说' },
      { type: RewardRarity.COMMON, color: '#cccccc', label: '普通' },
      { type: RewardRarity.UNCOMMON, color: '#4caf50', label: '不常见' },
      { type: RewardRarity.RARE, color: '#2196f3', label: '稀有' }
    ];

    return (
      <div className="lucky-draw-wheel-container relative w-64 h-64 mx-auto my-4">
        {/* 轮盘指针 */}
        <div className="wheel-pointer absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <svg width="30" height="30" viewBox="0 0 30 30">
            <polygon points="15,0 30,15 15,30 0,15" fill="#e53935" />
          </svg>
        </div>
        
        {/* 轮盘 */}
        <motion.div
          ref={wheelRef}
          className="lucky-draw-wheel w-full h-full rounded-full border-4 border-gold overflow-hidden relative"
          style={{
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            transform: `rotate(${wheelRotation}deg)`,
            transition: isWheelSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
          }}
        >
          {wheelItems.map((item, index) => {
            const angle = (index / wheelItems.length) * 360;
            return (
              <div
                key={`wheel-item-${index}`}
                className="wheel-item absolute w-full h-full"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: 'center',
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((angle + 45) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle + 45) * Math.PI / 180)}%)`
                }}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  <span
                    className="text-white font-bold transform rotate-180"
                    style={{
                      position: 'absolute',
                      top: '25%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    );
  };

  // 渲染奖励展示
  const renderRewardDisplay = () => {
    if (!showReward || rewards.length === 0) return null;

    const currentReward = rewards[currentRewardIndex];

    return (
      <div className="lucky-draw-reward-display flex flex-col items-center justify-center p-4">
        <h3 className="text-xl font-bold mb-4">恭喜获得奖励！</h3>
        
        <div className="reward-animation-container mb-4">
          <RewardAnimation
            type={currentReward.type}
            rarity={currentReward.rarity}
            iconPath={currentReward.iconPath}
            amount={currentReward.amount}
            size={120}
            animationStyle={
              currentReward.rarity === RewardRarity.LEGENDARY ? 'burst' :
              currentReward.rarity === RewardRarity.EPIC ? 'spin' :
              currentReward.rarity === RewardRarity.RARE ? 'pulse' :
              currentReward.rarity === RewardRarity.UNCOMMON ? 'float' : 'default'
            }
            playSound={false}
          />
        </div>
        
        <div className="reward-details text-center mb-4">
          <h4 className="text-lg font-bold">{currentReward.name}</h4>
          <p className="text-sm text-gray-600">{currentReward.description}</p>
          {currentReward.amount > 1 && (
            <p className="text-sm">数量: {currentReward.amount}</p>
          )}
        </div>
        
        <div className="reward-navigation">
          {currentRewardIndex < rewards.length - 1 ? (
            <Button variant="jade" onClick={handleNextReward}>
              下一个奖励
            </Button>
          ) : (
            <Button variant="gold" onClick={handleContinue}>
              继续抽奖
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <ScrollDialog
      isOpen={isOpen}
      onClose={onClose}
      title="幸运抽奖"
      closeOnOutsideClick={!isDrawing && !showReward}
      closeOnEsc={!isDrawing && !showReward}
      showCloseButton={!isDrawing && !showReward}
    >
      <div className="lucky-draw-content p-4">
        <AnimatePresence mode="wait">
          {!showReward ? (
            <motion.div
              key="lucky-draw-main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="lucky-points-display text-center mb-4">
                <LuckyPointsDisplay variant="large" />
                <p className="text-lg font-bold mt-2">当前幸运点数: <span className="text-gold">{points}</span></p>
              </div>
              
              {renderWheel()}
              
              <div className="lucky-draw-options flex justify-center gap-4 mt-4">
                {drawOptions.map(option => (
                  <motion.div
                    key={option.points}
                    className={`draw-option p-2 border-2 rounded-lg cursor-pointer ${selectedPoints === option.points ? 'border-gold bg-amber-50' : 'border-gray-300'} ${points < option.points ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => points >= option.points && handleSelectOption(option.points)}
                    whileHover={{ scale: points >= option.points ? 1.05 : 1 }}
                    whileTap={{ scale: points >= option.points ? 0.95 : 1 }}
                  >
                    <div className="draw-option-header flex items-center justify-between">
                      <div className="draw-option-points flex items-center">
                        <span className="lucky-points-icon mr-1">🍀</span>
                        <span>{option.points}</span>
                      </div>
                      <h3 className="draw-option-label font-bold">{option.label}</h3>
                    </div>
                    <p className="draw-option-description text-xs text-gray-600 mt-1">{option.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="lucky-draw-controls text-center mt-4">
                {error && (
                  <p className="text-red-500 text-sm mb-2">{error}</p>
                )}
                
                <Button
                  variant="gold"
                  onClick={handleDraw}
                  disabled={isDrawing || points < selectedPoints}
                  className="px-8 py-2"
                >
                  {isDrawing ? '抽奖中...' : '抽 奖'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="lucky-draw-reward"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderRewardDisplay()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollDialog>
  );
};

export default LuckyDrawWheel;
