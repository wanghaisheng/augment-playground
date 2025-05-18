// src/pages/BambooPlantingPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import PageTransition from '@/components/animation/PageTransition';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import BambooSeedSelector from '@/components/bamboo/BambooSeedSelector';
import BambooPlotCard from '@/components/bamboo/BambooPlotCard';
import Button from '@/components/common/Button';
import { playSound, SoundType } from '@/utils/sound';
import type {
  BambooPlantingPageViewLabelsBundle,
  BambooPlantingPageViewDataPayload,
} from '@/types';
import { fetchBambooPlantingPageView } from '@/services/localizedContentService';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { useBambooSystem } from '@/hooks/useBambooSystem';
import type { BambooPlantRecord, BambooPlotRecord, BambooSeedRecord } from '@/db-old'; // Corrected imports

const DUMMY_USER_ID = 'current-user';

// Placeholder for growth stage numbers, assuming 0: seedling, 1: growing, 2: harvestable
// These should ideally come from a shared enum or constants file if they exist
const GROWTH_STAGE_SEEDLING = 0;
const GROWTH_STAGE_GROWING = 1;
const GROWTH_STAGE_HARVESTABLE = 2;

const BambooPlantingPage: React.FC = () => {
  // const { showToast } = useToast(); // Commented out

  const {
    labels: pageLabels,
    // data: localizedViewData, // Not directly used, data comes from useBambooSystem
    isPending: localizedViewIsPending,
    error: localizedViewError,
    refetch: refetchLocalizedView
  } = useLocalizedView<
    BambooPlantingPageViewDataPayload,
    BambooPlantingPageViewLabelsBundle
  >(
    'bambooPlantingViewContent',
    fetchBambooPlantingPageView
  );

  // Get the entire object from useBambooSystem
  const bambooSystem = useBambooSystem(DUMMY_USER_ID);

  const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
  const [selectedSeed, setSelectedSeed] = useState<BambooSeedRecord | null>(null);
  const [currentPlantInSelectedPlot, setCurrentPlantInSelectedPlot] = useState<BambooPlantRecord | null>(null);

  const [showConfirmPlantModal, setShowConfirmPlantModal] = useState(false);
  const [showConfirmHarvestModal, setShowConfirmHarvestModal] = useState(false);

  useEffect(() => {
    if (selectedPlotId !== null) {
      const foundPlant = bambooSystem.plants.find((p: BambooPlantRecord) => p.plotId === selectedPlotId && p.userId === DUMMY_USER_ID);
      setCurrentPlantInSelectedPlot(foundPlant || null);
    } else {
      setCurrentPlantInSelectedPlot(null);
    }
  }, [selectedPlotId, bambooSystem.plants]);

  const isLoading = localizedViewIsPending || bambooSystem.isLoadingPlanting;
  const errorForDisplay = localizedViewError;
  // const labels = pageLabels || {} as BambooPlantingPageViewLabelsBundle;
  // Use a more direct approach to ensure labels are safely accessed with defaults
  // The 'as any' cast below mirrors the approach in CustomGoalsPage for stubborn 'never' issues if they arise
  // but ideally, pageLabels being optional in useLocalizedView + optional chaining should suffice.
  const safePageLabels = (pageLabels || {}) as any; // Provide an empty object fallback and cast for safety

  const handleSelectPlot = useCallback((plotId: number) => {
    setSelectedPlotId(plotId);
    setSelectedSeed(null);
    setShowConfirmPlantModal(false);
    setShowConfirmHarvestModal(false);
  }, []);

  const handleSelectSeed = useCallback((seed: BambooSeedRecord) => {
    setSelectedSeed(seed);
  }, []);

  const handlePlantAction = async () => {
    if (!selectedPlotId || !selectedSeed) {
      // showToast(labels.noSeedsMessage || 'Please select a plot and a seed.', 'error');
      // showToast(safePageLabels?.noSeedsMessage ?? 'Please select a plot and a seed.', 'error');
      return;
    }
    setShowConfirmPlantModal(false);
    try {
      const seedId = selectedSeed.id as number;
      if (typeof seedId !== 'number') throw new Error('Selected seed has an invalid ID.');

      const newPlant = await bambooSystem.plantBamboo(selectedPlotId, seedId);
      if (newPlant) {
        playSound(SoundType.BAMBOO_COLLECT);
        // showToast(labels.plantSuccessMessage?.replace('{plotName}', bambooSystem.plots.find((p: BambooPlotRecord) => p.id === selectedPlotId)?.name || 'plot') || `Bamboo planted!`, 'success');
        // showToast(safePageLabels?.plantSuccessMessage?.replace('{plotName}', bambooSystem.plots.find((p: BambooPlotRecord) => p.id === selectedPlotId)?.name ?? 'plot') ?? `Bamboo planted!`, 'success');
        setSelectedSeed(null);
      } else {
        // showToast(labels.plantFailureMessage || 'Failed to plant bamboo.', 'error');
        // showToast(safePageLabels?.plantFailureMessage ?? 'Failed to plant bamboo.', 'error');
      }
    } catch (err) {
      console.error('Planting error:', err);
      // showToast((err as Error).message || labels.plantFailureMessage || 'Planting failed.', 'error');
      // showToast((err as Error).message || safePageLabels?.plantFailureMessage || 'Planting failed.', 'error');
    }
  };

  const handleWaterAction = async () => {
    if (!currentPlantInSelectedPlot || !selectedPlotId) {
       // showToast(labels.noPlantSelectedMessage || 'No plant in selected plot to water.', 'info');
       // showToast(safePageLabels?.noPlantSelectedMessage ?? 'No plant in selected plot to water.', 'info');
       return;
    }
    try {
      const plantId = currentPlantInSelectedPlot.id as number;
      if (typeof plantId !== 'number') throw new Error('Selected plant has an invalid ID.');
      const success = await bambooSystem.waterPlant(plantId);
      if (success) {
        playSound(SoundType.WATER);
        // showToast(labels.waterSuccessMessage || `Plant watered!`, 'success');
        // showToast(safePageLabels?.waterSuccessMessage ?? `Plant watered!`, 'success');
      } else {
        // showToast(labels.waterFailureMessage || 'Failed to water. You might be out of resources.', 'error');
        // showToast(safePageLabels?.waterFailureMessage ?? 'Failed to water. You might be out of resources.', 'error');
      }
    } catch (err) {
      console.error('Watering error:', err);
      // showToast((err as Error).message || labels.waterFailureMessage || 'Watering failed.', 'error');
      // showToast((err as Error).message || safePageLabels?.waterFailureMessage || 'Watering failed.', 'error');
    }
  };

  const handleFertilizeAction = async () => {
    if (!currentPlantInSelectedPlot || !selectedPlotId) {
       // showToast(labels.noPlantSelectedMessage || 'No plant in selected plot to fertilize.', 'info');
       // showToast(safePageLabels?.noPlantSelectedMessage ?? 'No plant in selected plot to fertilize.', 'info');
       return;
    }
    try {
      const plantId = currentPlantInSelectedPlot.id as number;
      if (typeof plantId !== 'number') throw new Error('Selected plant has an invalid ID.');
      const success = await bambooSystem.fertilizePlant(plantId);
      if (success) {
        playSound(SoundType.FERTILIZE);
        // showToast(labels.fertilizeSuccessMessage || `Plant fertilized!`, 'success');
        // showToast(safePageLabels?.fertilizeSuccessMessage ?? `Plant fertilized!`, 'success');
      } else {
        // showToast(labels.fertilizeFailureMessage || 'Failed to fertilize. You might be out of resources.', 'error');
        // showToast(safePageLabels?.fertilizeFailureMessage ?? 'Failed to fertilize. You might be out of resources.', 'error');
      }
    } catch (err) {
      console.error('Fertilizing error:', err);
      // showToast((err as Error).message || labels.fertilizeFailureMessage || 'Fertilizing failed.', 'error');
      // showToast((err as Error).message || safePageLabels?.fertilizeFailureMessage || 'Fertilizing failed.', 'error');
    }
  };

  const handleHarvestAction = async () => {
    if (!currentPlantInSelectedPlot || !currentPlantInSelectedPlot.isHarvestable || !selectedPlotId) {
       // showToast(labels.harvestNotReadyMessage || 'Plant not ready for harvest or no plant selected.', 'info');
       // showToast(safePageLabels?.harvestNotReadyMessage ?? 'Plant not ready for harvest or no plant selected.', 'info');
       return;
    }
    setShowConfirmHarvestModal(false);
    try {
      const plantId = currentPlantInSelectedPlot.id as number;
      if (typeof plantId !== 'number') throw new Error('Selected plant has an invalid ID.');
      const success = await bambooSystem.harvestBamboo(plantId);
      if (success) {
        playSound(SoundType.BAMBOO_COLLECT);
        // showToast(labels.harvestSuccessMessage || `Plant harvested!`, 'success');
        // showToast(safePageLabels?.harvestSuccessMessage ?? `Plant harvested!`, 'success');
      } else {
        // showToast(labels.harvestFailureMessage || 'Failed to harvest.', 'error');
        // showToast(safePageLabels?.harvestFailureMessage ?? 'Failed to harvest.', 'error');
      }
    } catch (err) {
      console.error('Harvesting error:', err);
      // showToast((err as Error).message || labels.harvestFailureMessage || 'Harvesting failed.', 'error');
      // showToast((err as Error).message || safePageLabels?.harvestFailureMessage || 'Harvesting failed.', 'error');
    }
  };

  if (isLoading) {
    return <LoadingSpinner text={safePageLabels?.loadingMessage ?? "Loading Bamboo Garden..."} />;
  }

  if (errorForDisplay) {
    return (
      <ErrorDisplay
        error={errorForDisplay}
        title={safePageLabels?.errorLoadingBambooData ?? "Error Loading Garden"}
        onRetry={refetchLocalizedView}
      />
    );
  }

  const selectedPlot = bambooSystem.plots.find((p: BambooPlotRecord) => p.id === selectedPlotId);
  const plantGrowthStageText = (stage: number | undefined) => {
    if (stage === GROWTH_STAGE_SEEDLING) return safePageLabels?.growthStageSeedling ?? 'Seedling';
    if (stage === GROWTH_STAGE_GROWING) return safePageLabels?.growthStageGrowing ?? 'Growing';
    if (stage === GROWTH_STAGE_HARVESTABLE) return safePageLabels?.growthStageReady ?? 'Ready to Harvest';
    return safePageLabels?.growthStageUnknown ?? 'Unknown Stage';
  };

  return (
    <PageTransition>
    <div className="bamboo-planting-page">
        {/* Render page header (conditionally if labels are loaded) */}
        {/* {labels && <PageHeader title={pageTitle} />} */}

        <div className="bamboo-main-content">
          <div className="bamboo-plots-container">
            {bambooSystem.plots.map((plot: BambooPlotRecord) => (
                <BambooPlotCard
                  key={plot.id}
                  plot={plot}
                userId={DUMMY_USER_ID}
                bambooCount={bambooSystem.bambooCount}
                isSelected={plot.id === selectedPlotId}
                onSelect={() => handleSelectPlot(plot.id as number)}
                />
              ))}
          </div>

          {selectedPlot && (
            <div className="bamboo-selected-plot-actions">
              <h3>{safePageLabels?.selectedPlotTitle?.replace('{plotName}', selectedPlot.name) ?? `Plot: ${selectedPlot.name}`}</h3>
              {currentPlantInSelectedPlot ? (
                <div className="plant-actions">
                  <p>
                    {safePageLabels?.plantDetailsTitle ?? "Plant Details:"}
                    {(bambooSystem.seeds.find((s: BambooSeedRecord) => s.id === currentPlantInSelectedPlot.seedId)?.name) || 'Unknown Plant'}
                    (Growth: {plantGrowthStageText(currentPlantInSelectedPlot.growthStage)})
                  </p>
                  <Button
                    onClick={handleWaterAction}
                    disabled={currentPlantInSelectedPlot.growthStage === GROWTH_STAGE_HARVESTABLE || currentPlantInSelectedPlot.isWatered}
                  >
                    {safePageLabels?.waterButton ?? "Water"}
                  </Button>
                <Button
                    onClick={handleFertilizeAction}
                    disabled={currentPlantInSelectedPlot.growthStage === GROWTH_STAGE_HARVESTABLE || currentPlantInSelectedPlot.isFertilized}
                >
                    {safePageLabels?.fertilizeButton ?? "Fertilize"}
                  </Button>
                  <Button onClick={() => setShowConfirmHarvestModal(true)} disabled={!currentPlantInSelectedPlot.isHarvestable}>
                    {safePageLabels?.harvestButton ?? "Harvest"}
                </Button>
                      </div>
              ) : selectedPlot.isUnlocked ? (
                <div className="bamboo-seed-selector-container">
                  <h4>{safePageLabels?.seedSelectionTitle ?? "Select a Seed to Plant"}</h4>
                  {bambooSystem.seeds.length > 0 ? (
                    <BambooSeedSelector
                      seeds={bambooSystem.seeds}
                      userId={DUMMY_USER_ID}
                      bambooCount={bambooSystem.bambooCount}
                      selectedSeedId={selectedSeed?.id ?? null}
                      onSelect={(seedId) => {
                        const foundSeed = bambooSystem.seeds.find((s: BambooSeedRecord) => s.id === seedId);
                        if (foundSeed) handleSelectSeed(foundSeed);
                      }}
                    />
                  ) : (
                    <p>{safePageLabels?.noSeedsMessage ?? "No seeds available to plant."}</p>
                  )}
                  {selectedSeed && (
                    <Button
                      onClick={() => setShowConfirmPlantModal(true)}
                      disabled={!selectedPlotId || !selectedSeed}
                    >
                      {safePageLabels?.plantButton ?? "Plant Seed"}
                    </Button>
                  )}
                </div>
              ) : (
                <p>{safePageLabels?.plotLockedMessage ?? "This plot is locked. Keep playing to unlock it!"}</p>
              )}
            </div>
          )}
        </div>

        {showConfirmPlantModal && selectedPlot && selectedSeed && (
          <ConfirmationDialog
            title={safePageLabels?.confirmPlantTitle ?? "Confirm Plant"}
            message={safePageLabels?.confirmPlantMessage?.replace('{seedName}', selectedSeed.name).replace('{plotName}', selectedPlot.name) ?? `Plant ${selectedSeed.name} in ${selectedPlot.name}?`}
            confirmText={safePageLabels?.plantButton ?? "Plant"}
            cancelText={safePageLabels?.cancelButtonText ?? "Cancel"} // Added nullish coalescing
            onConfirm={handlePlantAction}
            onCancel={() => setShowConfirmPlantModal(false)}
          />
        )}

        {showConfirmHarvestModal && selectedPlot && currentPlantInSelectedPlot && (
          <ConfirmationDialog
            title={safePageLabels?.confirmHarvestTitle ?? "Confirm Harvest"}
            message={safePageLabels?.confirmHarvestMessage?.replace('{plotName}', selectedPlot.name) ?? `Harvest bamboo from ${selectedPlot.name}?`}
            confirmText={safePageLabels?.harvestButton ?? "Harvest"}
            cancelText={safePageLabels?.cancelButtonText ?? "Cancel"} // Added nullish coalescing
            onConfirm={handleHarvestAction}
            onCancel={() => setShowConfirmHarvestModal(false)}
          />
      )}
    </div>
    </PageTransition>
  );
};

export default BambooPlantingPage;
