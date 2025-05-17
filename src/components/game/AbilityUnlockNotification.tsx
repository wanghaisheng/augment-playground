// src/components/game/AbilityUnlockNotification.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PandaAbilityRecord } from '@/services/pandaAbilityService';
import ScrollDialog from './ScrollDialog';
import Button from '@/components/common/Button';
import { AbilityUnlockNotificationLabels } from '@/types';

interface AbilityUnlockNotificationProps {
  newlyUnlockedAbilities: PandaAbilityRecord[];
  onClose: () => void;
  labels?: AbilityUnlockNotificationLabels;
}

/**
 * Panda ability unlock notification component
 * Displays a notification when new abilities are unlocked
 *
 * @param newlyUnlockedAbilities - List of newly unlocked abilities
 * @param onClose - Callback function to close the notification
 * @param labels - Localized labels for the component
 */
const AbilityUnlockNotification: React.FC<AbilityUnlockNotificationProps> = ({
  newlyUnlockedAbilities,
  onClose,
  labels
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Currently displayed ability
  const currentAbility = newlyUnlockedAbilities[currentIndex];

  // Whether there are abilities to display
  const hasAbilities = newlyUnlockedAbilities.length > 0;

  // Whether there is a next ability
  const hasNextAbility = currentIndex < newlyUnlockedAbilities.length - 1;

  // Show next ability
  const showNextAbility = () => {
    if (hasNextAbility) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowAll(true);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Render single ability unlock notification
  const renderSingleAbility = () => {
    if (!currentAbility) return null;

    return (
      <motion.div
        className="ability-unlock-single"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div className="ability-unlock-icon" variants={itemVariants}>
          <img
            src={currentAbility.iconPath}
            alt={currentAbility.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/assets/abilities/default-ability.svg';
            }}
          />
        </motion.div>

        <motion.h3 className="ability-unlock-title" variants={itemVariants}>
          {labels?.newAbilityTitle || 'New Ability Unlocked!'}
        </motion.h3>

        <motion.h4 className="ability-unlock-name" variants={itemVariants}>
          {currentAbility.name}
        </motion.h4>

        <motion.p className="ability-unlock-description" variants={itemVariants}>
          {currentAbility.description}
        </motion.p>

        <motion.div className="ability-unlock-actions" variants={itemVariants}>
          {hasNextAbility ? (
            <Button variant="jade" onClick={showNextAbility}>
              {labels?.nextButtonText || 'Next Ability'}
            </Button>
          ) : (
            <Button variant="jade" onClick={() => setShowAll(true)}>
              {labels?.viewAllButtonText || 'View All Abilities'}
            </Button>
          )}
        </motion.div>
      </motion.div>
    );
  };

  // Render list of all unlocked abilities
  const renderAllAbilities = () => {
    return (
      <motion.div
        className="ability-unlock-all"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.h3 className="ability-unlock-title" variants={itemVariants}>
          {labels?.allUnlockedTitle || 'Newly Unlocked Abilities'}
        </motion.h3>

        <motion.div className="ability-unlock-list" variants={itemVariants}>
          {newlyUnlockedAbilities.map((ability, index) => (
            <div key={index} className="ability-unlock-item">
              <div className="ability-unlock-item-icon">
                <img
                  src={ability.iconPath}
                  alt={ability.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/assets/abilities/default-ability.svg';
                  }}
                />
              </div>
              <div className="ability-unlock-item-info">
                <h4 className="ability-unlock-item-name">{ability.name}</h4>
                <p className="ability-unlock-item-description">{ability.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div className="ability-unlock-actions" variants={itemVariants}>
          <Button variant="gold" onClick={onClose}>
            {labels?.closeButtonText || 'Close'}
          </Button>
        </motion.div>
      </motion.div>
    );
  };

  // If no abilities, don't show notification
  if (!hasAbilities) {
    return null;
  }

  return (
    <ScrollDialog
      isOpen={true}
      onClose={onClose}
      title={labels?.title || 'Ability Unlocked'}
      closeOnOutsideClick={false}
      closeOnEsc={false}
      showCloseButton={showAll}
      footer={null}
    >
      <div className="ability-unlock-content">
        <AnimatePresence mode="wait">
          {!showAll ? (
            <motion.div key="single" className="ability-unlock-view">
              {renderSingleAbility()}
            </motion.div>
          ) : (
            <motion.div key="all" className="ability-unlock-view">
              {renderAllAbilities()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollDialog>
  );
};

export default AbilityUnlockNotification;
