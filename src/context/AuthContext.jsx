import { createContext, useReducer, useEffect } from 'react'
import { authService, normalizeUser } from '../services/auth.service'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'nh_token'
const REFRESH_KEY = 'nh_refresh_token'
const USER_KEY = 'nh_user'

const initialState = {
  user: null,
  token: null,
  status: 'idle', // 'idle' | 'loading' | 'error'
  initializing: true, // true until localStorage check is complete
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, status: 'loading' }
    case 'LOGIN':
      return { user: action.payload.user, token: action.payload.token, status: 'idle', initializing: false }
    case 'LOGOUT':
      return { user: null, token: null, status: 'idle', initializing: false }
    case 'IDLE':
      return { ...state, status: 'idle' }
    case 'ERROR':
      return { ...state, status: 'error' }
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } }
    case 'INIT_DONE':
      return { ...state, initializing: false }
    default:
      return state
  }
}

function persist(user, token, refreshToken) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
}

function clearStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Restore + validate session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const raw = localStorage.getItem(USER_KEY)

    if (!token || !raw) {
      dispatch({ type: 'INIT_DONE' })
      return
    }

    // Optimistically restore from storage, then verify with backend
    try {
      dispatch({ type: 'LOGIN', payload: { user: JSON.parse(raw), token } })
    } catch {
      clearStorage()
      dispatch({ type: 'INIT_DONE' })
      return
    }

    // Silently validate token is still good
    authService.getProfile()
      .then(({ data }) => {
        const user = normalizeUser(data.data.user)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        dispatch({ type: 'LOGIN', payload: { user, token } })
      })
      .catch(() => {
        clearStorage()
        dispatch({ type: 'LOGOUT' })
      })
  }, [])

  async function login(email, password) {
    dispatch({ type: 'LOADING' })
    try {
      const { data } = await authService.login(email, password)
      const user = normalizeUser(data.data.user)
      const token = data.data.access_token
      const refreshToken = data.data.refresh_token
      persist(user, token, refreshToken)
      dispatch({ type: 'LOGIN', payload: { user, token } })
      return user
    } catch (err) {
      dispatch({ type: 'ERROR' })
      throw err
    }
  }

  async function register(name, email, password, program, level) {
    dispatch({ type: 'LOADING' })
    try {
      const { data } = await authService.register(name, email, password, program, level)
      // After register, user must verify OTP before they can log in.
      // Return the email so the OTP modal can use it.
      dispatch({ type: 'IDLE' })
      return { email: data.data?.email ?? email }
    } catch (err) {
      dispatch({ type: 'ERROR' })
      throw err
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch {
      // ignore server errors on logout
    }
    clearStorage()
    dispatch({ type: 'LOGOUT' })
  }

  function updateUser(patch) {
    const updated = { ...state.user, ...patch }
    localStorage.setItem(USER_KEY, JSON.stringify(updated))
    dispatch({ type: 'UPDATE_USER', payload: patch })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
