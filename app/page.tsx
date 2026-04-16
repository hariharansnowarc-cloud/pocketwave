import Link from 'next/link'

export default function LandingPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}>
        <span style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>Pocketwave</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/login" style={{ fontSize: '13px', color: 'var(--muted)', padding: '7px 18px', borderRadius: '999px', border: '1px solid var(--border2)' }}>Sign in</Link>
          <Link href="/login?mode=signup" style={{ fontSize: '13px', background: 'var(--green-600)', color: 'white', padding: '7px 18px', borderRadius: '999px', fontWeight: 500 }}>Join free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: '820px', margin: '0 auto', padding: '100px 2rem 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500, color: 'var(--green-700)', background: 'var(--green-50)', padding: '5px 16px', borderRadius: '999px', marginBottom: '2rem', border: '1px solid var(--green-200)' }}>
          <span style={{ width: '6px', height: '6px', background: 'var(--green-500)', borderRadius: '50%', display: 'inline-block' }}></span>
          New episodes every day
        </div>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '1.5rem', color: 'var(--ink)' }}>
          Stories that<br/><em style={{ color: 'var(--green-600)', fontStyle: 'italic' }}>stay with you.</em>
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--muted)', marginBottom: '2.5rem', fontWeight: 300, lineHeight: 1.7, maxWidth: '500px', margin: '0 auto 2.5rem' }}>
          Original fiction published daily. Thrillers, epics, and stories worth losing sleep over.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login?mode=signup" style={{ background: 'var(--green-600)', color: 'white', padding: '13px 32px', borderRadius: '999px', fontSize: '15px', fontWeight: 500 }}>Start reading free →</Link>
          <Link href="/login" style={{ background: 'transparent', color: 'var(--ink)', padding: '13px 24px', borderRadius: '999px', fontSize: '15px', border: '1px solid var(--border2)' }}>Sign in</Link>
        </div>
      </section>

      {/* STORIES */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '0 2rem 80px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: '1.5rem' }}>Now publishing</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Lost Love', genre: 'Thriller', desc: "An IT professional in Coimbatore investigates his girlfriend's disappearance — and loses himself in the process." },
            { title: 'The Chronicles of Neha', genre: 'Historical Epic', desc: 'A legendary warrior hides as a farmer. When a royal conspiracy tears his family apart, the Mad Wolf must awaken.' }
          ].map((s, i) => (
            <Link key={i} href="/login?mode=signup" style={{ display: 'block', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green-700)', background: 'var(--green-100)', padding: '3px 12px', borderRadius: '999px', display: 'inline-block', marginBottom: '1rem' }}>{s.genre}</div>
              <h2 style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>{s.title}</h2>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.65, fontWeight: 300 }}>{s.desc}</p>
              <div style={{ marginTop: '1.5rem', fontSize: '13px', color: 'var(--green-600)', fontWeight: 500 }}>Read now →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '60px 2rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          {[
            { icon: '📖', title: 'Daily episodes', desc: 'New content every single day. Build a reading habit.' },
            { icon: '🌊', title: 'Two worlds', desc: 'A modern thriller and an ancient epic — both unfolding.' },
            { icon: '✨', title: 'Free to read', desc: 'Create an account and read everything. No paywalls.' },
            { icon: '💬', title: 'Join the story', desc: 'Comment on each episode. Your thoughts matter.' },
          ].map((f, i) => (
            <div key={i}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Lora, serif', fontSize: '17px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--subtle)' }}>© 2026 Pocketwave · Stories worth reading</p>
      </footer>
    </main>
  )
}