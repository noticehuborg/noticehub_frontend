import api from './api'

export const postsService = {
  getMyPosts: (params) =>
    api.get('/posts/my', { params }),

  getById: (id) =>
    api.get(`/posts/${id}`),

  create: (data) =>
    api.post('/posts', data),

  update: (id, data) =>
    api.put(`/posts/${id}`, data),

  delete: (id) =>
    api.delete(`/posts/${id}`),

  publish: (id) =>
    api.put(`/posts/${id}/publish`),

  draft: (id) =>
    api.put(`/posts/${id}/draft`),

  togglePin: (id) =>
    api.put(`/posts/${id}/pin`),
}
