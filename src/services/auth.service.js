import api from './api'

export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (name, email, password, program, level) =>
    api.post('/auth/register', { name, email, password, program, level }),

  logout: () =>
    api.post('/auth/logout'),

  getProfile: () =>
    api.get('/auth/me'),

  updateProfile: (data) =>
    api.put('/auth/profile', data),

  changePassword: ({ currentPassword, newPassword }) =>
    api.put('/auth/password', { currentPassword, newPassword }),

  requestPasswordReset: (email) =>
    api.post('/auth/forgot-password', { email }),

  verifyOtp: (email, otp) =>
    api.post('/auth/verify-otp', { email, otp }),

  resetPassword: ({ token, newPassword }) =>
    api.post('/auth/reset-password', { token, newPassword }),
}
