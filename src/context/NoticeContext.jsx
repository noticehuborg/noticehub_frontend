import { createContext, useReducer, useEffect } from 'react'
import { mockNotices, mockDeadlines } from '../services/mockData'

export const NoticeContext = createContext(null)

const initialState = {
  notices: [],
  deadlines: [],
  activeFilter: 'all',
  loading: true,
}

function noticeReducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, notices: action.payload.notices, deadlines: action.payload.deadlines, loading: false }
    case 'SET_FILTER':
      return { ...state, activeFilter: action.payload }
    default:
      return state
  }
}

export function NoticeProvider({ children }) {
  const [state, dispatch] = useReducer(noticeReducer, initialState)

  useEffect(() => {
    // Simulate async fetch
    setTimeout(() => {
      dispatch({ type: 'LOAD', payload: { notices: mockNotices, deadlines: mockDeadlines } })
    }, 500)
  }, [])

  function setFilter(filter) {
    dispatch({ type: 'SET_FILTER', payload: filter })
  }

  const filteredNotices =
    state.activeFilter === 'all'
      ? state.notices
      : state.notices.filter((n) => n.type === state.activeFilter)

  return (
    <NoticeContext.Provider value={{ ...state, filteredNotices, setFilter }}>
      {children}
    </NoticeContext.Provider>
  )
}
