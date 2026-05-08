'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import Link from 'next/link'

const supabase = createClient()

export default function WishlistPage() {
  const [wishes, setWishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState<'active' | 'history'>('active')
  const [form, setForm] = useState({ title: '', description: '', tentative_date: '', added_by: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadWishes() }, [])

  async function loadWishes() {
    setLoading(true)
    const { data } = await supabase.from('wishes').select('*').order('created_at', { ascending: false })
    if (data) setWishes(data)
    setLoading(false)
  }

  async function addWish() {
    if (!form.title.trim() || !form.added_by) return
    setSaving(true)
    await supabase.from('wishes').insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      tentative_date: form.tentative_date.trim() || null,
      added_by: form.added_by,
      status: 'active'
    })
    setForm({ title: '', description: '', tentative_date: '', added_by: '' })
    setShowForm(false)
    setSaving(false)
    loadWishes()
  }

  async function updateStatus(id: string, status: 'completed' | 'cancelled') {
    await supabase.from('wishes').update({
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      cancelled_at: status === 'cancelled' ? new Date().toISOString() : null,
    }).eq('id', id)
    loadWishes()
  }

  async function restoreWish(id: string) {
    await supabase.from('wishes').update({ status: 'active', completed_at: null, cancelled_at: null }).eq('id', id)
    loadWishes()
  }

  async function deleteWish(id: string) {
    await supabase.from('wishes').delete().eq('id', id)
    loadWishes()
  }

  const active = wishes.filter(w => w.status === 'active')
  const history = wishes.filter(w => w.status !== 'active')

  const inp: React.CSSProperties = {
    width: '100%', background: '#fff', border: '1px solid var(--border2)',
    borderRadius: '10px', padding: '11px 14px', fontSize: '14px',
    color: 'var(--ink)', outline: 'none', fontFamily: 'Inter, sans-serif'
  }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav style={{ padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(253,248,242,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 600, color: 'var(--ink)' }}>Hari & Jothi</Link>
        <Link href="/" style={{ fontSize: '13px', color: 'var(--muted)' }}>← Home</Link>
      </nav>

      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.5rem', fontWeight: 500 }}>Dreams we share</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.1 }}>Wishlist ✨</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: showForm ? 'var(--cream2)' : 'var(--rose)', color: showForm ? 'var(--muted)' : 'white', border: 'none', padding: '10px 20px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {showForm ? 'Cancel' : '+ Add wish'}
          </button>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', background: 'var(--cream2)', borderRadius: '12px', padding: '3px', marginBottom: '2rem' }}>
          {(['active', 'history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '8px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer', background: tab === t ? '#fff' : 'transparent', color: tab === t ? 'var(--ink)' : 'var(--muted)', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
              {t === 'active' ? `Active (${active.length})` : `History (${history.length})`}
            </button>
          ))}
        </div>

        {/* ADD FORM */}
        {showForm && (
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 600, color: 'var(--ink)', marginBottom: '1.25rem' }}>Add a wish</h3>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Added by *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Hari Haran', 'Jothi Lakshmi'].map(name => (
                  <button key={name} onClick={() => setForm({ ...form, added_by: name })}
                    style={{ padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, border: `1px solid ${form.added_by === name ? 'var(--rose)' : 'var(--border2)'}`, background: form.added_by === name ? 'var(--rose-light)' : '#fff', color: form.added_by === name ? 'var(--rose)' : 'var(--muted)', cursor: 'pointer' }}>
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>Wish *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Trip to Ooty, New phone, Dinner at..." style={inp} />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="More details about this wish..." rows={2}
                style={{ ...inp, resize: 'none', lineHeight: 1.6 }} />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>Tentative date / time</label>
              <input value={form.tentative_date} onChange={e => setForm({ ...form, tentative_date: e.target.value })}
                placeholder="e.g. June 2026, After marriage, Next month..."
                style={inp} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={addWish} disabled={saving || !form.title.trim() || !form.added_by}
                style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', opacity: (saving || !form.title.trim() || !form.added_by) ? 0.5 : 1 }}>
                {saving ? 'Adding...' : 'Add wish ✨'}
              </button>
              <button onClick={() => { setShowForm(false); setForm({ title: '', description: '', tentative_date: '', added_by: '' }) }}
                style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border2)', padding: '10px 20px', borderRadius: '999px', fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE WISHES */}
        {tab === 'active' && (
          loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--subtle)' }}>Loading...</div>
          ) : active.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--subtle)' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</p>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>No wishes yet</p>
              <p style={{ fontSize: '14px', marginBottom: '1.5rem' }}>Add your first wish together</p>
              <button onClick={() => setShowForm(true)}
                style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                + Add wish
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {active.map(wish => (
                <div key={wish.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '19px', fontWeight: 600, color: 'var(--ink)' }}>{wish.title}</h3>
                    <button onClick={() => deleteWish(wish.id)}
                      style={{ fontSize: '13px', color: 'var(--subtle)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: '0 4px' }}>×</button>
                  </div>

                  {wish.description && (
                    <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '10px' }}>{wish.description}</p>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {wish.tentative_date && (
                      <span style={{ fontSize: '11px', color: 'var(--gold)', background: 'var(--gold-light)', padding: '3px 10px', borderRadius: '999px', fontWeight: 500 }}>
                        📅 {wish.tentative_date}
                      </span>
                    )}
                    <span style={{ fontSize: '11px', color: 'var(--rose)', background: 'var(--rose-light)', padding: '3px 10px', borderRadius: '999px', fontWeight: 500 }}>
                      Added by {wish.added_by}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--subtle)', padding: '3px 0' }}>
                      {new Date(wish.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => updateStatus(wish.id, 'completed')}
                      style={{ fontSize: '12px', fontWeight: 500, color: 'var(--green)', background: 'var(--green-light)', border: '1px solid var(--green)', padding: '6px 14px', borderRadius: '999px', cursor: 'pointer' }}>
                      ✓ Mark done
                    </button>
                    <button onClick={() => updateStatus(wish.id, 'cancelled')}
                      style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', background: 'var(--cream2)', border: '1px solid var(--border2)', padding: '6px 14px', borderRadius: '999px', cursor: 'pointer' }}>
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* HISTORY */}
        {tab === 'history' && (
          history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--subtle)' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</p>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>No history yet</p>
              <p style={{ fontSize: '14px' }}>Completed and cancelled wishes will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map(wish => (
                <div key={wish.id} style={{ background: '#fff', border: `1px solid ${wish.status === 'completed' ? 'var(--green)' : 'var(--border)'}`, borderRadius: '14px', padding: '1.25rem', opacity: 0.85 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{wish.status === 'completed' ? '✅' : '❌'}</span>
                      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 600, color: 'var(--ink)', textDecoration: wish.status === 'cancelled' ? 'line-through' : 'none' }}>{wish.title}</h3>
                    </div>
                    <button onClick={() => deleteWish(wish.id)}
                      style={{ fontSize: '13px', color: 'var(--subtle)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>×</button>
                  </div>

                  {wish.description && (
                    <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '8px' }}>{wish.description}</p>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: wish.status === 'completed' ? 'var(--green)' : '#dc2626', background: wish.status === 'completed' ? 'var(--green-light)' : '#fef2f2', padding: '3px 10px', borderRadius: '999px' }}>
                      {wish.status === 'completed' ? `✓ Done on ${new Date(wish.completed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : `✕ Cancelled on ${new Date(wish.cancelled_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    </span>
                    {wish.tentative_date && (
                      <span style={{ fontSize: '11px', color: 'var(--gold)', background: 'var(--gold-light)', padding: '3px 10px', borderRadius: '999px' }}>📅 {wish.tentative_date}</span>
                    )}
                    <span style={{ fontSize: '11px', color: 'var(--rose)', background: 'var(--rose-light)', padding: '3px 10px', borderRadius: '999px' }}>
                      By {wish.added_by}
                    </span>
                  </div>

                  <button onClick={() => restoreWish(wish.id)}
                    style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--cream2)', border: '1px solid var(--border2)', padding: '5px 14px', borderRadius: '999px', cursor: 'pointer' }}>
                    ↩ Restore
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </section>
    </main>
  )
}