import { createContext, useReducer, useEffect } from 'react'
// TODO: import { authService } from '../services/auth.service' — uncomment when backend is ready

export const AuthContext = createContext(null)

const TOKEN_KEY = 'nh_token'
const USER_KEY  = 'nh_user'

const initialState = {
  user: null,
  token: null,
  status: 'idle', // 'idle' | 'loading' | 'error'
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, status: 'loading' }
    case 'LOGIN':
      return { user: action.payload.user, token: action.payload.token, status: 'idle' }
    case 'LOGOUT':
      return { user: null, token: null, status: 'idle' }
    case 'ERROR':
      return { ...state, status: 'error' }
    default:
      return state
  }
}

function persist(user, token) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const raw   = localStorage.getItem(USER_KEY)
    if (!token || !raw) return
    try {
      dispatch({ type: 'LOGIN', payload: { user: JSON.parse(raw), token } })
    } catch {
      clearStorage()
    }
    // TODO: optionally verify token is still valid →
    // authService.getProfile().then(({ data }) => dispatch({ type: 'LOGIN', payload: { user: data, token } }))
    //   .catch(() => { clearStorage(); dispatch({ type: 'LOGOUT' }) })
  }, [])

  function login(email, password) {
    dispatch({ type: 'LOADING' })
    // TODO: replace mock with → authService.login(email, password).then(({ data }) => { ... })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const user = {
            email,
            name: 'Eliah Abormegah',
            role: 'course_rep',
            program: 'Bsc. Computer Science',
            level: 'Level 300',
          }
          const token = 'mock-token'
          persist(user, token)
          dispatch({ type: 'LOGIN', payload: { user, token } })
          resolve(user)
        } catch (err) {
          dispatch({ type: 'ERROR' })
          reject(err)
        }
      }, 800)
    })
  }

  function register(name, email, password, program, level) {
    dispatch({ type: 'LOADING' })
    // TODO: replace mock with → authService.register(name, email, password, program, level).then(({ data }) => { ... })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const user = { email, name, role: 'student', program, level }
          const token = 'mock-token'
          persist(user, token)
          dispatch({ type: 'LOGIN', payload: { user, token } })
          resolve(user)
        } catch (err) {
          dispatch({ type: 'ERROR' })
          reject(err)
        }
      }, 800)
    })
  }

  function logout() {
    // TODO: also call → authService.logout().catch(() => {}) — to invalidate server session
    clearStorage()
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
