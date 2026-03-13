export default function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 border-b border-neutral-gray-4 ${className}`}>
      {tabs.map((tab) => {
        const isActive = active === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`relative px-5 py-2.5 text-[var(--font-size-text-sm)] font-medium transition-colors duration-200 whitespace-nowrap
              ${isActive
                ? 'text-primary'
                : 'text-neutral-gray-6 hover:text-neutral-gray-9'
              }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}
