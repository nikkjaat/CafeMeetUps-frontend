// services/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const config = {
      ...options,
      headers: {
        ...options.headers,
      },
    };

    // Remove Content-Type for FormData (let browser set it)
    if (options.body && options.body instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (options.body && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
      if (typeof options.body === "object") {
        config.body = JSON.stringify(options.body);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🌐 API Call: ${config.method || "GET"} ${url}`);
    console.log("📤 Request config:", {
      headers: config.headers,
      hasBody: !!config.body,
      bodyType: config.body instanceof FormData ? "FormData" : "JSON",
    });

    try {
      const response = await fetch(url, config);
      console.log(
        `📥 Response status: ${response.status} ${response.statusText}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 API Success Response:", data);
      return data;
    } catch (error) {
      console.error("❌ API Request Error:", error);
      throw error;
    }
  }

  // ============ AUTH ENDPOINTS ============
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: credentials,
    });
  }

  async register(userData) {
    let body,
      headers = {};

    if (userData instanceof FormData) {
      body = userData;
    } else {
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
      body: { tokenId },
    });
  }

  async facebookAuth(tokenId) {
    return this.request("/auth/facebook", {
      method: "POST",
      body: { tokenId },
    });
  }

  async getProfile() {
    return this.request("/auth/profile");
  }

  async updateProfile(profileData) {
    const isFormData = profileData instanceof FormData;
    return this.request("/auth/profile", {
      method: "PUT",
      body: isFormData ? profileData : JSON.stringify(profileData),
    });
  }

  async uploadProfileImage(formData) {
    return this.request("/auth/upload-avatar", {
      method: "POST",
      body: formData,
    });
  }

  // ============ USER ENDPOINTS ============
  async getUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/users${queryParams ? `?${queryParams}` : ""}`);
  }

  async getFilteredUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(
      `/users/filtered${queryParams ? `?${queryParams}` : ""}`
    );
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  async updateUserPreferences(preferences) {
    return this.request("/users/preferences", {
      method: "PUT",
      body: preferences,
    });
  }

  // ============ MATCH ENDPOINTS ============
  async likeUser(userId) {
    return this.request(`/matches/like/${userId}`, {
      method: "POST",
    });
  }

  async swipeUser(userId, action) {
    return this.request("/matches/swipe", {
      method: "POST",
      body: { userId, action },
    });
  }

  async superLikeUser(userId) {
    return this.request(`/matches/super-like/${userId}`, {
      method: "POST",
    });
  }

  async getMatches() {
    return this.request("/matches");
  }

  async getMatchById(matchId) {
    return this.request(`/matches/${matchId}`);
  }

  async unmatchUser(matchId) {
    return this.request(`/matches/${matchId}`, {
      method: "DELETE",
    });
  }

  // ============ MESSAGE ENDPOINTS ============
  async sendMessage(messageData) {
    return this.request("/matches/messages", {
      method: "POST",
      body: messageData,
    });
  }

  async getMessages(matchId) {
    console.log(matchId);
    return this.request(`/matches/messages/${matchId}`);
  }

  async markMessageAsRead(messageId) {
    return this.request(`/matches/messages/${messageId}/read`, {
      method: "PUT",
    });
  }

  async deleteMessage(messageId) {
    return this.request(`/matches/messages/${messageId}`, {
      method: "DELETE",
    });
  }

  // ============ PREFERENCES & SETTINGS ============
  async updateDiscoverySettings(settings) {
    return this.request("/users/discovery-settings", {
      method: "PUT",
      body: settings,
    });
  }

  async updateNotificationSettings(settings) {
    return this.request("/users/notification-settings", {
      method: "PUT",
      body: settings,
    });
  }

  // ============ PROFILE INTERACTIONS ============
  async reportUser(userId, reason) {
    return this.request("/reports", {
      method: "POST",
      body: { reportedUserId: userId, reason },
    });
  }

  async blockUser(userId) {
    return this.request("/block", {
      method: "POST",
      body: { userId },
    });
  }

  async getBlockedUsers() {
    return this.request("/block");
  }

  async unblockUser(userId) {
    return this.request(`/block/${userId}`, {
      method: "DELETE",
    });
  }

  // ============ PREMIUM FEATURES ============
  async getPremiumFeatures() {
    return this.request("/premium/features");
  }

  async purchasePremium(planId) {
    return this.request("/premium/purchase", {
      method: "POST",
      body: { planId },
    });
  }

  async getSuperLikeCount() {
    return this.request("/premium/superlikes");
  }

  // ============ ANALYTICS & INSIGHTS ============
  async getSwipeStats() {
    return this.request("/analytics/swipes");
  }

  async getMatchStats() {
    return this.request("/analytics/matches");
  }

  async getProfileViews() {
    return this.request("/analytics/profile-views");
  }
}

export default new ApiService();
