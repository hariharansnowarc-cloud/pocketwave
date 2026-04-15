'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function login() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-2">Sign in</h1>
        <p className="text-white/40 text-sm mb-8">Admin access only</p>

        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30"
          />
        </div>

        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

        <button
          onClick={login}
          disabled={loading}
          className="w-full mt-4 bg-white text-black py-3 rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-40"
        >
          {loading ? 'Signing in...' : 'Sign in →'}
        </button>
      </div>
    </main>
  )
}