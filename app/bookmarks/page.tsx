import { createServerSupabaseClient } from '../lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function BookmarksPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*, episodes(id, title, episode_number, thumbnail_url, story_id, stories(title, slug, genre))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,249,246,0.95)', backdropFilter: 'blur(12px)' }}>
        <Link href="/home" style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>Pocketwave</Link>
        <Link href="/home" style={{ fontSize: '13px', color: 'var(--muted)' }}>← Home</Link>
      </nav>

      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: '28px', fontWeight: 600, color: 'var(--ink)', marginBottom: '2rem' }}>
          Saved episodes
        </h1>

        {bookmarks && bookmarks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bookmarks.map((b: any) => {
              const ep = b.episodes
              if (!ep) return null
              return (
                <Link key={b.id} href={`/stories/${ep.stories.slug}/episodes/${ep.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.25rem' }}>
                  {ep.thumbnail_url ? (
                    <img src={ep.thumbnail_url} alt={ep.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '60px', height: '60px', background: 'var(--green-50)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>
                      <span style={{ fontFamily: 'Lora, serif', fontSize: '1.3rem', color: 'var(--green-400)', fontStyle: 'italic' }}>{ep.episode_number}</span>
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '11px', color: 'var(--subtle)', display: 'block', marginBottom: '2px' }}>{ep.stories.title} · Episode {ep.episode_number}</span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', fontFamily: 'Lora, serif' }}>{ep.title}</span>
                  </div>
                  <span style={{ color: 'var(--green-400)', fontSize: '18px' }}>→</span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--subtle)', background: '#fff', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '40px', marginBottom: '1rem' }}>🔖</p>
            <p style={{ fontSize: '18px', fontWeight: 500, color: 'var(--ink)', marginBottom: '8px', fontFamily: 'Lora, serif' }}>No saved episodes yet</p>
            <p style={{ fontSize: '14px', marginBottom: '1.5rem' }}>Click the Save button on any episode to bookmark it here.</p>
            <Link href="/home" style={{ background: 'var(--green-600)', color: 'white', padding: '10px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 500 }}>Browse stories →</Link>
          </div>
        )}
      </section>
    </main>
  )
}