import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nh_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-clear session on 401 (token expired or invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nh_token')
      localStorage.removeItem('nh_user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
