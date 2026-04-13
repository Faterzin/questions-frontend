'use client'

import { useState } from 'react'

const BASE_URL = 'https://questions-backend-five.vercel.app'

export default function DemoSection() {
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [limit, setLimit] = useState('3')
  const [response, setResponse] = useState<object | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<number | null>(null)

  function buildUrl() {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (difficulty) params.set('difficulty', difficulty)
    if (limit) params.set('limit', limit)
    const qs = params.toString()
    return `${BASE_URL}/questions${qs ? `?${qs}` : ''}`
  }

  async function run() {
    setLoading(true)
    setResponse(null)
    setStatus(null)
    try {
      const res = await fetch(buildUrl())
      setStatus(res.status)
      setResponse(await res.json())
    } catch {
      setResponse({ error: 'Falha ao conectar com a API' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="demo" className="py-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2">Experimente agora</h2>
        <p className="text-muted text-sm">Monte uma query e veja a resposta em tempo real.</p>
      </div>

      <div className="max-w-3xl mx-auto p-6 rounded-2xl border border-border bg-card">
        {/* Filtros */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-widest">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-white focus:outline-none focus:border-accent transition-colors"
            >
              <option value="">Todas</option>
              <option>HTML</option>
              <option>CSS</option>
              <option>JavaScript</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-widest">
              Dificuldade
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-white focus:outline-none focus:border-accent transition-colors"
            >
              <option value="">Todas</option>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-widest">
              Limit
            </label>
            <input
              type="number"
              min="1"
              max="44"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* URL gerada */}
        <div className="flex items-center gap-3 mb-5 px-3 py-2 rounded-lg border border-border bg-surface overflow-x-auto">
          <span className="text-xs text-muted shrink-0">GET</span>
          <code className="text-xs text-accent font-mono whitespace-nowrap">{buildUrl()}</code>
        </div>

        <button
          onClick={run}
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Carregando...' : 'Executar'}
        </button>

        {/* Resposta */}
        {response && (
          <div className="mt-5 rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-surface border-b border-border">
              <span className="text-xs font-mono text-muted">response.json</span>
              {status && (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold border ${
                    status === 200
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : status === 429
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {status}
                </span>
              )}
            </div>
            <pre className="p-4 bg-[#0d1117] font-mono text-[13px] leading-relaxed text-slate-300 whitespace-pre overflow-x-auto max-h-72 overflow-y-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}
