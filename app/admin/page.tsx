'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const supabase = createClient()
  const router = useRouter()
  const [stories, setStories] = useState<any[]>([])
  const [selectedStory, setSelectedStory] = useState('')
  const [episodeNumber, setEpisodeNumber] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
        supabase.from('stories').select('*').then(({ data }) => {
          if (data) setStories(data)
        })
      }
    })
  }, [])

  async function publish() {
    if (!selectedStory || !episodeNumber || !title || !content) {
      setMessage('Please fill in all fields.')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('episodes').insert({
      story_id: selectedStory,
      episode_number: parseInt(episodeNumber),
      title,
      content: content.split('\n').filter((p: string) => p.trim()).map((p: string) => `<p>${p}</p>`).join(''),
      is_published: true,
      publish_at: new Date().toISOString()
    })
    setSaving(false)
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Episode published successfully!')
      setTitle('')
      setContent('')
      setEpisodeNumber('')
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <p className="text-white/40 text-sm">Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* NAV */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-sm">
        <span className="font-bold text-xl tracking-tight text-white">Pocketwave Admin</span>
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm text-white/40 hover:text-white transition-colors">← View site</a>
          <button onClick={logout} className="text-sm text-white/40 hover:text-white transition-colors">Sign out</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-1">Publish new episode</h1>
          <p className="text-white/30 text-sm">Fill in the details below and hit publish.</p>
        </div>

        {/* STORY SELECT */}
        <div className="mb-5">
          <label className="text-sm font-medium text-white/60 block mb-2">Story</label>
          <select
            value={selectedStory}
            onChange={e => setSelectedStory(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
          >
            <option value="">Select a story...</option>
            {stories.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        {/* EPISODE NUMBER */}
        <div className="mb-5">
          <label className="text-sm font-medium text-white/60 block mb-2">Episode number</label>
          <input
            type="number"
            value={episodeNumber}
            onChange={e => setEpisodeNumber(e.target.value)}
            placeholder="2"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* TITLE */}
        <div className="mb-5">
          <label className="text-sm font-medium text-white/60 block mb-2">Episode title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Episode 2 — The Arrival"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* CONTENT */}
        <div className="mb-6">
          <label className="text-sm font-medium text-white/60 block mb-2">
            Content
            <span className="text-white/25 font-normal ml-2">(each new line = new paragraph)</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={`Write your episode here...\n\nEach new line becomes a new paragraph.\n\nKATHIR: Dialogue goes here like this.\n\nASHOK: And the response here.`}
            rows={18}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors resize-none font-mono leading-relaxed"
          />
        </div>

        {/* PREVIEW */}
        {content && (
          <div className="mb-6 bg-white/3 border border-white/8 rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest text-white/20 mb-4">Preview</p>
            <div className="text-white/60 text-sm leading-8 space-y-3">
              {content.split('\n').filter(p => p.trim()).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* PUBLISH BUTTON */}
        <button
          onClick={publish}
          disabled={saving}
          className="w-full bg-white text-black py-3 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {saving ? 'Publishing...' : 'Publish episode →'}
        </button>

        {message && (
          <p className={`mt-4 text-sm text-center font-medium ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  )
}