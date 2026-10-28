import client from './client';

export const postsApi = {
  getPosts: (params) => client.get('/posts', { params }),
  getPostById: (id) => client.get(`/posts/${id}`),
  createPost: (data) => client.post('/posts', data),
  updatePost: (id, data) => client.patch(`/posts/${id}`, data),
  deletePost: (id) => client.delete(`/posts/${id}`),
  getPostCategories: (id) => client.get(`/posts/${id}/categories`),
  getPostLikes: (id) => client.get(`/posts/${id}/like`),
  votePost: (id, type) => client.post(`/posts/${id}/like`, { type }),
  deletePostVote: (id) => client.delete(`/posts/${id}/like`),
  toggleFavorite: (id) => client.post(`/posts/${id}/favorite`)
};
