'use client'
import { useState, useEffect } from 'react'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true)
      setTimeout(() => setVisible(false), 400)
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
      transition: 'opacity 0.4s ease',
      opacity: hiding ? 0 : 1,
    }}>
      {/* decorative circles */}
      <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,98,106,0.08) 0%, transparent 70%)' }}></div>
      <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,98,106,0.07) 0%, transparent 70%)' }}></div>

      {/* image */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <div style={{ position: 'absolute', inset: '-8px', borderRadius: '50%', border: '1px solid var(--rose-mid)', opacity: 0.4 }}></div>
        <img src="/Murugar.jpg" alt="Hari and Jothi"
          style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--rose-mid)', display: 'block' }} />
        <div style={{ position: 'absolute', top: '-6px', right: '-6px', fontSize: '18px', animation: 'pulse 2s ease-in-out infinite' }}>🌸</div>
      </div>

      {/* H & J */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.75rem' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-2px', lineHeight: 1 }}>H</span>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 400, color: 'var(--rose)', fontStyle: 'italic', lineHeight: 1, margin: '0 4px' }}>&</span>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 700, color: 'var(--rose)', letterSpacing: '-2px', lineHeight: 1 }}>J</span>
      </div>

      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '2rem' }}>
        Our little corner of the world
      </p>

      {/* loading dots */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '6px', height: '6px', borderRadius: '50%', background: 'var(--rose-mid)',
            animation: `pulse 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
            opacity: 0.6
          }}></div>
        ))}
      </div>
    </div>
  )
}