import { createContext, useReducer, useEffect, useCallback } from 'react'
import { mockNotices, mockDeadlines } from '../services/mockData'
// TODO: import { noticesService } from '../services/notices.service' — uncomment when backend is ready

export const NoticeContext = createContext(null)

const initialState = {
  notices: [],
  deadlines: [],
  activeFilter: 'all',
  loading: true,
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
        error: null,
      }
    case 'ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SET_FILTER':
      return { ...state, activeFilter: action.payload }
    default:
      return state
  }
}

export function NoticeProvider({ children }) {
  const [state, dispatch] = useReducer(noticeReducer, initialState)

  const fetchNotices = useCallback(async () => {
    dispatch({ type: 'LOADING' })
    try {
      // TODO: swap mock for real API calls when backend is ready →
      // const [noticesRes, deadlinesRes] = await Promise.all([
      //   noticesService.getAll(),
      //   noticesService.getDeadlines(),
      // ])
      // dispatch({ type: 'LOAD', payload: { notices: noticesRes.data, deadlines: deadlinesRes.data } })

      // Mock: simulate network latency
      await new Promise((r) => setTimeout(r, 500))
      dispatch({ type: 'LOAD', payload: { notices: mockNotices, deadlines: mockDeadlines } })
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err?.message ?? 'Failed to load notices' })
    }
  }, [])

  useEffect(() => {
    fetchNotices()
  }, [fetchNotices])

  function setFilter(filter) {
    dispatch({ type: 'SET_FILTER', payload: filter })
  }

  const filteredNotices =
    state.activeFilter === 'all'
      ? state.notices
      : state.notices.filter((n) => n.type === state.activeFilter)

  return (
    <NoticeContext.Provider value={{ ...state, filteredNotices, setFilter, refetch: fetchNotices }}>
      {children}
    </NoticeContext.Provider>
  )
}
