/**
 * ======================================================================
 * AUTHENTICATION MODULE
 * ======================================================================
 * 
 * Handles user authentication, session management, and account operations:
 * - User registration with security validation
 * - Login with brute force protection
 * - Session creation and validation
 * - Profile linking to accounts
 * - Admin role management
 * - Account management functions
 * 
 * Dependencies:
 * - js/core/db.js (database operations)
 * - js/auth/security.js (security functions)
 * - js/auth/advanced-security.js (advanced security modules)
 * ======================================================================
 */

// ==================== ACCOUNT MANAGEMENT ====================

/**
 * Get all accounts from database
 * @returns {Promise<Array>} Array of account objects
 */
async function getAllAccounts() {
  try {
    const accounts = await dbGetAll(STORE_ACCOUNTS);
    return accounts || [];
  } catch (err) {
    console.error('Failed to get accounts', err);
    return [];
  }
}

/**
 * Get recent security logs
 * @param {number} hoursBack - Hours to look back (default 24)
 * @returns {Promise<Array>} Array of security log entries
 */
async function getRecentSecurityLogs(hoursBack = 24) {
  try {
    const allSettings = await dbGetAll(STORE_SETTINGS);
    const cutoffTime = Date.now() - (hoursBack * 60 * 60 * 1000);
    
    const securityLogs = allSettings
      .filter(item => item.key && item.key.startsWith('security_log_'))
      .map(item => item.value)
      .filter(log => {
        const logTime = new Date(log.timestamp).getTime();
        return logTime >= cutoffTime;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return securityLogs;
  } catch (err) {
    console.error('Failed to get security logs', err);
    return [];
  }
}

// ==================== SESSION MANAGEMENT ====================

/**
 * Create a new session for an account
 * @param {Object} account - Account object
 */
function createSession(account) {
  const sessionToken = generateToken();
  const csrfToken = generateToken();
  
  authState.isAuthenticated = true;
  authState.currentAccount = {
    username: account.username,
    email: account.email,
    createdAt: account.createdAt,
    linkedProfiles: account.linkedProfiles || [],
    role: account.role || 'user'
  };
  authState.sessionToken = sessionToken;
  authState.csrfToken = csrfToken;
  
  // Store session securely
  const session = {
    token: sessionToken,
    csrf: csrfToken,
    username: account.username,
    role: account.role || 'user',
    createdAt: Date.now(),
    expiresAt: Date.now() + SECURITY_CONFIG.SESSION_TIMEOUT_MS
  };
  
  saveLS('ft_session', session);
  logSecurityEvent('login_success', account.username, 'User logged in successfully');
  
  // Log page access after login
  logPageAccess().catch(err => console.error('Failed to log page access', err));
}

/**
 * Validate current session
 * @returns {Promise<boolean>} True if session is valid
 */
async function validateSession() {
  const session = loadLS('ft_session');
  
  if (!session) {
    return false;
  }
  
  // Check if session expired
  if (Date.now() > session.expiresAt) {
    destroySession();
    return false;
  }
  
  // Load account from database
  try {
    const account = await dbGet(STORE_ACCOUNTS, session.username);
    if (!account) {
      destroySession();
      return false;
    }
    
    authState.isAuthenticated = true;
    authState.currentAccount = {
      username: account.username,
      email: account.email,
      createdAt: account.createdAt,
      linkedProfiles: account.linkedProfiles || [],
      role: account.role || 'user'
    };
    authState.sessionToken = session.token;
    authState.csrfToken = session.csrf;
    
    return true;
  } catch (err) {
    console.error('Session validation failed', err);
    destroySession();
    return false;
  }
}

/**
 * Destroy current session (logout)
 */
function destroySession() {
  if (authState.currentAccount) {
    logSecurityEvent('logout', authState.currentAccount.username, 'User logged out');
  }
  
  authState.isAuthenticated = false;
  authState.currentAccount = null;
  authState.sessionToken = null;
  authState.csrfToken = null;
  
  localStorage.removeItem('ft_session');
}

// ==================== REGISTRATION ====================

/**
 * Register a new account
 * @param {string} username - Username
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {Promise<Object>} Created account object
 * @throws {Error} If registration fails
 */
async function registerAccount(username, email, password) {
  // Rate limit check
  if (!checkRateLimit('register_' + username)) {
    throw new Error('Muitas tentativas de registro. Tente novamente em 1 minuto.');
  }
  
  // Validate inputs
  username = sanitizeInput(username);
  email = sanitizeInput(email);
  
  if (!validateUsername(username)) {
    throw new Error('Nome de usuário inválido. Use 3-20 caracteres alfanuméricos.');
  }
  
  if (!validateEmail(email)) {
    throw new Error('Email inválido.');
  }
  
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    throw new Error('Senha fraca:\n' + passwordCheck.errors.join('\n'));
  }
  
  // Check if username already exists
  const existingAccount = await dbGet(STORE_ACCOUNTS, username);
  if (existingAccount) {
    logSecurityEvent('register_failed', username, 'Username already exists');
    throw new Error('Nome de usuário já existe.');
  }
  
  // Check if this is the first account - make it admin
  const allAccounts = await dbGetAll(STORE_ACCOUNTS);
  const isFirstAccount = allAccounts.length === 0;
  
  // Create account
  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);
  
  const account = {
    username,
    email,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    linkedProfiles: [],
    twoFactorEnabled: false,
    accountLocked: false,
    role: isFirstAccount ? 'admin' : 'user' // First account is automatically admin
  };
  
  await dbPut(STORE_ACCOUNTS, account);
  
  // Save to Firebase Firestore
  if (typeof saveAccountToFirestore === 'function' && typeof isFirebaseAvailable === 'function') {
    if (isFirebaseAvailable()) {
      await saveAccountToFirestore(username, account);
    }
  }
  
  logSecurityEvent('register_success', username, `New account created${isFirstAccount ? ' (first account - auto-promoted to admin)' : ''}`);
  
  return account;
}

// ==================== LOGIN ====================

/**
 * Login with username and password
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} Account object
 * @throws {Error} If login fails
 */
async function loginAccount(username, password) {
  // Adaptive Rate Limit check (enhanced with ML-based adjustment)
  const rateDecision = AdaptiveRateLimiter.checkRequest(username, 'login');
  if (!rateDecision.allowed) {
    logSecurityEvent('login_blocked', username, `Adaptive rate limit: ${rateDecision.reason}`);
    throw new Error(`Limite de tentativas excedido (${rateDecision.currentCount}/${rateDecision.limit}). Tente novamente em 1 minuto.`);
  }
  
  // Legacy rate limit check (fallback)
  if (!checkRateLimit('login_' + username)) {
    throw new Error('Muitas tentativas de login. Tente novamente em 1 minuto.');
  }
  
  // Sanitize input
  username = sanitizeInput(username);
  
  // Check login attempts
  const attemptCheck = checkLoginAttempts(username);
  if (!attemptCheck.allowed) {
    logSecurityEvent('login_blocked', username, `Account locked for ${attemptCheck.lockedForMinutes} minutes`);
    throw new Error(`Conta bloqueada por ${attemptCheck.lockedForMinutes} minutos devido a muitas tentativas falhas.`);
  }
  
  // Get account
  const account = await dbGet(STORE_ACCOUNTS, username);
  if (!account) {
    recordFailedLogin(username);
    
    // AI-Powered Security Agent: Analyze failed login pattern
    const securityAnalysis = SecurityAgent.analyzePattern({
      type: 'login_failed',
      username,
      timestamp: Date.now()
    });
    
    if (securityAnalysis.threatLevel === 'high') {
      console.log('[Security] High threat detected:', SecurityAgent.explainDecision(securityAnalysis));
      // Collect anonymized metrics
      PrivacyPreservingAnalytics.collectAnonymized('security', {
        event: 'high_threat_login',
        threatLevel: securityAnalysis.threatLevel,
        value: securityAnalysis.confidence
      });
    }
    
    logSecurityEvent('login_failed', username, 'Account not found');
    throw new Error('Usuário ou senha incorretos.');
  }
  
  // Check if account is locked
  if (account.accountLocked) {
    logSecurityEvent('login_blocked', username, 'Account is permanently locked');
    throw new Error('Conta bloqueada. Entre em contato com o administrador.');
  }
  
  // Verify password
  const passwordHash = await hashPassword(password, account.salt);
  if (passwordHash !== account.passwordHash) {
    recordFailedLogin(username);
    
    // AI-Powered Security Agent: Analyze failed login pattern
    const securityAnalysis = SecurityAgent.analyzePattern({
      type: 'login_failed',
      username,
      timestamp: Date.now()
    });
    
    if (securityAnalysis.threatLevel === 'high') {
      console.log('[Security] High threat detected:', SecurityAgent.explainDecision(securityAnalysis));
    }
    
    logSecurityEvent('login_failed', username, 'Invalid password');
    throw new Error('Usuário ou senha incorretos.');
  }
  
  // Clear failed attempts
  clearFailedLoginAttempts(username);
  
  // AI-Powered Security Agent: Analyze successful login
  const securityAnalysis = SecurityAgent.analyzePattern({
    type: 'login_success',
    username,
    timestamp: Date.now()
  });
  
  // Zero Trust: Initialize session with continuous validation
  const sessionToken = generateToken();
  const zeroTrustInit = ZeroTrustFramework.initializeSession(sessionToken, {
    username: account.username
  });
  
  console.log('[ZeroTrust] Session initialized:', zeroTrustInit);
  
  // Collect anonymized metrics (privacy-preserving)
  PrivacyPreservingAnalytics.collectAnonymized('security', {
    event: 'login_success',
    threatLevel: securityAnalysis.threatLevel,
    trustScore: zeroTrustInit.trustScore,
    value: 1
  });
  
  // Update last login
  account.lastLogin = new Date().toISOString();
  await dbPut(STORE_ACCOUNTS, account);
  
  // Save to Firebase Firestore
  if (typeof saveAccountToFirestore === 'function' && typeof isFirebaseAvailable === 'function') {
    if (isFirebaseAvailable()) {
      await saveAccountToFirestore(username, account);
    }
  }
  
  // Create session (using Zero Trust token)
  authState.sessionToken = sessionToken;
  createSession(account);
  
  return account;
}

// ==================== PROFILE LINKING ====================

/**
 * Link a profile to an account
 * @param {string} accountUsername - Account username
 * @param {string} profileId - Profile ID to link
 */
async function linkProfileToAccount(accountUsername, profileId) {
  const account = await dbGet(STORE_ACCOUNTS, accountUsername);
  if (!account) {
    throw new Error('Conta não encontrada.');
  }
  
  if (!account.linkedProfiles) {
    account.linkedProfiles = [];
  }
  
  if (!account.linkedProfiles.includes(profileId)) {
    account.linkedProfiles.push(profileId);
    await dbPut(STORE_ACCOUNTS, account);
    
    // Save to Firebase Firestore
    if (typeof saveAccountToFirestore === 'function' && typeof isFirebaseAvailable === 'function') {
      if (isFirebaseAvailable()) {
        await saveAccountToFirestore(accountUsername, account);
      }
    }
    
    logSecurityEvent('profile_linked', accountUsername, `Profile ${profileId} linked to account`);
  }
}

/**
 * Unlink a profile from an account
 * @param {string} accountUsername - Account username
 * @param {string} profileId - Profile ID to unlink
 */
async function unlinkProfileFromAccount(accountUsername, profileId) {
  const account = await dbGet(STORE_ACCOUNTS, accountUsername);
  if (!account) {
    throw new Error('Conta não encontrada.');
  }
  
  if (account.linkedProfiles) {
    account.linkedProfiles = account.linkedProfiles.filter(p => p !== profileId);
    await dbPut(STORE_ACCOUNTS, account);
    
    // Save to Firebase Firestore
    if (typeof saveAccountToFirestore === 'function' && typeof isFirebaseAvailable === 'function') {
      if (isFirebaseAvailable()) {
        await saveAccountToFirestore(accountUsername, account);
      }
    }
    
    logSecurityEvent('profile_unlinked', accountUsername, `Profile ${profileId} unlinked from account`);
  }
}

// ==================== ADMIN FUNCTIONS ====================

/**
 * Check if current user is admin
 * @returns {boolean} True if user is admin
 */
function isAdmin() {
  return authState.isAuthenticated && authState.currentAccount && authState.currentAccount.role === 'admin';
}

/**
 * Promote user to admin role
 * @param {string} username - Username to promote
 * @throws {Error} If not authorized or account not found
 */
async function promoteToAdmin(username) {
  if (!isAdmin() && authState.currentAccount && authState.currentAccount.username !== username) {
    throw new Error('Somente administradores podem promover outros usuários.');
  }
  
  const account = await dbGet(STORE_ACCOUNTS, username);
  if (!account) {
    throw new Error('Conta não encontrada.');
  }
  
  account.role = 'admin';
  await dbPut(STORE_ACCOUNTS, account);
  
  // Save to Firebase Firestore
  if (typeof saveAccountToFirestore === 'function' && typeof isFirebaseAvailable === 'function') {
    if (isFirebaseAvailable()) {
      await saveAccountToFirestore(username, account);
    }
  }
  
  logSecurityEvent('admin_promotion', username, `User promoted to admin by ${authState.currentAccount ? authState.currentAccount.username : 'system'}`);
}

// Log module loaded
console.log('✅ Authentication module loaded (registerAccount, loginAccount, createSession, validateSession, etc.)');
