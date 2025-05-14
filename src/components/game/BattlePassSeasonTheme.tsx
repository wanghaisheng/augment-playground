// src/components/game/BattlePassSeasonTheme.tsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Props for the BattlePassSeasonTheme component
 */
export interface BattlePassSeasonThemeProps {
  /** The theme key for the current season */
  themeKey: string;
  /** The name of the current season */
  seasonName: string;
  /** The end date of the current season */
  endDate: string;
  /** Localized labels for the component */
  labels: {
    /** Label for "Season ends in" text */
    seasonEndsIn?: string;
    /** Label for days */
    days?: string;
    /** Label for hours */
    hours?: string;
    /** Label for minutes */
    minutes?: string;
  };
}

/**
 * Battle Pass Season Theme Component
 * Displays a themed visual for the current Battle Pass season
 */
const BattlePassSeasonTheme: React.FC<BattlePassSeasonThemeProps> = ({
  themeKey,
  seasonName,
  endDate,
  labels
}) => {
  // Calculate time remaining until season end
  const [timeRemaining, setTimeRemaining] = React.useState<{
    days: number;
    hours: number;
    minutes: number;
  }>({ days: 0, hours: 0, minutes: 0 });

  // Update time remaining every minute
  React.useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(endDate);
      const diffMs = end.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining({ days, hours, minutes });
    };
    
    // Calculate immediately
    calculateTimeRemaining();
    
    // Update every minute
    const interval = setInterval(calculateTimeRemaining, 60000);
    
    return () => clearInterval(interval);
  }, [endDate]);

  // Get theme-specific elements
  const getThemeElements = () => {
    switch (themeKey) {
      case 'spring_blossom':
        return {
          className: 'spring-blossom-theme',
          backgroundImage: '/assets/themes/spring_blossom_bg.jpg',
          particles: (
            <>
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="blossom-petal"
                  initial={{ 
                    x: Math.random() * 100 - 50,
                    y: -20,
                    rotate: Math.random() * 180,
                    opacity: 0.7 + Math.random() * 0.3
                  }}
                  animate={{ 
                    y: 120,
                    x: Math.random() * 200 - 100,
                    rotate: Math.random() * 360,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: 5 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 10
                  }}
                />
              ))}
            </>
          )
        };
      case 'summer_heat':
        return {
          className: 'summer-heat-theme',
          backgroundImage: '/assets/themes/summer_heat_bg.jpg',
          particles: (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="sun-ray"
                  initial={{ 
                    scale: 0.8,
                    opacity: 0.3
                  }}
                  animate={{ 
                    scale: 1.2,
                    opacity: 0.7
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </>
          )
        };
      case 'autumn_harvest':
        return {
          className: 'autumn-harvest-theme',
          backgroundImage: '/assets/themes/autumn_harvest_bg.jpg',
          particles: (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="falling-leaf"
                  initial={{ 
                    x: Math.random() * 100 - 50,
                    y: -20,
                    rotate: Math.random() * 180,
                    opacity: 0.7 + Math.random() * 0.3
                  }}
                  animate={{ 
                    y: 120,
                    x: Math.random() * 200 - 100,
                    rotate: Math.random() * 720,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: 8 + Math.random() * 7,
                    repeat: Infinity,
                    delay: Math.random() * 10
                  }}
                />
              ))}
            </>
          )
        };
      case 'winter_frost':
        return {
          className: 'winter-frost-theme',
          backgroundImage: '/assets/themes/winter_frost_bg.jpg',
          particles: (
            <>
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="snowflake"
                  initial={{ 
                    x: Math.random() * 100 - 50,
                    y: -20,
                    opacity: 0.7 + Math.random() * 0.3,
                    scale: 0.5 + Math.random() * 0.5
                  }}
                  animate={{ 
                    y: 120,
                    x: Math.random() * 200 - 100,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: 6 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 10
                  }}
                />
              ))}
            </>
          )
        };
      default:
        return {
          className: 'default-theme',
          backgroundImage: '/assets/themes/default_bg.jpg',
          particles: null
        };
    }
  };

  const theme = getThemeElements();
  
  // Default labels
  const seasonEndsIn = labels.seasonEndsIn || 'Season ends in';
  const daysLabel = labels.days || 'days';
  const hoursLabel = labels.hours || 'hours';
  const minutesLabel = labels.minutes || 'minutes';

  return (
    <div className={`battle-pass-season-theme ${theme.className}`}>
      <div 
        className="theme-background"
        style={{ backgroundImage: `url(${theme.backgroundImage})` }}
      >
        <div className="theme-particles">
          {theme.particles}
        </div>
        
        <div className="season-info">
          <motion.h2 
            className="season-name"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {seasonName}
          </motion.h2>
          
          <motion.div 
            className="season-timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="timer-label">{seasonEndsIn}:</span>
            <div className="timer-values">
              <div className="timer-unit">
                <span className="timer-number">{timeRemaining.days}</span>
                <span className="timer-label">{daysLabel}</span>
              </div>
              <div className="timer-separator">:</div>
              <div className="timer-unit">
                <span className="timer-number">{timeRemaining.hours}</span>
                <span className="timer-label">{hoursLabel}</span>
              </div>
              <div className="timer-separator">:</div>
              <div className="timer-unit">
                <span className="timer-number">{timeRemaining.minutes}</span>
                <span className="timer-label">{minutesLabel}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BattlePassSeasonTheme;
