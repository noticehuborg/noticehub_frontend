const typeStyles = {
  general:    'bg-blue-1 text-blue-8',
  exam:       'bg-error-2 text-error-8',
  assignment: 'bg-warning-2 text-warning-9',
  resource:   'bg-success-1 text-success-9',
}

export default function Badge({ type = 'general', label, className = '' }) {
  const display = label || type.charAt(0).toUpperCase() + type.slice(1)
  const styles = typeStyles[type] || typeStyles.general

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[var(--font-size-text-xs)] font-semibold capitalize ${styles} ${className}`}
    >
      {display}
    </span>
  )
}
