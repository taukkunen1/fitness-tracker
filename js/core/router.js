/**
 * Router Module - Hash-based routing system
 * Handles navigation between different sections of the app
 */

// Current route state
let currentRoute = '';

// Route definitions
const routes = {
  '': 'dashboard',
  'dashboard': 'dashboard',
  'treino': 'treino',
  'nutricao': 'nutricao',
  'admin': 'admin',
  'admin_tasks': 'admin_tasks',
  'admin_suggestions': 'admin_suggestions',
  'admin_security': 'admin_security',
  'admin_access': 'admin_access',
  'suggestions': 'suggestions'
};

// Protected routes (require admin)
const protectedRoutes = [
  'admin',
  'admin_tasks',
  'admin_suggestions',
  'admin_security',
  'admin_access'
];

/**
 * Navigate to a specific route
 * @param {string} route - Route name
 */
function navigateTo(route) {
  // Normalize route
  const normalizedRoute = route.replace(/^#?\/?/, '');
  
  // Check if route exists
  if (!routes.hasOwnProperty(normalizedRoute) && normalizedRoute !== '') {
    console.warn('Route not found:', normalizedRoute);
    route = 'dashboard';
  }
  
  // Check if route requires admin
  if (protectedRoutes.includes(normalizedRoute)) {
    if (!isAdmin()) {
      console.warn('Access denied to admin route:', normalizedRoute);
      showNotification('⛔ Acesso negado. Apenas administradores podem acessar esta área.', 'error');
      navigateTo('dashboard');
      return;
    }
  }
  
  // Update URL hash
  window.location.hash = normalizedRoute;
  
  // Update current route
  currentRoute = normalizedRoute || 'dashboard';
  
  // Render the route
  if (typeof render === 'function') {
    render();
  }
}

/**
 * Get current route from URL hash
 * @returns {string} Current route
 */
function getCurrentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return hash || 'dashboard';
}

/**
 * Load route from URL hash
 */
function loadFromHash() {
  const route = getCurrentRoute();
  currentRoute = route;
  console.log('[Router] Loading route:', route);
}

/**
 * Initialize router
 */
function initRouter() {
  // Load initial route
  loadFromHash();
  
  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    loadFromHash();
    if (typeof render === 'function') {
      render();
    }
  });
  
  console.log('[Router] Initialized');
}

/**
 * Check if user is admin
 * @returns {boolean} True if admin
 */
function isAdmin() {
  return authState && authState.isAuthenticated && 
         authState.currentAccount && authState.currentAccount.role === 'admin';
}
