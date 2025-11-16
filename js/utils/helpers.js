/**
 * Utility Helpers
 * General purpose helper functions used throughout the application
 */

/**
 * Parse a string to number safely
 * @param {string|number} value - Value to parse
 * @returns {number} Parsed number or 0
 */
function parseNumber(value) {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Format date to localized string
 * @param {Date|string} date - Date object or ISO string
 * @param {string} locale - Locale code (default: 'pt-BR')
 * @returns {string} Formatted date string
 */
function formatDateLocale(date, locale = 'pt-BR') {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale);
}

/**
 * Format datetime to localized string
 * @param {Date|string} date - Date object or ISO string
 * @param {string} locale - Locale code (default: 'pt-BR')
 * @returns {string} Formatted datetime string
 */
function formatDateTimeLocale(date, locale = 'pt-BR') {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale);
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique ID
 */
function generateId(prefix = '') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 11);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {number} Percentage
 */
function calculatePercentage(value, total, decimals = 0) {
  if (total === 0) return 0;
  const percentage = (value / total) * 100;
  return decimals > 0 ? parseFloat(percentage.toFixed(decimals)) : Math.round(percentage);
}

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

/**
 * Sort array by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {boolean} ascending - Sort order (default: true)
 * @returns {Array} Sorted array
 */
function sortBy(array, key, ascending = true) {
  return array.sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
}

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Get property from nested object safely
 * @param {Object} obj - Object to get from
 * @param {string} path - Path to property (e.g., 'user.profile.name')
 * @param {any} defaultValue - Default value if not found
 * @returns {any} Property value or default
 */
function getNestedProperty(obj, path, defaultValue = undefined) {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && result.hasOwnProperty(key)) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }
  
  return result;
}

/**
 * Download data as file
 * @param {string} data - Data to download
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type (default: 'text/plain')
 */
function downloadFile(data, filename, mimeType = 'text/plain') {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Show notification
 * @param {string} message - Message to show
 * @param {string} type - Type of notification ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };
  
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('animate-fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @param {string} locale - Locale code (default: 'pt-BR')
 * @returns {string} Formatted number
 */
function formatNumber(num, locale = 'pt-BR') {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Truncate string
 * @param {string} str - String to truncate
 * @param {number} length - Max length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
function truncate(str, length, suffix = '...') {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}
