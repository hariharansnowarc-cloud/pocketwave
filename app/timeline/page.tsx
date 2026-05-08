'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const supabase = createClient()

export default function TimelinePage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', event_date: '', emoji: '💛', added_by: '' })
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { loadEvents() }, [])

  async function loadEvents() {
    setLoading(true)
    const { data } = await supabase.from('timeline_events').select('*').order('event_date', { ascending: true })
    if (data) setEvents(data)
    setLoading(false)
  }

  async function save() {
    if (!form.title.trim() || !form.event_date.trim() || !form.added_by) return
    setSaving(true)
    if (editingId) {
      await supabase.from('timeline_events').update({ title: form.title.trim(), description: form.description.trim(), event_date: form.event_date.trim(), emoji: form.emoji.trim() || '💛', added_by: form.added_by }).eq('id', editingId)
    } else {
      await supabase.from('timeline_events').insert({ title: form.title.trim(), description: form.description.trim(), event_date: form.event_date.trim(), emoji: form.emoji.trim() || '💛', added_by: form.added_by })
    }
    setForm({ title: '', description: '', event_date: '', emoji: '💛', added_by: '' })
    setShowForm(false)
    setEditingId(null)
    setSaving(false)
    loadEvents()
  }

  async function deleteEvent(id: string) {
    setDeletingId(id)
    await supabase.from('timeline_events').delete().eq('id', id)
    setDeletingId(null)
    loadEvents()
  }

  function startEdit(event: any) {
    setForm({ title: event.title, description: event.description || '', event_date: event.event_date, emoji: event.emoji || '💛', added_by: event.added_by || '' })
    setEditingId(event.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelForm() {
    setForm({ title: '', description: '', event_date: '', emoji: '💛', added_by: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const inp: React.CSSProperties = { width: '100%', background: '#fff', border: '1px solid var(--border2)', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: 'var(--ink)', outline: 'none', fontFamily: 'Inter, sans-serif' }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Nav />
      <section style={{ maxWidth: '640px', margin: '0 auto', padding: '4rem 2rem 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.5rem', fontWeight: 500 }}>Our story</p>
            <h1 className="fade-up" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.1 }}>How it all began</h1>
          </div>
          <button onClick={() => { cancelForm(); setShowForm(!showForm) }} className="btn-hover"
            style={{ background: showForm ? 'var(--cream2)' : 'var(--rose)', color: showForm ? 'var(--muted)' : 'white', border: 'none', padding: '10px 20px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {showForm ? 'Cancel' : '+ Add moment'}
          </button>
        </div>

        {showForm && (
          <div className="fade-up" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2.5rem' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 600, color: 'var(--ink)', marginBottom: '1.25rem' }}>{editingId ? 'Edit moment' : 'Add a new moment'}</h3>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Added by *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Hari Haran', 'Jothi Lakshmi'].map(name => (
                  <button key={name} onClick={() => setForm({ ...form, added_by: name })} className="btn-hover"
                    style={{ padding: '8px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, border: `1px solid ${form.added_by === name ? 'var(--rose)' : 'var(--border2)'}`, background: form.added_by === name ? 'var(--rose-light)' : '#fff', color: form.added_by === name ? 'var(--rose)' : 'var(--muted)', cursor: 'pointer' }}>
                    {name}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>Emoji</label>
                <input value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} style={{ ...inp, textAlign: 'center', fontSize: '20px', padding: '10px 8px' }} maxLength={2} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. We met for the first time" style={inp} />
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>Date *</label>
              <input value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} placeholder="e.g. March 2024 or 14 Feb 2025" style={inp} />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Tell the story of this moment..." rows={3} style={{ ...inp, resize: 'none', lineHeight: 1.6 }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={save} disabled={saving || !form.title.trim() || !form.event_date.trim() || !form.added_by} className="btn-hover"
                style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', opacity: (saving || !form.title.trim() || !form.event_date.trim() || !form.added_by) ? 0.5 : 1 }}>
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add to story'}
              </button>
              <button onClick={cancelForm} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border2)', padding: '10px 20px', borderRadius: '999px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--subtle)' }}>Loading...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--subtle)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>💛</p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>Your story starts here</p>
            <p style={{ fontSize: '14px', marginBottom: '1.5rem' }}>Add your first moment together</p>
            <button onClick={() => setShowForm(true)} className="btn-hover" style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>+ Add first moment</button>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '19px', top: '8px', bottom: '8px', width: '1px', background: 'var(--rose-mid)', opacity: 0.4 }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {events.map((event) => (
                <div key={event.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div className="pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--rose-light)', border: '2px solid var(--rose-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                    {event.emoji}
                  </div>
                  <div className="card-hover" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{event.event_date}</p>
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 600, color: 'var(--ink)' }}>{event.title}</h3>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => startEdit(event)} style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--cream2)', border: 'none', padding: '4px 10px', borderRadius: '999px', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => deleteEvent(event.id)} disabled={deletingId === event.id} style={{ fontSize: '12px', color: '#dc2626', background: '#fef2f2', border: 'none', padding: '4px 10px', borderRadius: '999px', cursor: 'pointer', opacity: deletingId === event.id ? 0.5 : 1 }}>
                          {deletingId === event.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                    {event.description && <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '10px' }}>{event.description}</p>}
                    {event.added_by && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'var(--rose-light)', padding: '3px 10px', borderRadius: '999px', marginTop: '4px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--rose)', fontWeight: 500 }}>Added by {event.added_by}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}