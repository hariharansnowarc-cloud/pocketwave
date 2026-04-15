'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPage() {
  const supabase = createClient()
  const router = useRouter()
  const [tab, setTab] = useState<'dashboard' | 'publish' | 'stories'>('dashboard')
  const [user, setUser] = useState<any>(null)
  const [stories, setStories] = useState<any[]>([])
  const [stats, setStats] = useState({ totalViews: 0, totalReaders: 0, totalComments: 0, totalLikes: 0, weekViews: 0, monthViews: 0, topEpisodes: [] as any[] })
  const [selectedStory, setSelectedStory] = useState('')
  const [episodeNumber, setEpisodeNumber] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (profile?.role !== 'admin') { router.push('/home'); return }
      setUser(data.user)
      loadData()
    })
  }, [])

  async function loadData() {
    const { data: storiesData } = await supabase.from('stories').select('*').order('created_at', { ascending: false })
    if (storiesData) setStories(storiesData)

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const [{ count: totalViews }, { count: weekViews }, { count: monthViews }, { count: totalReaders }, { count: totalComments }, { count: totalLikes }] = await Promise.all([
      supabase.from('views').select('*', { count: 'exact', head: true }),
      supabase.from('views').select('*', { count: 'exact', head: true }).gte('viewed_at', weekAgo),
      supabase.from('views').select('*', { count: 'exact', head: true }).gte('viewed_at', monthAgo),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'reader'),
      supabase.from('comments').select('*', { count: 'exact', head: true }),
      supabase.from('likes').select('*', { count: 'exact', head: true }),
    ])

    const { data: topEps } = await supabase.from('episodes').select('title, views, story_id, episode_number').eq('is_published', true).order('views', { ascending: false }).limit(5)

    setStats({ totalViews: totalViews || 0, weekViews: weekViews || 0, monthViews: monthViews || 0, totalReaders: totalReaders || 0, totalComments: totalComments || 0, totalLikes: totalLikes || 0, topEpisodes: topEps || [] })
  }

  async function uploadImage(file: File, path: string) {
    setUploading(true)
    const { data, error } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    setUploading(false)
    if (error) { setMessage('Upload error: ' + error.message); return null }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
    return publicUrl
  }

  async function publish() {
    if (!selectedStory || !episodeNumber || !title || !content) { setMessage('Please fill in all fields.'); return }
    setSaving(true)
    const { error } = await supabase.from('episodes').insert({
      story_id: selectedStory,
      episode_number: parseInt(episodeNumber),
      title,
      content: content.split('\n').filter((p: string) => p.trim()).map((p: string) => `<p>${p}</p>`).join(''),
      thumbnail_url: thumbnailUrl || null,
      is_published: true,
      publish_at: new Date().toISOString()
    })
    setSaving(false)
    if (error) { setMessage('Error: ' + error.message) }
    else { setMessage('Episode published!'); setTitle(''); setContent(''); setEpisodeNumber(''); setThumbnailUrl('') }
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const statCard = (label: string, value: number | string) => (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ fontFamily: 'Lora, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--cream-100)' }}>{value}</p>
    </div>
  )

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: 'var(--cream-100)', outline: 'none', marginBottom: '14px' }

  if (!user) return <main style={{ background: 'var(--green-950)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'rgba(255,255,255,0.3)' }}>Loading...</p></main>

  return (
    <main style={{ background: 'var(--green-950)', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,26,15,0.95)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/home" style={{ fontFamily: 'Lora, serif', fontSize: '20px', fontWeight: 700, color: 'var(--cream-100)' }}>Pocketwave</Link>
          <span style={{ fontSize: '12px', color: 'var(--green-400)', background: 'rgba(58,158,96,0.1)', padding: '3px 10px', borderRadius: '999px' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/home" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)' }}>View site</Link>
          <button onClick={logout} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', cursor: 'pointer' }}>Sign out</button>
        </div>
      </nav>

      {/* TAB BAR */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 2rem', display: 'flex', gap: '0' }}>
        {(['dashboard', 'publish', 'stories'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', color: tab === t ? 'var(--green-400)' : 'rgba(255,255,255,0.3)', borderBottom: tab === t ? '2px solid var(--green-500)' : '2px solid transparent', textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '24px', fontWeight: 600, color: 'var(--cream-100)', marginBottom: '2rem' }}>Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '2.5rem' }}>
              {statCard('Total views', stats.totalViews)}
              {statCard('This week', stats.weekViews)}
              {statCard('This month', stats.monthViews)}
              {statCard('Readers', stats.totalReaders)}
              {statCard('Comments', stats.totalComments)}
              {statCard('Likes', stats.totalLikes)}
            </div>

            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '18px', fontWeight: 600, color: 'var(--cream-100)', marginBottom: '1rem' }}>Top episodes</h2>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
              {stats.topEpisodes.length > 0 ? stats.topEpisodes.map((ep: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: i < stats.topEpisodes.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'Lora, serif', fontSize: '20px', color: 'var(--green-800)', fontWeight: 700, minWidth: '28px' }}>#{i + 1}</span>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--cream-100)' }}>{ep.title}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Episode {ep.episode_number}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green-400)' }}>{ep.views} views</span>
                </div>
              )) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>No views yet. Share your stories!</div>
              )}
            </div>

            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '18px', fontWeight: 600, color: 'var(--cream-100)', margin: '2rem 0 1rem' }}>Your stories</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {stories.map((s: any) => (
                <div key={s.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '11px', color: 'var(--green-400)', marginBottom: '6px' }}>{s.genre}</div>
                  <p style={{ fontFamily: 'Lora, serif', fontSize: '16px', fontWeight: 600, color: 'var(--cream-100)', marginBottom: '4px' }}>{s.title}</p>
                  <p style={{ fontSize: '12px', color: s.is_published ? 'var(--green-400)' : 'rgba(255,255,255,0.25)' }}>{s.is_published ? '● Published' : '○ Draft'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PUBLISH TAB */}
        {tab === 'publish' && (
          <div style={{ maxWidth: '640px' }}>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '24px', fontWeight: 600, color: 'var(--cream-100)', marginBottom: '0.5rem' }}>Publish new episode</h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>Fill in the details and hit publish. It goes live instantly.</p>

            <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Story</label>
            <select value={selectedStory} onChange={e => setSelectedStory(e.target.value)} style={{ ...inp, appearance: 'none' as any }}>
              <option value="">Select a story...</option>
              {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>

            <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Episode number</label>
            <input type="number" value={episodeNumber} onChange={e => setEpisodeNumber(e.target.value)} placeholder="2" style={inp} />

            <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Episode title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Episode 2 — The Arrival" style={inp} />

            <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Thumbnail image <span style={{ color: 'rgba(255,255,255,0.2)' }}>(optional)</span></label>
            <input type="file" accept="image/*" onChange={async e => {
              const file = e.target.files?.[0]
              if (!file) return
              const url = await uploadImage(file, `episodes/${Date.now()}-${file.name}`)
              if (url) setThumbnailUrl(url)
            }} style={{ ...inp, padding: '10px 16px', cursor: 'pointer' }} />
            {uploading && <p style={{ fontSize: '12px', color: 'var(--green-400)', marginTop: '-10px', marginBottom: '14px' }}>Uploading...</p>}
            {thumbnailUrl && <img src={thumbnailUrl} alt="thumbnail" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', marginBottom: '14px' }} />}

            <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
              Content <span style={{ color: 'rgba(255,255,255,0.2)' }}>(each new line = new paragraph)</span>
            </label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={16}
              placeholder={'Write your episode here...\n\nEach line becomes a paragraph.\n\nASHOK: Dialogue like this.'}
              style={{ ...inp, resize: 'none', fontFamily: 'monospace', lineHeight: 1.7 }} />

            {content && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', marginBottom: '14px' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)', marginBottom: '12px' }}>Preview</p>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
                  {content.split('\n').filter(p => p.trim()).map((p, i) => <p key={i} style={{ marginBottom: '8px' }}>{p}</p>)}
                </div>
              </div>
            )}

            <button onClick={publish} disabled={saving || uploading}
              style={{ width: '100%', background: 'var(--green-600)', color: 'white', padding: '13px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Publishing...' : 'Publish episode →'}
            </button>

            {message && <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: message.includes('Error') ? '#f87171' : 'var(--green-400)' }}>{message}</p>}
          </div>
        )}

        {/* STORIES TAB */}
        {tab === 'stories' && (
          <div>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '24px', fontWeight: 600, color: 'var(--cream-100)', marginBottom: '2rem' }}>Manage stories</h1>
            <div style={{ display: 'grid', gap: '12px' }}>
              {stories.map((s: any) => (
                <div key={s.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {s.thumbnail_url ? (
                    <img src={s.thumbnail_url} alt={s.title} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '70px', height: '70px', background: 'var(--green-900)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'Lora, serif', fontSize: '1.5rem', color: 'var(--green-700)', fontStyle: 'italic' }}>{s.title[0]}</span>
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: 'var(--green-400)', marginBottom: '4px' }}>{s.genre}</div>
                    <p style={{ fontFamily: 'Lora, serif', fontSize: '16px', fontWeight: 600, color: 'var(--cream-100)', marginBottom: '4px' }}>{s.title}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>{s.description?.substring(0, 100)}...</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    <Link href={`/stories/${s.slug}`} style={{ fontSize: '12px', color: 'var(--green-400)', padding: '5px 12px', borderRadius: '999px', border: '1px solid rgba(58,158,96,0.25)', textAlign: 'center' }}>View</Link>
                    <span style={{ fontSize: '12px', color: s.is_published ? 'var(--green-400)' : 'rgba(255,255,255,0.2)', textAlign: 'center' }}>{s.is_published ? '● Live' : '○ Draft'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}