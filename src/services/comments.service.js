import api from './api'

export const commentsService = {
  getByNotice: (noticeId) =>
    api.get(`/announcements/${noticeId}/comments`),

  create: (noticeId, { body, parentId = null }) => {
    if (parentId) {
      // Reply to an existing comment
      return api.post(`/comments/${parentId}/reply`, { body })
    }
    // Top-level comment on an announcement
    return api.post(`/announcements/${noticeId}/comments`, { body })
  },

  update: (commentId, body) =>
    api.patch(`/comments/${commentId}`, { body }),

  delete: (commentId) =>
    api.delete(`/comments/${commentId}`),
}
