// src/pages/BambooCollectionPage.tsx
import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion'; // Unused
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchBambooCollectionPageView } from '@/services/localizedContentService';
import type {
  BambooCollectionPageViewLabelsBundle,
  BambooCollectionPageViewDataPayload,
  // ApiError, // Not explicitly used in this simplified version beyond what useLocalizedView handles
} from '@/types';
import { useLanguage } from '@/context/LanguageProvider'; // Needed for date-fns locale
// import LoadingSpinner from '@/components/common/LoadingSpinner'; // Replaced by page-level pending check
import ErrorDisplay from '@/components/common/ErrorDisplay';
// import { formatDistanceToNow } from 'date-fns'; // Let's simplify and remove direct date-fns usage for now to reduce errors
// import { zhCN, enUS } from 'date-fns/locale'; // Matching above
import { playSound, SoundType } from '@/utils/sound';
// import { useBambooCollectionSystem } from '@/hooks/useBambooCollectionSystem'; // Commented out - Module not found
import Button from '@/components/common/Button';
// import PageHeader from '@/components/common/PageHeader'; // Commented out - Missing file

// Mock type for BambooSpot - replace with actual from bambooCollectionService or db.ts if different
interface BambooSpot {
  id: string;
  name: string;
  status: 'available' | 'depleted' | 'respawning';
  nextAvailableAt?: number; // timestamp
  collectedAmount?: number;
}

const BambooCollectionPage: React.FC = () => {
  const { language } = useLanguage();
  // const { spots, collectFromSpot, isLoading: isLoadingSpots } = useBambooCollectionSystem(); // Assuming hook structure
  
  // Mocking collectFromSpot since useBambooCollectionSystem is commented out
  const mockCollectFromSpot = async (spotId: string): Promise<{success: boolean, respawnTimeMs?: number, error?: string}> => {
    console.log(`Mock collecting from ${spotId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate success or failure randomly or based on spotId
    if (Math.random() > 0.2) { 
      return { success: true, respawnTimeMs: 1000 * 60 * (Math.random() * 10 + 5) }; // 5-15 min respawn
    } else {
      return { success: false, error: 'Mock collection failed' };
    }
  };

  const {
    // isLoading: isLoadingSpots, // isLoading from useLocalizedView will cover initial label load
    // spots, // We'll manage spots locally for this example for simplicity, or assume it's part of a larger context not shown
  } = {} // useBambooCollectionSystem(); // Commented out

  // Simulate local spots data for now, or this would come from useBambooCollectionSystem or another source
  const [spots, setSpots] = useState<BambooSpot[]>([
    { id: 'spot1', name: 'Quiet Grove Patch', status: 'available', collectedAmount: 10 },
    { id: 'spot2', name: 'Sunlit Clearing', status: 'depleted', nextAvailableAt: Date.now() + 1000 * 60 * 5 }, // 5 mins
    { id: 'spot3', name: 'Misty Bamboo Thicket', status: 'respawning', nextAvailableAt: Date.now() + 1000 * 60 * 15 }, // 15 mins
  ]);

  const {
    labels: pageLabels,
    data: pageData, // Contains totalBambooCollected from our service example
    isPending,
    isError,
    error,
    refetch
  } = useLocalizedView<BambooCollectionPageViewDataPayload | null, BambooCollectionPageViewLabelsBundle>(
    'bambooCollectionViewContent', // Unique query key
    fetchBambooCollectionPageView // The fetch function
  );

  const safePageLabels = (pageLabels || {}) as any;
  const safePageData = (pageData || {}) as BambooCollectionPageViewDataPayload | any;

  const [collectingSpotId, setCollectingSpotId] = useState<string | null>(null);

  const handleCollect = async (spotId: string) => {
    setCollectingSpotId(spotId);
    try {
      // const result = await collectFromSpot(spotId); // Original call, commented due to missing hook
      const result = await mockCollectFromSpot(spotId); // Using mock function
      if (result && result.success) {
        playSound(SoundType.BAMBOO_COLLECT);
        // Update local spot state - in a real app, useBambooCollectionSystem would handle this
        setSpots(prevSpots => prevSpots.map(s => 
          s.id === spotId ? { ...s, status: 'depleted', nextAvailableAt: Date.now() + (result.respawnTimeMs || 1000 * 60 * 10) } : s
        ));
        // Potentially refetch pageData if totalBambooCollected needs update
        // refetch(); 
      } else {
        // Handle collection failure (e.g., display a toast)
        console.error('Failed to collect from spot:', result?.error);
      }
    } catch (e) {
      console.error('Error collecting from spot:', e);
    } finally {
      setCollectingSpotId(null);
    }
  };

  // Helper to format time remaining
  const formatTimeRemaining = (timestamp?: number) => {
    if (!timestamp) return '';
    const now = Date.now();
    if (timestamp <= now) return safePageLabels.spotStatusAvailable ?? 'Available';
    
    const diffSeconds = Math.round((timestamp - now) / 1000);
    if (diffSeconds < 60) return `${diffSeconds}s`;
    const diffMinutes = Math.round(diffSeconds / 60);
    return `${diffMinutes}m`;
    // For more complex formatting, re-introduce date-fns if needed
    // return formatDistanceToNow(timestamp, { addSuffix: true, locale: language === 'zh' ? zhCN : enUS });
  };

  if (isPending && !pageLabels) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p>{safePageLabels.loadingMessage ?? 'Loading Collection Spots...'}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay 
        error={error} 
        title={safePageLabels.errorTitle ?? 'Error Loading Spots'} 
        messageTemplate={safePageLabels.errorMessage ?? 'Could not load spots: {message}'}
        onRetry={refetch} 
        retryButtonText={safePageLabels.retryButtonText ?? 'Retry'}
      />
    );
  }

  return (
    <div className="bamboo-collection-page" style={{padding: '20px'}}>
      {/* <PageHeader title={safePageLabels.pageTitle ?? 'Bamboo Collection'} /> */}
      <h1 className="text-xl font-semibold mb-4">{safePageLabels.pageTitle ?? 'Bamboo Collection'}</h1>
      
      {safePageData?.totalBambooCollected !== undefined && (
        <p>Total Bamboo Collected: {safePageData.totalBambooCollected}</p>
      )}

      {spots.length === 0 && !isPending && (
        <p>{safePageLabels.noSpotsMessage ?? 'No bamboo spots available right now.'}</p>
      )}

      <div className="spots-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {spots.map(spot => (
          <div key={spot.id} className="spot-card" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
            <h3>{spot.name}</h3>
            <p>
              Status: {
                spot.status === 'available' ? (safePageLabels.spotStatusAvailable ?? 'Available') :
                spot.status === 'depleted' ? (safePageLabels.spotStatusDepleted ?? 'Depleted') :
                (safePageLabels.spotStatusRespawning ?? 'Respawning')
              } 
              {spot.status !== 'available' && spot.nextAvailableAt && (
                <span style={{fontSize: '0.9em', color: '#555'}}> ({safePageLabels.nextAvailableLabel ?? 'Next in:'} {formatTimeRemaining(spot.nextAvailableAt)})</span>
              )}
            </p>
            <Button 
              onClick={() => handleCollect(spot.id)} 
              disabled={spot.status !== 'available' || collectingSpotId === spot.id}
              isLoading={collectingSpotId === spot.id}
              loadingText="Collecting..."
            >
              {safePageLabels.collectButton ?? 'Collect'}
            </Button>
            {spot.status === 'available' && spot.collectedAmount && (
               <p style={{fontSize: '0.8em', color: '#777'}}>Collects ~{spot.collectedAmount} bamboo</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BambooCollectionPage;
