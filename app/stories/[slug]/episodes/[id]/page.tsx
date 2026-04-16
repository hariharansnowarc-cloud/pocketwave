import { createServerSupabaseClient } from '../../../../lib/supabase-server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import EpisodeActions from '../../../../components/EpisodeActions'
import CommentSection from '../../../../components/CommentSection'

export default async function EpisodePage(props: any) {
  const params = await props.params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: episode } = await supabase.from('episodes').select('*, stories(title, slug, genre)').eq('id', params.id).single()
  if (!episode) notFound()

  // Track view
  await supabase.from('views').upsert({ episode_id: episode.id, user_id: user.id }, { onConflict: 'episode_id,user_id' })
  await supabase.from('episodes').update({ views: (episode.views || 0) + 1 }).eq('id', episode.id)

  // Get next/prev episodes
  const { data: allEpisodes } = await supabase.from('episodes').select('id, episode_number, title').eq('story_id', episode.story_id).eq('is_published', true).order('episode_number', { ascending: true })
  const currentIndex = allEpisodes?.findIndex(e => e.id === episode.id) ?? -1
  const prevEp = currentIndex > 0 ? allEpisodes![currentIndex - 1] : null
  const nextEp = currentIndex < (allEpisodes?.length ?? 0) - 1 ? allEpisodes![currentIndex + 1] : null

  // Like and bookmark status
  const [{ count: likeCount }, { data: userLike }, { data: userBookmark }] = await Promise.all([
    supabase.from('likes').select('*', { count: 'exact', head: true }).eq('episode_id', episode.id),
    supabase.from('likes').select('id').eq('episode_id', episode.id).eq('user_id', user.id).maybeSingle(),
    supabase.from('bookmarks').select('id').eq('episode_id', episode.id).eq('user_id', user.id).maybeSingle(),
  ])

  // Comments
  const { data: comments } = await supabase.from('comments').select('*, profiles(username)').eq('episode_id', episode.id).is('parent_id', null).order('created_at', { ascending: true })

  const { data: profile } = await supabase.from('profiles').select('username, role').eq('id', user.id).single()

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,249,246,0.95)', backdropFilter: 'blur(12px)' }}>
        <Link href="/home" style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>Pocketwave</Link>
        <Link href={`/stories/${episode.stories.slug}`} style={{ fontSize: '13px', color: 'var(--muted)' }}>← {episode.stories.title}</Link>
      </nav>

      <article style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* THUMBNAIL */}
        {episode.thumbnail_url && (
          <img src={episode.thumbnail_url} alt={episode.title} style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '14px', marginBottom: '2rem' }} />
        )}

        {/* HEADER */}
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green-700)', background: 'var(--green-100)', padding: '4px 14px', borderRadius: '999px', display: 'inline-block', marginBottom: '0.75rem' }}>{episode.stories.genre}</div>
        <p style={{ fontSize: '13px', color: 'var(--subtle)', marginBottom: '6px' }}>Episode {episode.episode_number}</p>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '1.5rem' }}>{episode.title}</h1>
        <div style={{ width: '40px', height: '3px', background: 'var(--green-400)', borderRadius: '2px', marginBottom: '2rem' }}></div>

        {/* CONTENT */}
        <div style={{ fontSize: '17px', lineHeight: 1.85, color: '#2d3d30', fontWeight: 400 }}
          dangerouslySetInnerHTML={{ __html: episode.content }} />

        {/* ACTIONS: like, bookmark, share */}
        <EpisodeActions
          episodeId={episode.id}
          storySlug={episode.stories.slug}
          userId={user.id}
          initialLiked={!!userLike}
          initialBookmarked={!!userBookmark}
          initialLikeCount={likeCount || 0}
        />

        {/* PREV / NEXT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '2rem 0' }}>
          {prevEp ? (
            <Link href={`/stories/${episode.stories.slug}/episodes/${prevEp.id}`}
              style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', display: 'block' }}>
              <p style={{ fontSize: '11px', color: 'var(--subtle)', marginBottom: '4px' }}>← Previous</p>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', fontFamily: 'Lora, serif' }}>{prevEp.title}</p>
            </Link>
          ) : <div />}
          {nextEp ? (
            <Link href={`/stories/${episode.stories.slug}/episodes/${nextEp.id}`}
              style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', display: 'block', textAlign: 'right' }}>
              <p style={{ fontSize: '11px', color: 'var(--subtle)', marginBottom: '4px' }}>Next →</p>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', fontFamily: 'Lora, serif' }}>{nextEp.title}</p>
            </Link>
          ) : <div />}
        </div>

        {/* COMMENTS */}
        <CommentSection
          episodeId={episode.id}
          userId={user.id}
          username={profile?.username || 'Reader'}
          initialComments={comments || []}
        />

      </article>
    </main>
  )
}