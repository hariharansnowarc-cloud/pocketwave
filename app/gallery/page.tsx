'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import Link from 'next/link'

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

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!uploadedBy) { setError('Please select who is uploading'); return }
    setError('')
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `gallery/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    if (uploadError) { setError('Upload failed: ' + uploadError.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
    await supabase.from('photos').insert({
      url: publicUrl,
      caption: caption.trim() || null,
      category,
      uploaded_by: uploadedBy,
    })
    setCaption('')
    setUploading(false)
    e.target.value = ''
    loadPhotos()
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

  const inp: React.CSSProperties = {
    background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: '10px',
    padding: '10px 14px', fontSize: '14px', color: 'var(--ink)', outline: 'none', fontFamily: 'Inter, sans-serif'
  }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav style={{ padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(253,248,242,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 600, color: 'var(--ink)' }}>Hari & Jothi</Link>
        <Link href="/" style={{ fontSize: '13px', color: 'var(--muted)' }}>← Home</Link>
      </nav>

      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.5rem', fontWeight: 500 }}>Our memories</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '2.5rem', lineHeight: 1.1 }}>Gallery 📸</h1>

        {/* UPLOAD */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 600, color: 'var(--ink)', marginBottom: '1rem' }}>Add a photo</h3>

          {/* WHO IS UPLOADING */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Uploaded by *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Hari Haran', 'Jothi Lakshmi'].map(name => (
                <button key={name} onClick={() => setUploadedBy(name)}
                  style={{ padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, border: `1px solid ${uploadedBy === name ? 'var(--rose)' : 'var(--border2)'}`, background: uploadedBy === name ? 'var(--rose-light)' : '#fff', color: uploadedBy === name ? 'var(--rose)' : 'var(--muted)', cursor: 'pointer' }}>
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* CATEGORY */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)' }}>Category</label>
              <button onClick={() => setAddingCategory(!addingCategory)}
                style={{ fontSize: '11px', color: 'var(--rose)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                {addingCategory ? 'Cancel' : '+ New category'}
              </button>
            </div>
            {addingCategory && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input value={newCategory} onChange={e => setNewCategory(e.target.value)}
                  placeholder="Category name..." style={{ ...inp, flex: 1 }}
                  onKeyDown={e => e.key === 'Enter' && addCategory()} />
                <button onClick={addCategory}
                  style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                  Add
                </button>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  style={{ padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, border: `1px solid ${category === c ? 'var(--rose)' : 'var(--border2)'}`, background: category === c ? 'var(--rose-light)' : '#fff', color: category === c ? 'var(--rose)' : 'var(--muted)', cursor: 'pointer' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* CAPTION + UPLOAD */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input type="text" value={caption} onChange={e => setCaption(e.target.value)}
              placeholder="Add a caption (optional)" style={{ ...inp, flex: 1, minWidth: '200px' }} />
            <label style={{ background: uploading ? 'var(--rose-mid)' : 'var(--rose)', color: 'white', padding: '10px 22px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
              {uploading ? 'Uploading...' : '+ Upload photo'}
              <input type="file" accept="image/*" onChange={upload} style={{ display: 'none' }} disabled={uploading} />
            </label>
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
        </div>

        {/* CATEGORY FILTER */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {['All', ...categories].map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              style={{ padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, border: `1px solid ${activeCategory === c ? 'var(--rose)' : 'var(--border2)'}`, background: activeCategory === c ? 'var(--rose)' : '#fff', color: activeCategory === c ? 'white' : 'var(--muted)', cursor: 'pointer' }}>
              {c} ({c === 'All' ? photos.length : photos.filter(p => p.category === c).length})
            </button>
          ))}
        </div>

        {/* GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--subtle)' }}>Loading...</div>
        ) : filtered.length > 0 ? (
          <div style={{ columns: '3 220px', gap: '12px' }}>
            {filtered.map(photo => (
              <div key={photo.id} onClick={() => setSelected(photo)}
                style={{ breakInside: 'avoid', marginBottom: '12px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', background: '#fff', border: '1px solid var(--border)' }}>
                <img src={photo.url} alt={photo.caption || ''} style={{ width: '100%', display: 'block' }} />
                <div style={{ padding: '10px 12px' }}>
                  {photo.category && (
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--rose)', background: 'var(--rose-light)', padding: '2px 8px', borderRadius: '999px', display: 'inline-block', marginBottom: '4px' }}>{photo.category}</span>
                  )}
                  {photo.caption && <p style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', marginTop: '4px' }}>{photo.caption}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    {photo.uploaded_by && <p style={{ fontSize: '11px', color: 'var(--subtle)' }}>By {photo.uploaded_by}</p>}
                    <p style={{ fontSize: '11px', color: 'var(--subtle)' }}>
                      {new Date(photo.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(photo.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--subtle)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: 'var(--ink)', marginBottom: '6px' }}>
              {activeCategory === 'All' ? 'No photos yet' : `No photos in ${activeCategory}`}
            </p>
            <p style={{ fontSize: '14px' }}>Upload your first memory</p>
          </div>
        )}
      </section>

      {/* LIGHTBOX */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', zIndex: 100 }}>

          {/* IMAGE SIDE */}
          <div onClick={() => setSelected(null)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer' }}>
            <img src={selected.url} alt={selected.caption || ''} onClick={e => e.stopPropagation()}
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px', cursor: 'default' }} />
          </div>

          {/* INFO + COMMENTS SIDE */}
          <div onClick={e => e.stopPropagation()}
            style={{ width: '320px', background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* HEADER */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  {selected.category && (
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--rose)', background: 'var(--rose-light)', padding: '2px 8px', borderRadius: '999px', display: 'inline-block', marginBottom: '6px' }}>{selected.category}</span>
                  )}
                  {selected.caption && <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontStyle: 'italic', color: 'var(--ink)' }}>{selected.caption}</p>}
                </div>
                <button onClick={() => setSelected(null)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--muted)', lineHeight: 1, padding: '0 0 0 8px' }}>×</button>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--subtle)' }}>
                📅 {new Date(selected.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--subtle)' }}>
                🕐 {new Date(selected.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              {selected.uploaded_by && (
                <p style={{ fontSize: '12px', color: 'var(--subtle)', marginTop: '2px' }}>
                  👤 {selected.uploaded_by}
                </p>
              )}
              <button onClick={() => deletePhoto(selected.id)}
                style={{ marginTop: '10px', fontSize: '12px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '5px 12px', borderRadius: '999px', cursor: 'pointer' }}>
                Delete photo
              </button>
            </div>

            {/* COMMENTS */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                Comments ({comments.length})
              </p>
              {comments.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--subtle)', textAlign: 'center', padding: '1rem 0' }}>No comments yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {comments.map(c => (
                    <div key={c.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--rose)' }}>{c.from_name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--subtle)' }}>
                            {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                          <button onClick={() => deleteComment(c.id)}
                            style={{ fontSize: '11px', color: 'var(--subtle)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>{c.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ADD COMMENT */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                {['Hari Haran', 'Jothi Lakshmi'].map(name => (
                  <button key={name} onClick={() => setCommentFrom(name)}
                    style={{ flex: 1, padding: '6px', borderRadius: '8px', fontSize: '11px', fontWeight: 500, border: `1px solid ${commentFrom === name ? 'var(--rose)' : 'var(--border2)'}`, background: commentFrom === name ? 'var(--rose-light)' : '#fff', color: commentFrom === name ? 'var(--rose)' : 'var(--muted)', cursor: 'pointer' }}>
                    {name.split(' ')[0]}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input value={commentBody} onChange={e => setCommentBody(e.target.value)}
                  placeholder="Add a comment..." onKeyDown={e => e.key === 'Enter' && postComment()}
                  style={{ flex: 1, background: '#fff', border: '1px solid var(--border2)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: 'var(--ink)', outline: 'none' }} />
                <button onClick={postComment} disabled={postingComment || !commentBody.trim() || !commentFrom}
                  style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', opacity: (!commentBody.trim() || !commentFrom) ? 0.5 : 1 }}>
                  {postingComment ? '...' : '→'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}