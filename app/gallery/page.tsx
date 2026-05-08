'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '../lib/supabase'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const supabase = createClient()

export default function GalleryPage() {
  const [photos, setPhotos] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState('General')
  const [uploadedBy, setUploadedBy] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selected, setSelected] = useState<any>(null)
  const [error, setError] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentBody, setCommentBody] = useState('')
  const [commentFrom, setCommentFrom] = useState('')
  const [postingComment, setPostingComment] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadPhotos(); loadCategories() }, [])
  useEffect(() => { if (selected) loadComments(selected.id) }, [selected])

  async function loadPhotos() {
    setLoading(true)
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
    if (data) setPhotos(data)
    setLoading(false)
  }

  async function loadCategories() {
    const { data } = await supabase.from('photo_categories').select('name').order('name')
    if (data) setCategories(data.map((c: any) => c.name))
  }

  async function loadComments(photoId: string) {
    const { data } = await supabase.from('photo_comments').select('*').eq('photo_id', photoId).order('created_at', { ascending: true })
    if (data) setComments(data)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!uploadedBy) { setError('Please select who is uploading first'); return }
    setError('')
    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `gallery/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('images').upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
      const { error: dbError } = await supabase.from('photos').insert({ url: publicUrl, caption: caption.trim() || null, category, uploaded_by: uploadedBy })
      if (dbError) throw dbError
      setCaption('')
      await loadPhotos()
    } catch (err: any) {
      setError('Upload failed: ' + (err.message || 'Unknown error'))
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function triggerUpload() {
    if (!uploadedBy) { setError('Please select who is uploading first'); return }
    setError('')
    fileInputRef.current?.click()
  }

  async function addCategory() {
    if (!newCategory.trim()) return
    await supabase.from('photo_categories').insert({ name: newCategory.trim() })
    setNewCategory('')
    setAddingCategory(false)
    loadCategories()
  }

  async function postComment() {
    if (!commentBody.trim() || !commentFrom || !selected) return
    setPostingComment(true)
    await supabase.from('photo_comments').insert({ photo_id: selected.id, from_name: commentFrom, body: commentBody.trim() })
    setCommentBody('')
    setPostingComment(false)
    loadComments(selected.id)
  }

  async function deletePhoto(id: string) {
    await supabase.from('photos').delete().eq('id', id)
    setSelected(null)
    loadPhotos()
  }

  async function deleteComment(id: string) {
    await supabase.from('photo_comments').delete().eq('id', id)
    loadComments(selected.id)
  }

  const filtered = activeCategory === 'All' ? photos : photos.filter(p => p.category === activeCategory)
  const inp: React.CSSProperties = { background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: 'var(--ink)', outline: 'none', fontFamily: 'Inter, sans-serif', width: '100%' }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        .photo-grid { columns: 3 200px; gap: 10px; }
        @media (max-width: 600px) { .photo-grid { columns: 2 140px; gap: 8px; } }
        .lightbox-inner { display: flex; flex-direction: row; max-height: 100vh; }
        @media (max-width: 700px) { .lightbox-inner { flex-direction: column; overflow-y: auto; } }
        .photo-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .photo-card:hover { transform: scale(1.02); box-shadow: 0 6px 20px rgba(201,98,106,0.12); }
      `}</style>

      <Nav />

      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 1.25rem 4rem' }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.5rem', fontWeight: 500 }}>Our memories</p>
        <h1 className="fade-up" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 7vw, 3rem)', fontWeight: 600, color: 'var(--ink)', marginBottom: '2rem', lineHeight: 1.1 }}>Gallery 📸</h1>

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '1rem' }}>Add a photo</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Uploaded by *</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Hari Haran', 'Jothi Lakshmi'].map(name => (
                <button key={name} onClick={() => { setUploadedBy(name); setError('') }}
                  className="btn-hover"
                  style={{ padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, border: `1px solid ${uploadedBy === name ? 'var(--rose)' : 'var(--border2)'}`, background: uploadedBy === name ? 'var(--rose-light)' : '#fff', color: uploadedBy === name ? 'var(--rose)' : 'var(--muted)', cursor: 'pointer' }}>
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)' }}>Category</label>
              <button onClick={() => setAddingCategory(!addingCategory)} style={{ fontSize: '11px', color: 'var(--rose)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>{addingCategory ? 'Cancel' : '+ New category'}</button>
            </div>
            {addingCategory && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category name..." style={{ ...inp, flex: 1 }} onKeyDown={e => e.key === 'Enter' && addCategory()} />
                <button onClick={addCategory} className="btn-hover" style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>Add</button>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  style={{ padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, border: `1px solid ${category === c ? 'var(--rose)' : 'var(--border2)'}`, background: category === c ? 'var(--rose-light)' : '#fff', color: category === c ? 'var(--rose)' : 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Caption (optional)</label>
            <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a caption..." style={inp} />
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          <button onClick={triggerUpload} disabled={uploading} className="btn-hover"
            style={{ background: uploading ? 'var(--rose-mid)' : 'var(--rose)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, cursor: uploading ? 'not-allowed' : 'pointer', width: '100%' }}>
            {uploading ? 'Uploading... please wait' : '+ Upload photo from gallery'}
          </button>
          {uploading && <p style={{ fontSize: '12px', color: 'var(--rose)', marginTop: '8px', textAlign: 'center' }}>Uploading your photo ✨</p>}
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {['All', ...categories].map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, border: `1px solid ${activeCategory === c ? 'var(--rose)' : 'var(--border2)'}`, background: activeCategory === c ? 'var(--rose)' : '#fff', color: activeCategory === c ? 'white' : 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
              {c} ({c === 'All' ? photos.length : photos.filter(p => p.category === c).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--subtle)' }}>Loading photos...</div>
        ) : filtered.length > 0 ? (
          <div className="photo-grid">
            {filtered.map(photo => (
              <div key={photo.id} onClick={() => setSelected(photo)} className="photo-card"
                style={{ breakInside: 'avoid', marginBottom: '10px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', background: 'var(--rose-light)', border: '1px solid var(--border)' }}>
                <img src={photo.url} alt={photo.caption || 'photo'} loading="lazy" style={{ width: '100%', display: 'block', objectFit: 'cover', background: 'var(--rose-light)' }} />
                <div style={{ padding: '8px 10px' }}>
                  {photo.category && <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--rose)', background: 'var(--rose-light)', padding: '2px 7px', borderRadius: '999px', display: 'inline-block', marginBottom: '3px' }}>{photo.category}</span>}
                  {photo.caption && <p style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', marginTop: '3px' }}>{photo.caption}</p>}
                  <p style={{ fontSize: '10px', color: 'var(--subtle)', marginTop: '3px' }}>{photo.uploaded_by} · {new Date(photo.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--subtle)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: 'var(--ink)', marginBottom: '6px' }}>{activeCategory === 'All' ? 'No photos yet' : `No photos in ${activeCategory}`}</p>
            <p style={{ fontSize: '13px' }}>Upload your first memory</p>
          </div>
        )}
      </section>

      <Footer />

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 100, overflowY: 'auto' }}>
          <div className="lightbox-inner">
            <div onClick={() => setSelected(null)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', cursor: 'pointer', minHeight: '50vw' }}>
              <img src={selected.url} alt={selected.caption || ''} onClick={e => e.stopPropagation()} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px', cursor: 'default', display: 'block' }} />
            </div>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '300px', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  {selected.category && <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--rose)', background: 'var(--rose-light)', padding: '2px 8px', borderRadius: '999px', display: 'inline-block', marginBottom: '6px' }}>{selected.category}</span>}
                  {selected.caption && <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', fontStyle: 'italic', color: 'var(--ink)', marginBottom: '6px' }}>{selected.caption}</p>}
                  <p style={{ fontSize: '12px', color: 'var(--subtle)' }}>📅 {new Date(selected.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p style={{ fontSize: '12px', color: 'var(--subtle)' }}>🕐 {new Date(selected.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  {selected.uploaded_by && <p style={{ fontSize: '12px', color: 'var(--subtle)' }}>👤 {selected.uploaded_by}</p>}
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--muted)', lineHeight: 1, flexShrink: 0 }}>×</button>
              </div>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                <button onClick={() => deletePhoto(selected.id)} style={{ fontSize: '12px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '5px 12px', borderRadius: '999px', cursor: 'pointer' }}>Delete photo</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Comments ({comments.length})</p>
                {comments.length === 0 ? <p style={{ fontSize: '13px', color: 'var(--subtle)', textAlign: 'center', padding: '1rem 0' }}>No comments yet</p> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {comments.map(c => (
                      <div key={c.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--rose)' }}>{c.from_name}</span>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px', color: 'var(--subtle)' }}>{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            <button onClick={() => deleteComment(c.id)} style={{ fontSize: '13px', color: 'var(--subtle)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                          </div>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>{c.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  {['Hari Haran', 'Jothi Lakshmi'].map(name => (
                    <button key={name} onClick={() => setCommentFrom(name)}
                      style={{ flex: 1, padding: '6px', borderRadius: '8px', fontSize: '11px', fontWeight: 500, border: `1px solid ${commentFrom === name ? 'var(--rose)' : 'var(--border2)'}`, background: commentFrom === name ? 'var(--rose-light)' : '#fff', color: commentFrom === name ? 'var(--rose)' : 'var(--muted)', cursor: 'pointer' }}>
                      {name.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input value={commentBody} onChange={e => setCommentBody(e.target.value)} placeholder="Add a comment..." onKeyDown={e => e.key === 'Enter' && postComment()} style={{ flex: 1, background: '#fff', border: '1px solid var(--border2)', borderRadius: '8px', padding: '8px 10px', fontSize: '13px', color: 'var(--ink)', outline: 'none' }} />
                  <button onClick={postComment} disabled={postingComment || !commentBody.trim() || !commentFrom}
                    style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', opacity: (!commentBody.trim() || !commentFrom) ? 0.5 : 1 }}>
                    {postingComment ? '...' : '→'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}