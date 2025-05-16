// src/utils/storage.ts

/**
 * 从本地存储获取数据
 * @param key 存储键
 * @returns 存储的数据，如果不存在则返回null
 */
export function getLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item from localStorage with key ${key}:`, error);
    return null;
  }
}

/**
 * 将数据保存到本地存储
 * @param key 存储键
 * @param value 要存储的数据
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item to localStorage with key ${key}:`, error);
  }
}

/**
 * 从本地存储中移除数据
 * @param key 存储键
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage with key ${key}:`, error);
  }
}

/**
 * 清除所有本地存储
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * 从会话存储获取数据
 * @param key 存储键
 * @returns 存储的数据，如果不存在则返回null
 */
export function getSessionStorage<T>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item from sessionStorage with key ${key}:`, error);
    return null;
  }
}

/**
 * 将数据保存到会话存储
 * @param key 存储键
 * @param value 要存储的数据
 */
export function setSessionStorage<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item to sessionStorage with key ${key}:`, error);
  }
}

/**
 * 从会话存储中移除数据
 * @param key 存储键
 */
export function removeSessionStorage(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from sessionStorage with key ${key}:`, error);
  }
}

/**
 * 清除所有会话存储
 */
export function clearSessionStorage(): void {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
  }
}

/**
 * 检查本地存储中是否存在指定键
 * @param key 存储键
 * @returns 是否存在
 */
export function hasLocalStorage(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

/**
 * 检查会话存储中是否存在指定键
 * @param key 存储键
 * @returns 是否存在
 */
export function hasSessionStorage(key: string): boolean {
  return sessionStorage.getItem(key) !== null;
}

/**
 * 获取本地存储中所有键
 * @returns 键数组
 */
export function getLocalStorageKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      keys.push(key);
    }
  }
  return keys;
}

/**
 * 获取会话存储中所有键
 * @returns 键数组
 */
export function getSessionStorageKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) {
      keys.push(key);
    }
  }
  return keys;
}

/**
 * 获取本地存储使用情况
 * @returns 使用情况对象
 */
export function getLocalStorageUsage(): { used: number; total: number; percentage: number } {
  try {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          used += key.length + value.length;
        }
      }
    }
    
    // 本地存储限制通常为5MB
    const total = 5 * 1024 * 1024;
    const percentage = (used / total) * 100;
    
    return { used, total, percentage };
  } catch (error) {
    console.error('Error getting localStorage usage:', error);
    return { used: 0, total: 0, percentage: 0 };
  }
}

/**
 * 将数据保存到IndexedDB
 * @param dbName 数据库名称
 * @param storeName 存储名称
 * @param key 存储键
 * @param value 要存储的数据
 * @returns Promise
 */
export function setIndexedDB<T>(
  dbName: string,
  storeName: string,
  key: string,
  value: T
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    
    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const storeRequest = store.put(value, key);
      
      storeRequest.onerror = () => {
        reject(new Error('Failed to store data in IndexedDB'));
      };
      
      storeRequest.onsuccess = () => {
        resolve();
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
}

/**
 * 从IndexedDB获取数据
 * @param dbName 数据库名称
 * @param storeName 存储名称
 * @param key 存储键
 * @returns Promise
 */
export function getIndexedDB<T>(
  dbName: string,
  storeName: string,
  key: string
): Promise<T | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    
    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(storeName)) {
        resolve(null);
        db.close();
        return;
      }
      
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      const storeRequest = store.get(key);
      
      storeRequest.onerror = () => {
        reject(new Error('Failed to get data from IndexedDB'));
      };
      
      storeRequest.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result || null);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
}

/**
 * 从IndexedDB中移除数据
 * @param dbName 数据库名称
 * @param storeName 存储名称
 * @param key 存储键
 * @returns Promise
 */
export function removeIndexedDB(
  dbName: string,
  storeName: string,
  key: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    
    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(storeName)) {
        resolve();
        db.close();
        return;
      }
      
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const storeRequest = store.delete(key);
      
      storeRequest.onerror = () => {
        reject(new Error('Failed to remove data from IndexedDB'));
      };
      
      storeRequest.onsuccess = () => {
        resolve();
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
}
