import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/ui/Modal'
import OTPInput from '../../components/ui/OTPInput'
import Button from '../../components/ui/Button'

export default function OTPModal() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleVerify(e) {
    e.preventDefault()
    if (code.length < 6) { setError('Please enter the full 6-digit code.'); return }
    setLoading(true)
    setError('')
    // Mock verification
    setTimeout(() => {
      setLoading(false)
      navigate('/welcome')
    }, 900)
  }

  function handleResend() {
    setCode('')
    setError('')
    // Mock resend
  }

  return (
    <Modal onClose={() => navigate('/')} className="max-w-sm mx-auto">
      <div className="p-8 flex flex-col gap-6 items-center text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-mobile-h4 font-bold text-neutral-gray-10">Verify your email</h2>
          <p className="text-[var(--font-size-text-sm)] text-neutral-gray-6">
            We&apos;ve sent a 6-digit code to your email. Enter it below.
          </p>
        </div>

        <form onSubmit={handleVerify} className="w-full flex flex-col gap-5">
          <OTPInput length={6} value={code} onChange={setCode} />

          {error && (
            <p className="text-[var(--font-size-text-xs)] text-error-7">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full"
          >
            Verify email
          </Button>
        </form>

        <p className="text-[var(--font-size-text-sm)] text-neutral-gray-6">
          Didn&apos;t receive the code?{' '}
          <button onClick={handleResend} className="text-success-8 font-medium hover:underline">
            Resend code
          </button>
        </p>
      </div>
    </Modal>
  )
}
