import client from './client';

export const adminApi = {
  getStats: () => client.get('/admin/stats')
};
