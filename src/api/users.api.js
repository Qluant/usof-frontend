import client from './client';

export const usersApi = {
  getAll: () => client.get('/users'),
  getById: (id) => client.get(`/users/${id}`),
  create: (data) => client.post('/users', data),
  update: (id, data) => client.patch(`/users/${id}`, data),
  delete: (id) => client.delete(`/users/${id}`),
  uploadAvatar: (formData) =>
    client.patch('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getFavorites: () => client.get('/users/favorites')
};
