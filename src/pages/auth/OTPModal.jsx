import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import Modal from '../../components/ui/Modal'
import OTPInput from '../../components/ui/OTPInput'
import { authService } from '../../services/auth.service'
import { useModal, MODAL } from '../../context/ModalContext'

export default function OTPModal() {
  const { closeModal, openModal, modalData } = useModal()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [seconds, setSeconds] = useState(60)

  useEffect(() => {
    if (seconds === 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  async function submitCode(otp) {
    if (!modalData?.email) return
    setLoading(true)
    setError('')
    try {
      await authService.verifyOtp(modalData.email, otp)
      setLoading(false)
      openModal(MODAL.SUCCESS)
    } catch (err) {
      setLoading(false)
      setCode('')
      const msg = err?.response?.data?.message
      if (msg) {
        setError(msg)
      } else if (!err?.response) {
        setError('Network error. Please check your connection.')
      } else {
        setError('Verification failed. Please try again.')
      }
    }
  }

  function handleOTPChange(val) {
    setCode(val)
    if (val.length === 4) submitCode(val)
  }

  async function handleResend() {
    setCode('')
    setError('')
    setSeconds(60)
    if (!modalData?.email) return
    try {
      await authService.resendOtp(modalData.email)
    } catch {
      // Silently ignore — the timer reset is enough UX feedback
    }
  }

  return (
    <Modal
      onClose={closeModal}
      xIcon={false}
      mobileBreakpoint={640}
      portalClassName="p-0! items-end sm:items-center sm:p-6!"
      className="sm:max-w-125 min-h-[50vh] sm:min-h-0 rounded-none rounded-t-[20px]! sm:rounded-[20px]"
    >
      <div className="flex flex-col gap-8 pt-4 sm:p-4">
        <div className="flex flex-col items-center gap-6 sm:text-center">
          <div className="w-14 h-14 sm:w-18 sm:h-18 bg-primary rounded-full flex items-center justify-center">
            <Icon icon="material-symbols:mail" width={26} className="w-6.5 sm:w-8 h-6.5 sm:h-8 text-white" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-secondary text-xl sm:text-2xl font-semibold">
              OTP Verification
            </h2>
            <p className="text-neutral-gray-8 text-sm text-center sm:text-base leading-6 max-w-[450px] sm:max-w-sm">
              We&apos;ve sent a 4-digit code to{' '}
              <span className="text-secondary font-semibold">
                {modalData?.email ?? 'your email'}
              </span>
              . Check your email and enter the code below.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <OTPInput length={4} value={code} onChange={handleOTPChange} disabled={loading} />
          {loading && (
            <p className="text-sm text-primary text-center font-medium animate-pulse">
              Verifying…
            </p>
          )}
          {error && <p className="text-sm text-error-8 text-center">{error}</p>}
        </div>

        <p className="text-sm text-center text-neutral-gray-8">
          {seconds > 0 ? (
            <>
              You can resend the code in{' '}
              <span className="text-primary font-semibold">{seconds} seconds</span>
            </>
          ) : (
            <>
              Didn&apos;t receive the code?{' '}
              <button
                onClick={handleResend}
                className="text-primary font-semibold hover:underline"
              >
                Resend code
              </button>
            </>
          )}
        </p>
      </div>
    </Modal>
  )
}
