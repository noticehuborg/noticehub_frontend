// Filter pill buttons — used across all dashboard list pages
export default function FilterPills({ filters, active, onChange, className = "" }) {
  return (
    <div className={`flex items-center gap-1.5 lg:gap-2 flex-wrap ${className}`}>
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`cursor-pointer px-2.5 lg:px-5 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-colors
            ${active === f.value
              ? "bg-primary text-blue-1 outline-1 outline-primary"
              : "outline-1 outline-neutral-gray-6 text-neutral-gray-6 hover:bg-neutral-gray-2"
            }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
