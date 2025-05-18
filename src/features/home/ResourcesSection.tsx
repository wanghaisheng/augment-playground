// src/features/home/ResourcesSection.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getUserCurrency, UserCurrencyRecord } from '@/services/storeService';
import { useRegisterTableRefresh } from '@/hooks/useDataRefresh';
import LuckyPointsDisplay from '@/components/game/LuckyPointsDisplay';
import CurrencyDisplay from '@/components/store/CurrencyDisplay';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import BambooCollectionPanel from '@/components/bamboo/BambooCollectionPanel';
import { playSound, SoundType } from '@/utils/sound';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationProvider';

// Types
import type { Language } from '@/types';
import { NotificationType } from '@/types/notification';

// Define a placeholder fetch function for useLocalizedView
// In a real scenario, this would fetch labels and data for this section
const fetchResourcesSectionView = async (lang: Language): Promise<any> => { // Using any for now
  console.log(`Fetching resources section view for ${lang}`);
  // Replace with actual data fetching logic that returns { labels: YourLabelsBundle, data: YourDataPayload | null }
  return Promise.resolve({ labels: defaultLabels, data: null });
};

interface ResourcesSectionLabelsBundle { // Local definition for now
  title: string;
  bamboo: string;
  coins: string;
  jade: string;
  luckyPoints: string;
  collectBambooButton: string;
  bambooCollectedMessage: string;
  errorCollectingBamboo: string;
}

// Default labels (example structure)
const defaultLabels: ResourcesSectionLabelsBundle = {
  title: 'Your Resources',
  bamboo: 'Bamboo',
  coins: 'Coins',
  jade: 'Jade',
  luckyPoints: 'Lucky Points',
  collectBambooButton: 'Collect Bamboo',
  bambooCollectedMessage: 'Collected {amount} bamboo!',
  errorCollectingBamboo: 'Failed to collect bamboo.',
};

const ResourcesSection: React.FC = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const { addNotification } = useNotifications();

  const [userCurrency, setUserCurrency] = useState<UserCurrencyRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBambooPanelOpen, setIsBambooPanelOpen] = useState(false); // Added state for panel

  const { labels, /* data, */ isPending: labelsPending, isError: labelsError, error: labelsLoadingError } =
    useLocalizedView<null, ResourcesSectionLabelsBundle>(
      'resourcesSectionView', // Query key
      fetchResourcesSectionView // Fetch function
    );

  const currentLabels = labels || defaultLabels;

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const currencyData = await getUserCurrency(userId);
      setUserCurrency(currencyData);
    } catch (error) {
      console.error("Error loading resources data:", error);
      addNotification({
        title: currentLabels.errorCollectingBamboo,
        message: error instanceof Error ? error.message : 'Unknown error',
        type: NotificationType.CUSTOM, // Corrected: Use valid NotificationType
        priority: 'medium' as any, // Cast priority for now, ensure it matches NotificationPriority enum if strict
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, addNotification, currentLabels.errorCollectingBamboo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useRegisterTableRefresh('userCurrencies', loadData);
  useRegisterTableRefresh('luckyPoints', loadData);
  useRegisterTableRefresh('bambooCollections', loadData);

  const handleCollectBamboo = async () => {
    if (!userId) return;
    // This function is now primarily a trigger to open the panel or for other UI effects.
    // The actual collection logic should reside within BambooCollectionPanel or its services.
    setIsBambooPanelOpen(true); // Open the panel
    playSound(SoundType.BAMBOO_COLLECT); // Corrected: Use BAMBOO_COLLECT
    addNotification({
      title: 'Open Collection Panel', // Changed notification content
      message: 'Select a spot to collect bamboo.',
      type: NotificationType.CUSTOM, // Corrected: Use valid NotificationType
      priority: 'low' as any, // Cast priority for now
    });
  };

  if (labelsPending || isLoading) {
    return <div className="p-4">Loading resources...</div>;
  }

  if (labelsError) {
    return <div className="p-4 text-red-500">Error loading resource labels: {labelsLoadingError?.message}</div>;
  }

  return (
    <motion.div
      className="resources-section p-4 bg-white shadow-lg rounded-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{currentLabels.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {userCurrency && (
          <>
            <CurrencyDisplay currency={userCurrency} labels={{ coinsLabel: currentLabels.coins, jadeLabel: currentLabels.jade }} />
          </>
        )}
        <LuckyPointsDisplay labels={{ label: currentLabels.luckyPoints }} variant="default" />
      </div>

      <button onClick={handleCollectBamboo} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        {currentLabels.collectBambooButton}
      </button>
      <BambooCollectionPanel
        isOpen={isBambooPanelOpen}
        onClose={() => setIsBambooPanelOpen(false)}
      />

    </motion.div>
  );
};

export default ResourcesSection;
