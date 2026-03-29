import api from './api'

// Maps backend notification type → frontend display type
const TYPE_MAP = {
  new_announcement: 'notice',
  deadline_warning: 'deadline',
  comment_reply: 'comment',
  welcome: 'info',
  level_progressed: 'info',
}

export const normalizeNotification = (n) => ({
  id: n.id,
  type: TYPE_MAP[n.type] ?? 'info',
  title: n.title,
  body: n.body,
  reference_id: n.reference_id,
  is_read: n.is_read,
  createdAt: n.createdAt ?? n.created_at ?? null,
})

export const notificationsService = {
  getAll: (params) =>
    api.get('/notifications', { params }),

  markRead: (id) =>
    api.patch(`/notifications/${id}/read`),

  markAllRead: () =>
    api.patch('/notifications/read-all'),

  delete: (id) =>
    api.delete(`/notifications/${id}`),
}
