'use client'
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '../lib/supabase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient()

function LoginForm() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') setMode('signup')
  }, [searchParams])

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'signup') {
      if (!username.trim()) { setError('Please enter a username.'); setLoading(false); return }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return }
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: username } }
      })
      if (error) { setError(error.message); setLoading(false) }
      else { setSuccess('Account created! Check your email to confirm, then sign in.'); setLoading(false) }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false) }
      else {
        await new Promise(resolve => setTimeout(resolve, 500))
        window.location.href = '/home'
      }
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f0f7f2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <Link href="/" style={{
        fontFamily: 'Lora, serif',
        fontSize: '26px',
        fontWeight: 700,
        color: '#1a4028',
        marginBottom: '2rem',
        display: 'block',
        textAlign: 'center',
        textDecoration: 'none'
      }}>
        Pocketwave
      </Link>

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        border: '1px solid #d0e8d8',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
      }}>

        {/* TABS */}
        <div style={{ display: 'flex', background: '#f0f7f2', borderRadius: '12px', padding: '4px', marginBottom: '1.75rem' }}>
          {(['login', 'signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
              style={{
                flex: 1, padding: '9px', borderRadius: '9px',
                fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer',
                transition: 'all 0.15s',
                background: mode === m ? '#2d7a4a' : 'transparent',
                color: mode === m ? '#ffffff' : '#6b7f6e'
              }}>
              {m === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {/* FIELDS */}
        {mode === 'signup' && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#2d4a34', display: 'block', marginBottom: '6px' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="your_username"
              style={{
                width: '100%', padding: '11px 14px', fontSize: '14px',
                border: '1.5px solid #c0d8c8', borderRadius: '10px',
                color: '#1a2e1f', background: '#fff', outline: 'none',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#2d4a34', display: 'block', marginBottom: '6px' }}>Email address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%', padding: '11px 14px', fontSize: '14px',
              border: '1.5px solid #c0d8c8', borderRadius: '10px',
              color: '#1a2e1f', background: '#fff', outline: 'none',
              fontFamily: 'Inter, sans-serif'
            }}
          />
        </div>

        <div style={{ marginBottom: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#2d4a34', display: 'block', marginBottom: '6px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '11px 14px', fontSize: '14px',
              border: '1.5px solid #c0d8c8', borderRadius: '10px',
              color: '#1a2e1f', background: '#fff', outline: 'none',
              fontFamily: 'Inter, sans-serif'
            }}
          />
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '10px', fontWeight: 500 }}>{error}</p>}
        {success && <p style={{ color: '#2d7a4a', fontSize: '13px', marginTop: '10px', fontWeight: 500 }}>{success}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', marginTop: '16px',
            background: loading ? '#9aab9e' : '#2d7a4a',
            color: 'white', padding: '13px',
            borderRadius: '12px', fontSize: '15px',
            fontWeight: 600, border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}>
          {loading ? 'Signing in...' : mode === 'login' ? 'Sign in →' : 'Create account →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9aab9e', marginTop: '1rem' }}>
          By continuing you agree to our terms of service.
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: '#f0f7f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7f6e' }}>Loading...</p>
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}