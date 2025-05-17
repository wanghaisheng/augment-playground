// src/components/game/PandaEvolutionModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PandaAnimation from './PandaAnimation';
import { playSound, SoundType } from '@/utils/sound';
import { generateEvolutionParticles } from '@/utils/particleEffects';
import Button from '@/components/common/Button';
import { PandaMood, EnergyLevel } from './PandaAvatar';
import GoldenGlow from '@/components/animation/GoldenGlow';

/**
 * PandaEvolutionModal Props
 */
interface PandaEvolutionModalProps {
  /** Whether the modal is visible */
  isVisible: boolean;
  /** Callback when the modal is closed */
  onClose: () => void;
  /** Previous level of the panda */
  previousLevel: number;
  /** New level of the panda */
  newLevel: number;
  /** Panda mood */
  mood?: PandaMood;
  /** Panda energy level */
  energy?: EnergyLevel;
  /** Whether to play sound effects */
  playSoundEffects?: boolean;
  /** Localized labels */
  labels?: {
    /** Title for the evolution */
    evolutionTitle?: string;
    /** Message for the evolution */
    evolutionMessage?: string;
    /** Label for the continue button */
    continueButtonLabel?: string;
    /** Label for the level */
    levelLabel?: string;
    /** New abilities unlocked message */
    newAbilitiesMessage?: string;
  };
  /** Newly unlocked abilities (if any) */
  newAbilities?: Array<{
    id: number;
    name: string;
    description: string;
  }>;
}

/**
 * Animation stages for the evolution sequence
 */
type AnimationStage =
  | 'initial'      // Initial state
  | 'preparation'  // Panda preparing for evolution
  | 'transformation' // Panda transforming
  | 'completion'   // Evolution complete
  | 'final';       // Final state with message

/**
 * PandaEvolutionModal Component
 *
 * Displays an animated modal when the panda evolves to a new level
 */
const PandaEvolutionModal: React.FC<PandaEvolutionModalProps> = ({
  isVisible,
  onClose,
  previousLevel,
  newLevel,
  mood = 'happy',
  energy = 'high',
  playSoundEffects = true,
  labels = {},
  newAbilities = []
}) => {
  // Animation state
  const [animationStage, setAnimationStage] = useState<AnimationStage>('initial');
  const [currentLevel, setCurrentLevel] = useState<number>(previousLevel);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const evolutionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Default labels
  const evolutionTitle = labels.evolutionTitle || '熊猫进化！';
  const evolutionMessage = labels.evolutionMessage ||
    `恭喜！你的熊猫已经成长到${newLevel}级，获得了新的能力和外观！`;
  const continueButtonLabel = labels.continueButtonLabel || '继续';
  const levelLabel = labels.levelLabel || '等级';
  const newAbilitiesMessage = labels.newAbilitiesMessage || '解锁新能力：';

  // Play sound effect
  const playSoundEffect = (type: 'preparation' | 'transformation' | 'completion') => {
    if (!playSoundEffects) return;

    switch (type) {
      case 'preparation':
        playSound(SoundType.PANDA_HAPPY, 0.6);
        break;
      case 'transformation':
        playSound(SoundType.LEVEL_UP, 0.8);
        break;
      case 'completion':
        if (newAbilities.length > 0) {
          playSound(SoundType.ABILITY_UNLOCKED, 0.7);
        } else {
          playSound(SoundType.SUCCESS, 0.7);
        }
        break;
    }
  };

  // Generate particles for the current animation stage
  const generateParticlesForStage = (stage: AnimationStage) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    switch (stage) {
      case 'preparation':
        setParticles(generateEvolutionParticles({
          count: 15,
          colors: ['#8dc63f', '#a5d867', '#c1e698'],
          particleType: 'circle',
          container: containerRect,
          stage: 'preparation'
        }));
        break;
      case 'transformation':
        setParticles(generateEvolutionParticles({
          count: 30,
          colors: ['#ffd700', '#ffeb3b', '#fff9c4'],
          particleType: 'star',
          container: containerRect,
          stage: 'transformation'
        }));
        break;
      case 'completion':
        setParticles(generateEvolutionParticles({
          count: 20,
          colors: ['#ff5722', '#ff9800', '#ffeb3b'],
          particleType: 'sparkle',
          container: containerRect,
          stage: 'completion'
        }));
        break;
      default:
        setParticles([]);
    }
  };

  // Initialize animation sequence
  useEffect(() => {
    if (isVisible) {
      // Reset animation state
      setAnimationStage('initial');
      setCurrentLevel(previousLevel);
      setParticles([]);

      // Start animation sequence
      const sequence = async () => {
        // Preparation stage
        await new Promise(resolve => {
          evolutionTimeoutRef.current = setTimeout(() => {
            setAnimationStage('preparation');
            playSoundEffect('preparation');
            generateParticlesForStage('preparation');
            resolve(null);
          }, 1000);
        });

        // Transformation stage
        await new Promise(resolve => {
          evolutionTimeoutRef.current = setTimeout(() => {
            setAnimationStage('transformation');
            playSoundEffect('transformation');
            generateParticlesForStage('transformation');
            resolve(null);
          }, 2000);
        });

        // Level increment
        for (let level = previousLevel + 1; level <= newLevel; level++) {
          await new Promise(resolve => {
            evolutionTimeoutRef.current = setTimeout(() => {
              setCurrentLevel(level);
              resolve(null);
            }, 800);
          });
        }

        // Completion stage
        await new Promise(resolve => {
          evolutionTimeoutRef.current = setTimeout(() => {
            setAnimationStage('completion');
            playSoundEffect('completion');
            generateParticlesForStage('completion');
            resolve(null);
          }, 1000);
        });

        // Final stage
        await new Promise(resolve => {
          evolutionTimeoutRef.current = setTimeout(() => {
            setAnimationStage('final');
            resolve(null);
          }, 1500);
        });
      };

      sequence();
    }

    // Clean up timeouts on unmount or when modal closes
    return () => {
      if (evolutionTimeoutRef.current) {
        clearTimeout(evolutionTimeoutRef.current);
      }
    };
  }, [isVisible, previousLevel, newLevel]);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const containerVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.3 } }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const levelVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            ref={containerRef}
            className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-jade-50 to-white"></div>
              {animationStage === 'transformation' && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-amber-100 opacity-50"></div>
              )}
              {animationStage === 'completion' && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-yellow-100 opacity-30"></div>
              )}
            </div>

            {/* Title */}
            <motion.h2
              className="text-2xl font-bold text-center text-jade-800 mb-4 relative z-10"
              variants={titleVariants}
            >
              {evolutionTitle}
            </motion.h2>

            {/* Panda Animation */}
            <div className="relative flex justify-center items-center py-6 z-10">
              {animationStage === 'transformation' || animationStage === 'completion' ? (
                <GoldenGlow intensity="high">
                  <PandaAnimation
                    type={animationStage === 'transformation' ? 'levelUp' : 'happy'}
                    mood={mood}
                    energy={energy}
                    size={180}
                    duration={2}
                    loop={animationStage === 'transformation'}
                    autoPlay={true}
                    showAccessories={true}
                    showEnvironment={false}
                  />
                </GoldenGlow>
              ) : (
                <PandaAnimation
                  type={
                    animationStage === 'preparation' ? 'happy' :
                    animationStage === 'final' ? 'pose' : 'idle'
                  }
                  mood={mood}
                  energy={energy}
                  size={180}
                  duration={1.5}
                  loop={animationStage === 'preparation'}
                  autoPlay={true}
                  showAccessories={true}
                  showEnvironment={false}
                />
              )}

              {/* Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {particles}
              </div>
            </div>

            {/* Level Display */}
            <div className="flex justify-center items-center mb-4 relative z-10">
              <div className="text-center">
                <div className="text-jade-600 font-medium mb-1">{levelLabel}</div>
                <motion.div
                  key={currentLevel}
                  className="text-4xl font-bold text-jade-800"
                  variants={levelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {currentLevel}
                </motion.div>
              </div>
            </div>

            {/* Final Message */}
            <AnimatePresence>
              {animationStage === 'final' && (
                <motion.div
                  className="text-center relative z-10"
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <p className="text-jade-700 mb-4">{evolutionMessage}</p>

                  {/* New Abilities (if any) */}
                  {newAbilities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-amber-700 font-medium mb-2">{newAbilitiesMessage}</p>
                      <ul className="text-left bg-amber-50 p-3 rounded-md">
                        {newAbilities.map(ability => (
                          <li key={ability.id} className="mb-2 last:mb-0">
                            <div className="font-medium text-amber-800">{ability.name}</div>
                            <div className="text-sm text-amber-700">{ability.description}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    variant="jade"
                    onClick={onClose}
                    className="mt-2"
                  >
                    {continueButtonLabel}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PandaEvolutionModal;
