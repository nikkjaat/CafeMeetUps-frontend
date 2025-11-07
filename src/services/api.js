// API service for backend communication
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    // Start with basic config
    const config = {
      ...options,
    };

    // Only set default Content-Type for non-FormData requests
    if (!options.body || !(options.body instanceof FormData)) {
      config.headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };
    } else {
      // For FormData, use the headers provided or empty object
      config.headers = {
        ...options.headers,
      };
    }

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    // Check if it's FormData or regular object
    let body,
      headers = {};

    if (userData instanceof FormData) {
      // For FormData, send as-is (no JSON.stringify)
      body = userData;
      // Don't set Content-Type - browser will set it with boundary
    } else {
      // For regular objects, send as JSON
      body = JSON.stringify(userData);
      headers["Content-Type"] = "application/json";
    }

    return this.request("/auth/register", {
      method: "POST",
      headers,
      body,
    });
  }

  async googleAuth(tokenId) {
    return this.request("/auth/google", {
      method: "POST",
      body: JSON.stringify({ tokenId }),
    });
  }

  async facebookAuth(tokenId) {
    return this.request("/auth/facebook", {
      method: "POST",
      body: JSON.stringify({ tokenId }),
    });
  }

  async getProfile() {
    return this.request("/auth/profile");
  }

  // In your api.js file
  async updateProfile(profileData) {
    // Check if it's FormData (for file uploads) or regular object
    const isFormData = profileData instanceof FormData;

    return this.request("/auth/profile", {
      method: "PUT",
      body: isFormData ? profileData : JSON.stringify(profileData),
      isFormData: isFormData, // Add this flag to handle headers properly
    });
  }

  async uploadProfileImage(formData) {
    return this.request("/auth/upload-avatar", {
      method: "POST",
      body: formData,
      // No Content-Type header for FormData
    });
  }

  // User endpoints
  async getUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/users${queryParams ? `?${queryParams}` : ""}`);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  // Match endpoints
  async swipeUser(userId, action) {
    return this.request("/matches/swipe", {
      method: "POST",
      body: JSON.stringify({ userId, action }),
    });
  }

  async getMatches() {
    return this.request("/matches");
  }

  async sendMessage(matchId, message) {
    return this.request("/messages", {
      method: "POST",
      body: JSON.stringify({ matchId, message }),
    });
  }

  async getMessages(matchId) {
    return this.request(`/messages/${matchId}`);
  }
}

export default new ApiService();
