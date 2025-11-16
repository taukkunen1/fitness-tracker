/**
 * Theme Management System
 * Handles dark/light/auto theme switching with user preferences
 * @module core/theme
 */

// Theme state
let themeState = {
  currentTheme: 'dark', // 'dark', 'light', or 'auto'
  systemPreference: 'dark'
};

/**
 * Get the system's preferred color scheme
 * @returns {string} 'dark' or 'light'
 */
function getSystemThemePreference() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Apply theme to the document
 * @param {string} theme - 'dark', 'light', or 'auto'
 */
function applyTheme(theme) {
  const html = document.documentElement;
  const body = document.body;
  
  // Remove existing theme classes
  html.classList.remove('dark', 'light');
  body.classList.remove('dark', 'light');
  
  // Determine actual theme to apply
  let actualTheme = theme;
  if (theme === 'auto') {
    actualTheme = getSystemThemePreference();
  }
  
  // Apply theme classes
  if (actualTheme === 'light') {
    html.classList.add('light');
    body.classList.add('light');
    // Update body background for light mode
    body.className = 'light bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 text-slate-900 min-h-screen transition-colors duration-300';
  } else {
    html.classList.add('dark');
    body.classList.add('dark');
    // Keep dark mode background
    body.className = 'dark bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen transition-colors duration-300';
  }
  
  console.log(`[Theme] Applied theme: ${theme} (actual: ${actualTheme})`);
}

/**
 * Save theme preference for current user
 * @param {string} theme - 'dark', 'light', or 'auto'
 */
async function saveThemePreference(theme) {
  try {
    if (authState.isAuthenticated && authState.currentAccount) {
      // Save to IndexedDB settings store with username prefix
      const key = `theme_${authState.currentAccount.username}`;
      await dbPut(STORE_SETTINGS, { key, value: theme });
      
      // Also save to localStorage as fallback
      saveLS('ft_theme_' + authState.currentAccount.username, theme);
    } else {
      // Anonymous user - save to localStorage only
      saveLS('ft_theme_anonymous', theme);
    }
    
    themeState.currentTheme = theme;
    console.log(`[Theme] Saved preference: ${theme}`);
  } catch (err) {
    console.error('[Theme] Failed to save preference:', err);
    // Fallback to localStorage
    if (authState.isAuthenticated && authState.currentAccount) {
      saveLS('ft_theme_' + authState.currentAccount.username, theme);
    } else {
      saveLS('ft_theme_anonymous', theme);
    }
  }
}

/**
 * Load theme preference for current user
 * @returns {Promise<string>} Theme preference ('dark', 'light', or 'auto')
 */
async function loadThemePreference() {
  try {
    let savedTheme = null;
    
    if (authState.isAuthenticated && authState.currentAccount) {
      // Try to load from IndexedDB
      const key = `theme_${authState.currentAccount.username}`;
      const setting = await dbGet(STORE_SETTINGS, key);
      savedTheme = setting?.value;
      
      // Fallback to localStorage
      if (!savedTheme) {
        savedTheme = loadLS('ft_theme_' + authState.currentAccount.username);
      }
    } else {
      // Anonymous user - load from localStorage
      savedTheme = loadLS('ft_theme_anonymous');
    }
    
    // Default to auto if no preference saved
    const theme = savedTheme || 'auto';
    themeState.currentTheme = theme;
    console.log(`[Theme] Loaded preference: ${theme}`);
    return theme;
  } catch (err) {
    console.error('[Theme] Failed to load preference:', err);
    return 'auto';
  }
}

/**
 * Toggle between themes (dark -> light -> auto -> dark)
 */
async function toggleTheme() {
  const currentTheme = themeState.currentTheme;
  let newTheme;
  
  if (currentTheme === 'dark') {
    newTheme = 'light';
  } else if (currentTheme === 'light') {
    newTheme = 'auto';
  } else {
    newTheme = 'dark';
  }
  
  await saveThemePreference(newTheme);
  applyTheme(newTheme);
  
  // Refresh UI if on settings/profile page
  if (state.activeTab === 'perfil' || state.activeTab === 'settings') {
    render();
  }
  
  showNotification(`🎨 Tema alterado para: ${newTheme === 'dark' ? 'Escuro' : newTheme === 'light' ? 'Claro' : 'Automático'}`, 'success');
}

/**
 * Set specific theme
 * @param {string} theme - 'dark', 'light', or 'auto'
 */
async function setTheme(theme) {
  if (!['dark', 'light', 'auto'].includes(theme)) {
    console.error('[Theme] Invalid theme:', theme);
    return;
  }
  
  await saveThemePreference(theme);
  applyTheme(theme);
  
  // Refresh UI if needed
  if (state.activeTab === 'perfil' || state.activeTab === 'settings') {
    render();
  }
}

/**
 * Initialize theme system
 * Sets up theme based on user preference and listens for system changes
 */
async function initializeTheme() {
  // Get system preference
  themeState.systemPreference = getSystemThemePreference();
  
  // Load user preference
  const savedTheme = await loadThemePreference();
  
  // Apply theme
  applyTheme(savedTheme);
  
  // Listen for system theme changes
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
      themeState.systemPreference = e.matches ? 'dark' : 'light';
      console.log(`[Theme] System preference changed to: ${themeState.systemPreference}`);
      
      // Re-apply theme if in auto mode
      if (themeState.currentTheme === 'auto') {
        applyTheme('auto');
      }
    });
  }
  
  console.log('[Theme] Theme system initialized');
}

console.log('✅ Theme module loaded');
