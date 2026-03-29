import api from './api'

export const normalizeResource = (r) => ({
  id: r.id,
  title: r.title,
  description: r.description ?? '',
  type: r.type,           // 'telegram' | 'drive' | 'youtube' | 'file'
  url: r.url ?? null,
  fileUrl: r.file_url ?? null,
  fileName: r.file_name ?? null,
  fileSizeBytes: r.file_size_bytes ?? null,
  program: r.program ?? null,
  level: r.level ?? null,
  author: r.author?.full_name ?? null,
  authorId: r.author?.id ?? null,
  createdAt: r.createdAt ?? r.created_at ?? null,
})

// Normalizes a raw Attachment (from GET /announcements/attachments) into the
// same shape as a Resource so ResourceCard can render it without changes.
export const normalizeAttachment = (a) => ({
  id:           `att_${a.id}`,
  title:        a.file_name,
  description:  a.announcement?.title ?? '',
  type:         'file',
  url:          null,
  fileUrl:      a.file_url,
  fileName:     a.file_name,
  fileSizeBytes: a.file_size ?? null,
  program:      a.announcement?.program ?? null,
  level:        a.announcement?.level ?? null,
  author:       a.announcement?.author?.full_name ?? null,
  authorId:     a.announcement?.author?.id ?? null,
  createdAt:    a.createdAt ?? a.created_at ?? null,
  // Extra context for the Files tab
  sourceNotice: a.announcement?.title ?? null,
})

export const resourcesService = {
  getAll: (params = {}) =>
    api.get('/resources', { params }),

  getMine: () =>
    api.get('/resources', { params: { mine: true } }),

  /** Fetch all attachments from published announcements scoped to the user's program+level */
  getAttachments: () =>
    api.get('/announcements/attachments'),

  create: (formData) =>
    api.post('/resources', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, formData) =>
    api.patch(`/resources/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) =>
    api.delete(`/resources/${id}`),
}
