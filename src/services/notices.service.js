import api from './api'

export const noticesService = {
  getAll: (params) =>
    api.get('/notices', { params }),

  getById: (id) =>
    api.get(`/notices/${id}`),

  getDeadlines: (params) =>
    api.get('/notices/deadlines', { params }),

  create: (data) =>
    api.post('/notices', data),

  update: (id, data) =>
    api.put(`/notices/${id}`, data),

  delete: (id) =>
    api.delete(`/notices/${id}`),

  pin: (id) =>
    api.put(`/notices/${id}/pin`),

  unpin: (id) =>
    api.put(`/notices/${id}/unpin`),
}
