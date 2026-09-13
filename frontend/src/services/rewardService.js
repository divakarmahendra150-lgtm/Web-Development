import { api } from './api';

export const rewardService = {
  async getRewards() {
    return api.get('/api/rewards/');
  },

  async getReward(id) {
    return api.get(`/api/rewards/${id}/`);
  },

  async purchaseReward(id) {
    return api.post(`/api/rewards/${id}/purchase/`);
  },

  async getInventory() {
    return api.get('/api/rewards/inventory/');
  },

  async equipItem(id) {
    return api.post(`/api/rewards/inventory/${id}/equip/`);
  },

  async unequipItem(id) {
    return api.post(`/api/rewards/inventory/${id}/unequip/`);
  },
};
