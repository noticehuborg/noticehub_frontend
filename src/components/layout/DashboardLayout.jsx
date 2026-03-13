import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  function toggleCollapse() {
    setCollapsed((v) => {
      localStorage.setItem('sidebar-collapsed', String(!v))
      return !v
    })
  }

  function toggleMobileSidebar() {
    setMobileSidebarOpen((v) => !v)
  }

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-neutral-gray-2">
      <Header variant="dashboard" onSidebarToggle={toggleMobileSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:block h-[calc(100vh-73px)] sticky top-[73px]">
          <Sidebar collapsed={collapsed} onToggle={toggleCollapse} />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 z-30 bg-black/40"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="lg:hidden fixed left-0 top-[73px] bottom-0 z-40">
              <Sidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
