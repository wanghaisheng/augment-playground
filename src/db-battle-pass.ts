// src/db-battle-pass.ts
import { db } from './db';
import { tursoClient } from './db-turso';

/**
 * Updates the Dexie database schema to include Battle Pass tables
 *
 * @returns A promise that resolves when the schema update is complete
 */
export async function updateDexieSchemaForBattlePass(): Promise<void> {
  // Check if we need to update the schema
  const currentVersion = db.verno;
  const newVersion = currentVersion + 1;

  // Only update if the schema doesn't already include these tables
  if (!db.tables.some(table => table.name === 'battlePasses')) {
    // Create a new version with the Battle Pass tables
    db.version(newVersion).stores({
      // Existing tables remain unchanged

      // Battle Pass tables
      battlePasses: '++id, seasonName, startDate, endDate, isActive',
      battlePassLevels: '++id, passId, levelNumber, freeRewardItemId, paidRewardItemId, requiredExp',
      battlePassTasks: '++id, passId, taskType, targetValue, expReward, isRepeatable',
      userBattlePassOwnership: '++id, userId, passId, purchaseDate, transactionId, passType',
      userBattlePassProgress: '++id, userId, passId, currentLevel, currentExp, claimedFreeLevels, claimedPaidLevels',
      battlePassTaskProgress: '++id, userId, taskId, currentValue, lastUpdated, isCompleted'
    });

    console.log(`Updated Dexie schema to version ${newVersion} with Battle Pass tables`);
  }
}

/**
 * Creates Battle Pass tables in Turso database
 *
 * @returns A promise that resolves when the tables are created
 * @throws Error if table creation fails
 */
export async function createTursoTablesForBattlePass(): Promise<void> {
  try {
    // Create battle_passes table
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS battle_passes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season_name TEXT NOT NULL,
        season_description TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        max_level INTEGER NOT NULL,
        theme_visual_asset_key TEXT,
        season_theme TEXT,
        standard_pass_product_id TEXT,
        premium_pass_product_id TEXT,
        level_purchase_diamond_cost INTEGER,
        is_active INTEGER NOT NULL DEFAULT 0
      )
    `);

    // Create battle_pass_levels table
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS battle_pass_levels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pass_id INTEGER NOT NULL,
        level_number INTEGER NOT NULL,
        free_reward_item_id INTEGER,
        free_reward_quantity INTEGER,
        paid_reward_item_id INTEGER,
        paid_reward_quantity INTEGER,
        required_exp INTEGER NOT NULL,
        FOREIGN KEY (pass_id) REFERENCES battle_passes(id) ON DELETE CASCADE,
        UNIQUE(pass_id, level_number)
      )
    `);

    // Create battle_pass_tasks table
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS battle_pass_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pass_id INTEGER NOT NULL,
        task_name TEXT NOT NULL,
        task_type TEXT NOT NULL,
        target_value INTEGER NOT NULL,
        exp_reward INTEGER NOT NULL,
        related_game_action_key TEXT,
        is_repeatable INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (pass_id) REFERENCES battle_passes(id) ON DELETE CASCADE
      )
    `);

    // Create user_battle_pass_ownership table
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS user_battle_pass_ownership (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        pass_id INTEGER NOT NULL,
        purchase_date TEXT NOT NULL,
        platform_transaction_id TEXT,
        pass_type TEXT NOT NULL,
        FOREIGN KEY (pass_id) REFERENCES battle_passes(id) ON DELETE CASCADE,
        UNIQUE(user_id, pass_id)
      )
    `);

    // Create user_battle_pass_progress table
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS user_battle_pass_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        pass_id INTEGER NOT NULL,
        current_level INTEGER NOT NULL DEFAULT 1,
        current_exp INTEGER NOT NULL DEFAULT 0,
        claimed_free_levels TEXT,
        claimed_paid_levels TEXT,
        FOREIGN KEY (pass_id) REFERENCES battle_passes(id) ON DELETE CASCADE,
        UNIQUE(user_id, pass_id)
      )
    `);

    // Create battle_pass_task_progress table
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS battle_pass_task_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        task_id INTEGER NOT NULL,
        current_value INTEGER NOT NULL DEFAULT 0,
        last_updated TEXT NOT NULL,
        is_completed INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (task_id) REFERENCES battle_pass_tasks(id) ON DELETE CASCADE,
        UNIQUE(user_id, task_id)
      )
    `);

    console.log('Created Battle Pass tables in Turso database');
  } catch (error) {
    console.error('Error creating Battle Pass tables in Turso:', error);
    throw error;
  }
}

/**
 * Initialize the database schema for Battle Pass
 * This function should be called during app initialization
 *
 * @returns A promise that resolves to true if initialization is successful, false otherwise
 */
export async function initializeBattlePassDatabase(): Promise<boolean> {
  try {
    // Update Dexie schema
    await updateDexieSchemaForBattlePass();

    // Create Turso tables
    await createTursoTablesForBattlePass();

    return true;
  } catch (error) {
    console.error('Failed to initialize Battle Pass database:', error);
    return false;
  }
}
