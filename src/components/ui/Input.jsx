import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  error = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-gray-9">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={`input-base ${error ? "ring-1 ring-error-7" : ""} ${isPassword ? "pr-11" : ""} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="
             cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-6 hover:text-neutral-gray-8 transition-colors"
            tabIndex={-1}
          >
            <Icon
              icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
              width={20}
            />
          </button>
        )}
      </div>
      {error && <p className="text-xs md:text-sm text-error-7">{error}</p>}
    </div>
  );
}
