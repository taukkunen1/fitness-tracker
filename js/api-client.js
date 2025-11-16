/**
 * API Client for Fitness Tracker Backend
 * This client handles all HTTP requests to the backend API
 */

class FitnessTrackerAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('ft_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('ft_token', token);
    } else {
      localStorage.removeItem('ft_token');
    }
  }

  // Get authentication token
  getToken() {
    return this.token;
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(username, password) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return await this.request('/api/auth/me', {
      method: 'GET'
    });
  }

  async updateProfile(profileData) {
    return await this.request('/api/auth/updateprofile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async updatePassword(currentPassword, newPassword) {
    return await this.request('/api/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  logout() {
    this.setToken(null);
  }

  // Workout endpoints
  async getWorkouts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/api/workouts${queryParams ? '?' + queryParams : ''}`;
    return await this.request(endpoint, { method: 'GET' });
  }

  async getWorkout(id) {
    return await this.request(`/api/workouts/${id}`, { method: 'GET' });
  }

  async createWorkout(workoutData) {
    return await this.request('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workoutData)
    });
  }

  async updateWorkout(id, workoutData) {
    return await this.request(`/api/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workoutData)
    });
  }

  async deleteWorkout(id) {
    return await this.request(`/api/workouts/${id}`, { method: 'DELETE' });
  }

  // Meal endpoints
  async getMeals(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/api/meals${queryParams ? '?' + queryParams : ''}`;
    return await this.request(endpoint, { method: 'GET' });
  }

  async getMeal(id) {
    return await this.request(`/api/meals/${id}`, { method: 'GET' });
  }

  async createMeal(mealData) {
    return await this.request('/api/meals', {
      method: 'POST',
      body: JSON.stringify(mealData)
    });
  }

  async updateMeal(id, mealData) {
    return await this.request(`/api/meals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mealData)
    });
  }

  async deleteMeal(id) {
    return await this.request(`/api/meals/${id}`, { method: 'DELETE' });
  }

  // Metrics endpoints
  async getMetrics(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/api/metrics${queryParams ? '?' + queryParams : ''}`;
    return await this.request(endpoint, { method: 'GET' });
  }

  async createMetric(metricData) {
    return await this.request('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(metricData)
    });
  }

  async deleteMetric(id) {
    return await this.request(`/api/metrics/${id}`, { method: 'DELETE' });
  }

  // Progress Photos endpoints
  async getPhotos(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/api/photos${queryParams ? '?' + queryParams : ''}`;
    return await this.request(endpoint, { method: 'GET' });
  }

  async uploadPhoto(formData) {
    const url = `${this.baseURL}/api/photos`;
    const headers = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData // FormData should not have Content-Type header
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Photo upload failed');
      }

      return data;
    } catch (error) {
      console.error('Photo Upload Error:', error);
      throw error;
    }
  }

  async deletePhoto(id) {
    return await this.request(`/api/photos/${id}`, { method: 'DELETE' });
  }
}

// Export for use in frontend
if (typeof window !== 'undefined') {
  window.FitnessTrackerAPI = FitnessTrackerAPI;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FitnessTrackerAPI;
}
