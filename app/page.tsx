import { createClient } from './lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()
  const { data: stories } = await supabase
    .from('stories')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* NAV */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-sm">
        <span className="font-bold text-xl tracking-tight text-white">Pocketwave</span>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-white/50 hover:text-white px-4 py-2 rounded-full border border-white/10 transition-colors">Sign in</Link>
          <Link href="/login" className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">Get started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 py-28 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 bg-blue-400/10 px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
          New episodes daily
        </div>
        <h1 className="text-6xl font-bold tracking-tight mb-6 leading-tight">
          Stories that<br/>
          <span className="text-white/30">pull you under.</span>
        </h1>
        <p className="text-white/50 text-lg mb-10 font-light">Original fiction published daily. Free to read.</p>
        <Link href="#stories" className="bg-white text-black px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
          Start reading
        </Link>
      </section>

      {/* STORIES */}
      <section className="max-w-4xl mx-auto px-6 pb-24" id="stories">
        <p className="text-xs uppercase tracking-widest text-white/20 mb-8">All stories</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories?.map((story) => (
            <Link key={story.id} href={`/stories/${story.slug}`}
              className="group bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/20 rounded-2xl p-7 transition-all">
              <div className="text-xs font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full inline-block mb-4">{story.genre}</div>
              <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-white/90">{story.title}</h2>
              <p className="text-sm text-white/40 line-clamp-3 leading-relaxed font-light">{story.description}</p>
              <div className="mt-6 text-sm font-medium text-white/60 group-hover:text-white transition-colors">Read now →</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}