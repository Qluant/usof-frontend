import client from './client';

export const categoriesApi = {
  getAll: () => client.get('/categories'),
  getById: (id) => client.get(`/categories/${id}`),
  getCategoryPosts: (id, params) => client.get(`/categories/${id}/posts`, { params }),
  create: (data) => client.post('/categories', data),
  update: (id, data) => client.patch(`/categories/${id}`, data),
  delete: (id) => client.delete(`/categories/${id}`)
};
