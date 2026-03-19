import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'
import { motion, useMotionValue, useTransform, useDragControls } from 'framer-motion'

const MotionDiv = motion.div

export default function Modal({ children, onClose, portalClassName = '', className = '', xIcon = true, dragHandle = true, mobileBreakpoint = 768 }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < mobileBreakpoint)
  const panelRef = useRef(null)

  const y = useMotionValue(0)
  const dragOpacity = useTransform(y, [0, 250], [1, 0])
  const dragControls = useDragControls()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < mobileBreakpoint)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [mobileBreakpoint])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)

    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [onClose])

  function handleDragEnd(_, info) {
    if (info.offset.y > 100) {
      onClose?.()
    } else {
      y.set(0)
    }
  }

  // Start drag from anywhere on the panel when content isn't scrolled,
  // but ignore taps on interactive elements so inputs/buttons still work.
  function handlePanelPointerDown(e) {
    const interactive = ['input', 'button', 'select', 'textarea', 'a', 'label']
    if (interactive.includes(e.target.tagName.toLowerCase())) return

    const isScrolled = panelRef.current
      ? Array.from(panelRef.current.querySelectorAll('*')).some(el => el.scrollTop > 0)
      : false

    if (!isScrolled) dragControls.start(e)
  }

  return createPortal(
    <div
      className={`min-w-[320px] fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${portalClassName}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1.5px]" onClick={onClose} />

      <MotionDiv
        ref={panelRef}
        style={{ y, opacity: isMobile ? dragOpacity : 1 }}
        drag={isMobile ? 'y' : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        dragMomentum={false}
        onDragEnd={isMobile ? handleDragEnd : undefined}
        onPointerDown={isMobile ? handlePanelPointerDown : undefined}
        initial={{ y: isMobile ? '100%' : 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative p-4.5 xsm:px-6 sm:p-6 z-10 w-full bg-neutral-gray-1 rounded-[20px] shadow-2xl max-h-[85vh] ${className}`}
      >
        {/* Drag handle — always triggers drag, stops propagation so panel handler doesn't double-fire */}
        {isMobile && dragHandle && (
          <div
            onPointerDown={(e) => { e.stopPropagation(); dragControls.start(e) }}
            className="absolute top-0 inset-x-0 flex justify-center pt-2.5 pb-2 z-20 cursor-grab active:cursor-grabbing touch-none select-none"
            aria-hidden="true"
          >
            <div className="w-14 h-1 rounded-full bg-neutral-gray-4" />
          </div>
        )}

        {/* Close button — shown above mobileBreakpoint only */}
        {onClose && xIcon && !isMobile && (
          <button
            onClick={onClose}
            className="flex bg-white cursor-pointer absolute top-4 right-4 z-10 p-1.5 items-center justify-center rounded-full border border-neutral-gray-4 hover:border-primary text-neutral-gray-8 hover:text-primary hover:bg-blue-1 transition-colors"
            aria-label="Close"
          >
            <Icon icon="material-symbols:close-rounded" width={18} />
          </button>
        )}

        {children}
      </MotionDiv>
    </div>,
    document.body,
  )
}
