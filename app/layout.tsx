import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://questions-frontend.vercel.app'

export const metadata: Metadata = {
  title: 'Questions API',
  description: 'API REST pública com questões de múltipla escolha sobre HTML, CSS e JavaScript. Sem autenticação. Pronta para usar.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'Questions API',
    description: 'API REST pública com questões de múltipla escolha sobre HTML, CSS e JavaScript. Sem autenticação. Pronta para usar.',
    url: BASE_URL,
    siteName: 'Questions API',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Questions API',
    description: 'API REST pública com questões de múltipla escolha sobre HTML, CSS e JavaScript.',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-surface text-white antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
