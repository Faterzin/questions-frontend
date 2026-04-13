'use client'

import { useState, useEffect } from 'react'

const sections = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'endpoint', label: 'GET /questions' },
  { id: 'params', label: 'Parâmetros' },
  { id: 'model', label: 'Modelo de dados' },
  { id: 'responses', label: 'Respostas' },
  { id: 'base64', label: 'Encode Base64' },
  { id: 'errors', label: 'Erros' },
  { id: 'ratelimit', label: 'Rate Limit' },
]

export default function DocsSidebarNav() {
  const [active, setActive] = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-10% 0px -70% 0px' },
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const activeLabel = sections.find((s) => s.id === active)?.label

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-52 shrink-0">
        <div className="sticky top-24">
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Seções</p>
          <nav className="flex flex-col gap-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`text-sm py-1 transition-colors ${
                  active === s.id ? 'text-accent' : 'text-muted hover:text-white'
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile dropdown */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-border bg-card text-sm"
        >
          <span className="text-muted">
            Seção: <span className="text-white">{activeLabel}</span>
          </span>
          <svg
            className={`w-4 h-4 text-muted transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileOpen && (
          <div className="mt-1 rounded-lg border border-border bg-card overflow-hidden">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  active === s.id
                    ? 'text-accent bg-accent/5'
                    : 'text-muted hover:text-white'
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
