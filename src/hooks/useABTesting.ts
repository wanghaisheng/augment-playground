// src/hooks/useABTesting.ts
import { useState, useEffect, useCallback } from 'react';
import {
  getUserVariant,
  getExperimentById,
  recordExperimentEvent,
} from '@/services/abTestingService';
import type { AbTestExperimentRecord, AbTestVariantRecord } from '@/types/ab-testing';
import { useAuth } from '@/context/AuthContext';

interface UseABTestingOptions {
  autoRecordViewEvent?: boolean;
}

interface UseABTestingResult<T> {
  experiment: AbTestExperimentRecord | null;
  variant: AbTestVariantRecord | null;
  value: T | null;
  isLoading: boolean;
  error: Error | null;
  recordEvent: (eventName: string, details?: Record<string, any>) => void;
}

export function useABTesting<T>(
  experimentIdParam: number,
  defaultValue: T,
  options?: UseABTestingOptions
): UseABTestingResult<T> {
  const [experiment, setExperiment] = useState<AbTestExperimentRecord | null>(null);
  const [variant, setVariant] = useState<AbTestVariantRecord | null>(null);
  const [value, setValue] = useState<T | null>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  const { autoRecordViewEvent = true } = options || {};

  const fetchExperimentData = useCallback(async () => {
    if (!userId || !experimentIdParam) {
      setIsLoading(false);
      if (!userId) {
        console.warn("useABTesting: userId is missing, cannot fetch experiment data.");
      }
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const expResult = await getExperimentById(experimentIdParam);
      setExperiment(expResult);

      if (expResult) {
        const userVariantResult = await getUserVariant(userId, expResult.id!);
        setVariant(userVariantResult);

        if (userVariantResult && userVariantResult.configJson) {
          try {
            const config = JSON.parse(userVariantResult.configJson);
            if (config && typeof config.value !== 'undefined') {
              setValue(config.value as T);
            } else {
              setValue(defaultValue);
            }
          } catch (parseError) {
            console.error('Failed to parse variant config JSON:', parseError, userVariantResult.configJson);
            setError(new Error('Failed to parse variant configuration.'));
            setValue(defaultValue);
          }
        } else {
          setValue(defaultValue);
        }

        if (autoRecordViewEvent && expResult && userVariantResult) {
          recordExperimentEvent(userId, expResult.id!, userVariantResult.id!, 'VIEWED', {});
        }
      } else {
        setValue(defaultValue);
        setVariant(null);
      }
    } catch (err) {
      console.error('Error fetching A/B testing data:', err);
      setError(err as Error);
      setValue(defaultValue);
    } finally {
      setIsLoading(false);
    }
  }, [userId, experimentIdParam, defaultValue, autoRecordViewEvent]);

  useEffect(() => {
    fetchExperimentData();
  }, [fetchExperimentData]);

  const handleRecordEvent = useCallback(
    (eventName: string, details?: Record<string, any>) => {
      if (experiment && variant && userId) {
        recordExperimentEvent(userId, experiment.id!, variant.id!, eventName, details || {});
      } else {
        console.warn('Cannot record A/B test event: experiment, variant, or userId not available.');
      }
    },
    [experiment, variant, userId]
  );

  return {
    experiment,
    variant,
    value,
    isLoading,
    error,
    recordEvent: handleRecordEvent,
  };
}
