import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Layouts
import PublicLayout from '../components/layout/PublicLayout'
import DashboardLayout from '../components/layout/DashboardLayout'

// Public pages
import HomePage from '../pages/public/HomePage'
import AboutPage from '../pages/public/AboutPage'
import ContactPage from '../pages/public/ContactPage'

// Dashboard pages
import FeedPage from '../pages/dashboard/FeedPage'
import DeadlinesPage from '../pages/dashboard/DeadlinesPage'
import ExamsNoticePage from '../pages/dashboard/ExamsNoticePage'
import AssignmentNoticePage from '../pages/dashboard/AssignmentNoticePage'
import ResourcesPage from '../pages/dashboard/ResourcesPage'
import GeneralMessagePage from '../pages/dashboard/GeneralMessagePage'
import SearchPage from '../pages/dashboard/SearchPage'
import MyPostsPage from '../pages/dashboard/MyPostsPage'
import NotificationsPage from '../pages/dashboard/NotificationsPage'
import ProfilePage from '../pages/dashboard/ProfilePage'
// Guards
import ProtectedRoute from './ProtectedRoute'

// Redirects lecturers to /dashboard/resources; everyone else to /dashboard/feed
function DashboardIndex() {
  const { user } = useAuth()
  if (user?.role === 'lecturer') return <Navigate to="/dashboard/resources" replace />
  return <Navigate to="/dashboard/feed" replace />
}

// Blocks lecturers from student-only pages and redirects them to resources
function StudentOnlyRoute({ children }) {
  const { user, initializing } = useAuth()
  if (initializing) return null
  if (user?.role === 'lecturer') return <Navigate to="/dashboard/resources" replace />
  return children
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "login", element: <Navigate to="/" replace /> },
      { path: "register", element: <Navigate to="/" replace /> },
      { path: "verify", element: <Navigate to="/" replace /> },
      { path: "welcome", element: <Navigate to="/" replace /> },
      // Password reset link from email lands here; PublicLayout auto-opens the modal
      { path: "reset-password", element: <HomePage /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardIndex /> },
      { path: "feed", element: <StudentOnlyRoute><FeedPage /></StudentOnlyRoute> },
      { path: "deadlines", element: <StudentOnlyRoute><DeadlinesPage /></StudentOnlyRoute> },
      { path: "exams", element: <StudentOnlyRoute><ExamsNoticePage /></StudentOnlyRoute> },
      { path: "assignments", element: <StudentOnlyRoute><AssignmentNoticePage /></StudentOnlyRoute> },
      { path: "resources", element: <ResourcesPage /> },
      { path: "general", element: <StudentOnlyRoute><GeneralMessagePage /></StudentOnlyRoute> },
      { path: "search", element: <StudentOnlyRoute><SearchPage /></StudentOnlyRoute> },
      { path: "my-posts", element: <MyPostsPage /> },
      { path: "notifications", element: <StudentOnlyRoute><NotificationsPage /></StudentOnlyRoute> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);

export default router
