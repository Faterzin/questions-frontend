'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'questions-api-hide-star-popup'
const REPO_URL = 'https://github.com/Faterzin/questions-backend'

export default function StarPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    setVisible(false)
  }

  function neverShow() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 p-5 rounded-2xl border border-border bg-card shadow-2xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-lg">⭐</span>
          <h3 className="font-semibold text-white text-sm">Gostou da API?</h3>
        </div>
        <button
          onClick={dismiss}
          className="text-muted hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-muted leading-relaxed mb-4">
        Deixa uma estrelinha no repositório — ajuda muito e não custa nada!
      </p>

      <div className="flex flex-col gap-2">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium text-center transition-colors"
        >
          Ver repositório no GitHub
        </a>
        <button
          onClick={neverShow}
          className="w-full py-2 rounded-lg border border-border hover:border-accent/50 text-muted hover:text-white text-sm transition-colors"
        >
          Não mostrar novamente
        </button>
      </div>
    </div>
  )
}
