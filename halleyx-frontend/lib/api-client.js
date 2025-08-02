// lib/api-client.js
class ApiClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  // Get auth token from localStorage
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Create headers with auth token
  getHeaders() {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generate cache key for requests
  getCacheKey(url, options = {}) {
    const token = this.getAuthToken();
    return `${url}-${token}-${JSON.stringify(options)}`;
  }

  // Check if request is already pending
  isRequestPending(cacheKey) {
    return this.pendingRequests.has(cacheKey);
  }

  // Add pending request
  addPendingRequest(cacheKey, promise) {
    this.pendingRequests.set(cacheKey, promise);
    promise.finally(() => {
      this.pendingRequests.delete(cacheKey);
    });
  }

  // Make HTTP request with caching and deduplication
  async request(url, options = {}) {
    const fullUrl = `${this.baseURL}${url}`;
    const cacheKey = this.getCacheKey(url, options);
    
    // Check if request is already pending
    if (this.isRequestPending(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Check cache for GET requests
    if (options.method === 'GET' || !options.method) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes cache
        return cached.data;
      }
    }

    const promise = this.makeRequest(fullUrl, options, cacheKey);
    this.addPendingRequest(cacheKey, promise);
    return promise;
  }

  // Actual HTTP request
  async makeRequest(url, options, cacheKey) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful GET requests
      if (options.method === 'GET' || !options.method) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Convenience methods
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Clear cache for specific URL pattern
  clearCacheForPattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient; 