import React from 'react';
import { motion } from 'framer-motion';
import '@/game-theme.css';
import type { VipBenefitCardLabelsBundle } from '@/types';

interface VipBenefitCardProps {
  title: string;
  freeBenefit: string;
  vipBenefit: string;
  isVip: boolean;
  valueMultiplier?: number;
  valueType?: 'coins' | 'experience' | 'items' | 'time' | 'generic' | 'currency' | 'percentage' | 'multiplier' | 'feature';
  showValueComparison?: boolean;
  labels?: VipBenefitCardLabelsBundle;
}

/**
 * VipBenefitCard Component
 *
 * Displays a comparison between free and VIP benefits for a specific feature.
 * Uses luxurious game style with traditional Chinese elements and animations.
 *
 * @param title - The name of the benefit
 * @param freeBenefit - Description of the benefit for free users
 * @param vipBenefit - Description of the benefit for VIP users
 * @param isVip - Whether the current user is a VIP
 * @param valueMultiplier - Numeric multiplier showing value increase (e.g., 2x coins)
 * @param valueType - Type of value being compared (coins, experience, etc.)
 * @param showValueComparison - Whether to show the visual value comparison
 */
const VipBenefitCard: React.FC<VipBenefitCardProps> = ({
  title,
  freeBenefit,
  vipBenefit,
  isVip,
  valueMultiplier = 0,
  valueType = 'generic',
  showValueComparison = false,
  labels
}) => {
  const safeLabels = labels || {} as VipBenefitCardLabelsBundle;

  const getValueTypeIcon = () => {
    switch (valueType) {
      case 'coins':
      case 'currency':
        return '🪙';
      case 'experience':
        return '⭐';
      case 'items':
        return '��';
      case 'time':
        return '⏱️';
      case 'percentage':
        return '%';
      case 'multiplier':
        return '✖️';
      case 'feature':
        return '🌟';
      default:
        return '✨';
    }
  };

  const getValueTypeLabel = () => {
    switch (valueType) {
      case 'coins':
      case 'currency':
        return safeLabels.coinsLabel ?? '竹币';
      case 'experience':
        return safeLabels.experienceLabel ?? '经验值';
      case 'items':
        return safeLabels.itemsLabel ?? '物品';
      case 'time':
        return safeLabels.timeLabel ?? '时间';
      default:
        return safeLabels.rewardsLabel ?? '奖励';
    }
  };

  return (
    <div className="vip-benefit-card bg-white rounded-lg shadow-md overflow-hidden border border-gold-200">
      <div className="benefit-title bg-gold-50 p-3 border-b border-gold-200 font-bold text-gold-800">
        {title}
      </div>

      <div className="benefit-comparison p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 免费用户权益 */}
          <div className="free-benefit bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="benefit-label text-sm text-gray-500 mb-1">
              {safeLabels.freeUserLabel ?? '免费用户'}
            </div>
            <div className="benefit-content text-gray-700">
              {freeBenefit}
            </div>
          </div>

          {/* VIP用户权益 */}
          <div className="vip-benefit bg-gold-50 rounded-lg p-3 border border-gold-200">
            <div className="benefit-label text-sm text-gold-600 mb-1 font-medium">
              {safeLabels.vipUserLabel ?? 'VIP用户'}
              {isVip && (
                <motion.span
                  className="vip-badge ml-2 inline-block bg-gold-500 text-white text-xs px-1 py-0.5 rounded"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  ✓ {safeLabels.activeLabel ?? '已激活'}
                </motion.span>
              )}
            </div>
            <motion.div
              className="benefit-content text-gold-800"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {vipBenefit}
            </motion.div>
          </div>
        </div>

        {/* 价值对比 */}
        {showValueComparison && valueMultiplier > 0 && (
          <motion.div
            className="value-comparison mt-4 pt-3 border-t border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="text-sm text-gray-500 mb-2">
              {safeLabels.valueComparisonLabel ?? '价值对比'}
            </div>

            <div className="flex items-center">
              <div className="value-type-icon mr-2">
                {getValueTypeIcon()}
              </div>

              <div className="value-bars flex-1 flex items-center">
                <div className="value-bar-container flex-1 h-6 bg-gray-100 rounded-l overflow-hidden">
                  <div className="value-bar-label absolute text-xs text-gray-600 ml-2 mt-1">
                    {safeLabels.standardLabel ?? '标准'}
                  </div>
                  <div className="value-bar h-full bg-gray-300 w-full"></div>
                </div>

                <div className="value-multiplier mx-2 text-sm font-bold">
                  {valueMultiplier}x
                </div>

                <div className="value-bar-container flex-1 h-6 bg-gold-50 rounded-r overflow-hidden">
                  <div className="value-bar-label absolute text-xs text-gold-700 ml-2 mt-1">
                    {safeLabels.vipLabel ?? 'VIP'}
                  </div>
                  <motion.div
                    className="value-bar h-full bg-gold-300"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  ></motion.div>
                </div>
              </div>

              <div className="value-type-label ml-2 text-sm text-gray-600">
                {getValueTypeLabel()}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VipBenefitCard;
