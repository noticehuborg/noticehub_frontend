import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-[var(--font-size-text-sm)] font-medium text-neutral-gray-9">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={`input-base ${error ? 'border-error-7 focus:border-error-7 focus:ring-error-7/20' : ''} ${isPassword ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-6 hover:text-neutral-gray-9 transition-colors"
            tabIndex={-1}
          >
            <Icon icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} width={20} />
          </button>
        )}
      </div>
      {error && (
        <p className="text-[var(--font-size-text-xs)] text-error-7">{error}</p>
      )}
    </div>
  )
}
