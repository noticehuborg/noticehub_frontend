import axios from 'axios'

const TOKEN_KEY = 'nh_token'
const REFRESH_KEY = 'nh_refresh_token'
const USER_KEY = 'nh_user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// POST routes where idempotency keys must NOT be auto-generated
// (login/refresh/logout are safe to replay and don't create resources)
const IDEMPOTENCY_SKIP = ['/auth/login', '/auth/refresh', '/auth/logout']

// Attach auth token + idempotency key to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`

  // Auto-generate a stable idempotency key for resource-creating POST requests.
  // The key is written onto config.headers the first time through so retries
  // (which reuse the same config object) send the exact same key to the backend.
  if (
    config.method === 'post' &&
    !config.headers['Idempotency-Key'] &&
    !IDEMPOTENCY_SKIP.some((path) => config.url?.includes(path))
  ) {
    config.headers['Idempotency-Key'] = crypto.randomUUID()
  }

  return config
})

// On 401: try refresh, then retry; on failure clear session
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)))
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Only attempt refresh on 401 and only once per request
    if (error.response?.status === 401 && !original._retry) {
      const token = localStorage.getItem(TOKEN_KEY)
      const refreshToken = localStorage.getItem(REFRESH_KEY)

      // No credentials at all — user was never logged in, just propagate the error
      if (!token && !refreshToken) {
        return Promise.reject(error)
      }

      if (!refreshToken) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_KEY)
        localStorage.removeItem(USER_KEY)
        window.location.href = '/'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`
            return api(original)
          })
          .catch((err) => Promise.reject(err))
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refresh_token: refreshToken }
        )
        const newToken = data.data.access_token
        const newRefresh = data.data.refresh_token

        localStorage.setItem(TOKEN_KEY, newToken)
        if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh)

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)

        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_KEY)
        localStorage.removeItem(USER_KEY)
        window.location.href = '/'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
