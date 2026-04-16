'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const links = [
  { href: '/docs', label: 'Docs' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-surface/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="w-7 h-7 rounded-md bg-accent flex items-center justify-center text-xs font-bold">Q</span>
          Questions API
        </Link>

        {/* Desktop */}
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition-colors ${pathname === l.href ? 'text-white' : 'hover:text-white'}`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/Faterzin/questions-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          {user ? (
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white transition-colors"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Hamburger */}
        <button
          className="sm:hidden text-muted hover:text-white transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-border bg-surface">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`transition-colors ${pathname === l.href ? 'text-white' : 'text-muted hover:text-white'}`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://github.com/Faterzin/questions-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-white transition-colors"
            >
              GitHub
            </a>
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="inline-flex w-fit px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex w-fit px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
