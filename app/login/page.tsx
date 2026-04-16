'use client'
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const supabase = createClient()
  const router = useRouter()
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
      if (error) { setError(error.message) }
      else { setSuccess('Account created! Please sign in.'); setMode('login') }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message) }
      else { router.push('/home'); router.refresh() }
    }
    setLoading(false)
  }

  const inp: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    color: 'var(--cream-100)',
    outline: 'none',
    marginBottom: '12px'
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--green-950)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

      <Link href="/" style={{ fontFamily: 'Lora, serif', fontSize: '24px', fontWeight: 700, color: 'var(--cream-100)', marginBottom: '2.5rem', display: 'block', textAlign: 'center' }}>
        Pocketwave
      </Link>

      <div style={{ width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '1.75rem' }}>
          {(['login', 'signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
              style={{ flex: 1, padding: '8px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: mode === m ? 'var(--green-700)' : 'transparent', color: mode === m ? 'white' : 'rgba(255,255,255,0.35)' }}>
              {m === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {mode === 'signup' && (
          <input style={inp} type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        )}
        <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" />
        <input style={{ ...inp, marginBottom: '0' }} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

        {error && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'var(--green-400)', fontSize: '13px', marginTop: '10px' }}>{success}</p>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', marginTop: '16px', background: 'var(--green-600)', color: 'white', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign in →' : 'Create account →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '1.25rem' }}>
          By continuing you agree to our terms of service.
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: 'var(--green-950)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)' }}>Loading...</p>
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}