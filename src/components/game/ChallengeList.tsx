// src/components/game/ChallengeList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  ChallengeRecord,
  ChallengeStatus,
  ChallengeType,
  ChallengeDifficulty,
  getAllChallenges,
  completeChallenge
} from '@/services/challengeService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import ChallengeCard from './ChallengeCard';
import RewardModal from '@/components/game/RewardModal';
import { RewardRecord } from '@/services/rewardService';
import ScrollDialog from './ScrollDialog';
import { ChallengeCardSkeleton } from '@/components/skeleton';

interface ChallengeListProps {
  filter?: {
    status?: ChallengeStatus;
    type?: ChallengeType;
    difficulty?: ChallengeDifficulty;
  };
  onSelectChallenge?: (challenge: ChallengeRecord) => void;
  labels?: {
    statusLabel?: string;
    typeLabel?: string;
    difficultyLabel?: string;
    progressLabel?: string;
    statusActive?: string;
    statusCompleted?: string;
    statusExpired?: string;
    statusUpcoming?: string;
    difficultyEasy?: string;
    difficultyMedium?: string;
    difficultyHard?: string;
    difficultyExpert?: string;
    startLabel?: string;
    endLabel?: string;
    completedOnLabel?: string;
    completeButtonText?: string;
    inProgressText?: string;
    noItemsMessage?: string;
  };
}

/**
 * Challenge List Component
 * Displays a list of challenges with filtering and selection support
 */
const ChallengeList: React.FC<ChallengeListProps> = ({ filter, onSelectChallenge, labels }) => {
  const [challenges, setChallenges] = useState<ChallengeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeRecord | null>(null);
  const [showChallengeDetails, setShowChallengeDetails] = useState(false);

  // Load challenges
  const loadChallenges = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const challengeList = await getAllChallenges(filter);
      setChallenges(challengeList);
    } catch (err) {
      console.error('Failed to load challenges:', err);
      setError('Failed to load challenges. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  // Initial loading
  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  // Define challenge data update handler
  const handleChallengeDataUpdate = useCallback((challengeData: any) => {
    // If there is specific challenge data, update that challenge
    if (challengeData && challengeData.id) {
      setChallenges(prevChallenges => {
        // Check if challenge already exists
        const challengeExists = prevChallenges.some(challenge => challenge.id === challengeData.id);

        if (challengeExists) {
          // Update existing challenge
          return prevChallenges.map(challenge =>
            challenge.id === challengeData.id ? { ...challenge, ...challengeData } : challenge
          );
        } else {
          // Add new challenge (if it matches filter criteria)
          if (!filter ||
              ((!filter.status || challengeData.status === filter.status) &&
               (!filter.type || challengeData.type === filter.type) &&
               (!filter.difficulty || challengeData.difficulty === filter.difficulty))) {
            return [...prevChallenges, challengeData];
          }
          return prevChallenges;
        }
      });
    } else {
      // If no specific challenge data, reload all challenges
      loadChallenges();
    }
  }, [loadChallenges, filter]);

  // Use useRegisterTableRefresh hook to listen for changes in the challenges table
  useRegisterTableRefresh('challenges', handleChallengeDataUpdate);

  // Handle challenge selection
  const handleSelectChallenge = (challenge: ChallengeRecord) => {
    setSelectedChallenge(challenge);
    setShowChallengeDetails(true);

    if (onSelectChallenge) {
      onSelectChallenge(challenge);
    }
  };

  // Handle challenge completion
  const handleCompleteChallenge = async (challengeId: number) => {
    try {
      setIsLoading(true);

      // Complete challenge and get rewards
      const challengeRewards = await completeChallenge(challengeId);

      // Update challenge list
      setChallenges(prevChallenges =>
        prevChallenges.map(challenge =>
          challenge.id === challengeId
            ? {
                ...challenge,
                status: ChallengeStatus.COMPLETED,
                progress: 100,
                completedDate: new Date()
              }
            : challenge
        )
      );

      // Show rewards
      if (challengeRewards && challengeRewards.length > 0) {
        setRewards(challengeRewards);
        setShowRewardModal(true);
      }
    } catch (err) {
      console.error('Failed to complete challenge:', err);
      setError('Failed to complete challenge. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Close reward modal
  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
  };

  // Close challenge details
  const handleCloseChallengeDetails = () => {
    setShowChallengeDetails(false);
    setSelectedChallenge(null);
  };

  // If loading, show challenge card skeletons
  if (isLoading && challenges.length === 0) {
    return (
      <div className="challenge-list-skeleton">
        <ChallengeCardSkeleton variant="jade" />
        <ChallengeCardSkeleton variant="jade" />
        <ChallengeCardSkeleton variant="jade" />
      </div>
    );
  }

  // If error, show error message
  if (error && challenges.length === 0) {
    return <div className="error-message">{error}</div>;
  }

  // If no challenges, show message
  if (challenges.length === 0) {
    return <div className="no-challenges-message">{labels?.noItemsMessage || 'No challenges available'}</div>;
  }

  return (
    <div className="challenge-list">
      <AnimatePresence>
        {challenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onClick={handleSelectChallenge}
            onComplete={handleCompleteChallenge}
            labels={labels}
          />
        ))}
      </AnimatePresence>

      {/* Reward modal */}
      {showRewardModal && (
        <RewardModal
          rewards={rewards}
          onClose={handleCloseRewardModal}
        />
      )}

      {/* Challenge details */}
      {showChallengeDetails && selectedChallenge && (
        <ScrollDialog
          title={selectedChallenge.title}
          onClose={handleCloseChallengeDetails}
        >
          <div className="challenge-details">
            <div className="challenge-header">
              <img
                src={selectedChallenge.iconPath}
                alt={selectedChallenge.title}
                className="challenge-icon-large"
              />
              <div className="challenge-meta-details">
                <div className="challenge-difficulty">
                  {labels?.difficultyLabel || 'Difficulty'}: {
                    selectedChallenge.difficulty === ChallengeDifficulty.EASY ? (labels?.difficultyEasy || 'Easy') :
                    selectedChallenge.difficulty === ChallengeDifficulty.MEDIUM ? (labels?.difficultyMedium || 'Medium') :
                    selectedChallenge.difficulty === ChallengeDifficulty.HARD ? (labels?.difficultyHard || 'Hard') :
                    selectedChallenge.difficulty === ChallengeDifficulty.EXPERT ? (labels?.difficultyExpert || 'Expert') :
                    selectedChallenge.difficulty
                  }
                </div>
                <div className="challenge-type">
                  {labels?.typeLabel || 'Type'}: {selectedChallenge.type}
                </div>
                <div className="challenge-status">
                  {labels?.statusLabel || 'Status'}: {
                    selectedChallenge.status === ChallengeStatus.ACTIVE ? (labels?.statusActive || 'Active') :
                    selectedChallenge.status === ChallengeStatus.COMPLETED ? (labels?.statusCompleted || 'Completed') :
                    selectedChallenge.status === ChallengeStatus.UPCOMING ? (labels?.statusUpcoming || 'Upcoming') :
                    selectedChallenge.status
                  }
                </div>
              </div>
            </div>

            <div className="challenge-description-full">
              {selectedChallenge.description}
            </div>

            <div className="challenge-progress-details">
              <h4>{labels?.progressLabel || 'Progress'}: {selectedChallenge.progress}%</h4>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${selectedChallenge.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="challenge-dates-details">
              <div>{labels?.startLabel || 'Start Date'}: {selectedChallenge.startDate.toLocaleDateString()}</div>
              {selectedChallenge.endDate && (
                <div>{labels?.endLabel || 'End Date'}: {selectedChallenge.endDate.toLocaleDateString()}</div>
              )}
              {selectedChallenge.completedDate && (
                <div>{labels?.completedOnLabel || 'Completed On'}: {selectedChallenge.completedDate.toLocaleDateString()}</div>
              )}
            </div>

            {selectedChallenge.status === ChallengeStatus.ACTIVE && (
              <button
                className="complete-challenge-button-large"
                onClick={() => handleCompleteChallenge(selectedChallenge.id!)}
                disabled={selectedChallenge.progress < 100}
              >
                {selectedChallenge.progress >= 100 ? (labels?.completeButtonText || 'Complete Challenge') : (labels?.inProgressText || 'Keep Going')}
              </button>
            )}
          </div>
        </ScrollDialog>
      )}
    </div>
  );
};

export default ChallengeList;
