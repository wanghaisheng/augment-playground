// src/components/game/BattlePassFriendInvite.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interface for a friend
 */
export interface Friend {
  /** Friend ID */
  id: string;
  /** Friend name */
  name: string;
  /** Friend avatar URL */
  avatarUrl?: string;
  /** Whether the friend is already invited */
  isInvited: boolean;
  /** Whether the friend has already joined */
  hasJoined: boolean;
  /** Friend's current level in the battle pass */
  currentLevel?: number;
}

/**
 * Props for the BattlePassFriendInvite component
 */
export interface BattlePassFriendInviteProps {
  /** Array of friends */
  friends: Friend[];
  /** Current season name */
  seasonName: string;
  /** Callback function when a friend is invited */
  onInviteFriend?: (friendId: string) => Promise<boolean>;
  /** Callback function when the invite link is copied */
  onCopyInviteLink?: () => Promise<boolean>;
  /** Localized labels for the component */
  labels: {
    /** Title for the invite */
    inviteTitle?: string;
    /** Label for the invite button */
    inviteButtonLabel?: string;
    /** Label for the copy link button */
    copyLinkButtonLabel?: string;
    /** Label for the close button */
    closeButtonLabel?: string;
    /** Label for when there are no friends */
    noFriendsLabel?: string;
    /** Label for the invite message */
    inviteMessageLabel?: string;
    /** Label for the invite rewards */
    inviteRewardsLabel?: string;
    /** Label for the invite link */
    inviteLinkLabel?: string;
    /** Label for the already invited status */
    alreadyInvitedLabel?: string;
    /** Label for the already joined status */
    alreadyJoinedLabel?: string;
    /** Label for the invite sent status */
    inviteSentLabel?: string;
    /** Label for the link copied status */
    linkCopiedLabel?: string;
  };
}

/**
 * Battle Pass Friend Invite Component
 * Displays a list of friends to invite to the battle pass
 */
const BattlePassFriendInvite: React.FC<BattlePassFriendInviteProps> = ({
  friends,
  seasonName,
  onInviteFriend,
  onCopyInviteLink,
  labels
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [invitingFriendId, setInvitingFriendId] = useState<string | null>(null);
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Default labels
  const inviteTitle = labels.inviteTitle || 'Invite Friends';
  const inviteButtonLabel = labels.inviteButtonLabel || 'Invite';
  const copyLinkButtonLabel = labels.copyLinkButtonLabel || 'Copy Invite Link';
  const closeButtonLabel = labels.closeButtonLabel || 'Close';
  const noFriendsLabel = labels.noFriendsLabel || 'No friends to invite';
  const inviteMessageLabel = labels.inviteMessageLabel || 'Invite your friends to join the Battle Pass and earn rewards together!';
  const inviteRewardsLabel = labels.inviteRewardsLabel || 'You\'ll receive 50 diamonds for each friend who joins!';
  const inviteLinkLabel = labels.inviteLinkLabel || 'Or share this invite link:';
  const alreadyInvitedLabel = labels.alreadyInvitedLabel || 'Invited';
  const alreadyJoinedLabel = labels.alreadyJoinedLabel || 'Joined';
  const inviteSentLabel = labels.inviteSentLabel || 'Invite Sent!';
  const linkCopiedLabel = labels.linkCopiedLabel || 'Link Copied!';

  // Handle invite friend
  const handleInviteFriend = async (friendId: string) => {
    if (!onInviteFriend) return;
    
    setInvitingFriendId(friendId);
    
    try {
      const success = await onInviteFriend(friendId);
      
      if (success) {
        setInvitedFriends(prev => [...prev, friendId]);
        
        // Show success message for 2 seconds
        setTimeout(() => {
          setInvitingFriendId(null);
        }, 2000);
      } else {
        setInvitingFriendId(null);
      }
    } catch (error) {
      console.error('Failed to invite friend:', error);
      setInvitingFriendId(null);
    }
  };

  // Handle copy invite link
  const handleCopyInviteLink = async () => {
    if (!onCopyInviteLink) {
      // Fallback to clipboard API if no callback provided
      try {
        await navigator.clipboard.writeText(`Join me in the ${seasonName} Battle Pass! https://pandahabit.app/battlepass/invite`);
        setLinkCopied(true);
        
        // Reset after 2 seconds
        setTimeout(() => {
          setLinkCopied(false);
        }, 2000);
        
        return;
      } catch (error) {
        console.error('Failed to copy link:', error);
        return;
      }
    }
    
    try {
      const success = await onCopyInviteLink();
      
      if (success) {
        setLinkCopied(true);
        
        // Reset after 2 seconds
        setTimeout(() => {
          setLinkCopied(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy invite link:', error);
    }
  };

  return (
    <>
      <button
        className="invite-button jade-button"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
          <path d="M12 4.5V19.5M19.5 12H4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {inviteTitle}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="invite-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="invite-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="invite-header">
                <h2>{inviteTitle}</h2>
                <button
                  className="close-button"
                  onClick={() => setIsOpen(false)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="invite-content">
                <div className="invite-message">
                  <p>{inviteMessageLabel}</p>
                  <p className="invite-rewards">{inviteRewardsLabel}</p>
                </div>
                
                <div className="invite-link-section">
                  <p>{inviteLinkLabel}</p>
                  <div className="invite-link-container">
                    <input
                      type="text"
                      className="invite-link-input"
                      value={`https://pandahabit.app/battlepass/invite`}
                      readOnly
                    />
                    <button
                      className="copy-link-button jade-button"
                      onClick={handleCopyInviteLink}
                      disabled={linkCopied}
                    >
                      {linkCopied ? linkCopiedLabel : copyLinkButtonLabel}
                    </button>
                  </div>
                </div>
                
                <div className="friends-section">
                  <h3>Friends</h3>
                  
                  {friends.length > 0 ? (
                    <div className="friends-list">
                      {friends.map(friend => (
                        <div key={friend.id} className="friend-item">
                          <div className="friend-avatar">
                            {friend.avatarUrl ? (
                              <img src={friend.avatarUrl} alt={friend.name} />
                            ) : (
                              <div className="default-avatar">
                                {friend.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          
                          <div className="friend-info">
                            <div className="friend-name">{friend.name}</div>
                            {friend.currentLevel && (
                              <div className="friend-level">Level {friend.currentLevel}</div>
                            )}
                          </div>
                          
                          <div className="friend-action">
                            {friend.hasJoined ? (
                              <span className="friend-status joined">{alreadyJoinedLabel}</span>
                            ) : friend.isInvited || invitedFriends.includes(friend.id) ? (
                              <span className="friend-status invited">{alreadyInvitedLabel}</span>
                            ) : invitingFriendId === friend.id ? (
                              <span className="friend-status sending">{inviteSentLabel}</span>
                            ) : (
                              <button
                                className="invite-friend-button jade-button"
                                onClick={() => handleInviteFriend(friend.id)}
                              >
                                {inviteButtonLabel}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-friends">
                      <p>{noFriendsLabel}</p>
                    </div>
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

export default BattlePassFriendInvite;
