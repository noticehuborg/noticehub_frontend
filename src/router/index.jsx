import { createBrowserRouter, Navigate } from 'react-router-dom'

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
      { index: true, element: <FeedPage /> },
      { path: "feed", element: <FeedPage /> },
      { path: "deadlines", element: <DeadlinesPage /> },
      { path: "exams", element: <ExamsNoticePage /> },
      { path: "assignments", element: <AssignmentNoticePage /> },
      { path: "resources", element: <ResourcesPage /> },
      { path: "general", element: <GeneralMessagePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "my-posts", element: <MyPostsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);

export default router
