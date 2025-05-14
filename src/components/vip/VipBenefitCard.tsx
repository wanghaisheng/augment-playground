import React from 'react';
import { motion } from 'framer-motion';
import '@/game-theme.css';

interface VipBenefitCardProps {
  title: string;
  freeBenefit: string;
  vipBenefit: string;
  isVip: boolean;
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
 */
const VipBenefitCard: React.FC<VipBenefitCardProps> = ({
  title,
  freeBenefit,
  vipBenefit,
  isVip
}) => {
  return (
    <div className="vip-benefit-card">
      <div className="benefit-title">{title}</div>
      <div className="benefit-comparison">
        <div className="free-benefit">
          <div className="benefit-content">
            {freeBenefit}
          </div>
        </div>
        <div className="vip-benefit">
          <motion.div
            className="benefit-content"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span className="vip-text">{vipBenefit}</span>
            {isVip && (
              <motion.div
                className="vip-badge"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span>✓</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VipBenefitCard;
