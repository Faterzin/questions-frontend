'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'

type Tab = 'pending' | 'questions' | 'categories' | 'users'

interface Question {
  id: string
  title: string
  correctAnswer: string
  incorrectAnswers: string[]
  difficulty: string
  status: string
  submittedBy?: string | null
  category: { id: string; name: string }
  createdAt: string
}
interface QuestionsRes { data: Question[]; total: number; page: number; pages?: number; limit?: number }
interface Category { id: string; name: string; _count: { questions: number } }
interface UserItem { id: string; name: string; email: string; role: string; active: boolean }
interface UsersRes { data: UserItem[]; total: number; page: number; pages: number }
interface Stats { pending: number; approved: number; rejected: number; total: number }

const DIFF_LABEL: Record<string, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' }
const DIFF_COLOR: Record<string, string> = {
  easy: 'bg-emerald-500/20 text-emerald-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  hard: 'bg-red-500/20 text-red-400',
}
const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-emerald-500/20 text-emerald-400',
  rejected: 'bg-red-500/20 text-red-400',
}

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('pending')
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [isLoading, user, router])

  useEffect(() => {
    api.get<Stats>('/questions/stats').then(setStats).catch(() => {})
  }, [tab])

  if (isLoading || !user) {
    return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><p className="text-muted">Carregando...</p></div>
  }

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: 'pending', label: 'Aprovação', badge: stats?.pending },
    { key: 'questions', label: 'Questões' },
    { key: 'categories', label: 'Categorias' },
    { key: 'users', label: 'Usuários' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Painel Admin</h1>
          <p className="text-muted text-sm mt-1">Olá, {user.name}</p>
        </div>
        <div className="flex items-center gap-4">
          {stats && (
            <div className="hidden sm:flex items-center gap-3 text-xs text-muted">
              <span className="text-yellow-400">{stats.pending} pendentes</span>
              <span className="text-emerald-400">{stats.approved} aprovadas</span>
              <span>{stats.total} total</span>
            </div>
          )}
          <button onClick={logout} className="px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-white hover:border-red-500/50 transition-colors">
            Sair
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap flex items-center gap-2 ${
              tab === t.key ? 'border-accent text-white' : 'border-transparent text-muted hover:text-white'
            }`}
          >
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'pending' && <PendingTab onAction={() => api.get<Stats>('/questions/stats').then(setStats).catch(() => {})} />}
      {tab === 'questions' && <QuestionsTab />}
      {tab === 'categories' && <CategoriesTab />}
      {tab === 'users' && <UsersTab />}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   APROVAÇÃO (pendentes)
   ════════════════════════════════════════════════════════════════ */
function PendingTab({ onAction }: { onAction: () => void }) {
  const [items, setItems] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [reviewing, setReviewing] = useState<string | null>(null)

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await api.get<QuestionsRes>(`/questions/all?status=pending&limit=15&page=${p}`)
      setItems(res.data)
      setPage(res.page)
      setTotalPages(res.pages ?? 1)
    } catch { /* */ }
    setLoading(false)
  }, [])

  useEffect(() => { load(1) }, [load])

  async function review(id: string, status: 'approved' | 'rejected') {
    setReviewing(id)
    try {
      await api.patch(`/questions/${id}/review`, { status })
      load(page)
      onAction()
    } catch { /* */ }
    setReviewing(null)
  }

  if (loading) return <p className="text-muted text-center py-8">Carregando...</p>
  if (items.length === 0) return (
    <div className="text-center py-12">
      <p className="text-muted text-lg">Nenhuma questão pendente</p>
      <p className="text-muted/60 text-sm mt-1">Questões enviadas aparecerão aqui para aprovação</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {items.map(q => (
        <div key={q.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-white font-medium">{q.title}</p>
              {q.submittedBy && <p className="text-xs text-muted mt-1">Enviado por: {q.submittedBy}</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-muted">{q.category.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${DIFF_COLOR[q.difficulty]}`}>{DIFF_LABEL[q.difficulty]}</span>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-3 mb-3 space-y-1.5 text-sm">
            <p className="text-emerald-400">✓ {q.correctAnswer}</p>
            {q.incorrectAnswers.map((a, i) => (
              <p key={i} className="text-red-400/70">✗ {a}</p>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{new Date(q.createdAt).toLocaleDateString('pt-BR')}</span>
            <div className="flex gap-2">
              <button
                onClick={() => review(q.id, 'rejected')}
                disabled={reviewing === q.id}
                className="px-4 py-1.5 text-sm rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                Rejeitar
              </button>
              <button
                onClick={() => review(q.id, 'approved')}
                disabled={reviewing === q.id}
                className="px-4 py-1.5 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50"
              >
                Aprovar
              </button>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm text-muted pt-2">
          <button disabled={page <= 1} onClick={() => load(page - 1)} className="px-3 py-1.5 rounded-lg border border-border hover:text-white disabled:opacity-30">Anterior</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => load(page + 1)} className="px-3 py-1.5 rounded-lg border border-border hover:text-white disabled:opacity-30">Próxima</button>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   QUESTÕES (todas, com filtro de status)
   ════════════════════════════════════════════════════════════════ */
function QuestionsTab() {
  const [items, setItems] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterCat, setFilterCat] = useState('')
  const [filterDiff, setFilterDiff] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', correctAnswer: '', incorrectAnswers: ['', '', ''], difficulty: 'easy', categoryName: '' })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '15', page: String(p) })
      if (filterCat) params.set('category', filterCat)
      if (filterDiff) params.set('difficulty', filterDiff)
      if (filterStatus) params.set('status', filterStatus)
      const res = await api.get<QuestionsRes>(`/questions/all?${params}`)
      setItems(res.data)
      setPage(res.page)
      setTotalPages(res.pages ?? 1)
    } catch { /* */ }
    setLoading(false)
  }, [filterCat, filterDiff, filterStatus])

  useEffect(() => { load(1) }, [load])
  useEffect(() => { api.get<Category[]>('/categories').then(setCategories).catch(() => {}) }, [])

  function startEdit(q: Question) {
    setEditingId(q.id)
    setForm({ title: q.title, correctAnswer: q.correctAnswer, incorrectAnswers: [...q.incorrectAnswers, '', ''].slice(0, 3), difficulty: q.difficulty, categoryName: q.category.name })
  }

  async function save() {
    setSaving(true)
    try {
      await api.put(`/questions/${editingId}`, { ...form, incorrectAnswers: form.incorrectAnswers.filter(a => a.trim()) })
      setEditingId(null)
      load(page)
    } catch { /* */ }
    setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Deletar esta questão?')) return
    await api.del(`/questions/${id}`)
    load(page)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-white">
          <option value="">Todos status</option>
          <option value="approved">Aprovadas</option>
          <option value="pending">Pendentes</option>
          <option value="rejected">Rejeitadas</option>
        </select>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-white">
          <option value="">Todas categorias</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-white">
          <option value="">Todas dificuldades</option>
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </select>
      </div>

      {editingId && (
        <div className="rounded-xl border border-accent/30 bg-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Editar Questão</h3>
          <textarea value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-white" />
          <input value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })} placeholder="Resposta correta" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-white" />
          {form.incorrectAnswers.map((a, i) => (
            <input key={i} value={a} onChange={e => { const arr = [...form.incorrectAnswers]; arr[i] = e.target.value; setForm({ ...form, incorrectAnswers: arr }) }} placeholder={`Incorreta ${i + 1}`} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-white" />
          ))}
          <div className="flex gap-3">
            <input value={form.categoryName} onChange={e => setForm({ ...form, categoryName: e.target.value })} placeholder="Categoria" className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-sm text-white" />
            <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-white">
              <option value="easy">Fácil</option>
              <option value="medium">Médio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-sm text-muted hover:text-white">Cancelar</button>
            <button onClick={save} disabled={saving} className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium disabled:opacity-50">
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted text-center py-8">Carregando...</p> : items.length === 0 ? <p className="text-muted text-center py-8">Nenhuma questão.</p> : (
        <div className="space-y-2">
          {items.map(q => (
            <div key={q.id} className="rounded-xl border border-border bg-card p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium line-clamp-2">{q.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLOR[q.status]}`}>{q.status}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-muted">{q.category.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${DIFF_COLOR[q.difficulty]}`}>{DIFF_LABEL[q.difficulty]}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(q)} className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted hover:text-white hover:border-accent/50 transition-colors">Editar</button>
                <button onClick={() => remove(q.id)} className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted hover:text-red-400 hover:border-red-500/50 transition-colors">Deletar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm text-muted">
          <button disabled={page <= 1} onClick={() => load(page - 1)} className="px-3 py-1.5 rounded-lg border border-border hover:text-white disabled:opacity-30">Anterior</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => load(page + 1)} className="px-3 py-1.5 rounded-lg border border-border hover:text-white disabled:opacity-30">Próxima</button>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   CATEGORIAS
   ════════════════════════════════════════════════════════════════ */
function CategoriesTab() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [newName, setNewName] = useState('')
  const [showNew, setShowNew] = useState(false)

  async function load() {
    setLoading(true)
    try { setItems(await api.get<Category[]>('/categories')) } catch { /* */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function createCat() {
    if (!newName.trim()) return
    await api.post('/categories', { name: newName })
    setNewName(''); setShowNew(false); load()
  }

  async function updateCat(id: string) {
    if (!editName.trim()) return
    await api.put(`/categories/${id}`, { name: editName })
    setEditingId(null); load()
  }

  async function deleteCat(id: string) {
    if (!confirm('Deletar?')) return
    try { await api.del(`/categories/${id}`); load() } catch (e: any) { alert(e.message) }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowNew(true)} className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">+ Nova Categoria</button>
      </div>

      {showNew && (
        <div className="flex gap-3 items-center rounded-xl border border-accent/30 bg-card p-4">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome da categoria" className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-sm text-white" onKeyDown={e => e.key === 'Enter' && createCat()} />
          <button onClick={createCat} className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium">Criar</button>
          <button onClick={() => setShowNew(false)} className="text-sm text-muted hover:text-white">Cancelar</button>
        </div>
      )}

      {loading ? <p className="text-muted text-center py-8">Carregando...</p> : (
        <div className="space-y-2">
          {items.map(c => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
              {editingId === c.id ? (
                <>
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-sm text-white" onKeyDown={e => e.key === 'Enter' && updateCat(c.id)} />
                  <button onClick={() => updateCat(c.id)} className="px-3 py-1.5 text-xs rounded-lg bg-accent text-white">Salvar</button>
                  <button onClick={() => setEditingId(null)} className="text-xs text-muted hover:text-white">Cancelar</button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{c.name}</p>
                    <p className="text-xs text-muted">{c._count.questions} questões</p>
                  </div>
                  <button onClick={() => { setEditingId(c.id); setEditName(c.name) }} className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted hover:text-white hover:border-accent/50 transition-colors">Editar</button>
                  <button onClick={() => deleteCat(c.id)} className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted hover:text-red-400 hover:border-red-500/50 transition-colors">Deletar</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   USUÁRIOS
   ════════════════════════════════════════════════════════════════ */
function UsersTab() {
  const [items, setItems] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try { setItems((await api.get<UsersRes>('/users?limit=50')).data) } catch { /* */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function create() {
    if (!form.name || !form.email || !form.password) return
    setSaving(true)
    try {
      await api.post('/users', form)
      setForm({ name: '', email: '', password: '' }); setShowNew(false); load()
    } catch (e: any) { alert(e.message) }
    setSaving(false)
  }

  async function toggleActive(u: UserItem) {
    await api.put(`/users/${u.id}`, { active: !u.active }); load()
  }

  async function remove(id: string) {
    if (!confirm('Deletar este usuário?')) return
    try { await api.del(`/users/${id}`); load() } catch (e: any) { alert(e.message) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Apenas admins podem acessar o sistema. Cadastre novos admins aqui.</p>
        <button onClick={() => setShowNew(true)} className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">+ Novo Admin</button>
      </div>

      {showNew && (
        <div className="rounded-xl border border-accent/30 bg-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Novo Admin</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome" className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-white" />
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-white" />
            <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Senha" type="password" className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-white" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowNew(false)} className="px-3 py-1.5 text-sm text-muted hover:text-white">Cancelar</button>
            <button onClick={create} disabled={saving} className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium disabled:opacity-50">
              {saving ? 'Criando...' : 'Criar Admin'}
            </button>
          </div>
        </div>
      )}

      {loading ? <p className="text-muted text-center py-8">Carregando...</p> : (
        <div className="space-y-2">
          {items.map(u => (
            <div key={u.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-medium">{u.name}</p>
                  {!u.active && <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Inativo</span>}
                </div>
                <p className="text-xs text-muted">{u.email}</p>
              </div>
              <button onClick={() => toggleActive(u)} className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${u.active ? 'border-border text-muted hover:text-yellow-400 hover:border-yellow-500/50' : 'border-green-500/50 text-green-400'}`}>
                {u.active ? 'Desativar' : 'Ativar'}
              </button>
              <button onClick={() => remove(u.id)} className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted hover:text-red-400 hover:border-red-500/50 transition-colors">Deletar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
