import { useEffect } from 'react'
import { Icon } from '@iconify/react'

export default function Modal({ children, onClose, className = '' }) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative z-10 w-full bg-white rounded-2xl shadow-2xl ${className}`}>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-neutral-gray-7 hover:bg-neutral-gray-3 hover:text-neutral-gray-10 transition-colors"
            aria-label="Close"
          >
            <Icon icon="mdi:close" width={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
