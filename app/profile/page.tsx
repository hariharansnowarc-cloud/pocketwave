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
  const [stats, setStats] = useState({ comments: 0, likes: 0, bookmarks: 0 })

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      setProfile(p)
      const [{ count: c }, { count: l }, { count: b }] = await Promise.all([
        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', data.user.id),
        supabase.from('likes').select('*', { count: 'exact', head: true }).eq('user_id', data.user.id),
        supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', data.user.id),
      ])
      setStats({ comments: c || 0, likes: l || 0, bookmarks: b || 0 })
    })
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!profile) return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Loading...</p>
    </main>
  )

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,249,246,0.95)', backdropFilter: 'blur(12px)' }}>
        <Link href="/home" style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>Pocketwave</Link>
        <Link href="/home" style={{ fontSize: '13px', color: 'var(--muted)' }}>← Home</Link>
      </nav>

      <section style={{ maxWidth: '520px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, color: 'var(--green-700)', margin: '0 auto 1rem', border: '3px solid var(--green-200)' }}>
            {profile.username?.[0]?.toUpperCase() || '?'}
          </div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: '24px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{profile.username}</h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>{user?.email}</p>
          <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '11px', fontWeight: 600, color: profile.role === 'admin' ? 'var(--gold)' : 'var(--green-700)', background: profile.role === 'admin' ? 'var(--gold-bg)' : 'var(--green-100)', padding: '3px 12px', borderRadius: '999px' }}>
            {profile.role === 'admin' ? '★ Admin' : 'Reader'}
          </span>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Comments', value: stats.comments },
            { label: 'Likes given', value: stats.likes },
            { label: 'Saved', value: stats.bookmarks },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Lora, serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--green-700)' }}>{s.value}</p>
              <p style={{ fontSize: '12px', color: 'var(--subtle)', marginTop: '3px' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '11px', color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Member since</p>
          <p style={{ fontSize: '15px', color: 'var(--ink)', fontWeight: 500 }}>{new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <Link href="/bookmarks" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>🔖 Saved episodes</span>
          <span style={{ color: 'var(--green-400)' }}>→</span>
        </Link>

        <button onClick={logout}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--border2)', color: 'var(--muted)', fontSize: '14px', cursor: 'pointer', marginTop: '0.5rem' }}>
          Sign out
        </button>
      </section>
    </main>
  )
}