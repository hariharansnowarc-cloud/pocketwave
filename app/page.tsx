import Link from 'next/link'
import Countdown from './components/Countdown'

export default function HomePage() {
  const milestones = [
    { label: 'Poo Vaithal', date: '2026-05-28', emoji: '🌸' },
    { label: 'Engagement', date: '2026-08-23', emoji: '💍' },
    { label: 'Marriage', date: '2026-09-13', emoji: '💒' },
  ]

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>

      <style>{`
        .nav-links { display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
        .nav-links a { font-size: 13px; color: var(--muted); padding: 5px 10px; border-radius: 999px; }
        .hero-name { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.8rem, 10vw, 6rem); font-weight: 600; line-height: 1.05; color: var(--ink); letter-spacing: -1px; }
        .hero-name-rose { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.8rem, 10vw, 6rem); font-weight: 600; line-height: 1.05; color: var(--rose); letter-spacing: -1px; font-style: italic; }
        .countdown-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
        .links-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .link-card { display: block; border: 1px solid var(--border); border-radius: 20px; padding: 1.5rem 1rem; text-align: center; }
        .quote-box { background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 2rem 1.5rem; position: relative; margin: 0 1rem; }
        @media (max-width: 600px) {
          .nav-links a { font-size: 11px; padding: 4px 8px; }
          .countdown-grid { grid-template-columns: 1fr; }
          .links-grid { grid-template-columns: repeat(2, 1fr); }
          .quote-box { margin: 0; }
        }
        @media (max-width: 380px) {
          .nav-links { gap: 2px; }
          .nav-links a { font-size: 10px; padding: 3px 6px; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ padding: '0 1.25rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(253,248,242,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.3px', whiteSpace: 'nowrap', marginRight: '8px' }}>Hari & Jothi</span>
        <div className="nav-links">
          {[
            { href: '/', label: 'Home' },
            { href: '/timeline', label: 'Story' },
            { href: '/gallery', label: 'Gallery' },
            { href: '/checklists', label: 'Lists' },
            { href: '/wishlist', label: 'Wishlist' },
          ].map(link => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

        {/* BG DECORATIONS */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,98,106,0.09) 0%, transparent 70%)' }}></div>
          <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,98,106,0.08) 0%, transparent 70%)' }}></div>
          <div style={{ position: 'absolute', top: '40%', right: '5%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,134,11,0.06) 0%, transparent 70%)' }}></div>
          {[
            { top: '8%', left: '4%', size: '22px', opacity: 0.1 },
            { top: '18%', right: '6%', size: '16px', opacity: 0.09 },
            { top: '45%', left: '2%', size: '18px', opacity: 0.08 },
            { bottom: '22%', right: '4%', size: '24px', opacity: 0.09 },
            { bottom: '12%', left: '6%', size: '14px', opacity: 0.1 },
          ].map((h, i) => (
            <div key={i} style={{ position: 'absolute', top: h.top, left: h.left, right: h.right, bottom: h.bottom, fontSize: h.size, opacity: h.opacity, color: 'var(--rose)' }}>♥</div>
          ))}
          {[
            { top: '10%', right: '15%', opacity: 0.13 },
            { bottom: '28%', left: '12%', opacity: 0.11 },
            { top: '55%', right: '8%', opacity: 0.1 },
          ].map((f, i) => (
            <div key={i} style={{ position: 'absolute', top: f.top, left: f.left, right: f.right, bottom: f.bottom, fontSize: '18px', opacity: f.opacity }}>🌸</div>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '700px', margin: '0 auto', padding: '60px 1.5rem 60px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 500, color: 'var(--rose)', background: 'var(--rose-light)', padding: '5px 16px', borderRadius: '999px', marginBottom: '1.75rem', border: '1px solid var(--rose-mid)' }}>
            <span>🌸</span> Our little corner of the world <span>🌸</span>
          </div>

          <h1 className="hero-name">{`Hari Haran`}</h1>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: 'var(--rose-mid)', margin: '0.25rem 0', letterSpacing: '0.1em' }}>♥</div>
          <h1 className="hero-name-rose">{`Jothi Lakshmi`}</h1>

          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: 'var(--muted)', marginTop: '1.25rem', fontStyle: 'italic' }}>
            Ashok &amp; Kutty ma
          </p>
          <p style={{ fontSize: '13px', color: 'var(--subtle)', marginTop: '0.5rem', marginBottom: '2.5rem' }}>
            Our story, our memories, our forever 💛
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <div style={{ flex: 1, maxWidth: '60px', height: '1px', background: 'var(--rose-mid)', opacity: 0.4 }}></div>
            <span style={{ fontSize: '18px' }}>💍</span>
            <div style={{ flex: 1, maxWidth: '60px', height: '1px', background: 'var(--rose-mid)', opacity: 0.4 }}></div>
          </div>
        </div>
      </section>

      {/* COUNTDOWNS */}
      <section style={{ background: 'linear-gradient(180deg, var(--bg) 0%, rgba(201,98,106,0.06) 50%, var(--bg) 100%)', padding: '60px 1.5rem' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.4rem', fontWeight: 500 }}>Counting down to</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 600, color: 'var(--ink)' }}>Our celebrations 🎊</h2>
          </div>
          <div className="countdown-grid">
            {milestones.map((m, i) => (
              <Countdown key={i} label={m.label} date={m.date} emoji={m.emoji} />
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '50px 1.5rem' }}>
        <div className="quote-box">
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--rose-light)', border: '1px solid var(--rose-mid)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>♥</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1rem, 3.5vw, 1.3rem)', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.75, marginBottom: '1rem', textAlign: 'center' }}>
            "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
          </p>
          <p style={{ fontSize: '12px', color: 'var(--subtle)', textAlign: 'center' }}>— Maya Angelou</p>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem 70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 600, color: 'var(--ink)' }}>Our space 🌸</h2>
        </div>
        <div className="links-grid">
          {[
            { href: '/timeline', emoji: '💛', title: 'Our Story', desc: 'How it all began', bg: '#fff8f0' },
            { href: '/gallery', emoji: '📸', title: 'Gallery', desc: 'Our favourite moments', bg: '#fff0f3' },
            { href: '/checklists', emoji: '✅', title: 'Checklists', desc: 'Plan together', bg: '#f0faf5' },
            { href: '/wishlist', emoji: '✨', title: 'Wishlist', desc: 'Dreams we share', bg: '#fdfaf0' },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="link-card" style={{ background: item.bg }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{item.emoji}</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(16px, 4vw, 19px)', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{item.title}</h3>
              <p style={{ fontSize: '11px', color: 'var(--muted)' }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2.5rem 1.5rem', textAlign: 'center', background: 'var(--rose-light)' }}>
        <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🌸</div>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: 'var(--rose)', fontStyle: 'italic', marginBottom: '0.4rem' }}>Made with love</p>
        <p style={{ fontSize: '12px', color: 'var(--subtle)' }}>Just for Hari & Jothi 💛</p>
      </footer>
    </main>
  )
}