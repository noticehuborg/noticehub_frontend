import api from './api'

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatRole = (role) => {
  const map = {
    student:    'Student',
    course_rep: 'Course Rep',
    lecturer:   'Lecturer',
    admin:      'Admin',
  }
  return map[role] ?? role ?? null
}

const formatFileSize = (bytes) => {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Normalizer ────────────────────────────────────────────────────────────────

// Maps backend announcement shape → frontend notice shape.
// All UI components (DashNoticeCard, NoticePreview, DeadlinesPage, etc.)
// consume this normalized shape exclusively.
// Sequelize `underscored:true` stores created_at/updated_at in the DB but
// serialises them as createdAt/updatedAt (camelCase) in JSON.  Support both
// spellings so the normaliser works whether or not the record went through
// withCommentCount (which calls toJSON) or a raw query.
const pickDate = (a, camel, snake) => a[camel] ?? a[snake] ?? null

// Backend stores category as 'exams' (plural) but the frontend CATEGORY map
// and filter pills use 'exam' (singular).  Normalise on ingress so all
// frontend code is consistent.
const normaliseCategory = (cat) => (cat === 'exams' ? 'exam' : cat ?? 'general')

export const normalizeNotice = (a) => {
  const createdAt   = pickDate(a, 'createdAt', 'created_at')
  const updatedAt   = pickDate(a, 'updatedAt', 'updated_at')
  const publishedAt = pickDate(a, 'publishedAt', 'published_at')

  return {
    id:          a.id,
    title:       a.title,
    body:        a.body,
    type:        normaliseCategory(a.category), // backend: category → frontend: type
    course:      a.course ?? null,
    status:      a.status,
    program:     a.program,
    level:       a.level,
    is_pinned:   a.is_pinned,
    deadline:    a.deadline ?? null,
    useful_links: a.useful_links ?? [],
    attachments: (a.attachments ?? []).map((att) => ({
      id:        att.id,
      name:      att.file_name,
      size:      formatFileSize(att.file_size),
      type:      att.file_type,
      url:       att.file_url,
      public_id: att.public_id,
    })),
    comment_count: a.comment_count ?? 0,
    view_count:    a.view_count ?? 0,
    createdAt,
    updatedAt,
    publishedAt,

    // Aliases used directly by UI components
    // "Edited" means the notice was changed AFTER its first publish — not just that updated_at
    // differs from created_at (which also happens when a draft is published for the first time).
    editedAt:     publishedAt && updatedAt && updatedAt > publishedAt ? updatedAt : null,
    date:         publishedAt && updatedAt && updatedAt > publishedAt ? updatedAt : createdAt,
    dueDate:      a.deadline ?? null,
    pinned:       a.is_pinned ?? false,
    links:        (a.useful_links ?? []).map((lnk, i) => ({
      id:   i,
      ...lnk,
      // Normalise the description field — backend may store it as label, title, or desc.
      // Use || so an empty-string desc falls through to label (same logic as LinkCard).
      desc: lnk.desc || lnk.label || lnk.title || '',
      url:  lnk.url ?? '',
    })),
    commentCount: a.comment_count ?? 0,

    // Flat author fields
    author:       a.author?.full_name ?? null,
    authorAvatar: a.author?.avatar_url ?? null,
    authorRole:   formatRole(a.author?.role),
    authorData:   a.author ?? null,
  }
}

// ── Service ───────────────────────────────────────────────────────────────────

export const noticesService = {
  getAll: (params = {}) => {
    // Map frontend 'type' param → backend 'category'
    // Also remap 'exam' → 'exams' to match the backend ENUM
    const { type, ...rest } = params
    const query = { ...rest }
    if (type && type !== 'all') {
      query.category = type === 'exam' ? 'exams' : type
    }
    return api.get('/announcements', { params: query })
  },

  getById: (id) =>
    api.get(`/announcements/${id}`),

  getDeadlines: (params) =>
    api.get('/announcements/deadlines', { params }),

  search: (q, params = {}) =>
    api.get('/announcements/search', { params: { search: q, ...params } }),

  create: (data) =>
    api.post('/announcements', data),

  update: (id, data) =>
    api.patch(`/announcements/${id}`, data),

  delete: (id) =>
    api.delete(`/announcements/${id}`),

  pin: (id) =>
    api.patch(`/announcements/${id}/pin`),

  unpin: (id) =>
    api.patch(`/announcements/${id}/pin`),
}
