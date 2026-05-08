'use client'
import { useState, useEffect } from 'react'

interface Props {
  label: string
  date: string
  emoji: string
}

export default function Countdown({ label, date, emoji }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: false })

  useEffect(() => {
    function calc() {
      const target = new Date(date).getTime()
      const now = new Date().getTime()
      const diff = target - now
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: true })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        passed: false
      })
    }
    calc()
    const timer = setInterval(calc, 1000)
    return () => clearInterval(timer)
  }, [date])

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{emoji}</div>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '12px', color: 'var(--subtle)', marginBottom: '1rem' }}>{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      {timeLeft.passed ? (
        <p style={{ fontSize: '14px', color: 'var(--rose)', fontWeight: 500 }}>🎉 Celebrated!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { value: timeLeft.days, label: 'days' },
            { value: timeLeft.hours, label: 'hrs' },
            { value: timeLeft.minutes, label: 'min' },
            { value: timeLeft.seconds, label: 'sec' },
          ].map((t, i) => (
            <div key={i} style={{ background: 'var(--rose-light)', borderRadius: '10px', padding: '8px 4px' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 700, color: 'var(--rose)', lineHeight: 1 }}>{String(t.value).padStart(2, '0')}</div>
              <div style={{ fontSize: '10px', color: 'var(--rose)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}