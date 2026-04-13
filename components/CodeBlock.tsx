import { codeToHtml } from 'shiki'
import CopyButton from './CopyButton'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

function resolveLanguage(language: string, filename?: string): string {
  if (language === 'json') return 'json'
  if (language !== 'js') return language
  if (!filename) return 'javascript'
  if (filename === 'curl') return 'bash'
  if (filename.endsWith('.json')) return 'json'
  return 'javascript'
}

export default async function CodeBlock({ code, language = 'js', filename }: CodeBlockProps) {
  const lang = resolveLanguage(language, filename)

  const html = await codeToHtml(code, {
    lang,
    theme: 'github-dark',
  })

  return (
    <div className="rounded-lg border border-border overflow-hidden text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <span className="text-muted text-xs font-mono">{filename ?? language}</span>
        <CopyButton code={code} />
      </div>
      <div
        className="[&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:!bg-[#0d1117] [&>pre]:font-mono [&>pre]:text-[13px] [&>pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
