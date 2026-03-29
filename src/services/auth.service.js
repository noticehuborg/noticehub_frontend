import api from './api'

// Maps backend user shape → frontend user shape
export const normalizeUser = (u) => {
  const rawDate = u.createdAt ?? u.created_at ?? null
  return {
    id: u.id,
    name: u.full_name,
    email: u.email,
    role: u.role,
    program: u.program ?? null,
    level: u.level ?? null,
    avatar_url: u.avatar_url ?? null,
    // Lecturer-specific fields (null/[] for non-lecturer roles)
    position: u.position ?? null,
    // courses: array of { id, code, name, program, level } for lecturers
    courses: u.courses ?? [],
    must_reset_password: u.must_reset_password ?? false,
    // Preserve raw ISO timestamp so components can format it however they need
    createdAt: rawDate,
    memberSince: rawDate
      ? new Date(rawDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '—',
  }
}

export const authService = {
  /** Returns [{ value, label, levels: ['100','200',...] }] for active programs */
  getPrograms: () =>
    api.get('/auth/programs'),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (name, email, password, program, level) =>
    api.post('/auth/register', { full_name: name, email, password, program, level }),

  logout: () =>
    api.post('/auth/logout'),

  getProfile: () =>
    api.get('/users/me'),

  updateProfile: (data) => {
    const formData = new FormData()
    if (data.name) formData.append('full_name', data.name)
    if (data.avatar) formData.append('avatar', data.avatar)
    return api.patch('/users/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  changePassword: ({ currentPassword, newPassword }) =>
    api.patch('/users/me/password', { current_password: currentPassword, new_password: newPassword }),

  requestPasswordReset: (email) =>
    api.post('/auth/forgot-password', { email }),

  verifyOtp: (email, otp) =>
    api.post('/auth/verify-otp', { email, otp }),

  resendOtp: (email) =>
    api.post('/auth/resend-otp', { email }),

  resetPassword: ({ token, newPassword }) =>
    api.post('/auth/reset-password', { token, password: newPassword }),

  requestLevelCorrection: ({ requested_level, reason }) =>
    api.post('/users/me/level-correction', { requested_level, reason }),

  deleteAccount: () =>
    api.delete('/users/me'),
}
