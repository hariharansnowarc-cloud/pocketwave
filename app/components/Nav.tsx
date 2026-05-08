'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav style={{ padding: '0 1.25rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(253,248,242,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>

      {/* LOGO */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <img src="/Murugar.jpg" alt="Hari and Jothi"
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--rose-mid)', flexShrink: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-1px', lineHeight: 1 }}>H</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 400, color: 'var(--rose)', fontStyle: 'italic', lineHeight: 1, margin: '0 2px', paddingBottom: '2px' }}>&</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 700, color: 'var(--rose)', letterSpacing: '-1px', lineHeight: 1 }}>J</span>
        </div>
      </Link>

      {/* NAV LINKS */}
      <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {[
          { href: '/', label: 'Home' },
          { href: '/timeline', label: 'Story' },
          { href: '/gallery', label: 'Gallery' },
          { href: '/checklists', label: 'Lists' },
          { href: '/wishlist', label: 'Wishlist' },
        ].map(link => (
          <Link key={link.href} href={link.href} style={{
            fontSize: '13px',
            color: pathname === link.href ? 'var(--rose)' : 'var(--muted)',
            padding: '5px 10px',
            borderRadius: '999px',
            fontWeight: pathname === link.href ? 500 : 400,
            background: pathname === link.href ? 'var(--rose-light)' : 'transparent',
          }}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}