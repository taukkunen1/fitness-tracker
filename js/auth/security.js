/**
 * Security Configuration and Basic Helpers
 * Core security functions and authentication helpers
 */

// Security configuration
const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT_MS: 24 * 60 * 60 * 1000, // 24 hours
  PBKDF2_ITERATIONS: 100000,
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS_PER_WINDOW: 10
};

// Authentication state (will be initialized in main app)
let authState = {
  isAuthenticated: false,
  currentAccount: null,
  sessionToken: null,
  csrfToken: null,
  loginAttempts: {},
  rateLimitTracking: {}
};

/**
 * Hash a password using PBKDF2
 * @param {string} password - Plain text password
 * @param {string} salt - Salt for hashing
 * @returns {Promise<string>} Hex-encoded hash
 */
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);
  
  const combined = new Uint8Array(passwordBuffer.length + saltBuffer.length);
  combined.set(passwordBuffer, 0);
  combined.set(saltBuffer, passwordBuffer.length);
  
  const key = await crypto.subtle.importKey(
    'raw',
    combined,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: SECURITY_CONFIG.PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    key,
    256
  );
  return Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a cryptographically secure salt
 * @returns {string} Hex-encoded salt
 */
function generateSalt() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a cryptographically secure token
 * @returns {string} Hex-encoded token
 */
function generateToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with errors array
 */
function validatePassword(password) {
  const errors = [];
  
  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(`Senha deve ter pelo menos ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} caracteres`);
  }
  
  if (password.length > 128) {
    errors.push('Senha muito longa (máximo 128 caracteres)');
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBER && !/[0-9]/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#x60;')
    .replace(/\//g, '&#x2F;')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\t/g, ' ')
    .trim()
    .slice(0, 255);
}

/**
 * Escape HTML characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean} True if valid
 */
function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Check rate limit for an identifier
 * @param {string} identifier - Identifier to check
 * @returns {boolean} True if allowed
 */
function checkRateLimit(identifier) {
  const now = Date.now();
  
  if (!authState.rateLimitTracking[identifier]) {
    authState.rateLimitTracking[identifier] = { count: 0, windowStart: now };
  }
  
  const tracking = authState.rateLimitTracking[identifier];
  
  if (now - tracking.windowStart > SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS) {
    tracking.count = 0;
    tracking.windowStart = now;
  }
  
  tracking.count++;
  
  if (tracking.count > SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  return true;
}

/**
 * Check login attempts for brute force protection
 * @param {string} username - Username to check
 * @returns {Object} Status with allowed flag and remaining attempts
 */
function checkLoginAttempts(username) {
  const now = Date.now();
  
  if (!authState.loginAttempts[username]) {
    return { allowed: true, remainingAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS };
  }
  
  const attempts = authState.loginAttempts[username];
  
  if (attempts.lockedUntil && now < attempts.lockedUntil) {
    const remainingTime = Math.ceil((attempts.lockedUntil - now) / 1000 / 60);
    return { allowed: false, lockedForMinutes: remainingTime };
  }
  
  if (attempts.lockedUntil && now >= attempts.lockedUntil) {
    delete authState.loginAttempts[username];
    return { allowed: true, remainingAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS };
  }
  
  return { 
    allowed: attempts.count < SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS,
    remainingAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - attempts.count
  };
}

/**
 * Record a failed login attempt
 * @param {string} username - Username that failed
 */
function recordFailedLogin(username) {
  const now = Date.now();
  
  if (!authState.loginAttempts[username]) {
    authState.loginAttempts[username] = { count: 1, lastAttempt: now };
  } else {
    authState.loginAttempts[username].count++;
    authState.loginAttempts[username].lastAttempt = now;
  }
  
  if (authState.loginAttempts[username].count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
    authState.loginAttempts[username].lockedUntil = now + SECURITY_CONFIG.LOCKOUT_DURATION_MS;
    console.log('[SECURITY] Account locked:', username);
  }
  
  // Save to localStorage
  saveLS('ft_login_attempts', authState.loginAttempts);
}

/**
 * Clear failed login attempts
 * @param {string} username - Username to clear
 */
function clearFailedLoginAttempts(username) {
  delete authState.loginAttempts[username];
  saveLS('ft_login_attempts', authState.loginAttempts);
}

/**
 * Log security event
 * @param {string} eventType - Type of event
 * @param {string} username - Username involved
 * @param {string} details - Event details
 */
async function logSecurityEvent(eventType, username, details) {
  const event = {
    id: 'sec_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11),
    type: eventType,
    username: username || 'anonymous',
    timestamp: new Date().toISOString(),
    details: details,
    ip: 'client-side',
    userAgent: navigator.userAgent
  };
  
  try {
    await dbPut(STORE_SETTINGS, { 
      key: 'security_log_' + event.id, 
      value: event 
    });
    
    console.log('[SECURITY]', event);
  } catch (err) {
    console.error('Failed to log security event', err);
  }
}
