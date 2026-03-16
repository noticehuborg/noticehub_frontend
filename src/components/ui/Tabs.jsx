export default function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex-center gap-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = active === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`cursor-pointer relative select-none py-2.5 text-sm md:text-[15px] font-medium transition-colors duration-200 whitespace-nowrap
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
