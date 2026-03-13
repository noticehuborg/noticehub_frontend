export default function Filters({ filters, active, onChange, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filters.map((f) => {
        const isActive = active === f.value
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`px-4 py-1.5 rounded-full text-[var(--font-size-text-sm)] font-medium border transition-colors duration-200
              ${isActive
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-neutral-gray-7 border-neutral-gray-4 hover:border-primary hover:text-primary'
              }`}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
