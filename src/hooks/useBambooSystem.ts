// src/hooks/useBambooSystem.ts
import { useState, useEffect, useCallback } from 'react';
import { useDataRefresh, useDataRefreshTrigger } from './useDataRefresh';
import { 
  getAllPlots, 
  getAllSeeds, 
  getPlantsInPlot, 
  plantBamboo,
  waterPlant,
  fertilizePlant,
  harvestBamboo,
  updatePlantGrowth,
  unlockPlot,
  upgradePlot,
  unlockSeed
} from '@/services/bambooPlantingService';
import {
  getTradeableResources,
  getTradeRate,
  getTradeHistory,
  tradeBambooForResource,
  tradeResourceForBamboo
} from '@/services/bambooTradingService';
import { getUserCurrency } from '@/services/storeService';
import { 
  BambooPlotRecord, 
  BambooSeedRecord, 
  BambooPlantRecord,
  TradeableResourceRecord,
  TradeRateRecord,
  BambooTradeRecord
} from '@/db-old';

// Default user ID (in a real app, this would come from authentication)
const DEFAULT_USER_ID = 'current-user';

/**
 * Hook for accessing bamboo planting and trading functionality
 */
export function useBambooSystem(userId: string = DEFAULT_USER_ID) {
  const triggerRefresh = useDataRefreshTrigger();
  const listenedTables = [
    'bambooPlots', 
    'userCurrencies', 
    'bambooSeeds', 
    'bambooPlants', 
    'tradeHistory',
    // Add any other tables that this system might cause to refresh or needs to react to
  ];
  const lastRefreshEvent = useDataRefresh(listenedTables);
  
  // Bamboo planting state
  const [plots, setPlots] = useState<BambooPlotRecord[]>([]);
  const [seeds, setSeeds] = useState<BambooSeedRecord[]>([]);
  const [plants, setPlants] = useState<BambooPlantRecord[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
  const [isLoadingPlanting, setIsLoadingPlanting] = useState(true);
  
  // Bamboo trading state
  const [resources, setResources] = useState<TradeableResourceRecord[]>([]);
  const [tradeRates, setTradeRates] = useState<Map<number, TradeRateRecord>>(new Map());
  const [tradeHistory, setTradeHistory] = useState<BambooTradeRecord[]>([]);
  const [isLoadingTrading, setIsLoadingTrading] = useState(true);
  
  // User currency state
  const [bambooCount, setBambooCount] = useState(0);
  const [coinsCount, setCoinsCount] = useState(0);
  const [jadeCount, setJadeCount] = useState(0);
  
  // Load bamboo planting data
  const loadPlantingData = useCallback(async () => {
    setIsLoadingPlanting(true);
    try {
      // Get plots
      const plotsData = await getAllPlots(userId);
      setPlots(plotsData);
      
      // Get seeds
      const seedsData = await getAllSeeds();
      setSeeds(seedsData);
      
      // If there's a selected plot, get its plants
      if (selectedPlotId) {
        const plantsData = await getPlantsInPlot(userId, selectedPlotId);
        setPlants(plantsData);
      } else if (plotsData.length > 0) {
        // If no plot is selected but plots exist, select the first unlocked one
        const unlockedPlot = plotsData.find(plot => plot.isUnlocked);
        if (unlockedPlot) {
          setSelectedPlotId(unlockedPlot.id!);
          const plantsData = await getPlantsInPlot(userId, unlockedPlot.id!);
          setPlants(plantsData);
        }
      }
      
      // Update plant growth
      await updatePlantGrowth(userId);
    } catch (error) {
      console.error('Failed to load bamboo planting data:', error);
    } finally {
      setIsLoadingPlanting(false);
    }
  }, [userId, selectedPlotId]);
  
  // Load bamboo trading data
  const loadTradingData = useCallback(async () => {
    setIsLoadingTrading(true);
    try {
      // Get tradeable resources
      const resourcesData = await getTradeableResources();
      setResources(resourcesData);
      
      // Get trade rates for each resource
      const ratesMap = new Map<number, TradeRateRecord>();
      for (const resource of resourcesData) {
        const rate = await getTradeRate(resource.id!);
        if (rate) {
          ratesMap.set(resource.id!, rate);
        }
      }
      setTradeRates(ratesMap);
      
      // Get trade history
      const historyData = await getTradeHistory(userId);
      setTradeHistory(historyData);
    } catch (error) {
      console.error('Failed to load bamboo trading data:', error);
    } finally {
      setIsLoadingTrading(false);
    }
  }, [userId]);
  
  // Load user currency
  const loadUserCurrency = useCallback(async () => {
    try {
      const currency = await getUserCurrency(userId);
      if (currency) {
        setBambooCount(currency.bamboo || 0);
        setCoinsCount(currency.coins || 0);
        setJadeCount(currency.jade || 0);
      }
    } catch (error) {
      console.error('Failed to load user currency:', error);
    }
  }, [userId]);
  
  // Load all data
  useEffect(() => {
    loadPlantingData();
    loadTradingData();
    loadUserCurrency();
  }, [loadPlantingData, loadTradingData, loadUserCurrency, lastRefreshEvent]);
  
  // When selected plot changes, load its plants
  useEffect(() => {
    if (selectedPlotId) {
      getPlantsInPlot(userId, selectedPlotId)
        .then(plantsData => setPlants(plantsData))
        .catch(error => console.error('Failed to load plants for plot:', error));
    } else {
      setPlants([]);
    }
  }, [userId, selectedPlotId]);
  
  // Planting actions
  const handleSelectPlot = useCallback((plotId: number) => {
    setSelectedPlotId(plotId);
  }, []);
  
  const handleUnlockPlot = useCallback(async (plotId: number) => {
    try {
      const success = await unlockPlot(userId, plotId);
      if (success) {
        triggerRefresh('bambooPlots');
        triggerRefresh('userCurrencies');
        await loadPlantingData();
        await loadUserCurrency();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unlock plot:', error);
      return false;
    }
  }, [userId, loadPlantingData, loadUserCurrency, triggerRefresh]);
  
  const handleUpgradePlot = useCallback(async (plotId: number) => {
    try {
      const success = await upgradePlot(userId, plotId);
      if (success) {
        triggerRefresh('bambooPlots');
        triggerRefresh('userCurrencies');
        await loadPlantingData();
        await loadUserCurrency();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to upgrade plot:', error);
      return false;
    }
  }, [userId, loadPlantingData, loadUserCurrency, triggerRefresh]);
  
  const handleUnlockSeed = useCallback(async (seedId: number) => {
    try {
      const success = await unlockSeed(userId, seedId);
      if (success) {
        triggerRefresh('bambooSeeds');
        triggerRefresh('userCurrencies');
        await loadPlantingData();
        await loadUserCurrency();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unlock seed:', error);
      return false;
    }
  }, [userId, loadPlantingData, loadUserCurrency, triggerRefresh]);
  
  const handlePlantBamboo = useCallback(async (plotId: number, seedId: number) => {
    try {
      const plant = await plantBamboo(userId, plotId, seedId);
      if (plant) {
        triggerRefresh('bambooPlants', { plotId });
        triggerRefresh('userCurrencies');
        await loadPlantingData();
        await loadUserCurrency();
        return plant;
      }
      return null;
    } catch (error) {
      console.error('Failed to plant bamboo:', error);
      return null;
    }
  }, [userId, loadPlantingData, loadUserCurrency, triggerRefresh]);
  
  const handleWaterPlant = useCallback(async (plantId: number) => {
    try {
      const success = await waterPlant(userId, plantId);
      if (success) {
        triggerRefresh('bambooPlants', { plantId });
        await loadPlantingData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to water plant:', error);
      return false;
    }
  }, [userId, loadPlantingData, triggerRefresh]);
  
  const handleFertilizePlant = useCallback(async (plantId: number, itemId?: string) => {
    try {
      const success = await fertilizePlant(userId, plantId, itemId);
      if (success) {
        triggerRefresh('bambooPlants', { plantId });
        triggerRefresh('userCurrencies');
        await loadPlantingData();
        await loadUserCurrency();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to fertilize plant:', error);
      return false;
    }
  }, [userId, loadPlantingData, loadUserCurrency, triggerRefresh]);
  
  const handleHarvestBamboo = useCallback(async (plantId: number) => {
    try {
      const harvestedAmount = await harvestBamboo(userId, plantId);
      if (harvestedAmount > 0) {
        triggerRefresh('bambooPlants', { plantId });
        triggerRefresh('userCurrencies');
        await loadPlantingData();
        await loadUserCurrency();
        return harvestedAmount;
      }
      return 0;
    } catch (error) {
      console.error('Failed to harvest bamboo:', error);
      return 0;
    }
  }, [userId, loadPlantingData, loadUserCurrency, triggerRefresh]);
  
  // Trading actions
  const handleTradeBambooForResource = useCallback(async (resourceId: number, amount: number) => {
    try {
      const success = await tradeBambooForResource(userId, resourceId, amount);
      if (success) {
        triggerRefresh('userCurrencies');
        triggerRefresh('tradeHistory');
        await loadTradingData();
        await loadUserCurrency();
        return amount;
      }
      return false;
    } catch (error) {
      console.error('Failed to trade bamboo for resource:', error);
      return false;
    }
  }, [userId, loadTradingData, loadUserCurrency, triggerRefresh]);
  
  const handleTradeResourceForBamboo = useCallback(async (resourceId: number, amount: number) => {
    try {
      const success = await tradeResourceForBamboo(userId, resourceId, amount);
      if (success) {
        triggerRefresh('userCurrencies');
        triggerRefresh('tradeHistory');
        await loadTradingData();
        await loadUserCurrency();
        return amount;
      }
      return false;
    } catch (error) {
      console.error('Failed to trade resource for bamboo:', error);
      return false;
    }
  }, [userId, loadTradingData, loadUserCurrency, triggerRefresh]);
  
  return {
    // State
    plots,
    seeds,
    plants,
    resources,
    tradeRates,
    tradeHistory,
    bambooCount,
    coinsCount,
    jadeCount,
    selectedPlotId,
    isLoadingPlanting,
    isLoadingTrading,
    
    // Planting actions
    selectPlot: handleSelectPlot,
    unlockPlot: handleUnlockPlot,
    upgradePlot: handleUpgradePlot,
    unlockSeed: handleUnlockSeed,
    plantBamboo: handlePlantBamboo,
    waterPlant: handleWaterPlant,
    fertilizePlant: handleFertilizePlant,
    harvestBamboo: handleHarvestBamboo,
    
    // Trading actions
    tradeBambooForResource: handleTradeBambooForResource,
    tradeResourceForBamboo: handleTradeResourceForBamboo,
    
    // Refresh functions
    refreshPlantingData: loadPlantingData,
    refreshTradingData: loadTradingData,
    refreshUserCurrency: loadUserCurrency
  };
}
