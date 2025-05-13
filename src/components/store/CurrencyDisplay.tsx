// src/components/store/CurrencyDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { UserCurrencyRecord } from '@/services/storeService';

interface CurrencyDisplayProps {
  currency: UserCurrencyRecord;
  isVip?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * 货币显示组件
 * 用于显示用户的金币和玉石
 */
const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  currency,
  isVip = false,
  compact = false,
  className = ''
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
    <div className={`currency-display p-3 bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="currency-section">
          <div className="coins-display flex items-center mb-2">
            <motion.span
              className="coin-icon text-xl mr-2"
              initial={{ rotateY: 0 }}
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.5 }}
            >
              🪙
            </motion.span>
            <div>
              <div className="coin-value font-bold">{formatNumber(currency.coins)}</div>
              <div className="coin-label text-xs text-gray-500">金币</div>
            </div>
          </div>
          <div className="jade-display flex items-center">
            <motion.span
              className="jade-icon text-xl mr-2"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              💎
            </motion.span>
            <div>
              <div className="jade-value font-bold">{formatNumber(currency.jade)}</div>
              <div className="jade-label text-xs text-gray-500">玉石</div>
            </div>
          </div>
        </div>
        
        {isVip && (
          <div className="vip-section">
            <div className="vip-badge px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-medium">
              VIP会员
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyDisplay;
