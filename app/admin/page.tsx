'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'

export default function AdminPage() {
  const supabase = createClient()
  const [stories, setStories] = useState<any[]>([])
  const [selectedStory, setSelectedStory] = useState('')
  const [episodeNumber, setEpisodeNumber] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.from('stories').select('*').then(({ data }) => {
      if (data) setStories(data)
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
      content: content.split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join(''),
      is_published: true,
      publish_at: new Date().toISOString()
    })
    setSaving(false)
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Episode published!')
      setTitle('')
      setContent('')
      setEpisodeNumber('')
    }
  }

  return (
    <main className="min-h-screen bg-[#f9f7f3]">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-xl tracking-tight">Pocketwave Admin</span>
        <a href="/" className="text-sm text-gray-500 hover:text-black">← View site</a>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8">Publish new episode</h1>

        {/* STORY SELECT */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 block mb-2">Story</label>
          <select
            value={selectedStory}
            onChange={e => setSelectedStory(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black bg-white"
          >
            <option value="">Select a story...</option>
            {stories.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        {/* EPISODE NUMBER */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 block mb-2">Episode number</label>
          <input
            type="number"
            value={episodeNumber}
            onChange={e => setEpisodeNumber(e.target.value)}
            placeholder="2"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black bg-white"
          />
        </div>

        {/* TITLE */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 block mb-2">Episode title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Episode 2 — The Arrival"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black bg-white"
          />
        </div>

        {/* CONTENT */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Content <span className="text-gray-400 font-normal">(each new line = new paragraph)</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your episode here...

Each blank line becomes a new paragraph.

KATHIR: Dialogue goes here like this."
            rows={16}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black bg-white resize-none font-mono leading-relaxed"
          />
        </div>

        {/* PUBLISH BUTTON */}
        <button
          onClick={publish}
          disabled={saving}
          className="w-full bg-black text-white py-3 rounded-xl font-medium text-sm hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          {saving ? 'Publishing...' : 'Publish episode →'}
        </button>

        {message && (
          <p className={`mt-4 text-sm text-center font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  )
}