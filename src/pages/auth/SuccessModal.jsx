import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { useModal } from '../../context/ModalContext'

export default function SuccessModal() {
  const navigate = useNavigate()
  const { closeModal } = useModal()

  function handleLogin() {
    closeModal()
    navigate('/login')
  }

  return (
    <Modal xIcon={false} dragHandle={false} className="max-w-[420px]">
      <div className="p-4 flex flex-col items-center gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-success-7 ring-[14px] ring-success-1 flex items-center justify-center">
          <Icon icon="mdi:check" width={28} className="text-white" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-secondary text-2xl font-bold">
            You&apos;re all set!
          </h2>
          <p className="text-neutral-gray-8 text-base leading-6">
            Your account has been verified. Welcome to NoticeHub — your notice
            feed is ready.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="text-[15px] xsm:text-base! py-2.5!"
          onClick={handleLogin}
        >
          Go to login
          <Icon icon="mdi:arrow-right" width={18} />
        </Button>
      </div>
    </Modal>
  );
}
