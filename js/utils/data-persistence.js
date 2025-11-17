/**
 * Data Persistence Module
 * Handles saving and loading data from IndexedDB and localStorage
 * @module utils/data-persistence
 */

/**
 * Save all application data to Firebase Firestore (primary) and IndexedDB (cache)
 * Saves users, comparisons, references, and timestamp
 */
async function saveAllToDB() {
  try {
    // Save to Firebase Firestore (primary storage)
    if (typeof saveAllUsersToFirestore === 'function' && typeof isFirebaseAvailable === 'function') {
      if (isFirebaseAvailable()) {
        await saveAllUsersToFirestore(state.users);
      }
    }
    
    // Save to IndexedDB (cache/fallback)
    for (const id of Object.keys(state.users)) {
      await dbPut(STORE_USERS, state.users[id]);
    }
    // comparisons
    for (const comp of state.comparisons) {
      await dbPut(STORE_COMPARISONS, comp);
    }
    // references
    for (const ref of state.references) {
      await dbPut(STORE_REFERENCES, ref);
    }
    // settings: store lastSave timestamp
    await dbPut(STORE_SETTINGS, { key: 'lastSave', value: new Date().toISOString() });

    // fallback localStorage
    saveLS('ft_users', state.users);
    saveLS('ft_comparisons', state.comparisons);
    saveLS('ft_references', state.references);
  } catch (err) {
    console.error('saveAllToDB error', err);
  }
}

/**
 * Load all application data from Firebase Firestore (primary) with IndexedDB/localStorage fallback
 * Loads users, comparisons, references and handles legacy migrations
 */
async function loadAllFromDB() {
  let users = {};
  let comparisons = [];
  let references = [];
  
  // Try loading from Firebase Firestore first
  try {
    if (typeof loadAllUsersFromFirestore === 'function' && typeof isFirebaseAvailable === 'function') {
      if (isFirebaseAvailable()) {
        const firestoreUsers = await loadAllUsersFromFirestore();
        if (firestoreUsers && Object.keys(firestoreUsers).length > 0) {
          users = firestoreUsers;
          console.log('✅ Loaded users from Firebase Firestore');
        }
      }
    }
  } catch (err) {
    console.warn('Firebase load failed, falling back to IndexedDB', err);
  }
  
  // Fallback to IndexedDB if Firebase didn't return data
  if (Object.keys(users).length === 0) {
    try {
      const dbUsers = await dbGetAll(STORE_USERS);
      const dbComparisons = await dbGetAll(STORE_COMPARISONS);
      const dbReferences = await dbGetAll(STORE_REFERENCES);
      if (dbUsers && dbUsers.length) dbUsers.forEach(u => users[u.id] = u);
      if (dbComparisons && dbComparisons.length) comparisons = dbComparisons;
      if (dbReferences && dbReferences.length) references = dbReferences;
    } catch (err) {
      console.warn('DB load failed, fallback to localStorage', err);
    }
  }

  // fallback localStorage if empty
  if (Object.keys(users).length === 0) {
    const lsUsers = loadLS('ft_users');
    if (lsUsers) users = lsUsers;
  }
  if (!comparisons.length) {
    const lsComparisons = loadLS('ft_comparisons');
    if (lsComparisons) comparisons = lsComparisons;
  }
  if (!references.length) {
    const lsReferences = loadLS('ft_references');
    if (lsReferences) references = lsReferences;
  }

  // Legacy migration: ft_custom_programs
  const legacyPrograms = loadLS('ft_custom_programs');
  if (legacyPrograms && typeof legacyPrograms === 'object') {
    Object.keys(legacyPrograms).forEach(uid => {
      if (!users[uid]) return;
      users[uid].customPrograms = users[uid].customPrograms || {};
      // merge but do not overwrite existing keys
      Object.keys(legacyPrograms[uid]).forEach(k => {
        if (!users[uid].customPrograms[k]) users[uid].customPrograms[k] = legacyPrograms[uid][k];
      });
    });
    // do not delete legacy key automatically
  }

  // If no users exist in DB/LS, seed defaults (but do not overwrite if user has data)
  if (Object.keys(users).length === 0) {
    users = initialUsers;
    comparisons = [];
    references = []; // keep empty until user imports seed references to avoid accidental overwrite
    state.users = users;
    state.comparisons = comparisons;
    state.references = references;
    await saveAllToDB();
  } else {
    state.users = users;
    state.comparisons = comparisons;
    state.references = references;
  }

  // Ensure all users have workoutLogs array (migration for new feature)
  Object.keys(state.users).forEach(userId => {
    if (!state.users[userId].workoutLogs) {
      state.users[userId].workoutLogs = [];
    }
  });
}

/**
 * Load custom meals from IndexedDB with localStorage fallback
 */
async function loadCustomMeals() {
  try {
    const customMealsData = await dbGet(STORE_SETTINGS, 'customMeals').catch(() => null);
    if (customMealsData && customMealsData.value) {
      state.customMeals = customMealsData.value;
      return;
    }
  } catch (err) {
    console.warn('Failed to load custom meals from IndexedDB', err);
  }
  
  // Fallback to localStorage
  const lsCustomMeals = loadLS('ft_custom_meals');
  if (lsCustomMeals && Array.isArray(lsCustomMeals)) {
    state.customMeals = lsCustomMeals;
  } else {
    state.customMeals = [];
  }
}

/**
 * Save custom meals to IndexedDB and localStorage
 */
async function saveCustomMeals() {
  try {
    await dbPut(STORE_SETTINGS, { key: 'customMeals', value: state.customMeals });
  } catch (err) {
    console.error('Failed to save custom meals to IndexedDB', err);
  }
  
  // Also save to localStorage as fallback
  saveLS('ft_custom_meals', state.customMeals);
}

console.log('✅ Data persistence module loaded');
