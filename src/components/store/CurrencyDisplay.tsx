// src/components/store/CurrencyDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { UserCurrencyRecord } from '@/services/storeService';

interface CurrencyDisplayProps {
  currency: UserCurrencyRecord;
  isVip?: boolean;
  compact?: boolean;
  className?: string;
  labels?: {
    coinsLabel?: string;
    jadeLabel?: string;
    vipLabel?: string;
  };
}

/**
 * 货币显示组件
 * 用于显示用户的金币和玉石
 */
const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  currency,
  isVip = false,
  compact = false,
  className = '',
  labels
}) => {
  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // 紧凑模式
  if (compact) {
    return (
      <div className={`currency-display-compact flex items-center ${className}`}>
        <div className="coins-display flex items-center mr-3">
          <span className="coin-icon mr-1">🪙</span>
          <span className="coin-value font-medium">{formatNumber(currency.coins)}</span>
        </div>
        <div className="jade-display flex items-center">
          <span className="jade-icon mr-1">💎</span>
          <span className="jade-value font-medium">{formatNumber(currency.jade)}</span>
        </div>
        {isVip && (
          <div className="vip-badge ml-3 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-300">
            VIP
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`currency-display p-4 bg-white rounded-lg shadow-md border border-amber-200 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="currency-section flex items-center gap-6">
          <div className="coins-display flex items-center">
            <motion.div
              className="coin-icon text-2xl mr-3 bg-amber-100 p-2 rounded-full"
              initial={{ rotateY: 0 }}
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.5 }}
            >
              🪙
            </motion.div>
            <div>
              <div className="coin-value font-bold text-lg">{formatNumber(currency.coins)}</div>
              <div className="coin-label text-xs text-gray-500">{labels?.coinsLabel || "Coins"}</div>
            </div>
          </div>
          <div className="jade-display flex items-center">
            <motion.div
              className="jade-icon text-2xl mr-3 bg-jade-100 p-2 rounded-full"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              💎
            </motion.div>
            <div>
              <div className="jade-value font-bold text-lg">{formatNumber(currency.jade)}</div>
              <div className="jade-label text-xs text-gray-500">{labels?.jadeLabel || "Jade"}</div>
            </div>
          </div>
        </div>

        {isVip && (
          <div className="vip-section">
            <div className="vip-badge px-4 py-2 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-medium flex items-center">
              <span className="mr-1">✨</span>
              {labels?.vipLabel || "VIP Member"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyDisplay;
