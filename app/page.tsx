import { Suspense } from 'react'
import Link from 'next/link'
import QuickStartBlock from '@/components/QuickStartBlock'
import DemoSection from '@/components/DemoSection'

const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M9 18h6" />
      </svg>
    ),
    title: 'Filtros flexíveis',
    desc: 'Filtre por categoria e dificuldade em qualquer combinação. Parâmetros opcionais e case-insensitive.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Paginação',
    desc: 'Use limit e page para controlar quantas questões receber por requisição e navegar entre páginas.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Encode Base64',
    desc: 'Adicione encode=base64 para receber todos os valores codificados, preservando a estrutura do JSON.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Rate Limit',
    desc: 'Limite de 12 requisições a cada 30 segundos por IP, com headers RateLimit-* em todas as respostas.',
  },
]

export default function Home() {
  return (
    <div>

      {/* Hero with grid background */}
      <section className="relative overflow-hidden">
        {/* Grid pattern */}
        <div className="hero-grid absolute inset-0 pointer-events-none" />
        {/* Radial fade */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,#0f1117_75%)]" />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center gap-6 py-24">
          <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted bg-card/80 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            API online · questions-backend-five.vercel.app
          </div>

          <h1 className="animate-fade-in-up text-5xl sm:text-7xl font-bold tracking-tight">
            Questions{' '}
            <span className="text-accent">API</span>
          </h1>

          <p className="animate-fade-in-up animation-delay-100 text-lg text-muted max-w-xl leading-relaxed">
            API REST pública com questões de múltipla escolha sobre{' '}
            <span className="text-white">assuntos diversos</span>.
            Pronta para usar em quizzes, estudos e projetos.
          </p>

          <div className="animate-fade-in-up animation-delay-200 flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/docs"
              className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-all hover:shadow-lg hover:shadow-accent/25"
            >
              Ver documentação
            </Link>
            <a
              href="/#demo"
              className="px-6 py-2.5 rounded-lg border border-border hover:border-accent text-muted hover:text-white transition-colors"
            >
              Demonstração
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="animate-fade-in animation-delay-500 absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="w-5 h-8 rounded-full border-2 border-border flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-muted animate-scroll-dot" />
            </div>
          </div>
        </div>
      </section>

      {/* Code block — separate section */}
      <section className="max-w-6xl mx-auto px-6 -mt-4 mb-16">
        <div className="animate-fade-in-up animation-delay-300 max-w-2xl mx-auto">
          <Suspense fallback={
            <div className="rounded-xl border border-border bg-card h-48 animate-pulse" />
          }>
            <QuickStartBlock />
          </Suspense>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        {/* Features */}
        <section className="py-20">
          <h2 className="text-2xl font-bold text-center mb-12 animate-fade-in-up">O que a API oferece</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card hover:border-accent/30 transition-all hover:-translate-y-0.5 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <DemoSection />

        {/* CTA */}
        <section className="py-16 text-center">
          <div className="p-10 rounded-2xl border border-border bg-card">
            <h2 className="text-2xl font-bold mb-3">Pronto para começar?</h2>
            <p className="text-muted mb-6 text-sm">Sem autenticação. Sem instalação. Só chamar a rota.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/docs"
                className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-all hover:shadow-lg hover:shadow-accent/25"
              >
                Ler a documentação
              </Link>
            </div>
          </div>
        </section>
      </div>

    </div>
  )
}
