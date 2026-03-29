import { createContext, useReducer, useEffect, useCallback } from 'react'
import { noticesService, normalizeNotice } from '../services/notices.service'
import { useAuth } from '../hooks/useAuth'

export const NoticeContext = createContext(null)

const initialState = {
  notices: [],
  deadlines: [],
  activeFilter: 'all',
  loading: false,
  initialized: false, // true after first successful fetch (or error)
  error: null,
}

function noticeReducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null }
    case 'LOAD':
      return {
        ...state,
        notices: action.payload.notices,
        deadlines: action.payload.deadlines,
        loading: false,
        initialized: true,
        error: null,
      }
    case 'ERROR':
      return { ...state, loading: false, initialized: true, error: action.payload }
    case 'SET_FILTER':
      return { ...state, activeFilter: action.payload }
    case 'UPDATE_COMMENT_COUNT':
      return {
        ...state,
        notices: state.notices.map((n) =>
          n.id === action.payload.id
            ? { ...n, commentCount: (n.commentCount ?? 0) + 1 }
            : n
        ),
      }
    default:
      return state
  }
}

export function NoticeProvider({ children }) {
  const [state, dispatch] = useReducer(noticeReducer, initialState)
  const { user } = useAuth()

  const fetchNotices = useCallback(async () => {
    dispatch({ type: 'LOADING' })
    try {
      const [noticesRes, deadlinesRes] = await Promise.all([
        noticesService.getAll(),
        noticesService.getDeadlines(),
      ])
      const notices = (noticesRes.data?.data?.announcements ?? []).map(normalizeNotice)
      const deadlines = (deadlinesRes.data?.data?.announcements ?? []).map(normalizeNotice)
      dispatch({ type: 'LOAD', payload: { notices, deadlines } })
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err?.message ?? 'Failed to load notices' })
    }
  }, [])

  useEffect(() => {
    if (!user) return
    fetchNotices()
  }, [user, fetchNotices])

  function setFilter(filter) {
    dispatch({ type: 'SET_FILTER', payload: filter })
  }

  function incrementCommentCount(noticeId) {
    dispatch({ type: 'UPDATE_COMMENT_COUNT', payload: { id: noticeId } })
  }

  const filteredNotices =
    state.activeFilter === 'all'
      ? state.notices
      : state.notices.filter((n) => n.type === state.activeFilter)

  return (
    <NoticeContext.Provider value={{ ...state, filteredNotices, setFilter, refetch: fetchNotices, incrementCommentCount }}>
      {children}
    </NoticeContext.Provider>
  )
}
