import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
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
  const { user } = useAuth()
  const variant = user ? 'authenticated' : 'public'

  return (
    <div className="relative min-h-screen flex flex-col bg-white min-w-[320px]">
      <ScrollToTop />
      <Header variant={variant} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ModalContainer />
    </div>
  )
}
