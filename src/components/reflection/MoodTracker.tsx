// src/components/reflection/MoodTracker.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodType, MoodIntensity, recordMood, getUserMoods, MoodRecord } from '@/services/reflectionService';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import EnhancedTextArea from '@/components/common/EnhancedTextArea';
import EnhancedInput from '@/components/common/EnhancedInput';

interface MoodTrackerProps {
  onMoodRecorded?: (mood: MoodRecord) => void;
  compact?: boolean;
  className?: string;
  labels?: {
    title?: string;
    currentMoodQuestion?: string;
    intensityLabel?: string;
    intensityPrefix?: string;
    noteLabel?: string;
    notePlaceholder?: string;
    recordMoodButton?: string;
    recordButtonCompact?: string;
    historyLabel?: string;
    recentMoodsTitle?: string;
    noMoodsMessage?: string;
    backLabel?: string;
    intensityStrength?: {
      veryMild?: string;
      mild?: string;
      moderate?: string;
      strong?: string;
      veryStrong?: string;
    };
    moodTypes?: {
      happy?: string;
      content?: string;
      neutral?: string;
      sad?: string;
      anxious?: string;
      stressed?: string;
      tired?: string;
      energetic?: string;
      motivated?: string;
      frustrated?: string;
      angry?: string;
      calm?: string;
      unknown?: string;
    };
  };
}

/**
 * Mood Tracker Component
 * Used to record and display user's mood states
 */
const MoodTracker: React.FC<MoodTrackerProps> = ({
  onMoodRecorded,
  compact = false,
  className = '',
  labels
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState<MoodIntensity>(3);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentMoods, setRecentMoods] = useState<MoodRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Current user ID (in a real application, this should be retrieved from the user session)
  const userId = 'current-user';

  // Load recent mood records
  const loadRecentMoods = async () => {
    try {
      const moods = await getUserMoods(userId, 5);
      setRecentMoods(moods);
    } catch (err) {
      console.error('Failed to load recent moods:', err);
    }
  };

  // Initial loading
  useEffect(() => {
    loadRecentMoods();
  }, []);

  // Register data refresh listener
  useRegisterTableRefresh('moods', loadRecentMoods);

  // Handle mood submission
  const handleSubmit = async () => {
    if (!selectedMood) return;

    try {
      setIsSubmitting(true);

      // Record mood
      const mood = await recordMood({
        userId,
        mood: selectedMood,
        intensity,
        note: note.trim() || undefined
      });

      // Play sound effect
      playSound(SoundType.SUCCESS, 0.5);

      // Reset form
      setSelectedMood(null);
      setIntensity(3);
      setNote('');

      // Reload recent mood records
      await loadRecentMoods();

      // Notify parent component
      if (onMoodRecorded) {
        onMoodRecorded(mood);
      }
    } catch (err) {
      console.error('Failed to record mood:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get mood icon and color
  const getMoodInfo = (mood: MoodType) => {
    switch (mood) {
      case MoodType.HAPPY:
        return { icon: '😄', color: 'bg-yellow-100 text-yellow-800', label: labels?.moodTypes?.happy || 'Happy' };
      case MoodType.CONTENT:
        return { icon: '😊', color: 'bg-green-100 text-green-800', label: labels?.moodTypes?.content || 'Content' };
      case MoodType.NEUTRAL:
        return { icon: '😐', color: 'bg-gray-100 text-gray-800', label: labels?.moodTypes?.neutral || 'Neutral' };
      case MoodType.SAD:
        return { icon: '😢', color: 'bg-blue-100 text-blue-800', label: labels?.moodTypes?.sad || 'Sad' };
      case MoodType.ANXIOUS:
        return { icon: '😰', color: 'bg-purple-100 text-purple-800', label: labels?.moodTypes?.anxious || 'Anxious' };
      case MoodType.STRESSED:
        return { icon: '😫', color: 'bg-red-100 text-red-800', label: labels?.moodTypes?.stressed || 'Stressed' };
      case MoodType.TIRED:
        return { icon: '😴', color: 'bg-gray-200 text-gray-800', label: labels?.moodTypes?.tired || 'Tired' };
      case MoodType.ENERGETIC:
        return { icon: '⚡', color: 'bg-yellow-200 text-yellow-800', label: labels?.moodTypes?.energetic || 'Energetic' };
      case MoodType.MOTIVATED:
        return { icon: '🔥', color: 'bg-orange-100 text-orange-800', label: labels?.moodTypes?.motivated || 'Motivated' };
      case MoodType.FRUSTRATED:
        return { icon: '😤', color: 'bg-red-200 text-red-800', label: labels?.moodTypes?.frustrated || 'Frustrated' };
      case MoodType.ANGRY:
        return { icon: '😠', color: 'bg-red-100 text-red-800', label: labels?.moodTypes?.angry || 'Angry' };
      case MoodType.CALM:
        return { icon: '😌', color: 'bg-blue-100 text-blue-800', label: labels?.moodTypes?.calm || 'Calm' };
      default:
        return { icon: '❓', color: 'bg-gray-100 text-gray-800', label: labels?.moodTypes?.unknown || 'Unknown' };
    }
  };

  // Get intensity label
  const getIntensityLabel = (intensity: MoodIntensity) => {
    switch (intensity) {
      case 1: return labels?.intensityStrength?.veryMild || 'Very Mild';
      case 2: return labels?.intensityStrength?.mild || 'Mild';
      case 3: return labels?.intensityStrength?.moderate || 'Moderate';
      case 4: return labels?.intensityStrength?.strong || 'Strong';
      case 5: return labels?.intensityStrength?.veryStrong || 'Very Strong';
      default: return 'Unknown';
    }
  };

  // Render mood selector
  const renderMoodSelector = () => {
    const moods = [
      MoodType.HAPPY,
      MoodType.CONTENT,
      MoodType.NEUTRAL,
      MoodType.SAD,
      MoodType.ANXIOUS,
      MoodType.STRESSED,
      MoodType.TIRED,
      MoodType.ENERGETIC,
      MoodType.MOTIVATED,
      MoodType.FRUSTRATED,
      MoodType.ANGRY,
      MoodType.CALM
    ];

    return (
      <div className="mood-selector">
        <h3 className="text-lg font-bold mb-3">
          {labels?.currentMoodQuestion || "How are you feeling right now?"}
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {moods.map((mood) => {
            const { icon, color, label } = getMoodInfo(mood);
            return (
              <motion.div
                key={mood}
                className={`mood-item p-3 rounded-lg cursor-pointer text-center ${
                  selectedMood === mood ? 'ring-2 ring-jade-500 shadow-md' : ''
                } ${color} hover:shadow-md transition-all duration-200`}
                onClick={() => setSelectedMood(mood)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="mood-icon text-2xl mb-1">{icon}</div>
                <div className="mood-label text-xs font-medium">{label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render intensity selector
  const renderIntensitySelector = () => {
    return (
      <div className="intensity-selector mt-4">
        <h3 className="text-lg font-bold mb-2">{labels?.intensityLabel || "How intense is this feeling?"}</h3>
        <div className="flex items-center">
          <EnhancedInput
            type="range"
            min="1"
            max="5"
            value={intensity.toString()}
            onChange={(e) => setIntensity(parseInt(e.target.value) as MoodIntensity)}
            className="flex-grow"
          />
          <span className="ml-3 text-sm font-medium px-2 py-1 bg-jade-100 text-jade-800 rounded-md">
            {getIntensityLabel(intensity)}
          </span>
        </div>
      </div>
    );
  };

  // Render note input
  const renderNoteInput = () => {
    return (
      <div className="note-input mt-4">
        <h3 className="text-lg font-bold mb-2">{labels?.noteLabel || "Anything you'd like to note? (optional)"}</h3>
        <EnhancedTextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={labels?.notePlaceholder || "Write down your thoughts..."}
          minRows={3}
          maxRows={6}
          autoResize={true}
        />
      </div>
    );
  };

  // Render recent mood records
  const renderRecentMoods = () => {
    if (recentMoods.length === 0) {
      return (
        <div className="text-center text-gray-500 p-4">
          {labels?.noMoodsMessage || "No mood records yet"}
        </div>
      );
    }

    return (
      <div className="recent-moods-list">
        {recentMoods.map((mood) => {
          const { icon, color } = getMoodInfo(mood.mood as MoodType);
          return (
            <div
              key={mood.id}
              className="mood-record flex items-center p-2 border-b border-gray-200 last:border-b-0"
            >
              <div className={`mood-icon p-2 rounded-full ${color} mr-3`}>
                <span className="text-xl">{icon}</span>
              </div>
              <div className="mood-info flex-grow">
                <div className="flex justify-between">
                  <span className="font-medium">{getMoodInfo(mood.mood as MoodType).label}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(mood.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {labels?.intensityPrefix || "Intensity"}: {getIntensityLabel(mood.intensity as MoodIntensity)}
                  </span>
                </div>
                {mood.note && (
                  <p className="text-sm text-gray-700 mt-1">{mood.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Compact mode
  if (compact) {
    return (
      <div className={`mood-tracker-compact ${className}`}>
        <div className="flex items-center">
          <div className="mood-selector-compact flex-grow">
            <div className="flex flex-wrap gap-2">
              {[MoodType.HAPPY, MoodType.CONTENT, MoodType.NEUTRAL, MoodType.SAD, MoodType.ANXIOUS].map((mood) => {
                const { icon, color } = getMoodInfo(mood);
                return (
                  <motion.div
                    key={mood}
                    className={`mood-item p-2 rounded-full cursor-pointer ${
                      selectedMood === mood ? 'ring-2 ring-jade-500' : ''
                    } ${color}`}
                    onClick={() => setSelectedMood(mood)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="mood-icon text-xl">{icon}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <Button
            variant="jade"
            size="small"
            onClick={handleSubmit}
            disabled={!selectedMood || isSubmitting}
            className="ml-2"
          >
            {labels?.recordButtonCompact || "Record"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mood-tracker ${className}`}>
      <div className="mood-tracker-header flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-jade-700">
          <span className="mr-2">🍵</span>
          {labels?.title || "Mood Tracking"}
        </h2>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? (labels?.backLabel || "Back") : (labels?.historyLabel || "History")}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {showHistory ? (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mood-history"
          >
            <h3 className="text-lg font-bold mb-2">{labels?.recentMoodsTitle || "Recent Mood Records"}</h3>
            {renderRecentMoods()}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="mood-form"
          >
            {renderMoodSelector()}

            {selectedMood && (
              <>
                {renderIntensitySelector()}
                {renderNoteInput()}

                <div className="form-actions mt-4 flex justify-end">
                  <Button
                    variant="jade"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {labels?.recordMoodButton || "Record Mood"}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodTracker;
