'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'

interface Comment {
  id: string
  body: string
  created_at: string
  user_id: string
  profiles: { username: string }
}

interface Props {
  episodeId: string
  userId: string
  username: string
  initialComments: Comment[]
}

export default function CommentSection({ episodeId, userId, username, initialComments }: Props) {
  const supabase = createClient()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [body, setBody] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  async function postComment() {
    if (!body.trim()) return
    if (body.length > 1000) { setError('Comment too long (max 1000 chars)'); return }
    setPosting(true)
    setError('')
    const { data, error: err } = await supabase
      .from('comments')
      .insert({ episode_id: episodeId, user_id: userId, body: body.trim() })
      .select('*, profiles(username)')
      .single()
    if (err) {
      setError(err.message)
    } else {
      setComments(prev => [...prev, data])
      setBody('')
    }
    setPosting(false)
  }

  async function deleteComment(commentId: string) {
    await supabase.from('comments').delete().eq('id', commentId).eq('user_id', userId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'Lora, serif', fontSize: '20px', fontWeight: 600, color: 'var(--ink)', marginBottom: '1.25rem' }}>
        {comments.length > 0 ? `${comments.length} Comment${comments.length > 1 ? 's' : ''}` : 'Comments'}
      </h2>

      {/* FORM */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--green-700)', flexShrink: 0 }}>
            {username[0]?.toUpperCase()}
          </div>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Share your thoughts on this episode..."
            rows={3}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: 'var(--ink)', resize: 'none', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}
          />
        </div>
        {error && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '8px' }}>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--subtle)' }}>{body.length}/1000</span>
          <button onClick={postComment} disabled={posting || !body.trim()}
            style={{ background: 'var(--green-600)', color: 'white', border: 'none', padding: '7px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, cursor: posting ? 'not-allowed' : 'pointer', opacity: posting ? 0.7 : 1 }}>
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* COMMENTS LIST */}
      {comments.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {comments.map(comment => (
            <div key={comment.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--green-700)' }}>
                    {comment.profiles?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{comment.profiles?.username || 'Reader'}</span>
                  <span style={{ fontSize: '12px', color: 'var(--subtle)' }}>{new Date(comment.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                {comment.user_id === userId && (
                  <button onClick={() => deleteComment(comment.id)}
                    style={{ fontSize: '12px', color: 'var(--subtle)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: '4px' }}>
                    Delete
                  </button>
                )}
              </div>
              <p style={{ fontSize: '14px', color: '#3d4f3f', lineHeight: 1.7 }}>{comment.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--subtle)', background: '#fff', borderRadius: '14px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '15px', marginBottom: '4px' }}>No comments yet</p>
          <p style={{ fontSize: '13px' }}>Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
}