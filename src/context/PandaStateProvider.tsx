// src/context/PandaStateProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  getPandaState,
  updatePandaMood,
  updatePandaEnergy,
  addPandaExperience,
  resetPandaState,
  type PandaStateRecord
} from '@/services/pandaStateService';
import {
  initializePandaAbilities,
  checkAndUnlockAbilities,
  getAllPandaAbilities,
  getUnlockedPandaAbilities,
  activateAbility,
  type PandaAbilityRecord
} from '@/services/pandaAbilityService';
import { useDataRefreshContext } from '@/context/DataRefreshProvider';
import type { PandaMood, EnergyLevel } from '@/components/game/PandaAvatar';

// 熊猫状态上下文类型
interface PandaStateContextType {
  pandaState: PandaStateRecord | null;
  abilities: PandaAbilityRecord[];
  unlockedAbilities: PandaAbilityRecord[];
  isLoading: boolean;
  error: Error | null;
  setMood: (mood: PandaMood) => Promise<void>;
  setEnergy: (energy: EnergyLevel) => Promise<void>;
  addExperience: (amount: number) => Promise<void>;
  resetState: () => Promise<void>;
  refreshState: () => Promise<void>;
  activateAbility: (abilityId: number) => Promise<void>;
  checkNewAbilities: () => Promise<PandaAbilityRecord[]>;
}

// 创建上下文
const PandaStateContext = createContext<PandaStateContextType | undefined>(undefined);

// Provider组件属性
interface PandaStateProviderProps {
  children: ReactNode;
}

/**
 * 熊猫状态Provider组件
 * 提供熊猫状态管理功能
 */
export const PandaStateProvider: React.FC<PandaStateProviderProps> = ({ children }) => {
  const [pandaState, setPandaState] = useState<PandaStateRecord | null>(null);
  const [abilities, setAbilities] = useState<PandaAbilityRecord[]>([]);
  const [unlockedAbilities, setUnlockedAbilities] = useState<PandaAbilityRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { registerRefreshListener } = useDataRefreshContext();

  // 初始加载熊猫状态和能力
  useEffect(() => {
    initializeSystem();
  }, []);

  // 初始化系统
  const initializeSystem = async () => {
    try {
      setIsLoading(true);

      // 加载熊猫状态
      try {
        await loadPandaState();
      } catch (stateErr) {
        console.error('Failed to load panda state:', stateErr);
      }

      // 加载熊猫能力
      try {
        await loadPandaAbilities();
      } catch (abilitiesErr) {
        console.error('Failed to load panda abilities:', abilitiesErr);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to initialize panda system:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize panda system'));
    } finally {
      setIsLoading(false);
    }
  };

  // 定义状态更新处理函数
  const handleStateUpdate = useCallback((stateData: any) => {
    if (stateData) {
      setPandaState(prevState => {
        if (!prevState) return stateData;
        return {
          ...prevState,
          ...stateData
        };
      });
    }
  }, []);

  // 定义能力更新处理函数
  const handleAbilityUpdate = useCallback(async (abilityData: any) => {
    // 只有当有特定的能力数据时才更新，避免无限循环
    if (abilityData && abilityData.id) {
      try {
        // 更新单个能力而不是重新加载所有能力
        setAbilities(prevAbilities => {
          const index = prevAbilities.findIndex(a => a.id === abilityData.id);
          if (index >= 0) {
            const newAbilities = [...prevAbilities];
            newAbilities[index] = { ...newAbilities[index], ...abilityData };
            return newAbilities;
          }
          return [...prevAbilities, abilityData];
        });

        // 更新已解锁能力列表
        if (abilityData.isUnlocked) {
          setUnlockedAbilities(prevUnlocked => {
            const index = prevUnlocked.findIndex(a => a.id === abilityData.id);
            if (index >= 0) {
              const newUnlocked = [...prevUnlocked];
              newUnlocked[index] = { ...newUnlocked[index], ...abilityData };
              return newUnlocked;
            }
            return [...prevUnlocked, abilityData];
          });
        } else {
          // 如果能力被锁定，从已解锁列表中移除
          setUnlockedAbilities(prevUnlocked =>
            prevUnlocked.filter(a => a.id !== abilityData.id)
          );
        }
      } catch (err) {
        console.error('Failed to update ability:', err);
      }
    }
  }, []);

  // 使用 useEffect 注册监听器
  useEffect(() => {
    // 注册监听器
    const unregisterState = registerRefreshListener('pandaState', handleStateUpdate);
    const unregisterAbility = registerRefreshListener('abilities', handleAbilityUpdate);

    return () => {
      unregisterState();
      unregisterAbility();
    };
  }, [registerRefreshListener, handleStateUpdate, handleAbilityUpdate]);

  // 加载熊猫状态
  const loadPandaState = async () => {
    try {
      const state = await getPandaState();
      setPandaState(state);

      // 检查是否有新解锁的能力
      if (state) {
        await checkAndUnlockAbilities(state.level);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to load panda state:', err);
      setError(err instanceof Error ? err : new Error('Failed to load panda state'));
    }
  };

  // 加载熊猫能力
  const loadPandaAbilities = async () => {
    try {
      // 初始化熊猫能力系统（只在第一次加载时初始化）
      await initializePandaAbilities();

      // 获取所有能力
      let allAbilities: PandaAbilityRecord[] = [];
      try {
        allAbilities = await getAllPandaAbilities();
      } catch (allErr) {
        console.error('Failed to get all abilities:', allErr);
        allAbilities = [];
      }

      // 安全地更新能力列表
      if (Array.isArray(allAbilities)) {
        // 只有当能力列表为空或长度不同时才更新状态
        if (abilities.length === 0 || abilities.length !== allAbilities.length) {
          setAbilities(allAbilities);
        }
      } else {
        console.error('getAllPandaAbilities did not return an array:', allAbilities);
        if (abilities.length === 0) {
          setAbilities([]);
        }
      }

      // 获取已解锁的能力
      let unlocked: PandaAbilityRecord[] = [];
      try {
        unlocked = await getUnlockedPandaAbilities();
      } catch (unlockErr) {
        console.error('Failed to load unlocked abilities:', unlockErr);
        unlocked = [];
      }

      // 安全地更新已解锁能力列表
      if (Array.isArray(unlocked)) {
        // 只有当解锁能力列表为空或长度不同时才更新状态
        if (unlockedAbilities.length === 0 || unlockedAbilities.length !== unlocked.length) {
          setUnlockedAbilities(unlocked);
        }
      } else {
        console.error('getUnlockedPandaAbilities did not return an array:', unlocked);
        if (unlockedAbilities.length === 0) {
          setUnlockedAbilities([]);
        }
      }

      setError(null);
    } catch (err) {
      console.error('Failed to load panda abilities:', err);
      setError(err instanceof Error ? err : new Error('Failed to load panda abilities'));
      // 设置默认空数组，防止UI错误
      if (abilities.length === 0) {
        setAbilities([]);
      }
      if (unlockedAbilities.length === 0) {
        setUnlockedAbilities([]);
      }
    }
  };

  // 设置熊猫情绪
  const setMood = async (mood: PandaMood) => {
    try {
      setIsLoading(true);
      const updatedState = await updatePandaMood(mood);
      setPandaState(updatedState);
    } catch (err) {
      console.error('Failed to update panda mood:', err);
      setError(err instanceof Error ? err : new Error('Failed to update panda mood'));
    } finally {
      setIsLoading(false);
    }
  };

  // 设置熊猫能量
  const setEnergy = async (energy: EnergyLevel) => {
    try {
      setIsLoading(true);
      const updatedState = await updatePandaEnergy(energy);
      setPandaState(updatedState);
    } catch (err) {
      console.error('Failed to update panda energy:', err);
      setError(err instanceof Error ? err : new Error('Failed to update panda energy'));
    } finally {
      setIsLoading(false);
    }
  };

  // 增加熊猫经验
  const addExperience = async (amount: number) => {
    try {
      setIsLoading(true);
      const updatedState = await addPandaExperience(amount);
      setPandaState(updatedState);

      // 检查是否有新解锁的能力
      if (updatedState) {
        await checkAndUnlockAbilities(updatedState.level);
        await loadPandaAbilities(); // 重新加载能力以更新状态
      }
    } catch (err) {
      console.error('Failed to add panda experience:', err);
      setError(err instanceof Error ? err : new Error('Failed to add panda experience'));
    } finally {
      setIsLoading(false);
    }
  };

  // 激活熊猫能力
  const handleActivateAbility = async (abilityId: number) => {
    try {
      setIsLoading(true);
      await activateAbility(abilityId);
      await loadPandaAbilities(); // 重新加载能力以更新状态
      setError(null);
    } catch (err) {
      console.error('Failed to activate ability:', err);
      setError(err instanceof Error ? err : new Error('Failed to activate ability'));
    } finally {
      setIsLoading(false);
    }
  };

  // 检查新解锁的能力
  const checkNewAbilities = async (): Promise<PandaAbilityRecord[]> => {
    try {
      if (!pandaState) {
        return [];
      }

      const newlyUnlocked = await checkAndUnlockAbilities(pandaState.level);
      await loadPandaAbilities(); // 重新加载能力以更新状态

      return newlyUnlocked;
    } catch (err) {
      console.error('Failed to check new abilities:', err);
      setError(err instanceof Error ? err : new Error('Failed to check new abilities'));
      return [];
    }
  };

  // 重置熊猫状态
  const resetState = async () => {
    try {
      setIsLoading(true);
      const resetedState = await resetPandaState();
      setPandaState(resetedState);
    } catch (err) {
      console.error('Failed to reset panda state:', err);
      setError(err instanceof Error ? err : new Error('Failed to reset panda state'));
    } finally {
      setIsLoading(false);
    }
  };

  // 刷新熊猫状态
  const refreshState = async () => {
    await loadPandaState();
  };

  // 提供上下文值
  const contextValue: PandaStateContextType = {
    pandaState,
    abilities,
    unlockedAbilities,
    isLoading,
    error,
    setMood,
    setEnergy,
    addExperience,
    resetState,
    refreshState,
    activateAbility: handleActivateAbility,
    checkNewAbilities
  };

  return (
    <PandaStateContext.Provider value={contextValue}>
      {children}
    </PandaStateContext.Provider>
  );
};

/**
 * 使用熊猫状态的Hook
 * @returns 熊猫状态上下文
 */
export const usePandaState = (): PandaStateContextType => {
  const context = useContext(PandaStateContext);
  if (context === undefined) {
    throw new Error('usePandaState must be used within a PandaStateProvider');
  }
  return context;
};
