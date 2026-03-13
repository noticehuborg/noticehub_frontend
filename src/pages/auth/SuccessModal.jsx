import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'

export default function SuccessModal() {
  const navigate = useNavigate()
  const { register } = useAuth()

  function handleGoToDashboard() {
    // Complete mock registration
    register('Student', 'student@university.edu', 'password')
    setTimeout(() => navigate('/dashboard/feed'), 100)
  }

  return (
    <Modal className="max-w-sm mx-auto">
      <div className="p-10 flex flex-col items-center gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-success-7 flex items-center justify-center">
          <Icon icon="mdi:check" width={32} className="text-white" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-mobile-h4 font-bold text-neutral-gray-10">You&apos;re all set!</h2>
          <p className="text-[var(--font-size-text-sm)] text-neutral-gray-6">
            Your account has been verified. Welcome to NoticeHub — your notice feed is ready.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={handleGoToDashboard}
        >
          Go to my dashboard
          <Icon icon="mdi:arrow-right" width={18} />
        </Button>
      </div>
    </Modal>
  )
}
