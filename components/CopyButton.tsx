'use client'

import { useState } from 'react'

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={copy} className="text-xs text-muted hover:text-white transition-colors">
      {copied ? 'copiado ✓' : 'copiar'}
    </button>
  )
}
