// src/components/game/BattlePassEvents.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interface for a battle pass event
 */
export interface BattlePassEvent {
  /** Event ID */
  id: string;
  /** Event name */
  name: string;
  /** Event description */
  description: string;
  /** Event start date */
  startDate: string;
  /** Event end date */
  endDate: string;
  /** Event image URL */
  imageUrl?: string;
  /** Event theme */
  theme: 'spring' | 'summer' | 'autumn' | 'winter' | 'special';
  /** Event rewards */
  rewards: Array<{
    name: string;
    icon?: string;
    quantity: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  }>;
  /** Event requirements */
  requirements?: string;
  /** Whether the event is premium only */
  isPremiumOnly: boolean;
  /** Whether the user has participated in the event */
  hasParticipated: boolean;
  /** User's progress in the event (0-100) */
  progress: number;
  /** Whether the user has completed the event */
  isCompleted: boolean;
  /** Whether the user has claimed the rewards */
  hasClaimedRewards: boolean;
}

/**
 * Props for the BattlePassEvents component
 */
export interface BattlePassEventsProps {
  /** Array of battle pass events */
  events: BattlePassEvent[];
  /** Whether the user has premium pass */
  hasPremiumPass: boolean;
  /** Callback function when an event is joined */
  onJoinEvent?: (eventId: string) => Promise<boolean>;
  /** Callback function when event rewards are claimed */
  onClaimRewards?: (eventId: string) => Promise<boolean>;
  /** Localized labels for the component */
  labels: {
    /** Title for the events */
    eventsTitle?: string;
    /** Label for the join button */
    joinButtonLabel?: string;
    /** Label for the claim rewards button */
    claimRewardsButtonLabel?: string;
    /** Label for the close button */
    closeButtonLabel?: string;
    /** Label for when there are no events */
    noEventsLabel?: string;
    /** Label for the premium only badge */
    premiumOnlyLabel?: string;
    /** Label for the event details button */
    eventDetailsButtonLabel?: string;
    /** Label for the event rewards */
    eventRewardsLabel?: string;
    /** Label for the event requirements */
    eventRequirementsLabel?: string;
    /** Label for the event progress */
    eventProgressLabel?: string;
    /** Label for the event completed status */
    eventCompletedLabel?: string;
    /** Label for the event joined status */
    eventJoinedLabel?: string;
    /** Label for the event rewards claimed status */
    eventRewardsClaimedLabel?: string;
    /** Label for the time remaining */
    timeRemainingLabel?: string;
    /** Label for days */
    daysLabel?: string;
    /** Label for hours */
    hoursLabel?: string;
    /** Label for minutes */
    minutesLabel?: string;
    /** Label for the event start date */
    eventStartDateLabel?: string;
    /** Label for the event end date */
    eventEndDateLabel?: string;
  };
}

/**
 * Battle Pass Events Component
 * Displays a list of special events for the battle pass
 */
const BattlePassEvents: React.FC<BattlePassEventsProps> = ({
  events,
  hasPremiumPass,
  onJoinEvent,
  onClaimRewards,
  labels
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<BattlePassEvent | null>(null);
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);
  const [claimingRewardsEventId, setClaimingRewardsEventId] = useState<string | null>(null);

  // Default labels
  const eventsTitle = labels.eventsTitle || 'Special Events';
  const joinButtonLabel = labels.joinButtonLabel || 'Join Event';
  const claimRewardsButtonLabel = labels.claimRewardsButtonLabel || 'Claim Rewards';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const closeButtonLabel = labels.closeButtonLabel || 'Close';
  const noEventsLabel = labels.noEventsLabel || 'No events available';
  const premiumOnlyLabel = labels.premiumOnlyLabel || 'Premium Only';
  const eventDetailsButtonLabel = labels.eventDetailsButtonLabel || 'Details';
  const eventRewardsLabel = labels.eventRewardsLabel || 'Rewards';
  const eventRequirementsLabel = labels.eventRequirementsLabel || 'Requirements';
  const eventProgressLabel = labels.eventProgressLabel || 'Progress';
  const eventCompletedLabel = labels.eventCompletedLabel || 'Completed';
  const eventJoinedLabel = labels.eventJoinedLabel || 'Joined';
  const eventRewardsClaimedLabel = labels.eventRewardsClaimedLabel || 'Rewards Claimed';
  const timeRemainingLabel = labels.timeRemainingLabel || 'Time Remaining';
  const daysLabel = labels.daysLabel || 'days';
  const hoursLabel = labels.hoursLabel || 'hours';
  const minutesLabel = labels.minutesLabel || 'minutes';
  const eventStartDateLabel = labels.eventStartDateLabel || 'Start Date';
  const eventEndDateLabel = labels.eventEndDateLabel || 'End Date';

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Calculate time remaining
  const calculateTimeRemaining = (endDateString: string) => {
    const endDate = new Date(endDateString).getTime();
    const now = Date.now();
    const timeRemaining = endDate - now;

    if (timeRemaining <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  // Get rarity color
  const getRarityColor = (rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary') => {
    switch (rarity) {
      case 'common': return '#9e9e9e';
      case 'uncommon': return '#4caf50';
      case 'rare': return '#2196f3';
      case 'epic': return '#9c27b0';
      case 'legendary': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  // Handle join event
  const handleJoinEvent = async (eventId: string) => {
    if (!onJoinEvent) return;

    setJoiningEventId(eventId);

    try {
      const success = await onJoinEvent(eventId);

      if (success) {
        // Show success message or update UI
      }
    } catch (error) {
      console.error('Failed to join event:', error);
    } finally {
      setJoiningEventId(null);
    }
  };

  // Handle claim rewards
  const handleClaimRewards = async (eventId: string) => {
    if (!onClaimRewards) return;

    setClaimingRewardsEventId(eventId);

    try {
      const success = await onClaimRewards(eventId);

      if (success) {
        // Show success message or update UI
      }
    } catch (error) {
      console.error('Failed to claim rewards:', error);
    } finally {
      setClaimingRewardsEventId(null);
    }
  };

  // Filter active events
  const activeEvents = events.filter(event => {
    const endDate = new Date(event.endDate).getTime();
    return endDate > Date.now();
  });

  return (
    <>
      <button
        className="events-button jade-button"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
          <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {eventsTitle}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="events-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsOpen(false);
              setSelectedEvent(null);
            }}
          >
            <motion.div
              className="events-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="events-header">
                <h2>{eventsTitle}</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedEvent(null);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="events-content">
                {activeEvents.length > 0 ? (
                  <div className="events-list">
                    {activeEvents.map(event => (
                      <div
                        key={event.id}
                        className={`event-item ${event.theme} ${event.isPremiumOnly && !hasPremiumPass ? 'premium-locked' : ''}`}
                        onClick={() => {
                          if (!event.isPremiumOnly || hasPremiumPass) {
                            setSelectedEvent(event);
                          }
                        }}
                      >
                        <div className="event-image">
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt={event.name} />
                          ) : (
                            <div className={`default-event-image ${event.theme}`}>
                              <span>{event.name.charAt(0)}</span>
                            </div>
                          )}
                          {event.isPremiumOnly && (
                            <div className="premium-badge" title={premiumOnlyLabel}>
                              ⭐
                            </div>
                          )}
                        </div>

                        <div className="event-info">
                          <h3 className="event-name">{event.name}</h3>
                          <p className="event-description">{event.description}</p>

                          <div className="event-time-remaining">
                            <span className="time-label">{timeRemainingLabel}:</span>
                            <span className="time-value">
                              {(() => {
                                const { days, hours, minutes } = calculateTimeRemaining(event.endDate);
                                return `${days} ${daysLabel}, ${hours} ${hoursLabel}, ${minutes} ${minutesLabel}`;
                              })()}
                            </span>
                          </div>

                          {event.hasParticipated && (
                            <div className="event-progress-bar">
                              <div
                                className="progress-fill"
                                style={{ width: `${event.progress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>

                        <div className="event-actions">
                          {event.isPremiumOnly && !hasPremiumPass ? (
                            <span className="premium-required">{premiumOnlyLabel}</span>
                          ) : event.isCompleted && !event.hasClaimedRewards ? (
                            <button
                              className="claim-rewards-button imperial-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClaimRewards(event.id);
                              }}
                              disabled={claimingRewardsEventId === event.id}
                            >
                              {claimingRewardsEventId === event.id ? '...' : claimRewardsButtonLabel}
                            </button>
                          ) : event.hasClaimedRewards ? (
                            <span className="rewards-claimed">{eventRewardsClaimedLabel}</span>
                          ) : event.hasParticipated ? (
                            <span className="event-joined">{eventJoinedLabel}</span>
                          ) : (
                            <button
                              className="join-event-button jade-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinEvent(event.id);
                              }}
                              disabled={joiningEventId === event.id}
                            >
                              {joiningEventId === event.id ? '...' : joinButtonLabel}
                            </button>
                          )}

                          <button
                            className="event-details-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!event.isPremiumOnly || hasPremiumPass) {
                                setSelectedEvent(event);
                              }
                            }}
                          >
                            {eventDetailsButtonLabel}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-events">
                    <p>{noEventsLabel}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="event-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className={`event-detail-modal ${selectedEvent.theme}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="event-detail-header">
                <h2>{selectedEvent.name}</h2>
                <button
                  className="close-button"
                  onClick={() => setSelectedEvent(null)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="event-detail-content">
                <div className="event-detail-image">
                  {selectedEvent.imageUrl ? (
                    <img src={selectedEvent.imageUrl} alt={selectedEvent.name} />
                  ) : (
                    <div className={`default-event-image ${selectedEvent.theme}`}>
                      <span>{selectedEvent.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                <div className="event-detail-description">
                  <p>{selectedEvent.description}</p>
                </div>

                <div className="event-detail-dates">
                  <div className="date-item">
                    <span className="date-label">{eventStartDateLabel}</span>
                    <span className="date-value">{formatDate(selectedEvent.startDate)}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">{eventEndDateLabel}</span>
                    <span className="date-value">{formatDate(selectedEvent.endDate)}</span>
                  </div>
                </div>

                {selectedEvent.requirements && (
                  <div className="event-detail-requirements">
                    <h3>{eventRequirementsLabel}</h3>
                    <p>{selectedEvent.requirements}</p>
                  </div>
                )}

                <div className="event-detail-rewards">
                  <h3>{eventRewardsLabel}</h3>
                  <div className="rewards-grid">
                    {selectedEvent.rewards.map((reward, index) => (
                      <div key={index} className="reward-item">
                        <div
                          className="reward-icon"
                          style={{ borderColor: getRarityColor(reward.rarity) }}
                        >
                          {reward.icon || '🎁'}
                        </div>
                        <div className="reward-info">
                          <div className="reward-name">{reward.name}</div>
                          <div className="reward-quantity">x{reward.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedEvent.hasParticipated && (
                  <div className="event-detail-progress">
                    <h3>{eventProgressLabel}</h3>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${selectedEvent.progress}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {selectedEvent.progress}%
                      {selectedEvent.isCompleted && (
                        <span className="completed-badge">{eventCompletedLabel}</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="event-detail-actions">
                  {selectedEvent.isPremiumOnly && !hasPremiumPass ? (
                    <span className="premium-required">{premiumOnlyLabel}</span>
                  ) : selectedEvent.isCompleted && !selectedEvent.hasClaimedRewards ? (
                    <button
                      className="claim-rewards-button imperial-button"
                      onClick={() => handleClaimRewards(selectedEvent.id)}
                      disabled={claimingRewardsEventId === selectedEvent.id}
                    >
                      {claimingRewardsEventId === selectedEvent.id ? '...' : claimRewardsButtonLabel}
                    </button>
                  ) : selectedEvent.hasClaimedRewards ? (
                    <span className="rewards-claimed">{eventRewardsClaimedLabel}</span>
                  ) : selectedEvent.hasParticipated ? (
                    <span className="event-joined">{eventJoinedLabel}</span>
                  ) : (
                    <button
                      className="join-event-button jade-button"
                      onClick={() => handleJoinEvent(selectedEvent.id)}
                      disabled={joiningEventId === selectedEvent.id}
                    >
                      {joiningEventId === selectedEvent.id ? '...' : joinButtonLabel}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BattlePassEvents;
