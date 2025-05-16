// src/components/profile/AvatarFrame.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Avatar frame types
 */
export enum AvatarFrameType {
  /** No frame */
  NONE = 'none',
  /** Basic frame for all users */
  BASIC = 'basic',
  /** Bronze frame for active users */
  BRONZE = 'bronze',
  /** Silver frame for long-time users */
  SILVER = 'silver',
  /** Gold frame for premium users */
  GOLD = 'gold',
  /** Jade frame for VIP users */
  JADE = 'jade',
  /** Bamboo frame for VIP users */
  BAMBOO = 'bamboo',
  /** Dragon frame for VIP users */
  DRAGON = 'dragon',
  /** Phoenix frame for VIP users */
  PHOENIX = 'phoenix',
  /** Custom frame for special events */
  CUSTOM = 'custom'
}

/**
 * Props for the AvatarFrame component
 */
export interface AvatarFrameProps {
  /** The URL of the avatar image */
  avatarUrl: string;
  /** The type of frame to display */
  frameType: AvatarFrameType;
  /** The size of the avatar in pixels */
  size?: number;
  /** Whether the frame should be animated */
  animated?: boolean;
  /** The animation speed (1 = normal, 2 = double speed, etc.) */
  animationSpeed?: number;
  /** Custom frame URL (only used when frameType is CUSTOM) */
  customFrameUrl?: string;
  /** Alt text for the avatar */
  alt?: string;
  /** Click handler for the avatar */
  onClick?: () => void;
  /** Whether the avatar is clickable */
  clickable?: boolean;
  /** Whether to show the VIP badge */
  showVipBadge?: boolean;
  /** Whether to show the online status */
  showOnlineStatus?: boolean;
  /** Whether the user is online */
  isOnline?: boolean;
  /** CSS class name */
  className?: string;
}

/**
 * Avatar Frame Component
 * Displays a user avatar with a decorative frame
 */
const AvatarFrame: React.FC<AvatarFrameProps> = ({
  avatarUrl,
  frameType,
  size = 64,
  animated = false,
  animationSpeed = 1,
  customFrameUrl,
  alt = 'User Avatar',
  onClick,
  clickable = false,
  showVipBadge = false,
  showOnlineStatus = false,
  isOnline = false,
  className = ''
}) => {
  const [frameUrl, setFrameUrl] = useState<string>('');
  const [rotation, setRotation] = useState<number>(0);
  
  // Get frame URL based on frame type
  useEffect(() => {
    switch (frameType) {
      case AvatarFrameType.NONE:
        setFrameUrl('');
        break;
      case AvatarFrameType.BASIC:
        setFrameUrl('/assets/frames/basic-frame.png');
        break;
      case AvatarFrameType.BRONZE:
        setFrameUrl('/assets/frames/bronze-frame.png');
        break;
      case AvatarFrameType.SILVER:
        setFrameUrl('/assets/frames/silver-frame.png');
        break;
      case AvatarFrameType.GOLD:
        setFrameUrl('/assets/frames/gold-frame.png');
        break;
      case AvatarFrameType.JADE:
        setFrameUrl('/assets/frames/jade-frame.png');
        break;
      case AvatarFrameType.BAMBOO:
        setFrameUrl('/assets/frames/bamboo-frame.png');
        break;
      case AvatarFrameType.DRAGON:
        setFrameUrl('/assets/frames/dragon-frame.png');
        break;
      case AvatarFrameType.PHOENIX:
        setFrameUrl('/assets/frames/phoenix-frame.png');
        break;
      case AvatarFrameType.CUSTOM:
        setFrameUrl(customFrameUrl || '');
        break;
      default:
        setFrameUrl('');
    }
  }, [frameType, customFrameUrl]);
  
  // Animate the frame rotation
  useEffect(() => {
    if (animated && frameType !== AvatarFrameType.NONE) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50 / animationSpeed);
      
      return () => clearInterval(interval);
    }
  }, [animated, frameType, animationSpeed]);
  
  // Get frame animation variants based on frame type
  const getFrameAnimationVariants = () => {
    switch (frameType) {
      case AvatarFrameType.JADE:
        return {
          animate: {
            rotate: [0, 360],
            transition: {
              repeat: Infinity,
              duration: 20 / animationSpeed,
              ease: 'linear'
            }
          }
        };
      case AvatarFrameType.BAMBOO:
        return {
          animate: {
            scale: [1, 1.05, 1],
            opacity: [1, 0.8, 1],
            transition: {
              repeat: Infinity,
              duration: 2 / animationSpeed,
              ease: 'easeInOut'
            }
          }
        };
      case AvatarFrameType.DRAGON:
        return {
          animate: {
            filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
            transition: {
              repeat: Infinity,
              duration: 10 / animationSpeed,
              ease: 'linear'
            }
          }
        };
      case AvatarFrameType.PHOENIX:
        return {
          animate: {
            boxShadow: [
              '0 0 10px rgba(255, 100, 50, 0.5)',
              '0 0 20px rgba(255, 150, 50, 0.8)',
              '0 0 10px rgba(255, 100, 50, 0.5)'
            ],
            transition: {
              repeat: Infinity,
              duration: 1.5 / animationSpeed,
              ease: 'easeInOut'
            }
          }
        };
      default:
        return {
          animate: {
            rotate: animated ? rotation : 0
          }
        };
    }
  };
  
  // Get particle effects for premium frames
  const renderParticleEffects = () => {
    if (!animated || ![
      AvatarFrameType.JADE,
      AvatarFrameType.BAMBOO,
      AvatarFrameType.DRAGON,
      AvatarFrameType.PHOENIX
    ].includes(frameType)) {
      return null;
    }
    
    return (
      <div className="avatar-particles">
        {Array.from({ length: 12 }).map((_, index) => (
          <motion.div
            key={index}
            className={`particle particle-${frameType.toLowerCase()}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, Math.cos(index * 30 * Math.PI / 180) * size * 0.8],
              y: [0, Math.sin(index * 30 * Math.PI / 180) * size * 0.8]
            }}
            transition={{
              repeat: Infinity,
              duration: 2 / animationSpeed,
              delay: index * 0.2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div 
      className={`avatar-frame-container ${className} ${clickable ? 'clickable' : ''}`}
      style={{ width: size, height: size }}
      onClick={clickable ? onClick : undefined}
    >
      {/* Particle effects */}
      {renderParticleEffects()}
      
      {/* Avatar image */}
      <div className="avatar-image-container">
        <img
          src={avatarUrl}
          alt={alt}
          className="avatar-image"
          width={size * 0.85}
          height={size * 0.85}
        />
      </div>
      
      {/* Frame image */}
      {frameUrl && (
        <motion.div
          className={`avatar-frame frame-${frameType.toLowerCase()}`}
          variants={getFrameAnimationVariants()}
          animate="animate"
        >
          <img
            src={frameUrl}
            alt="Avatar Frame"
            className="frame-image"
            width={size}
            height={size}
          />
        </motion.div>
      )}
      
      {/* VIP Badge */}
      {showVipBadge && (
        <div className="vip-badge">
          <span>VIP</span>
        </div>
      )}
      
      {/* Online Status */}
      {showOnlineStatus && (
        <div className={`online-status ${isOnline ? 'online' : 'offline'}`}>
          <div className="status-indicator" />
        </div>
      )}
    </div>
  );
};

export default AvatarFrame;
