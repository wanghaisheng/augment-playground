// src/services/abTestingService.ts
import { db } from '@/db-old';
import { addSyncItem } from '@/services/dataSyncService';
import Dexie from 'dexie';
import { 
  ExperimentStatus, 
  VariantType, 
  type ExperimentGoal, 
  type AbTestExperimentRecord as ExperimentRecord, // Use AbTestExperimentRecord as ExperimentRecord
  type AbTestVariantRecord as VariantRecord, // Use AbTestVariantRecord as VariantRecord
  type UserAbTestAssignmentRecord as UserExperimentRecord, // Use UserAbTestAssignmentRecord as UserExperimentRecord
  type AbTestExperimentRecord,
  type AbTestVariantRecord,
  type UserAbTestAssignmentRecord
} from '@/types/ab-testing'; // Import from centralized types

/**
 * 实验事件记录接口
 */
export interface ExperimentEventRecord {
  id?: number;
  userId: string;
  experimentId: number;
  variantId: number;
  eventType: string;
  eventData: string; // JSON string
  timestamp: Date;
}

/**
 * 初始化A/B测试系统
 */
export async function initializeABTestingSystem(): Promise<void> {
  try {
    // Table creation is handled by Dexie schema in db.ts
    // Check if default experiments/variants need to be seeded if tables are empty.
    const experimentCount = await db.abTestExperiments.count();
    if (experimentCount === 0) {
      // Optionally seed initial data here
      console.log('AB Testing system initialized, no pre-existing experiments.');
    } else {
      console.log('AB Testing system initialized.');
    }
  } catch (err) {
    console.error('Failed to initialize AB testing system:', err);
  }
}

/**
 * 创建新实验
 * @param experiment 实验数据
 * @returns 创建的实验记录
 */
export async function createExperiment(experiment: Omit<ExperimentRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExperimentRecord> {
  try {
    const now = new Date();
    const newExperiment: ExperimentRecord = {
      ...experiment,
      createdAt: now,
      updatedAt: now
    };
    
    const id = await db.abTestExperiments.add(newExperiment as AbTestExperimentRecord); // Cast to ensure correct type for Dexie
    const createdExperiment = { ...newExperiment, id: id as number };
    
    await addSyncItem('abTestExperiments', 'create', createdExperiment);
    
    return createdExperiment;
  } catch (err) {
    console.error('Failed to create experiment:', err);
    throw err;
  }
}

/**
 * 更新实验
 * @param experimentId 实验ID
 * @param updates 更新数据
 * @returns 更新后的实验记录
 */
export async function updateExperiment(experimentId: number, updates: Partial<ExperimentRecord>): Promise<ExperimentRecord> {
  try {
    const existingExperiment = await db.abTestExperiments.get(experimentId);
    if (!existingExperiment) {
      throw new Error(`Experiment with ID ${experimentId} not found.`);
    }

    const updatedExperimentData: Partial<AbTestExperimentRecord> = { ...updates };
    if (updates.updatedAt === undefined) {
      updatedExperimentData.updatedAt = new Date();
    }
    
    await db.abTestExperiments.update(experimentId, updatedExperimentData);
    const finalExperiment = await db.abTestExperiments.get(experimentId);
    if (!finalExperiment) throw new Error('Failed to retrieve updated experiment');
    
    await addSyncItem('abTestExperiments', 'update', finalExperiment);
    
    return finalExperiment as ExperimentRecord; // Cast back
  } catch (err) {
    console.error('Failed to update experiment:', err);
    throw err;
  }
}

/**
 * 获取所有实验
 * @param status 可选的状态筛选
 * @returns 实验记录列表
 */
export async function getAllExperiments(status?: ExperimentStatus): Promise<ExperimentRecord[]> {
  try {
    let query: Dexie.Table<AbTestExperimentRecord, number> | Dexie.Collection<AbTestExperimentRecord, number> = db.abTestExperiments;
    
    if (status) {
      query = query.where('status').equals(status);
    }
    
    const experiments = await query.toArray();
    return experiments as ExperimentRecord[]; // Cast result array
  } catch (err) {
    console.error('Failed to get experiments:', err);
    return [];
  }
}

/**
 * 获取实验详情
 * @param experimentId 实验ID
 * @returns 实验记录
 */
export async function getExperimentById(experimentId: number): Promise<ExperimentRecord | null> {
  try {
    const experiment = await db.abTestExperiments.get(experimentId);
    return experiment ? experiment as ExperimentRecord : null;
  } catch (err) {
    console.error(`Failed to get experiment with ID ${experimentId}:`, err);
    return null;
  }
}

/**
 * 创建实验变体
 * @param variant 变体数据
 * @returns 创建的变体记录
 */
export async function createVariant(variantData: Omit<VariantRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<VariantRecord> {
  try {
    const now = new Date();
    const newVariant: VariantRecord = {
      ...variantData,
      createdAt: now,
      updatedAt: now
    };
    
    const id = await db.abTestVariants.add(newVariant as AbTestVariantRecord);
    const createdVariant = { ...newVariant, id: id as number };
    
    await addSyncItem('abTestVariants', 'create', createdVariant);
    
    return createdVariant;
  } catch (err) {
    console.error('Failed to create variant:', err);
    throw err;
  }
}

/**
 * 获取实验的所有变体
 * @param experimentId 实验ID
 * @returns 变体记录列表
 */
export async function getVariantsByExperimentId(experimentId: number): Promise<VariantRecord[]> {
  try {
    const variants = await db.abTestVariants
      .where('experimentId')
      .equals(experimentId)
      .toArray();
    return variants as VariantRecord[];
  } catch (err) {
    console.error(`Failed to get variants for experiment ${experimentId}:`, err);
    return [];
  }
}

/**
 * 为用户分配实验变体
 * @param userId 用户ID
 * @param experimentId 实验ID
 * @returns 分配的变体记录
 */
export async function assignUserToExperiment(userId: string, experimentId: number): Promise<VariantRecord | null> {
  try {
    const existingAssignment = await db.userAbTestAssignments
      .where('userId')
      .equals(userId)
      .and(record => record.experimentId === experimentId)
      .first();
    
    if (existingAssignment) {
      const variant = await db.abTestVariants.get(existingAssignment.variantId);
      return variant ? variant as VariantRecord : null;
    }
    
    const experiment = await getExperimentById(experimentId);
    // Ensure to use properties from AbTestExperimentRecord like sampleSizePercentage
    if (!experiment || experiment.status !== ExperimentStatus.RUNNING) { // Use RUNNING from imported enum
      return null;
    }
    
    const variants = await getVariantsByExperimentId(experimentId);
    if (variants.length === 0) {
      return null;
    }
    
    const variant = selectVariantByAllocation(variants); // Renamed from selectVariantByWeight for clarity
    if (!variant) {
      return null;
    }
    
    const now = new Date();
    const userExperimentAssignment: UserExperimentRecord = {
      userId,
      experimentId,
      variantId: variant.id!,
      assignedAt: now,
      // conversionEvents will be initialized by its type definition (optional)
      createdAt: now, // Add createdAt
      updatedAt: now // Add updatedAt
    };
    
    await db.userAbTestAssignments.add(userExperimentAssignment as UserAbTestAssignmentRecord);
    
    await addSyncItem('userAbTestAssignments', 'create', userExperimentAssignment);
    
    await recordExperimentEvent(userId, experimentId, variant.id!, 'assigned', {});
    
    return variant;
  } catch (err) {
    console.error(`Failed to assign user ${userId} to experiment ${experimentId}:`, err);
    return null;
  }
}

// Renamed for clarity, using allocationPercentage
function selectVariantByAllocation(variants: VariantRecord[]): VariantRecord | null {
  if (variants.length === 0) {
    return null;
  }
  
  const totalAllocation = variants.reduce((sum, variant) => sum + variant.allocationPercentage, 0);
  if (totalAllocation !== 100 && totalAllocation !== 0) { // Allow 0 if no variants have allocation yet
      console.warn(`Sum of variant allocations for experiment is ${totalAllocation}, not 100.`);
      // Potentially re-normalize or handle error, for now, proceed with selection
  }
  
  let random = Math.random() * totalAllocation; // Use totalAllocation which might not be 100
  if (totalAllocation === 0 && variants.length > 0) { // If all allocations are 0, pick one randomly
      return variants[Math.floor(Math.random() * variants.length)];
  }


  for (const variant of variants) {
    if (random < variant.allocationPercentage) {
      return variant;
    }
    random -= variant.allocationPercentage;
  }
  
  // Fallback, though ideally, the loop should always find one if totalAllocation > 0
  return variants.length > 0 ? variants[variants.length -1] : null;
}

/**
 * 获取用户的实验变体
 * @param userId 用户ID
 * @param experimentId 实验ID
 * @returns 变体记录
 */
export async function getUserVariant(userId: string, experimentId: number): Promise<VariantRecord | null> {
  try {
    const assignment = await db.userAbTestAssignments
      .where('[userId+experimentId]')
      .equals([userId, experimentId])
      .first();
    
    if (assignment) {
      const variant = await db.abTestVariants.get(assignment.variantId);
      return variant ? variant as VariantRecord : null;
    }
    return null;
  } catch (err) {
    console.error(`Failed to get user variant for experiment ${experimentId}:`, err);
    return null;
  }
}

/**
 * 记录实验事件
 * @param userId 用户ID
 * @param experimentId 实验ID
 * @param variantId 变体ID
 * @param eventType 事件类型
 * @param eventData 事件数据
 * @returns 创建的事件记录
 */
export async function recordExperimentEvent(
  userId: string,
  experimentId: number,
  variantId: number,
  eventType: string,
  eventData: Record<string, any>
): Promise<ExperimentEventRecord> {
  try {
    const now = new Date();
    const eventRecord: ExperimentEventRecord = {
      userId,
      experimentId,
      variantId,
      eventType,
      eventData: JSON.stringify(eventData),
      timestamp: now
    };
    
    const id = await db.abTestEvents.add(eventRecord); // Assuming db.abTestEvents table
    const createdEvent = { ...eventRecord, id: id as number };
    
    await addSyncItem('abTestEvents', 'create', createdEvent);
    
    // Update user's experiment assignment if it's a conversion event
    if (eventType === 'conversion') { // This is a simple check, might need more robust goal checking
      await updateUserExperimentConversion(userId, experimentId, variantId, eventData);
    }
    await updateUserExperimentInteraction(userId, experimentId);


    return createdEvent;
  } catch (err) {
    console.error('Failed to record experiment event:', err);
    throw err;
  }
}

/**
 * 更新用户实验转化状态
 * @param userId 用户ID
 * @param experimentId 实验ID
 * @param variantId 变体ID
 * @param eventData 事件数据
 */
async function updateUserExperimentConversion(
  userId: string,
  experimentId: number,
  variantId: number, // Added variantId to ensure we update the correct assignment record.
  eventData: Record<string, any> // Contains goalId
): Promise<void> {
  try {
    const assignment = await db.userAbTestAssignments
      .where('[userId+experimentId+variantId]') // Query by variantId too
      .equals([userId, experimentId, variantId])
      .first();
      
    if (assignment) {
      const goalId = eventData.goalId || 'default_goal'; // Extract goalId or use a default
      
      const updatedConversionEvents = {
        ...(assignment.conversionEvents || {}), // Existing events (should be object, not string)
        [goalId]: new Date() 
      };

      await db.userAbTestAssignments.update(assignment.id!, {
        hasConverted: true, // General conversion flag
        conversionEvents: updatedConversionEvents,
        updatedAt: new Date()
      });
      await addSyncItem('userAbTestAssignments', 'update', { id: assignment.id!, hasConverted: true, conversionEvents: updatedConversionEvents, updatedAt: new Date() });
    }
  } catch (err) {
    console.error('Failed to update user experiment conversion:', err);
  }
}

/**
 * 更新用户实验最后交互时间
 * @param userId 用户ID
 * @param experimentId 实验ID
 */
async function updateUserExperimentInteraction(userId: string, experimentId: number): Promise<void> {
  try {
    const assignment = await db.userAbTestAssignments
      .where('[userId+experimentId]')
      .equals([userId, experimentId])
      .first(); // This might pick any variant if user is in multiple variants of same exp (not typical)

    if (assignment) {
      await db.userAbTestAssignments.update(assignment.id!, { 
        lastInteractionAt: new Date(),
        updatedAt: new Date()
      });
      await addSyncItem('userAbTestAssignments', 'update', { id: assignment.id!, lastInteractionAt: new Date(), updatedAt: new Date() });
    }
  } catch (err) {
    console.error('Failed to update user experiment interaction:', err);
  }
}

/**
 * 标记用户已查看实验
 * @param userId 用户ID
 * @param experimentId 实验ID
 */
export async function markExperimentAsViewed(userId: string, experimentId: number): Promise<void> {
  try {
    // This function might need to update a specific assignment if a user could somehow be assigned to multiple variants.
    // For now, assume one assignment per user-experiment.
    const assignment = await db.userAbTestAssignments
      .where('[userId+experimentId]')
      .equals([userId, experimentId])
      .first();
    
    if (assignment && !assignment.lastViewedAt) {
      await db.userAbTestAssignments.update(assignment.id!, { 
        lastViewedAt: new Date(),
        updatedAt: new Date()
      });
      await addSyncItem('userAbTestAssignments', 'update', { id: assignment.id!, lastViewedAt: new Date(), updatedAt: new Date() });
    }
  } catch (err) {
    console.error('Failed to mark experiment as viewed:', err);
  }
}

/**
 * 获取实验结果
 * @param experimentId 实验ID
 * @returns 实验结果
 */
export async function getExperimentResults(experimentId: number): Promise<any> {
  try {
    const experiment = await db.abTestExperiments.get(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }

    const variants = await db.abTestVariants.where('experimentId').equals(experimentId).toArray();
    const assignments = await db.userAbTestAssignments.where('experimentId').equals(experimentId).toArray();

    const results: Record<string, {
      name: string;
      assignments: number;
      conversions: Record<string, number>; // goalId -> count
      conversionRate: Record<string, number>; // goalId -> rate
      totalInteractions: number; // Not directly tracked per variant, but could be aggregated
    }> = {};

    for (const variant of variants) {
      results[variant.id!] = {
        name: variant.name,
        assignments: 0,
        conversions: {},
        conversionRate: {},
        totalInteractions: 0, // Placeholder
      };
    }
    
    const experimentGoals = experiment.goals.map(g => g.id);

    for (const assignment of assignments) {
      if (results[assignment.variantId]) {
        results[assignment.variantId].assignments++;
        if (assignment.conversionEvents) {
          // Ensure conversionEvents is an object
          const events = typeof assignment.conversionEvents === 'string' 
            ? JSON.parse(assignment.conversionEvents) // Should already be an object based on type def
            : assignment.conversionEvents;

          for (const goalId in events) {
            if (experimentGoals.includes(goalId)) {
              results[assignment.variantId].conversions[goalId] = (results[assignment.variantId].conversions[goalId] || 0) + 1;
            }
          }
        }
      }
    }

    for (const variantId in results) {
      const variantResult = results[variantId];
      for (const goalId of experimentGoals) {
        const conversions = variantResult.conversions[goalId] || 0;
        variantResult.conversionRate[goalId] = variantResult.assignments > 0 ? (conversions / variantResult.assignments) : 0;
      }
    }

    return {
      experimentName: experiment.name,
      status: experiment.status,
      results
    };
  } catch (err) {
    console.error(`Failed to get results for experiment ${experimentId}:`, err);
    return null;
  }
}

// Additional functions might be needed for managing experiment lifecycle (pause, complete, archive)
// and for more detailed analytics.
