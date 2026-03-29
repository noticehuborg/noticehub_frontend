import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

const VARIANTS = {
  error: {
    icon: "mdi:alert-circle",
    wrap: "bg-error-2 border-error-4",
    iconCls: "text-error-8",
    textCls: "text-error-5",
  },
  success: {
    icon: "ep:success-filled",
    wrap: "bg-success-1 border-success-2",
    iconCls: "text-success-8",
    textCls: "text-success-5",
  },
  warning: {
    icon: "mdi:alert",
    wrap: "bg-warning-2 border-warning-4",
    iconCls: "text-warning-8",
    textCls: "text-warning-5",
  },
  info: {
    icon: "mdi:information",
    wrap: "bg-blue-1 border-blue-2",
    iconCls: "text-blue-7",
    textCls: "text-blue-5",
  },
};

export default function Toast({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false)
  const v = VARIANTS[toast.type] ?? VARIANTS.error

  useEffect(() => {
    // Small delay so the enter animation fires after mount
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  function dismiss() {
    setVisible(false)
    setTimeout(onDismiss, 250)
  }

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 w-full max-w-[350px] mx-auto px-4 py-3 rounded-xl border shadow-md
        transition-all duration-250 ease-in-out
        ${v.wrap}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}
      `}
    >
      <Icon icon={v.icon} width={20} className={`${v.iconCls} shrink-0 mt-0.5`} />
      <p className={`flex-1 text-sm font-medium leading-5 ${v.textCls}`}>
        {toast.message}
      </p>
      <button
        type="button"
        onClick={dismiss}
        className={`shrink-0 p-0.5 rounded transition-opacity hover:opacity-70 ${v.iconCls}`}
        aria-label="Dismiss"
      >
        <Icon icon="mdi:close" width={16} />
      </button>
    </div>
  )
}
