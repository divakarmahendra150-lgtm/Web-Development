import { api } from './api';

export const authService = {
  async register(userData) {
    const data = await api.post('/api/auth/register/', userData);
    if (data.access) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
    }
    return data;
  },

  async login(credentials) {
    const data = await api.post('/api/auth/login/', credentials);
    if (data.access) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
    }
    return data;
  },

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        await api.post('/api/auth/logout/', { refresh: refreshToken });
      }
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  async getMe() {
    return api.get('/api/auth/me/');
  },

  async updateProfile(profileData) {
    return api.patch('/api/auth/profile/', profileData);
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};
