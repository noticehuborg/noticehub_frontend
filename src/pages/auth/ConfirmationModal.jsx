import { Icon } from '@iconify/react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { useModal, MODAL } from '../../context/ModalContext'

export default function ConfirmationModal() {
  const { closeModal, openModal } = useModal()

  return (
    <Modal onClose={closeModal} xIcon={false} dragHandle={false} className="max-w-[420px]">
      <div className="p-4 flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-full bg-success-7 ring-[14px] ring-success-1 flex items-center justify-center">
          <Icon icon="clarity:email-solid" width={28} className="text-white" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-secondary text-2xl font-bold">
            Check Your Email
          </h2>
          <p className="text-neutral-gray-8 text-base leading-6">
            We&apos;ve sent a password reset link to your email address. Please
            check your inbox and follow the instructions.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="text-[15px] xsm:text-base! py-2.5! lg:py-3!"
          onClick={() => openModal(MODAL.LOGIN)}
        >
          Back to Login
        </Button>
      </div>
    </Modal>
  );
}
