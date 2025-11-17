/**
 * Application Initialization
 * Handles app startup, data seeding, and security setup
 * @module core/init
 */

/**
 * Save all data before page unload
 */
window.addEventListener('beforeunload', () => { 
  try { 
    saveAllToDB(); 
  } catch (e) { 
    console.error('Failed to save data on unload:', e);
  } 
});

/**
 * Initialize the application
 * - Loads data from database
 * - Seeds initial users if needed
 * - Creates and auto-logins Pedro admin account
 * - Initializes theme and security systems
 * - Starts continuous security monitoring
 */
async function initApp() {
  console.log('🚀 Initializing Fitness Tracker...');
  
  // Load security state
  loadLoginAttempts();
  
  // Load user data regardless of authentication state
  await loadAllFromDB();
  await loadCustomMeals();
  
  // Ensure default users exist (do not overwrite)
  if (!state.users.pedro) state.users.pedro = initialUsers.pedro;
  if (!state.users.valentina) state.users.valentina = initialUsers.valentina;
  
  // Import marmitas list to a settings key for future UI if desired
  const s = await dbGet(STORE_SETTINGS, 'marmitas_seed_loaded').catch(()=>null);
  if (!s) {
    // store marmitas in settings for reference (not required, but keeps record)
    await dbPut(STORE_SETTINGS, { key: 'marmitas_seed_loaded', value: new Date().toISOString() });
  }
  
  // Initialize tasks (short-term roadmap)
  await initializeTasks();
  
  await saveAllToDB();
  
  // Auto-create Pedro and Valentina admin accounts with their respective profiles
  // Pedro admin account
  let pedroAccount = await dbGet(STORE_ACCOUNTS, 'Pedro');
  if (!pedroAccount) {
    try {
      // Create Pedro admin account with specified credentials
      const saltPedro = generateSalt();
      const passwordHashPedro = await hashPassword('123456', saltPedro);
      
      pedroAccount = {
        username: 'Pedro',
        email: 'pedro@fitness-tracker.com',
        passwordHash: passwordHashPedro,
        salt: saltPedro,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        linkedProfiles: ['pedro'], // Only pedro profile linked
        twoFactorEnabled: false,
        accountLocked: false,
        role: 'admin'
      };
      
      await dbPut(STORE_ACCOUNTS, pedroAccount);
      
      // Save to Firebase Firestore
      if (typeof saveAccountToFirestore === 'function' && typeof isFirebaseAvailable === 'function') {
        if (isFirebaseAvailable()) {
          await saveAccountToFirestore('Pedro', pedroAccount);
        }
      }
      
      console.log('✅ Pedro admin account created successfully');
    } catch (err) {
      console.error('Failed to create Pedro admin account:', err);
    }
  }
  
  // Valentina admin account
  let valentinaAccount = await dbGet(STORE_ACCOUNTS, 'Valentina');
  if (!valentinaAccount) {
    try {
      // Create Valentina admin account with specified credentials
      const saltValentina = generateSalt();
      const passwordHashValentina = await hashPassword('123456', saltValentina);
      
      valentinaAccount = {
        username: 'Valentina',
        email: 'valentina@fitness-tracker.com',
        passwordHash: passwordHashValentina,
        salt: saltValentina,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        linkedProfiles: ['valentina'], // Only valentina profile linked
        twoFactorEnabled: false,
        accountLocked: false,
        role: 'admin'
      };
      
      await dbPut(STORE_ACCOUNTS, valentinaAccount);
      
      // Save to Firebase Firestore
      if (typeof saveAccountToFirestore === 'function' && typeof isFirebaseAvailable === 'function') {
        if (isFirebaseAvailable()) {
          await saveAccountToFirestore('Valentina', valentinaAccount);
        }
      }
      
      console.log('✅ Valentina admin account created successfully');
    } catch (err) {
      console.error('Failed to create Valentina admin account:', err);
    }
  }
  
  // Auto-login as Pedro (bypass authentication screen)
  if (!authState.isAuthenticated) {
    try {
      // Create session directly without going through login
      authState.isAuthenticated = true;
      authState.currentAccount = {
        username: 'Pedro',
        email: pedroAccount.email,
        createdAt: pedroAccount.createdAt,
        linkedProfiles: pedroAccount.linkedProfiles || ['pedro'],
        role: 'admin'
      };
      authState.sessionToken = generateToken();
      authState.csrfToken = generateToken();
      
      // Store session
      const session = {
        token: authState.sessionToken,
        csrf: authState.csrfToken,
        username: 'Pedro',
        role: 'admin',
        createdAt: Date.now(),
        expiresAt: Date.now() + SECURITY_CONFIG.SESSION_TIMEOUT_MS
      };
      
      saveLS('ft_session', session);
      
      // Update last login
      pedroAccount.lastLogin = new Date().toISOString();
      await dbPut(STORE_ACCOUNTS, pedroAccount);
      
      // Log page access
      await logPageAccess().catch(err => console.error('Failed to log page access', err));
      
      console.log('✅ Auto-logged in as Pedro (admin)');
    } catch (err) {
      console.error('Failed to auto-login as Pedro:', err);
    }
  }
  
  await loadProgressPhotos();
  
  // Initialize theme system
  await initializeTheme();
  
  // Initialize Advanced Security Modules (2025 Research-Based)
  if (authState.isAuthenticated && authState.sessionToken) {
    // Initialize Zero Trust Framework for current session
    ZeroTrustFramework.initializeSession(authState.sessionToken, {
      username: authState.currentAccount.username
    });
    
    // Calculate initial security posture (DCCI Framework)
    const securityPosture = DCCIFramework.calculatePosture();
    console.log('🛡️ Security Posture:', securityPosture.grade, `(${(securityPosture.overall * 100).toFixed(1)}%)`);
    
    // Collect initial metrics (privacy-preserving)
    PrivacyPreservingAnalytics.collectAnonymized('security', {
      event: 'app_init',
      postureScore: securityPosture.overall,
      value: 1
    });
  }
  
  // Start continuous security monitoring (Zero Trust validation)
  setInterval(() => {
    if (authState.isAuthenticated && authState.sessionToken) {
      const validation = ZeroTrustFramework.validateSession(authState.sessionToken);
      
      if (!validation.valid) {
        console.warn('[ZeroTrust] Session validation failed:', validation.reason);
        
        if (validation.action === 'revoke_access') {
          // Session is no longer valid, force logout
          console.log('[ZeroTrust] Forcing logout due to security policy');
          destroySession();
          render();
        }
      }
      
      // Update threat score decay (reduce threat level over time if no issues)
      if (AdaptiveRateLimiter.threatScore > 0) {
        AdaptiveRateLimiter.threatScore = Math.max(0, AdaptiveRateLimiter.threatScore - 1);
        AdaptiveRateLimiter.analyzeThreatLevel();
      }
      
      // Gradually restore rate limit to baseline if threat is low
      if (AdaptiveRateLimiter.threatLevel === 'low' && AdaptiveRateLimiter.currentLimit < AdaptiveRateLimiter.baseLimit) {
        AdaptiveRateLimiter.currentLimit = Math.min(
          AdaptiveRateLimiter.baseLimit,
          AdaptiveRateLimiter.currentLimit + 1
        );
      }
    }
  }, 60000); // Check every minute
  
  // Initialize hash-based routing
  loadFromHash();
  
  console.log('✅ Fitness Tracker initialized successfully');
  
  // Render the application
  render();
}

console.log('✅ Init module loaded');
