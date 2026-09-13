import { api } from './api';

export const questService = {
  async getQuests(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.status) params.append('status', filters.status);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/api/game/tasks/${queryString}`);
  },

  async getQuest(id) {
    return api.get(`/api/game/tasks/${id}/`);
  },

  async createQuest(questData) {
    return api.post('/api/game/tasks/', questData);
  },

  async updateQuest(id, questData) {
    return api.patch(`/api/game/tasks/${id}/`, questData);
  },

  async deleteQuest(id) {
    return api.delete(`/api/game/tasks/${id}/`);
  },

  async completeQuest(id) {
    return api.post(`/api/game/tasks/${id}/complete/`);
  },

  async getCharacter() {
    return api.get('/api/game/character/');
  },

  async getStats() {
    return api.get('/api/game/stats/');
  },

  async getProgression() {
    return api.get('/api/game/progression/');
  },

  async getStreak() {
    return api.get('/api/game/streak/');
  },

  async getBadges() {
    return api.get('/api/game/badges/');
  },

  async getHistory(limit = 50) {
    return api.get(`/api/game/history/?limit=${limit}`);
  },

  async getXpHistory() {
    return api.get('/api/game/xp-history/');
  },

  async getGoldHistory() {
    return api.get('/api/game/gold-history/');
  },
};
