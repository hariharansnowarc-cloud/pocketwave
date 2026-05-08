'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import Link from 'next/link'

const supabase = createClient()

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([])
  const [from, setFrom] = useState('')
  const [body, setBody] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    loadNotes()
  }, [])

  async function loadNotes() {
    const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
    if (data) setNotes(data)
  }

  async function postNote() {
    if (!from.trim() || !body.trim()) return
    setPosting(true)
    await supabase.from('notes').insert({ from_name: from.trim(), body: body.trim() })
    setBody('')
    setPosting(false)
    loadNotes()
  }

  const inp: React.CSSProperties = { width: '100%', background: '#fff', border: '1px solid var(--border2)', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: 'var(--ink)', outline: 'none', fontFamily: 'Inter, sans-serif' }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav style={{ padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(253,248,242,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 600, color: 'var(--ink)' }}>Hari & Jothi</Link>
        <Link href="/" style={{ fontSize: '13px', color: 'var(--muted)' }}>← Home</Link>
      </nav>

      <section style={{ maxWidth: '620px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.75rem', fontWeight: 500 }}>Just for us</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '3rem', lineHeight: 1.1 }}>Love Notes 💌</h1>

        {/* WRITE NOTE */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 600, color: 'var(--ink)', marginBottom: '1rem' }}>Write a note</h3>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>From</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Hari Haran', 'Jothi Lakshmi'].map(name => (
                <button key={name} onClick={() => setFrom(name)}
                  style={{ padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, border: `1px solid ${from === name ? 'var(--rose)' : 'var(--border2)'}`, background: from === name ? 'var(--rose-light)' : '#fff', color: from === name ? 'var(--rose)' : 'var(--muted)', cursor: 'pointer' }}>
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={4}
              placeholder="Write something sweet..."
              style={{ ...inp, resize: 'none', lineHeight: 1.6 }} />
          </div>
          <button onClick={postNote} disabled={posting || !from || !body.trim()}
            style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', opacity: posting ? 0.6 : 1 }}>
            {posting ? 'Sending...' : 'Send note 💌'}
          </button>
        </div>

        {/* NOTES LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notes.map(note => (
            <div key={note.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--rose)' }}>From {note.from_name}</span>
                <span style={{ fontSize: '12px', color: 'var(--subtle)' }}>{new Date(note.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.75, fontFamily: 'Cormorant Garamond, serif' }}>{note.body}</p>
            </div>
          ))}
          {notes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--subtle)' }}>
              <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>💌</p>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: 'var(--ink)', marginBottom: '6px' }}>No notes yet</p>
              <p style={{ fontSize: '14px' }}>Be the first to write something sweet</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}