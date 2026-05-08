import Link from 'next/link'
import Countdown from './components/Countdown'
import Nav from './components/Nav'
import Footer from './components/Footer'

export default function HomePage() {
  const milestones = [
    { label: 'Poo Vaithal', date: '2026-05-28', emoji: '🌸' },
    { label: 'Engagement', date: '2026-08-23', emoji: '💍' },
    { label: 'Marriage', date: '2026-09-13', emoji: '💒' },
  ]

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>

      <style>{`
        .links-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 500px) { .links-grid { grid-template-columns: repeat(4, 1fr); } }
        .hero-badge { animation: fadeUp 0.6s ease forwards; }
        .hero-h1-1 { animation: fadeUp 0.6s ease 0.15s forwards; opacity: 0; }
        .hero-heart { animation: fadeIn 0.4s ease 0.3s forwards; opacity: 0; }
        .hero-h1-2 { animation: fadeUp 0.6s ease 0.35s forwards; opacity: 0; }
        .hero-sub { animation: fadeUp 0.5s ease 0.5s forwards; opacity: 0; }
        .hero-divider { animation: fadeIn 0.5s ease 0.65s forwards; opacity: 0; }
        .countdown-section { animation: fadeUp 0.6s ease 0.2s forwards; opacity: 0; }
        .quote-card { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
      `}</style>

      <Nav />

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,98,106,0.09) 0%, transparent 70%)' }}></div>
          <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,98,106,0.08) 0%, transparent 70%)' }}></div>
          {[{ top: '8%', left: '4%' }, { top: '18%', right: '6%' }, { top: '45%', left: '2%' }, { bottom: '22%', right: '4%' }, { bottom: '12%', left: '6%' }].map((h, i) => (
            <div key={i} className="float" style={{ position: 'absolute', ...h, fontSize: '20px', opacity: 0.1, color: 'var(--rose)', animationDelay: `${i * 0.4}s` }}>♥</div>
          ))}
          {[{ top: '10%', right: '15%' }, { bottom: '28%', left: '12%' }, { top: '55%', right: '8%' }].map((f, i) => (
            <div key={i} className="float" style={{ position: 'absolute', ...f, fontSize: '18px', opacity: 0.12, animationDelay: `${i * 0.6}s` }}>🌸</div>
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '700px', margin: '0 auto', padding: '60px 1.5rem', textAlign: 'center' }}>
          <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 500, color: 'var(--rose)', background: 'var(--rose-light)', padding: '5px 16px', borderRadius: '999px', marginBottom: '1.75rem', border: '1px solid var(--rose-mid)' }}>
            <span>🌸</span> Our little corner of the world <span>🌸</span>
          </div>

          <h1 className="hero-h1-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 10vw, 6rem)', fontWeight: 600, lineHeight: 1.05, color: 'var(--ink)', letterSpacing: '-1px' }}>Hari Haran</h1>
          <div className="hero-heart" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: 'var(--rose-mid)', margin: '0.25rem 0' }}>♥</div>
          <h1 className="hero-h1-2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 10vw, 6rem)', fontWeight: 600, lineHeight: 1.05, color: 'var(--rose)', letterSpacing: '-1px', fontStyle: 'italic' }}>Jothi Lakshmi</h1>

          <div className="hero-sub">
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: 'var(--muted)', marginTop: '1.25rem', fontStyle: 'italic' }}>Ashok &amp; Kutty ma</p>
            <p style={{ fontSize: '13px', color: 'var(--subtle)', marginTop: '0.5rem', marginBottom: '2.5rem' }}>Our story, our memories, our forever 💛</p>
          </div>

          <div className="hero-divider" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <div style={{ flex: 1, maxWidth: '60px', height: '1px', background: 'var(--rose-mid)', opacity: 0.4 }}></div>
            <span className="pulse" style={{ fontSize: '18px', display: 'inline-block' }}>💍</span>
            <div style={{ flex: 1, maxWidth: '60px', height: '1px', background: 'var(--rose-mid)', opacity: 0.4 }}></div>
          </div>
        </div>
      </section>

      {/* COUNTDOWNS */}
      <section className="countdown-section" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, rgba(201,98,106,0.06) 50%, var(--bg) 100%)', padding: '60px 1.5rem' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.4rem', fontWeight: 500 }}>Counting down to</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 600, color: 'var(--ink)' }}>Our celebrations 🎊</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {milestones.map((m, i) => (
              <Countdown key={i} label={m.label} date={m.date} emoji={m.emoji} />
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section style={{ maxWidth: '580px', margin: '0 auto', padding: '50px 1.5rem' }}>
        <div className="quote-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem 1.5rem', position: 'relative', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--rose-light)', border: '1px solid var(--rose-mid)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>♥</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1rem, 3.5vw, 1.3rem)', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.75, marginBottom: '1rem' }}>
            "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
          </p>
          <p style={{ fontSize: '12px', color: 'var(--subtle)' }}>— Maya Angelou</p>
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
            <Link key={i} href={item.href} className="card-hover" style={{ display: 'block', background: item.bg, border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{item.emoji}</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(15px, 4vw, 18px)', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>{item.title}</h3>
              <p style={{ fontSize: '11px', color: 'var(--muted)' }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}