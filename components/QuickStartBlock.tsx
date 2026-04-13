import { codeToHtml } from 'shiki'
import QuickStartTabs from './QuickStartTabs'

const BASE = 'https://questions-backend-five.vercel.app'

const snippets = {
  javascript: `const res = await fetch('${BASE}/questions?limit=5')
const { data } = await res.json()

data.forEach(q => console.log(q.title))`,

  python: `import requests

res = requests.get('${BASE}/questions', params={'limit': 5})
data = res.json()['data']

for q in data:
    print(q['title'])`,

  curl: `curl "${BASE}/questions?limit=5"`,
}

const langMap = {
  javascript: 'javascript',
  python: 'python',
  curl: 'bash',
} as const

function addLineNumbers(html: string, code: string): string {
  const lineCount = code.split('\n').length
  const numbers = Array.from({ length: lineCount }, (_, i) =>
    `<span class="line-number">${i + 1}</span>`
  ).join('')

  const gutter = `<div class="line-numbers-gutter">${numbers}</div>`

  return html.replace(/<pre([^>]*)>/, `<pre$1 class="with-line-numbers"><div class="code-wrapper">${gutter}`) + '</div>'
}

export default async function QuickStartBlock() {
  const rendered = {} as Record<keyof typeof snippets, { html: string; code: string }>

  for (const key of Object.keys(snippets) as (keyof typeof snippets)[]) {
    const rawHtml = await codeToHtml(snippets[key], {
      lang: langMap[key],
      theme: 'github-dark',
    })
    rendered[key] = {
      html: addLineNumbers(rawHtml, snippets[key]),
      code: snippets[key],
    }
  }

  return <QuickStartTabs snippets={rendered} />
}
