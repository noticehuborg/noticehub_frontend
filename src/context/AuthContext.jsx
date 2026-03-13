import { createContext, useReducer } from 'react'

export const AuthContext = createContext(null)

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
      return initialState
    case 'ERROR':
      return { ...state, status: 'error' }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  function login(email, password) {
    dispatch({ type: 'LOADING' })
    // Mock login — replace with real API call
    setTimeout(() => {
      dispatch({
        type: 'LOGIN',
        payload: { user: { email, name: 'Student' }, token: 'mock-token' },
      })
    }, 800)
  }

  function register(name, email, password) {
    dispatch({ type: 'LOADING' })
    // Mock register — replace with real API call
    setTimeout(() => {
      dispatch({
        type: 'LOGIN',
        payload: { user: { email, name }, token: 'mock-token' },
      })
    }, 800)
  }

  function logout() {
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
