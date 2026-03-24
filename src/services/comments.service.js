import api from './api'

export const commentsService = {
  getByNotice: (noticeId) =>
    api.get(`/notices/${noticeId}/comments`),

  create: (noticeId, { body, parentId = null }) =>
    api.post(`/notices/${noticeId}/comments`, { body, parentId }),

  update: (commentId, body) =>
    api.put(`/comments/${commentId}`, { body }),

  delete: (commentId) =>
    api.delete(`/comments/${commentId}`),
}
