'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      setProfile(p)
    })
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!profile) return (
    <main style={{ background: 'var(--green-950)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.3)' }}>Loading...</p>
    </main>
  )

  return (
    <main style={{ background: 'var(--green-950)', minHeight: '100vh' }}>
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,26,15,0.95)', backdropFilter: 'blur(12px)' }}>
        <Link href="/home" style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: 700, color: 'var(--cream-100)' }}>Pocketwave</Link>
        <Link href="/home" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>← Back</Link>
      </nav>

      <section style={{ maxWidth: '520px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--green-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, color: 'var(--green-300)', margin: '0 auto 1rem' }}>
            {profile.username?.[0]?.toUpperCase() || '?'}
          </div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: '24px', fontWeight: 600, color: 'var(--cream-100)', marginBottom: '4px' }}>{profile.username}</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>{user?.email}</p>
          <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '11px', fontWeight: 500, color: profile.role === 'admin' ? 'var(--gold)' : 'var(--green-400)', background: profile.role === 'admin' ? 'rgba(201,168,76,0.1)' : 'rgba(58,158,96,0.1)', padding: '3px 12px', borderRadius: '999px' }}>
            {profile.role === 'admin' ? 'Admin' : 'Reader'}
          </span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Member since</p>
          <p style={{ fontSize: '15px', color: 'var(--cream-100)' }}>{new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <button onClick={logout}
          style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '14px', cursor: 'pointer', marginTop: '1rem' }}>
          Sign out
        </button>
      </section>
    </main>
  )
}