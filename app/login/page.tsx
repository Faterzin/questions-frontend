export default function Login() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center text-sm font-bold mx-auto mb-4">
            Q
          </div>
          <h1 className="text-2xl font-bold">Entrar</h1>
          <p className="text-muted text-sm mt-1">Acesse sua conta da Questions API</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5 font-semibold uppercase tracking-widest">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <button className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
            Entrar
          </button>
        </div>

      </div>
    </div>
  )
}
