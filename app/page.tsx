import Link from 'next/link'

const S = {
  page: { background: 'var(--green-950)', minHeight: '100vh' } as React.CSSProperties,
  nav: { borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,26,15,0.95)', backdropFilter: 'blur(12px)' } as React.CSSProperties,
  logo: { fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: 700, color: 'var(--cream-100)', letterSpacing: '-0.5px' } as React.CSSProperties,
  navLinks: { display: 'flex', gap: '10px' } as React.CSSProperties,
  btnGhost: { fontSize: '13px', color: 'var(--cream-300)', padding: '7px 18px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)' } as React.CSSProperties,
  btnPrimary: { fontSize: '13px', background: 'var(--green-600)', color: 'white', padding: '7px 18px', borderRadius: '999px', fontWeight: 500 } as React.CSSProperties,
  hero: { maxWidth: '820px', margin: '0 auto', padding: '110px 2rem 80px', textAlign: 'center' } as React.CSSProperties,
  badge: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500, color: 'var(--green-300)', background: 'rgba(58,158,96,0.12)', padding: '5px 16px', borderRadius: '999px', marginBottom: '2rem', border: '1px solid rgba(58,158,96,0.2)' } as React.CSSProperties,
  dot: { width: '6px', height: '6px', background: 'var(--green-400)', borderRadius: '50%', display: 'inline-block' } as React.CSSProperties,
  h1: { fontFamily: 'Lora, serif', fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '1.5rem', color: 'var(--cream-50)' } as React.CSSProperties,
  em: { color: 'var(--green-400)', fontStyle: 'italic' } as React.CSSProperties,
  sub: { fontSize: '18px', color: 'var(--cream-300)', marginBottom: '2.5rem', fontWeight: 300, lineHeight: 1.7, maxWidth: '500px', margin: '0 auto 2.5rem' } as React.CSSProperties,
  actions: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const },
  btnLg: { background: 'var(--green-600)', color: 'white', padding: '13px 32px', borderRadius: '999px', fontSize: '15px', fontWeight: 500 } as React.CSSProperties,
  btnLgGhost: { background: 'transparent', color: 'var(--cream-300)', padding: '13px 24px', borderRadius: '999px', fontSize: '15px', border: '1px solid rgba(255,255,255,0.1)' } as React.CSSProperties,
  storiesSection: { maxWidth: '960px', margin: '0 auto', padding: '0 2rem 80px' } as React.CSSProperties,
  sectionLabel: { fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.2)', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' } as React.CSSProperties,
  storyCard: { display: 'block', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.75rem' } as React.CSSProperties,
  genreBadge: { fontSize: '11px', fontWeight: 500, color: 'var(--green-400)', background: 'rgba(58,158,96,0.1)', padding: '3px 12px', borderRadius: '999px', display: 'inline-block', marginBottom: '1rem' } as React.CSSProperties,
  storyTitle: { fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: 600, color: 'var(--cream-100)', marginBottom: '0.75rem' } as React.CSSProperties,
  storyDesc: { fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, fontWeight: 300 } as React.CSSProperties,
  readLink: { marginTop: '1.5rem', fontSize: '13px', color: 'var(--green-400)' } as React.CSSProperties,
  divider: { borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 2rem' } as React.CSSProperties,
  features: { maxWidth: '960px', margin: '0 auto', padding: '60px 2rem 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' } as React.CSSProperties,
  featureTitle: { fontFamily: 'Lora, serif', fontSize: '17px', fontWeight: 600, color: 'var(--cream-100)', marginBottom: '8px' } as React.CSSProperties,
  featureDesc: { fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 } as React.CSSProperties,
  footer: { borderTop: '1px solid rgba(255,255,255,0.05)', padding: '2rem', textAlign: 'center' as const },
  footerText: { fontSize: '13px', color: 'rgba(255,255,255,0.2)' } as React.CSSProperties,
}

export default function LandingPage() {
  return (
    <main style={S.page}>
      <nav style={S.nav}>
        <span style={S.logo}>Pocketwave</span>
        <div style={S.navLinks}>
          <Link href="/login" style={S.btnGhost}>Sign in</Link>
          <Link href="/login?mode=signup" style={S.btnPrimary}>Join free</Link>
        </div>
      </nav>

      <section style={S.hero}>
        <div style={S.badge}>
          <span style={S.dot}></span>
          New episodes every day
        </div>
        <h1 style={S.h1}>
          Stories that<br/>
          <em style={S.em}>stay with you.</em>
        </h1>
        <p style={S.sub}>
          Original fiction published daily. Thrillers, epics, and stories worth losing sleep over.
        </p>
        <div style={S.actions}>
          <Link href="/login?mode=signup" style={S.btnLg}>Start reading free →</Link>
          <Link href="/login" style={S.btnLgGhost}>Sign in</Link>
        </div>
      </section>

      <section style={S.storiesSection}>
        <p style={S.sectionLabel}>Now publishing</p>
        <div style={S.grid}>
          {[
            { title: 'Lost Love', genre: 'Thriller', desc: "An IT professional in Coimbatore investigates his girlfriend's disappearance — and loses himself in the process." },
            { title: 'The Chronicles of Neha', genre: 'Historical Epic', desc: 'A legendary warrior hides as a farmer. When a royal conspiracy tears his family apart, the Mad Wolf must awaken.' }
          ].map((s, i) => (
            <Link key={i} href="/login?mode=signup" style={S.storyCard}>
              <div style={S.genreBadge}>{s.genre}</div>
              <h2 style={S.storyTitle}>{s.title}</h2>
              <p style={S.storyDesc}>{s.desc}</p>
              <div style={S.readLink}>Read now →</div>
            </Link>
          ))}
        </div>
      </section>

      <div style={S.divider}></div>

      <div style={S.features}>
        {[
          { title: 'Daily episodes', desc: 'New content published every single day. Build a reading habit.' },
          { title: 'Two worlds', desc: 'A modern thriller and an ancient epic — both unfolding simultaneously.' },
          { title: 'Free to read', desc: 'Create an account and read everything. No paywalls, no limits.' },
          { title: 'Join the story', desc: 'Comment on each episode. Your thoughts matter to the author.' },
        ].map((f, i) => (
          <div key={i}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>
              {['📖', '🌊', '✨', '💬'][i]}
            </div>
            <h3 style={S.featureTitle}>{f.title}</h3>
            <p style={S.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      <footer style={S.footer}>
        <p style={S.footerText}>© 2026 Pocketwave · Stories worth reading</p>
      </footer>
    </main>
  )
}