'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const supabase = createClient()

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<any[]>([])
  const [items, setItems] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [newListTitle, setNewListTitle] = useState('')
  const [addingList, setAddingList] = useState(false)
  const [newItems, setNewItems] = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [deletingList, setDeletingList] = useState<string | null>(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const { data: lists } = await supabase.from('checklists').select('*').order('created_at', { ascending: false })
    if (!lists) { setLoading(false); return }
    setChecklists(lists)

    const allItems: Record<string, any[]> = {}
    for (const list of lists) {
      const { data } = await supabase.from('checklist_items').select('*').eq('checklist_id', list.id).order('created_at', { ascending: true })
      allItems[list.id] = data || []
    }
    setItems(allItems)
    setLoading(false)
  }

  async function createList() {
    if (!newListTitle.trim()) return
    const { data } = await supabase.from('checklists').insert({ title: newListTitle.trim() }).select().single()
    if (data) {
      setChecklists(prev => [data, ...prev])
      setItems(prev => ({ ...prev, [data.id]: [] }))
      setExpanded(prev => ({ ...prev, [data.id]: true }))
      setNewListTitle('')
      setAddingList(false)
    }
  }

  async function deleteList(id: string) {
    setDeletingList(id)
    await supabase.from('checklists').delete().eq('id', id)
    setChecklists(prev => prev.filter(l => l.id !== id))
    setItems(prev => { const n = { ...prev }; delete n[id]; return n })
    setDeletingList(null)
  }

  async function addItem(listId: string) {
    const text = newItems[listId]?.trim()
    if (!text) return
    const { data } = await supabase.from('checklist_items').insert({ checklist_id: listId, text }).select().single()
    if (data) {
      setItems(prev => ({ ...prev, [listId]: [...(prev[listId] || []), data] }))
      setNewItems(prev => ({ ...prev, [listId]: '' }))
    }
  }

  async function toggleItem(listId: string, itemId: string, done: boolean) {
    await supabase.from('checklist_items').update({ done: !done }).eq('id', itemId)
    setItems(prev => ({
      ...prev,
      [listId]: prev[listId].map(i => i.id === itemId ? { ...i, done: !done } : i)
    }))
  }

  async function deleteItem(listId: string, itemId: string) {
    await supabase.from('checklist_items').delete().eq('id', itemId)
    setItems(prev => ({ ...prev, [listId]: prev[listId].filter(i => i.id !== itemId) }))
  }

  function getProgress(listId: string) {
    const listItems = items[listId] || []
    if (listItems.length === 0) return 0
    return Math.round((listItems.filter(i => i.done).length / listItems.length) * 100)
  }

  const inp: React.CSSProperties = {
    background: '#fff', border: '1px solid var(--border2)', borderRadius: '10px',
    padding: '10px 14px', fontSize: '14px', color: 'var(--ink)', outline: 'none', fontFamily: 'Inter, sans-serif'
  }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav style={{ padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(253,248,242,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 600, color: 'var(--ink)' }}>Hari & Jothi</Link>
        <Link href="/" style={{ fontSize: '13px', color: 'var(--muted)' }}>← Home</Link>
      </nav>

      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.5rem', fontWeight: 500 }}>Plan together</p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.1 }}>Checklists ✅</h1>
          </div>
          <button onClick={() => setAddingList(!addingList)}
            style={{ background: addingList ? 'var(--cream2)' : 'var(--rose)', color: addingList ? 'var(--muted)' : 'white', border: 'none', padding: '10px 20px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {addingList ? 'Cancel' : '+ New list'}
          </button>
        </div>

        {/* NEW LIST FORM */}
        {addingList && (
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={newListTitle} onChange={e => setNewListTitle(e.target.value)}
                placeholder="List name e.g. Wedding shopping, Groceries..."
                onKeyDown={e => e.key === 'Enter' && createList()}
                style={{ ...inp, flex: 1 }} autoFocus />
              <button onClick={createList} disabled={!newListTitle.trim()}
                style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', opacity: !newListTitle.trim() ? 0.5 : 1 }}>
                Create
              </button>
            </div>
          </div>
        )}

        {/* LISTS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--subtle)' }}>Loading...</div>
        ) : checklists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--subtle)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>No lists yet</p>
            <p style={{ fontSize: '14px', marginBottom: '1.5rem' }}>Create your first checklist together</p>
            <button onClick={() => setAddingList(true)}
              style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
              + New list
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {checklists.map(list => {
              const listItems = items[list.id] || []
              const progress = getProgress(list.id)
              const done = listItems.filter(i => i.done).length
              const isExpanded = expanded[list.id] !== false

              return (
                <div key={list.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>

                  {/* LIST HEADER */}
                  <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    onClick={() => setExpanded(prev => ({ ...prev, [list.id]: !isExpanded }))}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 600, color: 'var(--ink)' }}>{list.title}</h3>
                        <span style={{ fontSize: '12px', color: 'var(--subtle)' }}>{done}/{listItems.length}</span>
                      </div>
                      {/* PROGRESS BAR */}
                      <div style={{ height: '4px', background: 'var(--cream2)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: progress === 100 ? 'var(--green)' : 'var(--rose)', borderRadius: '2px', transition: 'width 0.3s' }}></div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {progress === 100 && listItems.length > 0 && (
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green)', background: 'var(--green-light)', padding: '3px 10px', borderRadius: '999px' }}>Done!</span>
                      )}
                      <button onClick={e => { e.stopPropagation(); deleteList(list.id) }} disabled={deletingList === list.id}
                        style={{ fontSize: '12px', color: '#dc2626', background: '#fef2f2', border: 'none', padding: '4px 10px', borderRadius: '999px', cursor: 'pointer' }}>
                        {deletingList === list.id ? '...' : 'Delete'}
                      </button>
                      <span style={{ color: 'var(--subtle)', fontSize: '16px' }}>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* LIST ITEMS */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '0.75rem 1.25rem 1.25rem' }}>
                      {listItems.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px', marginTop: '8px' }}>
                          {listItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', background: item.done ? 'var(--green-light)' : 'var(--bg)', transition: 'background 0.2s' }}>
                              <button onClick={() => toggleItem(list.id, item.id, item.done)}
                                style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${item.done ? 'var(--green)' : 'var(--border2)'}`, background: item.done ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                                {item.done && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                              </button>
                              <span style={{ flex: 1, fontSize: '14px', color: item.done ? 'var(--subtle)' : 'var(--ink)', textDecoration: item.done ? 'line-through' : 'none' }}>
                                {item.text}
                              </span>
                              <button onClick={() => deleteItem(list.id, item.id)}
                                style={{ fontSize: '13px', color: 'var(--subtle)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* ADD ITEM */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          value={newItems[list.id] || ''}
                          onChange={e => setNewItems(prev => ({ ...prev, [list.id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && addItem(list.id)}
                          placeholder="Add an item..."
                          style={{ ...inp, flex: 1, padding: '9px 14px', fontSize: '13px' }}
                        />
                        <button onClick={() => addItem(list.id)} disabled={!newItems[list.id]?.trim()}
                          style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', opacity: !newItems[list.id]?.trim() ? 0.5 : 1 }}>
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}