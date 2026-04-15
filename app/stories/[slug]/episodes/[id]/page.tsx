import { createClient } from '../../../../lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EpisodePage(props: any) {
  const params = await props.params
  const supabase = createClient()
  const { data: episode } = await supabase.from('episodes').select('*, stories(title, slug, genre)').eq('id', params.id).single()
  if (!episode) notFound()
  const { data: comments } = await supabase.from('comments').select('*, profiles(username)').eq('episode_id', episode.id).is('parent_id', null).order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-sm">
        <Link href="/" className="font-bold text-xl tracking-tight text-white">Pocketwave</Link>
        <Link href={`/stories/${episode.stories.slug}`} className="text-sm text-white/40 hover:text-white transition-colors">? {episode.stories.title}</Link>
      </nav>
      <section className="max-w-2xl mx-auto px-6 pt-16 pb-8">
        <div className="text-xs font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full inline-block mb-5">{episode.stories.genre}</div>
        <p className="text-sm text-white/25 mb-2">Episode {episode.episode_number}</p>
        <h1 className="text-4xl font-bold tracking-tight mb-6">{episode.title}</h1>
        <div className="w-10 h-px bg-white/10"></div>
      </section>
      <article className="max-w-2xl mx-auto px-6 pb-16">
        <div className="text-white/70 leading-8 text-lg font-light space-y-5"
          dangerouslySetInnerHTML={{ __html: episode.content }} />
      </article>
      <div className="max-w-2xl mx-auto px-6 pb-16 flex justify-end">
        <Link href={`/stories/${episode.stories.slug}`} className="text-sm text-white/40 hover:text-white transition-colors">All episodes ?</Link>
      </div>
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8">
          {comments?.length || 0} Comments
        </h2>
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5 mb-8">
          <textarea placeholder="Share your thoughts..." className="w-full bg-transparent text-sm text-white/70 resize-none outline-none min-h-[80px] placeholder-white/20" />
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
            <span className="text-xs text-white/20">Sign in to comment</span>
            <button className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:opacity-90">Post</button>
          </div>
        </div>
        {comments && comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((c: any) => (
              <div key={c.id} className="bg-white/5 border border-white/8 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                    {c.profiles?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-medium text-white/70">{c.profiles?.username || 'Anonymous'}</span>
                  <span className="text-xs text-white/20">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/20 text-sm">No comments yet. Be the first!</div>
        )}
      </section>
    </main>
  )
}
