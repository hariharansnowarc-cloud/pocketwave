import { createServerSupabaseClient } from '../lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function HomePage({ searchParams }: any) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const search = searchParams?.q || ''
  const { data: profile } = await supabase.from('profiles').select('username, role').eq('id', user.id).single()

  let query = supabase.from('stories').select('*').eq('is_published', true).order('created_at', { ascending: false })
  if (search) query = query.ilike('title', `%${search}%`)
  const { data: stories } = await query

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,249,246,0.95)', backdropFilter: 'blur(12px)' }}>
        <Link href="/home" style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>Pocketwave</Link>

        <form action="/home" method="GET" style={{ flex: 1, maxWidth: '380px', margin: '0 2rem' }}>
          <input name="q" defaultValue={search} placeholder="Search stories..."
            style={{ width: '100%', background: '#fff', border: '1px solid var(--border2)', borderRadius: '999px', padding: '8px 18px', fontSize: '13px', color: 'var(--ink)', outline: 'none' }} />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/bookmarks" style={{ fontSize: '13px', color: 'var(--muted)' }}>Bookmarks</Link>
          {profile?.role === 'admin' && (
            <Link href="/admin" style={{ fontSize: '12px', color: 'var(--green-700)', background: 'var(--green-100)', padding: '5px 14px', borderRadius: '999px', fontWeight: 500 }}>Admin</Link>
          )}
          <Link href="/profile" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--green-700)' }}>
            {profile?.username?.[0]?.toUpperCase() || '?'}
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <section style={{ maxWidth: '1040px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: '28px', fontWeight: 600, color: 'var(--ink)' }}>
            {search ? `Results for "${search}"` : 'All stories'}
          </h1>
          <span style={{ fontSize: '13px', color: 'var(--subtle)' }}>{stories?.length || 0} stories</span>
        </div>

        {stories && stories.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {stories.map((story: any) => (
              <Link key={story.id} href={`/stories/${story.slug}`}
                style={{ display: 'block', background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                {story.thumbnail_url ? (
                  <img src={story.thumbnail_url} alt={story.title} style={{ width: '100%', height: '190px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '190px', background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Lora, serif', fontSize: '4rem', color: 'var(--green-300)', fontStyle: 'italic' }}>{story.title[0]}</span>
                  </div>
                )}
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green-700)', background: 'var(--green-100)', padding: '3px 10px', borderRadius: '999px', display: 'inline-block', marginBottom: '0.75rem' }}>{story.genre}</div>
                  <h2 style={{ fontFamily: 'Lora, serif', fontSize: '19px', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>{story.title}</h2>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{story.description}</p>
                  <div style={{ marginTop: '1rem', fontSize: '13px', color: 'var(--green-600)', fontWeight: 500 }}>Read now →</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--subtle)' }}>
            <p style={{ fontSize: '20px', marginBottom: '8px' }}>No stories found</p>
            <p style={{ fontSize: '14px' }}>Try a different search term</p>
          </div>
        )}
      </section>
    </main>
  )
}