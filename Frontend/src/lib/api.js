const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const api = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  // User Management APIs
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  },

  searchUsers: async (query) => {
    const response = await fetch(`${API_BASE_URL}/search-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });
    return response.json();
  },

  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  getSignupLogs: async () => {
    const response = await fetch(`${API_BASE_URL}/signup-logs`);
    return response.json();
  }
};
