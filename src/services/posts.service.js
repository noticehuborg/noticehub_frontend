import api from './api'

export const postsService = {
  getMyPosts: (params) =>
    api.get('/announcements/my-posts', { params }),

  getById: (id) =>
    api.get(`/announcements/${id}`),

  create: (data) =>
    api.post('/announcements', data),

  update: (id, data) =>
    api.patch(`/announcements/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) =>
    api.delete(`/announcements/${id}`),

  publish: (id) =>
    api.patch(`/announcements/${id}/publish`),

  draft: (id) =>
    api.patch(`/announcements/${id}`, { status: 'draft' }),

  togglePin: (id) =>
    api.patch(`/announcements/${id}/pin`),
}
