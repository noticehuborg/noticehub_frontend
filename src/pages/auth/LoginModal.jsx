import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'

export default function LoginModal() {
  const navigate = useNavigate()
  const { login, status } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    login(form.email, form.password)
    // After mock login completes, redirect
    setTimeout(() => navigate('/dashboard/feed'), 900)
  }

  return (
    <Modal onClose={() => navigate('/')} className="max-w-md mx-auto">
      <div className="p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-mobile-h4 font-bold text-neutral-gray-10">Welcome back</h2>
          <p className="text-[var(--font-size-text-sm)] text-neutral-gray-6">
            Sign in to your NoticeHub account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email address"
            id="login-email"
            name="email"
            type="email"
            placeholder="you@university.edu"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <Input
            label="Password"
            id="login-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          {error && (
            <p className="text-[var(--font-size-text-xs)] text-error-7 text-center">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={status === 'loading'}
            className="w-full mt-1"
          >
            Sign in
          </Button>
        </form>

        <p className="text-center text-[var(--font-size-text-sm)] text-neutral-gray-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </Modal>
  )
}
