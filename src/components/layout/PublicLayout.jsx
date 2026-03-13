import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useAuth } from '../../hooks/useAuth'

export default function PublicLayout() {
  const { user } = useAuth()
  const variant = user ? 'authenticated' : 'public'

  return (
    <div className="relative min-h-screen flex flex-col bg-white min-w-[320px]">
      <Header variant={variant} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
