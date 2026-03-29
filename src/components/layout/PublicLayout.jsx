import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import Header from './Header'
import Footer from './Footer'
import Modal from '../ui/Modal'
import ScrollToTop from '../common/ScrollToTop'
import { useAuth } from '../../hooks/useAuth'
import { useModal, MODAL } from '../../context/ModalContext'
import LoginModal from '../../pages/auth/LoginModal'
import RegisterModal from '../../pages/auth/RegisterModal'
import ForgotPasswordModal from '../../pages/auth/ForgotPasswordModal'
import CreateNewPasswordModal from '../../pages/auth/CreateNewPasswordModal'
import OTPModal from '../../pages/auth/OTPModal'
import SuccessModal from '../../pages/auth/SuccessModal'
import ConfirmationModal from '../../pages/auth/ConfirmationModal'

function ModalContainer() {
  const { activeModal } = useModal()
  switch (activeModal) {
    case MODAL.LOGIN: return <LoginModal />
    case MODAL.REGISTER: return <RegisterModal />
    case MODAL.FORGOT_PASSWORD: return <ForgotPasswordModal />
    case MODAL.CREATE_PASSWORD: return <CreateNewPasswordModal />
    case MODAL.OTP: return <OTPModal />
    case MODAL.SUCCESS: return <SuccessModal />
    case MODAL.CONFIRMATION: return <ConfirmationModal />
    default: return null
  }
}

export default function PublicLayout() {
  const { user, logout } = useAuth()
  const { openModal } = useModal()
  const [searchParams, setSearchParams] = useSearchParams()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const navigate = useNavigate()
  const variant = user ? 'authenticated' : 'public'

  // Auto-open the Create New Password modal when ?token= is present in the URL
  // (user clicked the reset-password link from their email)
  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      openModal(MODAL.CREATE_PASSWORD, { token })
      setSearchParams({}, { replace: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleLogoutRequest() {
    setLogoutModalOpen(true)
  }

  function handleLogoutConfirm() {
    logout()
    navigate('/')
    setLogoutModalOpen(false)
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-white min-w-[320px]">
      <ScrollToTop />
      <Header variant={variant} onLogoutRequest={handleLogoutRequest} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ModalContainer />

      {/* Logout confirmation modal */}
      {logoutModalOpen && (
        <Modal onClose={() => setLogoutModalOpen(false)} className="max-w-sm" xIcon={false} dragHandle={false}>
          <div className="flex flex-col items-center gap-5 p-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <Icon icon="mdi:logout" className="w-7 h-7 text-error-8" />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <h3 className="text-base font-semibold text-neutral-gray-10">Log out of NoticeHub?</h3>
              <p className="text-sm text-neutral-gray-6">You'll need to sign in again to access your account.</p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl border border-neutral-gray-4 text-sm font-medium text-neutral-gray-8 hover:bg-neutral-gray-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-error-7 text-sm font-medium text-white hover:bg-error-8 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
