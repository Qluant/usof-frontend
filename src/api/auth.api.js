import client from './client';

export const authApi = {
  register: (data) => client.post('/auth/register', data),
  confirmEmail: (token) => client.get(`/auth/confirm-email/${token}`),
  login: (credentials) => client.post('/auth/login', credentials),
  logout: () => client.post('/auth/logout'),
  requestPasswordReset: (email) => client.post('/auth/password-reset', { email }),
  resetPassword: (token, password) => client.post(`/auth/password-reset/${token}`, { password })
};
