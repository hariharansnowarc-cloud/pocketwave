'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPage() {
  const supabase = createClient()
  const router = useRouter()
  const [tab, setTab] = useState<'dashboard' | 'publish' | 'episodes'>('dashboard')
  const [user, setUser] = useState<any>(null)
  const [stories, setStories] = useState<any[]>([])
  const [episodes, setEpisodes] = useState<any[]>([])
  const [stats, setStats] = useState({ totalViews: 0, weekViews: 0, monthViews: 0, totalReaders: 0, totalComments: 0, totalLikes: 0, topEpisodes: [] as any[] })
  const [selectedStory, setSelectedStory] = useState('')
  const [episodeNumber, setEpisodeNumber] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [editingEp, setEditingEp] = useState<any>(null)

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
    const { data: s } = await supabase.from('stories').select('*').order('created_at', { ascending: false })
    if (s) setStories(s)

    const { data: e } = await supabase.from('episodes').select('*, stories(title, slug)').order('created_at', { ascending: false })
    if (e) setEpisodes(e)

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const [{ count: tv }, { count: wv }, { count: mv }, { count: tr }, { count: tc }, { count: tl }] = await Promise.all([
      supabase.from('views').select('*', { count: 'exact', head: true }),
      supabase.from('views').select('*', { count: 'exact', head: true }).gte('viewed_at', weekAgo),
      supabase.from('views').select('*', { count: 'exact', head: true }).gte('viewed_at', monthAgo),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'reader'),
      supabase.from('comments').select('*', { count: 'exact', head: true }),
      supabase.from('likes').select('*', { count: 'exact', head: true }),
    ])
    const { data: top } = await supabase.from('episodes').select('title, views, episode_number, stories(title)').eq('is_published', true).order('views', { ascending: false }).limit(5)
    setStats({ totalViews: tv || 0, weekViews: wv || 0, monthViews: mv || 0, totalReaders: tr || 0, totalComments: tc || 0, totalLikes: tl || 0, topEpisodes: top || [] })
  }

  async function uploadImage(file: File, path: string) {
    setUploading(true)
    const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    setUploading(false)
    if (error) { setMessage('Upload error: ' + error.message); return null }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
    return publicUrl
  }

  async function publish() {
    if (!selectedStory || !episodeNumber || !title || !content) { setMessage('Please fill in all fields.'); return }
    setSaving(true)
    const publishAt = scheduleDate ? new Date(scheduleDate).toISOString() : new Date().toISOString()
    const isPublished = !scheduleDate || new Date(scheduleDate) <= new Date()
    const { error } = await supabase.from('episodes').insert({
      story_id: selectedStory, episode_number: parseInt(episodeNumber), title,
      content: content.split('\n').filter((p: string) => p.trim()).map((p: string) => `<p>${p}</p>`).join(''),
      thumbnail_url: thumbnailUrl || null, is_published: isPublished, publish_at: publishAt
    })
    setSaving(false)
    if (error) setMessage('Error: ' + error.message)
    else {
      setMessage(scheduleDate ? `Scheduled for ${new Date(scheduleDate).toLocaleString()}` : 'Published!')
      setTitle(''); setContent(''); setEpisodeNumber(''); setThumbnailUrl(''); setScheduleDate('')
      loadData()
    }
  }

  async function saveEdit() {
    if (!editingEp) return
    setSaving(true)
    const { error } = await supabase.from('episodes').update({
      title: editingEp.title,
      content: editingEp.content,
      thumbnail_url: editingEp.thumbnail_url || null,
    }).eq('id', editingEp.id)
    setSaving(false)
    if (error) setMessage('Error: ' + error.message)
    else { setMessage('Episode updated!'); setEditingEp(null); loadData() }
  }

  async function deleteEpisode(id: string) {
    if (!confirm('Delete this episode? This cannot be undone.')) return
    await supabase.from('episodes').delete().eq('id', id)
    loadData()
    setMessage('Episode deleted.')
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#fff', border: '1px solid var(--border2)',
    borderRadius: '10px', padding: '11px 14px', fontSize: '14px',
    color: 'var(--ink)', outline: 'none', marginBottom: '12px'
  }

  const statCard = (label: string, value: number | string, accent?: string) => (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
      <p style={{ fontSize: '11px', color: 'var(--subtle)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ fontFamily: 'Lora, serif', fontSize: '2rem', fontWeight: 700, color: accent || 'var(--ink)' }}>{value}</p>
    </div>
  )

  if (!user) return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Loading...</p>
    </main>
  )

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,249,246,0.95)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/home" style={{ fontFamily: 'Lora, serif', fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>Pocketwave</Link>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green-700)', background: 'var(--green-100)', padding: '3px 10px', borderRadius: '999px' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/home" style={{ fontSize: '13px', color: 'var(--muted)', padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--border2)' }}>View site</Link>
          <button onClick={logout} style={{ fontSize: '13px', color: 'var(--muted)', padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--border2)', background: 'transparent', cursor: 'pointer' }}>Sign out</button>
        </div>
      </nav>

      {/* TABS */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '0 2rem', display: 'flex', background: '#fff' }}>
        {(['dashboard', 'publish', 'episodes'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setMessage('') }}
            style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', color: tab === t ? 'var(--green-700)' : 'var(--muted)', borderBottom: tab === t ? '2px solid var(--green-500)' : '2px solid transparent', textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '24px', fontWeight: 600, color: 'var(--ink)', marginBottom: '2rem' }}>Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginBottom: '2.5rem' }}>
              {statCard('Total views', stats.totalViews, 'var(--green-700)')}
              {statCard('This week', stats.weekViews)}
              {statCard('This month', stats.monthViews)}
              {statCard('Readers', stats.totalReaders)}
              {statCard('Comments', stats.totalComments)}
              {statCard('Likes', stats.totalLikes)}
            </div>

            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '1rem' }}>Top episodes</h2>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
              {stats.topEpisodes.length > 0 ? stats.topEpisodes.map((ep: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.25rem', borderBottom: i < stats.topEpisodes.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'Lora, serif', fontSize: '18px', color: 'var(--green-300)', fontWeight: 700, minWidth: '28px' }}>#{i + 1}</span>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>{ep.title}</p>
                      <p style={{ fontSize: '12px', color: 'var(--subtle)' }}>{ep.stories?.title} · Ep. {ep.episode_number}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green-600)' }}>{ep.views} views</span>
                </div>
              )) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--subtle)', fontSize: '14px' }}>No views yet. Share your stories!</div>
              )}
            </div>
          </div>
        )}

        {/* PUBLISH */}
        {tab === 'publish' && (
          <div style={{ maxWidth: '640px' }}>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '24px', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>Publish episode</h1>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '2rem' }}>Write and publish or schedule a new episode.</p>

            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>Story</label>
            <select value={selectedStory} onChange={e => setSelectedStory(e.target.value)} style={inp}>
              <option value="">Select a story...</option>
              {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>Episode number</label>
                <input type="number" value={episodeNumber} onChange={e => setEpisodeNumber(e.target.value)} placeholder="2" style={inp} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>Schedule (optional)</label>
                <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={inp} />
              </div>
            </div>

            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Episode 2 — The Arrival" style={inp} />

            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
              Thumbnail <span style={{ color: 'var(--subtle)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input type="file" accept="image/*" onChange={async e => {
              const file = e.target.files?.[0]; if (!file) return
              const url = await uploadImage(file, `episodes/${Date.now()}-${file.name}`)
              if (url) setThumbnailUrl(url)
            }} style={{ ...inp, cursor: 'pointer' }} />
            {uploading && <p style={{ fontSize: '12px', color: 'var(--green-600)', marginTop: '-8px', marginBottom: '12px' }}>Uploading...</p>}
            {thumbnailUrl && <img src={thumbnailUrl} alt="preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '12px' }} />}

            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
              Content <span style={{ color: 'var(--subtle)', fontWeight: 400 }}>(new line = new paragraph)</span>
            </label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={16}
              placeholder={'Write your episode here...\n\nEach line becomes a paragraph.\n\nASHOK: Dialogue like this.'}
              style={{ ...inp, resize: 'none', fontFamily: 'monospace', lineHeight: 1.7 }} />

            {content && (
              <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: '12px', padding: '1.25rem', marginBottom: '14px' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--subtle)', marginBottom: '10px' }}>Preview</p>
                <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8 }}>
                  {content.split('\n').filter(p => p.trim()).map((p, i) => <p key={i} style={{ marginBottom: '6px' }}>{p}</p>)}
                </div>
              </div>
            )}

            <button onClick={publish} disabled={saving || uploading}
              style={{ width: '100%', background: 'var(--green-600)', color: 'white', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : scheduleDate ? `Schedule for ${new Date(scheduleDate).toLocaleString()}` : 'Publish now →'}
            </button>

            {message && <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: message.includes('Error') ? '#dc2626' : 'var(--green-700)', fontWeight: 500 }}>{message}</p>}
          </div>
        )}

        {/* EPISODES */}
        {tab === 'episodes' && (
          <div>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '24px', fontWeight: 600, color: 'var(--ink)', marginBottom: '2rem' }}>All episodes</h1>

            {message && <p style={{ marginBottom: '1rem', fontSize: '13px', color: message.includes('Error') ? '#dc2626' : 'var(--green-700)', fontWeight: 500 }}>{message}</p>}

            {editingEp && (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Lora, serif', fontSize: '18px', fontWeight: 600, marginBottom: '1rem', color: 'var(--ink)' }}>Editing: {editingEp.title}</h2>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>Title</label>
                <input value={editingEp.title} onChange={e => setEditingEp({ ...editingEp, title: e.target.value })} style={inp} />
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>Content (HTML)</label>
                <textarea value={editingEp.content} onChange={e => setEditingEp({ ...editingEp, content: e.target.value })} rows={12} style={{ ...inp, fontFamily: 'monospace', lineHeight: 1.6, resize: 'vertical' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={saveEdit} disabled={saving} style={{ background: 'var(--green-600)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                  <button onClick={() => setEditingEp(null)} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border2)', padding: '10px 24px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {episodes.map((ep: any) => (
                <div key={ep.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.25rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '11px', color: 'var(--subtle)', marginBottom: '3px' }}>{ep.stories?.title} · Ep. {ep.episode_number}</p>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', fontFamily: 'Lora, serif' }}>{ep.title}</p>
                    <p style={{ fontSize: '12px', marginTop: '3px', color: ep.is_published ? 'var(--green-600)' : 'var(--gold)' }}>
                      {ep.is_published ? '● Published' : `○ Scheduled: ${new Date(ep.publish_at).toLocaleString()}`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setEditingEp(ep); setTab('episodes') }}
                      style={{ fontSize: '12px', color: 'var(--green-700)', background: 'var(--green-50)', border: '1px solid var(--green-200)', padding: '5px 12px', borderRadius: '999px', cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button onClick={() => deleteEpisode(ep.id)}
                      style={{ fontSize: '12px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '5px 12px', borderRadius: '999px', cursor: 'pointer' }}>
                      Delete
                    </button>
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