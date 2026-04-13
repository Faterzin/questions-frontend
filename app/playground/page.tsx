'use client'

import { useState } from 'react'

const BASE_URL = 'https://questions-backend-five.vercel.app'

export default function Playground() {
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [limit, setLimit] = useState('5')
  const [encode, setEncode] = useState(false)
  const [response, setResponse] = useState<object | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<number | null>(null)

  function buildUrl() {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (difficulty) params.set('difficulty', difficulty)
    if (limit) params.set('limit', limit)
    if (encode) params.set('encode', 'base64')
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
      const json = await res.json()
      setResponse(json)
    } catch {
      setResponse({ error: 'Falha ao conectar com a API' })
    } finally {
      setLoading(false)
    }
  }

  const url = buildUrl()
  const fetchCode = `const res = await fetch('${url}')
const data = await res.json()`

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Playground</h1>
        <p className="text-muted leading-relaxed">
          Monte sua query e veja a resposta em tempo real — sem sair do browser.
        </p>
      </div>

      {/* Filters */}
      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        <div>
          <label className="block text-xs text-muted mb-2 font-semibold uppercase tracking-widest">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Todas</option>
            <option>HTML</option>
            <option>CSS</option>
            <option>JavaScript</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-muted mb-2 font-semibold uppercase tracking-widest">
            Dificuldade
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Todas</option>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-muted mb-2 font-semibold uppercase tracking-widest">
            Limit
          </label>
          <input
            type="number"
            min="1"
            max="44"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex items-end pb-0.5">
          <button
            onClick={() => setEncode((v) => !v)}
            className="flex items-center gap-3 cursor-pointer group"
            type="button"
          >
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${encode ? 'bg-accent' : 'bg-border'}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${encode ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </div>
            <span className="text-sm text-muted group-hover:text-white transition-colors">
              encode=base64
            </span>
          </button>
        </div>
      </div>

      {/* Generated fetch code */}
      <div className="mb-6 rounded-lg border border-border overflow-hidden text-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
          <span className="text-muted text-xs font-mono">fetch.js</span>
        </div>
        <pre className="p-4 bg-[#0d1117] font-mono text-[13px] leading-relaxed text-slate-300 whitespace-pre overflow-x-auto">
          {fetchCode}
        </pre>
      </div>

      {/* Run */}
      <button
        onClick={run}
        disabled={loading}
        className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-10"
      >
        {loading ? 'Carregando...' : 'Executar'}
      </button>

      {/* Response */}
      {response && (
        <div className="rounded-lg border border-border overflow-hidden text-sm">
          <div className="flex items-center gap-3 px-4 py-2 bg-card border-b border-border">
            <span className="text-muted text-xs font-mono">response.json</span>
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
          <pre className="p-4 bg-[#0d1117] font-mono text-[13px] leading-relaxed text-slate-300 whitespace-pre overflow-x-auto max-h-[480px] overflow-y-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
