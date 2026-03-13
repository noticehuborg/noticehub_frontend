import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'

export default function RegisterModal() {
  const navigate = useNavigate()
  const { status } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((e2) => ({ ...e2, [e.target.name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    // Navigate to OTP step (mock — in real app, trigger OTP send here)
    navigate('/verify')
  }

  return (
    <Modal onClose={() => navigate('/')} className="max-w-lg mx-auto">
      <div className="p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-mobile-h4 font-bold text-neutral-gray-10">Create your account</h2>
          <p className="text-[var(--font-size-text-sm)] text-neutral-gray-6">
            Join thousands of students on NoticeHub
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full name"
            id="reg-name"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            label="Email address"
            id="reg-email"
            name="email"
            type="email"
            placeholder="you@university.edu"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Password"
            id="reg-password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            id="reg-confirm"
            name="confirm"
            type="password"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={handleChange}
            error={errors.confirm}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={status === 'loading'}
            className="w-full mt-1"
          >
            Create account
          </Button>
        </form>

        <p className="text-center text-[var(--font-size-text-sm)] text-neutral-gray-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Modal>
  )
}
