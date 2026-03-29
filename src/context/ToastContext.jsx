import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Toast from '../components/ui/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  /**
   * addToast(message, type?)
   *   type: 'error' | 'success' | 'warning' | 'info'  (default: 'error')
   */
  const addToast = useCallback(
    (message, type = 'error') => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => removeToast(id), 4500)
      return id
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none px-4 sm:px-0"
          aria-live="polite"
          aria-atomic="false"
        >
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
