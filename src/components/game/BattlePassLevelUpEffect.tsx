// src/components/game/BattlePassLevelUpEffect.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * Props for the BattlePassLevelUpEffect component
 */
export interface BattlePassLevelUpEffectProps {
  /** Previous level */
  previousLevel: number;
  /** New level */
  newLevel: number;
  /** Whether the animation is visible */
  isVisible: boolean;
  /** Callback function when the animation is closed */
  onClose: () => void;
  /** Whether to play sound effects */
  playSoundEffects?: boolean;
  /** Localized labels for the component */
  labels: {
    /** Title for the level up */
    levelUpTitle?: string;
    /** Message for the level up */
    levelUpMessage?: string;
    /** Label for the continue button */
    continueButtonLabel?: string;
    /** Label for the level */
    levelLabel?: string;
  };
}

/**
 * Battle Pass Level Up Effect Component
 * Displays an animated effect when the user levels up in the battle pass
 */
const BattlePassLevelUpEffect: React.FC<BattlePassLevelUpEffectProps> = ({
  previousLevel,
  newLevel,
  isVisible,
  onClose,
  playSoundEffects = true,
  labels
}) => {
  const [animationStage, setAnimationStage] = useState<'initial' | 'levelUp' | 'final'>('initial');
  const [currentLevel, setCurrentLevel] = useState<number>(previousLevel);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstanceRef = useRef<any>(null);
  const levelUpIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Default labels
  const levelUpTitle = labels.levelUpTitle || 'Level Up!';
  const levelUpMessage = labels.levelUpMessage || 'Congratulations! You\'ve reached a new level in the Battle Pass!';
  const continueButtonLabel = labels.continueButtonLabel || 'Continue';
  const levelLabel = labels.levelLabel || 'Level';

  // Play sound effect
  const playSoundEffect = (type: 'levelUp' | 'final') => {
    if (!playSoundEffects) return;
    
    // In a real app, you would play a sound effect here
    console.log(`Playing ${type} sound effect`);
  };

  // Initialize animation
  useEffect(() => {
    if (isVisible) {
      setAnimationStage('initial');
      setCurrentLevel(previousLevel);
      
      // Start level up animation after a short delay
      const timer = setTimeout(() => {
        setAnimationStage('levelUp');
        playSoundEffect('levelUp');
        
        // Start incrementing the level
        levelUpIntervalRef.current = setInterval(() => {
          setCurrentLevel(prev => {
            if (prev < newLevel) {
              return prev + 1;
            } else {
              if (levelUpIntervalRef.current) {
                clearInterval(levelUpIntervalRef.current);
                levelUpIntervalRef.current = null;
              }
              setAnimationStage('final');
              playSoundEffect('final');
              return prev;
            }
          });
        }, 1000);
      }, 1500);
      
      return () => {
        clearTimeout(timer);
        if (levelUpIntervalRef.current) {
          clearInterval(levelUpIntervalRef.current);
          levelUpIntervalRef.current = null;
        }
      };
    }
  }, [isVisible, previousLevel, newLevel, playSoundEffects]);

  // Handle confetti animation
  useEffect(() => {
    if (animationStage === 'final' && confettiCanvasRef.current) {
      const canvas = confettiCanvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create confetti instance
        confettiInstanceRef.current = confetti.create(canvas, {
          resize: true,
          useWorker: true
        });
        
        // Launch confetti
        confettiInstanceRef.current({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'],
          shapes: ['circle', 'square'],
          ticks: 200,
          gravity: 1,
          scalar: 1.2,
          disableForReducedMotion: true
        });
        
        return () => {
          if (confettiInstanceRef.current) {
            confettiInstanceRef.current.reset();
          }
        };
      }
    }
  }, [animationStage]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (levelUpIntervalRef.current) {
        clearInterval(levelUpIntervalRef.current);
        levelUpIntervalRef.current = null;
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="level-up-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="level-up-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <canvas
              ref={confettiCanvasRef}
              className="confetti-canvas"
              width={500}
              height={500}
            />
            
            <div className="level-up-content">
              <motion.h2
                className="level-up-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {levelUpTitle}
              </motion.h2>
              
              <div className="level-indicator">
                <div className="level-label">{levelLabel}</div>
                <div className="level-number-container">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentLevel}
                      className="level-number"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentLevel}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              
              <AnimatePresence>
                {animationStage === 'final' && (
                  <motion.div
                    className="level-up-message"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <p>{levelUpMessage}</p>
                    
                    <button
                      className="continue-button imperial-button"
                      onClick={onClose}
                    >
                      {continueButtonLabel}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BattlePassLevelUpEffect;
