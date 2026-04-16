import { createServerSupabaseClient } from '../../lib/supabase-server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function StoryPage(props: any) {
  const params = await props.params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: story } = await supabase.from('stories').select('*').eq('slug', params.slug).single()
  if (!story) notFound()

  const { data: episodes } = await supabase.from('episodes').select('*').eq('story_id', story.id).eq('is_published', true).order('episode_number', { ascending: true })
  const { data: profile } = await supabase.from('profiles').select('username, role').eq('id', user.id).single()

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,249,246,0.95)', backdropFilter: 'blur(12px)' }}>
        <Link href="/home" style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>Pocketwave</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {profile?.role === 'admin' && <Link href="/admin" style={{ fontSize: '12px', color: 'var(--green-700)', background: 'var(--green-100)', padding: '5px 14px', borderRadius: '999px', fontWeight: 500 }}>Admin</Link>}
          <Link href="/home" style={{ fontSize: '13px', color: 'var(--muted)' }}>← All stories</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>

        {/* COVER */}
        {story.thumbnail_url ? (
          <img src={story.thumbnail_url} alt={story.title} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '16px', marginBottom: '2rem' }} />
        ) : (
          <div style={{ width: '100%', height: '200px', background: 'var(--green-50)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'Lora, serif', fontSize: '5rem', color: 'var(--green-300)', fontStyle: 'italic' }}>{story.title[0]}</span>
          </div>
        )}

        {/* HEADER */}
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green-700)', background: 'var(--green-100)', padding: '4px 14px', borderRadius: '999px', display: 'inline-block', marginBottom: '1rem' }}>{story.genre}</div>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-1px', marginBottom: '1rem', lineHeight: 1.15 }}>{story.title}</h1>
        <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '1.5rem' }}>{story.description}</p>

        <div style={{ display: 'flex', gap: '24px', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>Episodes</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--green-700)', fontFamily: 'Lora, serif' }}>{episodes?.length || 0}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>Genre</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>{story.genre}</p>
          </div>
        </div>

        {/* EPISODES */}
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: '20px', fontWeight: 600, color: 'var(--ink)', marginBottom: '1rem' }}>All episodes</h2>

        {episodes && episodes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {episodes.map((ep: any) => (
              <Link key={ep.id} href={`/stories/${story.slug}/episodes/${ep.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.25rem' }}>
                {ep.thumbnail_url ? (
                  <img src={ep.thumbnail_url} alt={ep.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', background: 'var(--green-50)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'Lora, serif', fontSize: '1.3rem', color: 'var(--green-400)', fontStyle: 'italic' }}>{ep.episode_number}</span>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '11px', color: 'var(--subtle)', display: 'block', marginBottom: '3px' }}>Episode {ep.episode_number}</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', fontFamily: 'Lora, serif' }}>{ep.title}</span>
                  {ep.views > 0 && <span style={{ fontSize: '12px', color: 'var(--subtle)', display: 'block', marginTop: '2px' }}>{ep.views} reads</span>}
                </div>
                <span style={{ color: 'var(--green-400)', fontSize: '18px', flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--subtle)', background: '#fff', borderRadius: '14px', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '16px', marginBottom: '6px' }}>First episode coming soon</p>
            <p style={{ fontSize: '13px' }}>Check back tomorrow!</p>
          </div>
        )}
      </div>
    </main>
  )
}