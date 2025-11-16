/**
 * Database Module - IndexedDB and LocalStorage Helpers
 * Manages all data persistence for the Fitness Tracker application
 */

// Database configuration
const DB_NAME = 'fitness-tracker-db';
const DB_VERSION = 6;
const STORE_USERS = 'users';
const STORE_COMPARISONS = 'comparisons';
const STORE_REFERENCES = 'references';
const STORE_ARCHIVE = 'archive';
const STORE_SETTINGS = 'settings';
const STORE_ACCOUNTS = 'accounts';
const STORE_TASKS = 'tasks';
const STORE_SUGGESTIONS = 'suggestions';
const STORE_ACCESS_LOGS = 'access_logs';

/**
 * Opens IndexedDB connection
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_USERS)) db.createObjectStore(STORE_USERS, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORE_COMPARISONS)) db.createObjectStore(STORE_COMPARISONS, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORE_REFERENCES)) db.createObjectStore(STORE_REFERENCES, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORE_ARCHIVE)) db.createObjectStore(STORE_ARCHIVE, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      if (!db.objectStoreNames.contains(STORE_ACCOUNTS)) {
        const accountStore = db.createObjectStore(STORE_ACCOUNTS, { keyPath: 'username' });
        accountStore.createIndex('email', 'email', { unique: true });
      }
      if (!db.objectStoreNames.contains(STORE_TASKS)) {
        db.createObjectStore(STORE_TASKS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SUGGESTIONS)) {
        db.createObjectStore(STORE_SUGGESTIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_ACCESS_LOGS)) {
        const accessStore = db.createObjectStore(STORE_ACCESS_LOGS, { keyPath: 'id' });
        accessStore.createIndex('timestamp', 'timestamp', { unique: false });
        accessStore.createIndex('username', 'username', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Puts a value into an IndexedDB store
 * @param {string} storeName - Name of the object store
 * @param {Object} value - Value to store
 * @returns {Promise<any>}
 */
async function dbPut(storeName, value) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('DB put failed', err);
    throw err;
  }
}

/**
 * Gets all values from an IndexedDB store
 * @param {string} storeName - Name of the object store
 * @returns {Promise<Array>}
 */
async function dbGetAll(storeName) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('DB getAll failed', err);
    return [];
  }
}

/**
 * Gets a single value from an IndexedDB store
 * @param {string} storeName - Name of the object store
 * @param {any} key - Key to retrieve
 * @returns {Promise<any>}
 */
async function dbGet(storeName, key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('DB get failed', err);
    return null;
  }
}

/**
 * Deletes a value from an IndexedDB store
 * @param {string} storeName - Name of the object store
 * @param {any} key - Key to delete
 * @returns {Promise<void>}
 */
async function dbDelete(storeName, key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('DB delete failed', err);
    throw err;
  }
}

/**
 * Saves data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store (will be JSON stringified)
 */
function saveLS(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('localStorage save failed', err);
  }
}

/**
 * Loads data from localStorage
 * @param {string} key - Storage key
 * @returns {any} Parsed data or null
 */
function loadLS(key) {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : null;
  } catch (err) {
    return null;
  }
}
