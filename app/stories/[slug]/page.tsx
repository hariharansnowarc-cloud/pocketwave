import { createClient } from '../../lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function StoryPage(props: any) {
  const params = await props.params
  const supabase = createClient()
  const { data: story } = await supabase.from('stories').select('*').eq('slug', params.slug).single()
  if (!story) notFound()
  const { data: episodes } = await supabase.from('episodes').select('*').eq('story_id', story.id).eq('is_published', true).order('episode_number', { ascending: true })

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-sm">
        <Link href="/" className="font-bold text-xl tracking-tight text-white">Pocketwave</Link>
        <Link href="/" className="text-sm text-white/40 hover:text-white transition-colors">? All stories</Link>
      </nav>
      <section className="max-w-2xl mx-auto px-6 py-20">
        <div className="text-xs font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full inline-block mb-5">{story.genre}</div>
        <h1 className="text-5xl font-bold tracking-tight mb-5 leading-tight">{story.title}</h1>
        <p className="text-white/40 text-lg leading-relaxed font-light mb-16">{story.description}</p>
        <p className="text-xs uppercase tracking-widest text-white/20 mb-6">{episodes?.length || 0} Episodes</p>
        {episodes && episodes.length > 0 ? (
          <div className="space-y-2">
            {episodes.map((ep: any) => (
              <Link key={ep.id} href={`/stories/${params.slug}/episodes/${ep.id}`}
                className="flex items-center justify-between bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/15 rounded-xl px-6 py-4 transition-all group">
                <div>
                  <span className="text-xs text-white/25 mb-1 block">Episode {ep.episode_number}</span>
                  <span className="font-medium text-white/80 group-hover:text-white transition-colors">{ep.title}</span>
                </div>
                <span className="text-white/20 group-hover:text-white/60 transition-colors">?</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-white/20">
            <p>First episode coming soon.</p>
          </div>
        )}
      </section>
    </main>
  )
}
