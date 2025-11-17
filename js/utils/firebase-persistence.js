/**
 * Firebase Firestore Persistence Module
 * Handles saving and loading data from Firebase Firestore
 * @module utils/firebase-persistence
 */

// Firebase configuration (matches firebase-config.js)
const firebaseConfig = {
  apiKey: "AIzaSyC1zhIHzZoTHx7XBfaYnSYya_TgrJR-eNU",
  authDomain: "fitness-tracker-9c801.firebaseapp.com",
  projectId: "fitness-tracker-9c801",
  storageBucket: "fitness-tracker-9c801.firebasestorage.app",
  messagingSenderId: "890869868034",
  appId: "1:890869868034:web:034347f9849af262ea691b",
  measurementId: "G-TYDL5MRFRL"
};

// Firebase app instance and Firestore reference
let firebaseApp = null;
let firestoreDB = null;
let firebaseInitialized = false;

/**
 * Initialize Firebase and Firestore
 * @returns {Promise<boolean>} True if initialization successful
 */
async function initializeFirebase() {
  if (firebaseInitialized) {
    return true;
  }
  
  try {
    // Import Firebase modules dynamically
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where } = 
      await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    // Initialize Firebase app
    firebaseApp = initializeApp(firebaseConfig);
    firestoreDB = getFirestore(firebaseApp);
    
    // Store Firebase methods globally for easy access
    window.firebaseFirestore = {
      collection,
      doc,
      setDoc,
      getDoc,
      getDocs,
      deleteDoc,
      query,
      where
    };
    
    firebaseInitialized = true;
    console.log('✅ Firebase Firestore initialized successfully');
    return true;
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
    firebaseInitialized = false;
    return false;
  }
}

/**
 * Save a user profile to Firestore
 * @param {string} userId - User profile ID
 * @param {Object} userData - User data object
 * @returns {Promise<boolean>} True if save successful
 */
async function saveUserToFirestore(userId, userData) {
  try {
    if (!firebaseInitialized) {
      await initializeFirebase();
    }
    
    if (!firestoreDB || !window.firebaseFirestore) {
      console.warn('Firestore not available, skipping save');
      return false;
    }
    
    const { doc, setDoc } = window.firebaseFirestore;
    const userRef = doc(firestoreDB, 'users', userId);
    
    await setDoc(userRef, {
      ...userData,
      lastUpdated: new Date().toISOString()
    });
    
    console.log(`✅ User ${userId} saved to Firestore`);
    return true;
  } catch (err) {
    console.error(`Failed to save user ${userId} to Firestore:`, err);
    return false;
  }
}

/**
 * Load a user profile from Firestore
 * @param {string} userId - User profile ID
 * @returns {Promise<Object|null>} User data or null if not found
 */
async function loadUserFromFirestore(userId) {
  try {
    if (!firebaseInitialized) {
      await initializeFirebase();
    }
    
    if (!firestoreDB || !window.firebaseFirestore) {
      console.warn('Firestore not available');
      return null;
    }
    
    const { doc, getDoc } = window.firebaseFirestore;
    const userRef = doc(firestoreDB, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      console.log(`✅ User ${userId} loaded from Firestore`);
      return userSnap.data();
    } else {
      console.log(`User ${userId} not found in Firestore`);
      return null;
    }
  } catch (err) {
    console.error(`Failed to load user ${userId} from Firestore:`, err);
    return null;
  }
}

/**
 * Load all users from Firestore
 * @returns {Promise<Object>} Object with userId as key and user data as value
 */
async function loadAllUsersFromFirestore() {
  try {
    if (!firebaseInitialized) {
      await initializeFirebase();
    }
    
    if (!firestoreDB || !window.firebaseFirestore) {
      console.warn('Firestore not available');
      return {};
    }
    
    const { collection, getDocs } = window.firebaseFirestore;
    const usersCollection = collection(firestoreDB, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    const users = {};
    usersSnapshot.forEach((doc) => {
      users[doc.id] = doc.data();
    });
    
    console.log(`✅ Loaded ${Object.keys(users).length} users from Firestore`);
    return users;
  } catch (err) {
    console.error('Failed to load users from Firestore:', err);
    return {};
  }
}

/**
 * Save account data to Firestore
 * @param {string} username - Account username
 * @param {Object} accountData - Account data object
 * @returns {Promise<boolean>} True if save successful
 */
async function saveAccountToFirestore(username, accountData) {
  try {
    if (!firebaseInitialized) {
      await initializeFirebase();
    }
    
    if (!firestoreDB || !window.firebaseFirestore) {
      console.warn('Firestore not available, skipping save');
      return false;
    }
    
    const { doc, setDoc } = window.firebaseFirestore;
    const accountRef = doc(firestoreDB, 'accounts', username);
    
    await setDoc(accountRef, {
      ...accountData,
      lastUpdated: new Date().toISOString()
    });
    
    console.log(`✅ Account ${username} saved to Firestore`);
    return true;
  } catch (err) {
    console.error(`Failed to save account ${username} to Firestore:`, err);
    return false;
  }
}

/**
 * Load account data from Firestore
 * @param {string} username - Account username
 * @returns {Promise<Object|null>} Account data or null if not found
 */
async function loadAccountFromFirestore(username) {
  try {
    if (!firebaseInitialized) {
      await initializeFirebase();
    }
    
    if (!firestoreDB || !window.firebaseFirestore) {
      console.warn('Firestore not available');
      return null;
    }
    
    const { doc, getDoc } = window.firebaseFirestore;
    const accountRef = doc(firestoreDB, 'accounts', username);
    const accountSnap = await getDoc(accountRef);
    
    if (accountSnap.exists()) {
      console.log(`✅ Account ${username} loaded from Firestore`);
      return accountSnap.data();
    } else {
      return null;
    }
  } catch (err) {
    console.error(`Failed to load account ${username} from Firestore:`, err);
    return null;
  }
}

/**
 * Save all user profiles to Firestore
 * @param {Object} users - Object with userId as key and user data as value
 * @returns {Promise<boolean>} True if all saves successful
 */
async function saveAllUsersToFirestore(users) {
  try {
    const savePromises = Object.keys(users).map(userId => 
      saveUserToFirestore(userId, users[userId])
    );
    
    await Promise.all(savePromises);
    console.log(`✅ All users saved to Firestore`);
    return true;
  } catch (err) {
    console.error('Failed to save all users to Firestore:', err);
    return false;
  }
}

/**
 * Check if Firebase is available and initialized
 * @returns {boolean} True if Firebase is ready
 */
function isFirebaseAvailable() {
  return firebaseInitialized && firestoreDB !== null;
}

console.log('✅ Firebase persistence module loaded');
