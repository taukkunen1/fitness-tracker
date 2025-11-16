/**
 * Application State Management
 * Global state object for the fitness tracker application
 * @module core/state
 */

/**
 * Main application state
 * Holds all application data and current UI state
 */
let state = {
  activeTab: 'dashboard',
  activeUser: 'pedro',
  users: {},
  comparisons: [],
  references: [],
  currentDay: new Date().toISOString().split('T')[0], // For day-by-day meal navigation
  currentWorkoutDay: new Date().toISOString().split('T')[0], // For day-by-day workout navigation
  customMeals: [], // User-defined meals with nutrition info
  progressPhotos: [], // Progress photos with date and metadata
  currentMealComposition: { // For building composed meals
    name: '',
    components: [], // Array of { foodName, weight, prot, carb, fat, kcal }
    totalProt: 0,
    totalCarb: 0,
    totalFat: 0,
    totalKcal: 0,
    totalWeight: 0
  },
  compareProfile1: null, // For profile comparison feature
  compareProfile2: null  // For profile comparison feature
};

/**
 * Chart holder for muscle mass chart
 */
let muscleChart = null;

console.log('✅ State module loaded');
