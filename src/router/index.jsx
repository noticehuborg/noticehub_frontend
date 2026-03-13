import { createBrowserRouter } from 'react-router-dom'

// Layouts
import PublicLayout from '../components/layout/PublicLayout'
import DashboardLayout from '../components/layout/DashboardLayout'

// Public pages
import HomePage from '../pages/public/HomePage'
import AboutPage from '../pages/public/AboutPage'
import ContactPage from '../pages/public/ContactPage'

// Auth modals
import LoginModal from '../pages/auth/LoginModal'
import RegisterModal from '../pages/auth/RegisterModal'
import OTPModal from '../pages/auth/OTPModal'
import SuccessModal from '../pages/auth/SuccessModal'

// Dashboard pages
import FeedPage from '../pages/dashboard/FeedPage'
import DeadlinesPage from '../pages/dashboard/DeadlinesPage'
import ExamsNoticePage from '../pages/dashboard/ExamsNoticePage'
import AssignmentNoticePage from '../pages/dashboard/AssignmentNoticePage'
import ResourcesPage from '../pages/dashboard/ResourcesPage'
import GeneralMessagePage from '../pages/dashboard/GeneralMessagePage'
import SearchPage from '../pages/dashboard/SearchPage'
import ComponentPage from '../pages/public/ComponentPage'

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
      { path: "components", element: <ComponentPage /> },
      { path: "login", element: <LoginModal /> },
      { path: "register", element: <RegisterModal /> },
      { path: "verify", element: <OTPModal /> },
      { path: "welcome", element: <SuccessModal /> },
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
    ],
  },
]);

export default router
