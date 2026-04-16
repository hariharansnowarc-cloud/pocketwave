'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'

interface Props {
  episodeId: string
  storySlug: string
  userId: string
  initialLiked: boolean
  initialBookmarked: boolean
  initialLikeCount: number
}

export default function EpisodeActions({ episodeId, storySlug, userId, initialLiked, initialBookmarked, initialLikeCount }: Props) {
  const supabase = createClient()
  const [liked, setLiked] = useState(initialLiked)
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [copied, setCopied] = useState(false)

  async function toggleLike() {
    if (liked) {
      await supabase.from('likes').delete().eq('episode_id', episodeId).eq('user_id', userId)
      setLiked(false)
      setLikeCount(c => c - 1)
    } else {
      await supabase.from('likes').insert({ episode_id: episodeId, user_id: userId })
      setLiked(true)
      setLikeCount(c => c + 1)
    }
  }

  async function toggleBookmark() {
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('episode_id', episodeId).eq('user_id', userId)
      setBookmarked(false)
    } else {
      await supabase.from('bookmarks').insert({ episode_id: episodeId, user_id: userId })
      setBookmarked(true)
    }
  }

  function share() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const btn = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
    borderRadius: '999px', border: `1px solid ${active ? 'var(--green-400)' : 'var(--border2)'}`,
    background: active ? 'var(--green-50)' : '#fff', cursor: 'pointer',
    fontSize: '13px', fontWeight: 500, color: active ? 'var(--green-700)' : 'var(--muted)',
    transition: 'all 0.15s'
  })

  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '1.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', margin: '2rem 0' }}>
      <button onClick={toggleLike} style={btn(liked)}>
        <span style={{ fontSize: '16px' }}>{liked ? '❤️' : '🤍'}</span>
        {likeCount > 0 ? likeCount : ''} {liked ? 'Liked' : 'Like'}
      </button>

      <button onClick={toggleBookmark} style={btn(bookmarked)}>
        <span style={{ fontSize: '16px' }}>{bookmarked ? '🔖' : '📄'}</span>
        {bookmarked ? 'Saved' : 'Save'}
      </button>

      <button onClick={share} style={btn(copied)}>
        <span style={{ fontSize: '16px' }}>🔗</span>
        {copied ? 'Copied!' : 'Share'}
      </button>
    </div>
  )
}