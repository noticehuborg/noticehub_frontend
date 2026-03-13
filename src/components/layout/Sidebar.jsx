import { NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'

const navItems = [
  { label: 'Feed', to: '/dashboard/feed', icon: 'mdi:newspaper-variant-outline' },
  { label: 'Deadlines', to: '/dashboard/deadlines', icon: 'mdi:calendar-clock-outline' },
  { label: 'Exams', to: '/dashboard/exams', icon: 'mdi:file-document-edit-outline' },
  { label: 'Assignments', to: '/dashboard/assignments', icon: 'mdi:book-open-page-variant-outline' },
  { label: 'Resources', to: '/dashboard/resources', icon: 'mdi:folder-open-outline' },
  { label: 'General', to: '/dashboard/general', icon: 'mdi:bullhorn-outline' },
  { label: 'Search', to: '/dashboard/search', icon: 'mdi:magnify' },
]

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`h-full bg-white border-r border-neutral-gray-4 flex flex-col transition-all duration-300
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center h-12 border-b border-neutral-gray-4 hover:bg-neutral-gray-2 transition-colors text-neutral-gray-6 hover:text-neutral-gray-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <Icon
          icon={collapsed ? 'mdi:chevron-right-circle-outline' : 'mdi:chevron-left-circle-outline'}
          width={20}
        />
      </button>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 group
               ${isActive
                 ? 'bg-blue-1 text-primary'
                 : 'text-neutral-gray-7 hover:bg-neutral-gray-2 hover:text-neutral-gray-10'
               }`
            }
          >
            <Icon icon={item.icon} width={20} className="shrink-0" />
            {!collapsed && (
              <span className="text-[var(--font-size-text-sm)] font-medium whitespace-nowrap">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
