'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    if (password === '062613') {
      document.cookie = 'hj_auth=true; path=/; max-age=2592000' // 30 days
      router.push('/')
      router.refresh()
    } else {
      setError('Wrong password. Try again 💔')
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* BG DECORATION */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,98,106,0.08) 0%, transparent 70%)' }}></div>
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,98,106,0.07) 0%, transparent 70%)' }}></div>
        {['8% / 6%', '15% / auto / 8%', 'auto / 10% / 15%', 'auto / auto / 12% / 10%'].map((pos, i) => {
          const [top, right, bottom, left] = pos.split(' / ')
          return <div key={i} style={{ position: 'absolute', top: top !== 'auto' ? top : undefined, right: right !== 'auto' ? right : undefined, bottom: bottom !== 'auto' ? bottom : undefined, left: left !== 'auto' ? left : undefined, fontSize: '20px', opacity: 0.1 }}>🌸</div>
        })}
      </div>

      {/* LOGO */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '42px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.1 }}>
          Hari <span style={{ color: 'var(--rose)' }}>♥</span> Jothi
        </p>
        <p style={{ fontSize: '13px', color: 'var(--subtle)', marginTop: '6px' }}>Our private space 🌸</p>
      </div>

      {/* CARD */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 30px rgba(201,98,106,0.08)',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px', textAlign: 'center' }}>Welcome back 💛</h2>
        <p style={{ fontSize: '13px', color: 'var(--subtle)', textAlign: 'center', marginBottom: '1.75rem' }}>Enter the password to continue</p>

        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="••••••"
          style={{
            width: '100%', padding: '12px 16px', fontSize: '16px',
            border: '1.5px solid var(--border2)', borderRadius: '12px',
            color: 'var(--ink)', background: 'var(--bg)', outline: 'none',
            fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em',
            marginBottom: '4px'
          }}
          autoFocus
        />

        {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px', marginBottom: '4px' }}>{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading || !password}
          style={{
            width: '100%', marginTop: '14px',
            background: 'var(--rose)', color: 'white',
            padding: '13px', borderRadius: '12px',
            fontSize: '15px', fontWeight: 500,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: (!password || loading) ? 0.6 : 1,
            fontFamily: 'Inter, sans-serif'
          }}>
          {loading ? 'Opening...' : 'Enter our space →'}
        </button>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--subtle)', marginTop: '2rem', position: 'relative', zIndex: 1 }}>
        Made with love 🌸
      </p>
    </main>
  )
}