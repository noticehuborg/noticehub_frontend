import { useRef } from 'react'

export default function OTPInput({ length = 6, value = '', onChange }) {
  const refs = useRef([])

  const digits = Array.from({ length }, (_, i) => value[i] || '')

  function handleChange(e, idx) {
    const char = e.target.value.slice(-1)
    if (!/^\d$/.test(char) && char !== '') return

    const next = digits.map((d, i) => (i === idx ? char : d))
    onChange(next.join(''))

    if (char && idx < length - 1) {
      refs.current[idx + 1]?.focus()
    }
  }

  function handleKeyDown(e, idx) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus()
      const next = digits.map((d, i) => (i === idx - 1 ? '' : d))
      onChange(next.join(''))
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(length, '').slice(0, length))
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (refs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-[var(--font-size-text-lg)] font-semibold rounded-xl border border-neutral-gray-4 bg-white
                     focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
      ))}
    </div>
  )
}
