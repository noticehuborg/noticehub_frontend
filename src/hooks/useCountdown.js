import { useState, useEffect } from 'react'

function compute(target) {
  if (!target) return { days: 0, hrs: 0, min: 0, sec: 0, expired: true }
  const diff = new Date(target) - Date.now()
  if (diff <= 0) return { days: 0, hrs: 0, min: 0, sec: 0, expired: true }
  return {
    days: Math.floor(diff / 86400000),
    hrs: Math.floor((diff % 86400000) / 3600000),
    min: Math.floor((diff % 3600000) / 60000),
    sec: Math.floor((diff % 60000) / 1000),
    expired: false,
  }
}

export function useCountdown(target) {
  const [time, setTime] = useState(() => compute(target))

  useEffect(() => {
    setTime(compute(target))
    if (!target) return
    const id = setInterval(() => setTime(compute(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return time
}
