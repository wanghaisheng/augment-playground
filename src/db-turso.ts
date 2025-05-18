// src/db-turso.ts
import { createClient } from '@libsql/client';

// 创建Turso客户端
export const tursoClient = createClient({
  url: import.meta.env.VITE_TURSO_DATABASE_URL || 'libsql://your-database-url.turso.io',
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN || 'your-auth-token',
});

// 初始化数据库模式
export async function initializeSchema() {
  try {
    console.log('Initializing Turso database schema...');

    // 创建uiLabels表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS ui_labels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scope_key TEXT NOT NULL,
        label_key TEXT NOT NULL,
        language_code TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        UNIQUE(scope_key, label_key, language_code)
      )
    `);

    // 创建panda_state表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS panda_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mood TEXT NOT NULL,
        energy TEXT NOT NULL,
        last_updated TEXT NOT NULL,
        level INTEGER NOT NULL,
        experience INTEGER NOT NULL DEFAULT 0
      )
    `);

    // 创建task_categories表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS task_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        icon TEXT,
        is_default INTEGER NOT NULL DEFAULT 0
      )
    `);

    // 创建tasks表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category_id INTEGER,
        priority TEXT NOT NULL,
        status TEXT NOT NULL,
        due_date TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES task_categories(id)
      )
    `);

    // 创建subtasks表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS subtasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_task_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        status TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);

    // 创建task_completions表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS task_completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        completed_at TEXT NOT NULL,
        experience_gained INTEGER NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);

    // 创建task_reminders表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS task_reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        reminder_time TEXT NOT NULL,
        is_viewed INTEGER NOT NULL DEFAULT 0,
        is_completed INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);

    // 创建rewards表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        rarity TEXT NOT NULL,
        task_id INTEGER,
        obtained_at TEXT NOT NULL,
        is_viewed INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
      )
    `);

    // 创建items表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        rarity TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        obtained_at TEXT NOT NULL
      )
    `);

    // 创建badges表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rarity TEXT NOT NULL,
        obtained_at TEXT NOT NULL,
        is_equipped INTEGER NOT NULL DEFAULT 0
      )
    `);

    // 创建abilities表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS abilities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        effect_type TEXT NOT NULL,
        required_level INTEGER NOT NULL,
        is_unlocked INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 0
      )
    `);

    // 创建reward_abilities表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS reward_abilities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rarity TEXT NOT NULL,
        obtained_at TEXT NOT NULL,
        is_unlocked INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 0
      )
    `);

    // 创建panda_accessories表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS panda_accessories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        image_path TEXT NOT NULL,
        overlay_path TEXT,
        is_equipped INTEGER NOT NULL DEFAULT 0,
        is_owned INTEGER NOT NULL DEFAULT 0,
        obtained_at TEXT,
        store_item_id INTEGER,
        rarity TEXT NOT NULL,
        theme_type TEXT NOT NULL
      )
    `);

    // 创建panda_environments表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS panda_environments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        background_path TEXT NOT NULL,
        foreground_path TEXT,
        ambient_sound TEXT,
        is_active INTEGER NOT NULL DEFAULT 0,
        is_owned INTEGER NOT NULL DEFAULT 0,
        obtained_at TEXT,
        store_item_id INTEGER,
        rarity TEXT NOT NULL,
        theme_type TEXT NOT NULL,
        interactive_elements TEXT
      )
    `);

    // 创建challenges表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        status TEXT NOT NULL,
        progress REAL NOT NULL DEFAULT 0,
        start_date TEXT,
        end_date TEXT,
        created_at TEXT NOT NULL
      )
    `);

    // 创建challenge_categories表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS challenge_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        icon_path TEXT
      )
    `);

    // 创建challenge_completions表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS challenge_completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        challenge_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        completed_date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
      )
    `);

    // 创建challenge_discoveries表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS challenge_discoveries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        challenge_id INTEGER NOT NULL,
        discovered_at TEXT NOT NULL,
        is_viewed INTEGER NOT NULL DEFAULT 0,
        is_accepted INTEGER NOT NULL DEFAULT 0,
        expires_at TEXT,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
      )
    `);

    // 创建reflections表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS reflections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        task_id INTEGER,
        mood TEXT NOT NULL,
        reflection TEXT,
        action TEXT,
        created_at TEXT NOT NULL,
        is_completed INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
      )
    `);

    // 创建reflection_triggers表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS reflection_triggers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL,
        is_viewed INTEGER NOT NULL DEFAULT 0,
        is_completed INTEGER NOT NULL DEFAULT 0
      )
    `);

    // 创建moods表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS moods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        mood TEXT NOT NULL,
        intensity INTEGER NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    // 创建store_categories表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS store_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        is_visible INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
      )
    `);

    // 创建store_items表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS store_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        rarity TEXT NOT NULL,
        price REAL NOT NULL,
        price_type TEXT NOT NULL,
        is_available INTEGER NOT NULL DEFAULT 1,
        is_featured INTEGER NOT NULL DEFAULT 0,
        is_on_sale INTEGER NOT NULL DEFAULT 0,
        sale_price REAL,
        sale_end_date TEXT,
        category_id INTEGER,
        created_at TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES store_categories(id) ON DELETE SET NULL
      )
    `);

    // 创建purchases表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        store_item_id INTEGER NOT NULL,
        price REAL NOT NULL,
        price_type TEXT NOT NULL,
        purchase_date TEXT NOT NULL,
        is_refunded INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (store_item_id) REFERENCES store_items(id) ON DELETE CASCADE
      )
    `);

    // 创建vip_subscriptions表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS vip_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        tier INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
      )
    `);

    // 创建user_currencies表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS user_currencies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        coins INTEGER NOT NULL DEFAULT 0,
        jade INTEGER NOT NULL DEFAULT 0,
        last_updated TEXT NOT NULL
      )
    `);

    // 创建timely_rewards表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS timely_rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    // 创建lucky_points表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS lucky_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        is_spent INTEGER NOT NULL DEFAULT 0,
        expiry_date TEXT,
        created_at TEXT NOT NULL
      )
    `);

    // 创建lucky_draws表
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS lucky_draws (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        points_spent INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    console.log('Turso database schema initialized successfully.');
  } catch (error) {
    console.error('Error initializing Turso database schema:', error);
    throw error;
  }
}
