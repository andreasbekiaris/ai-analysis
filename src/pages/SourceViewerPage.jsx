import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Home, BookOpen, Code2, ChevronDown, Copy, Check } from 'lucide-react'
import SiteNavBar from '../components/SiteNavBar'

const rawFiles = import.meta.glob('/src/dashboards/**/*.jsx', { query: '?raw', eager: true, import: 'default' })

const keywords = [
  'import','export','default','from','const','let','var','function','return',
  'if','else','switch','case','break','true','false','null','undefined',
  'new','typeof','instanceof','this','class','extends','super','try','catch',
  'throw','finally','for','while','do','in','of','async','await','yield',
  'useState','useEffect','useMemo','useCallback','useRef',
]

const kwSet = new Set(keywords)

function highlightLine(line) {
  const tokens = []
  let i = 0

  while (i < line.length) {
    // strings
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const q = line[i]
      let j = i + 1
      while (j < line.length && line[j] !== q) { if (line[j] === '\\') j++; j++ }
      tokens.push({ type: 'string', text: line.slice(i, j + 1) })
      i = j + 1
      continue
    }
    // line comments
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ type: 'comment', text: line.slice(i) })
      break
    }
    // numbers
    if (/\d/.test(line[i]) && (i === 0 || /[\s,=:([\-+*/]/.test(line[i - 1]))) {
      let j = i
      while (j < line.length && /[\d.xXa-fA-FeE_]/.test(line[j])) j++
      tokens.push({ type: 'number', text: line.slice(i, j) })
      i = j
      continue
    }
    // words
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++
      const word = line.slice(i, j)
      tokens.push({ type: kwSet.has(word) ? 'keyword' : 'ident', text: word })
      i = j
      continue
    }
    // jsx tags
    if (line[i] === '<' && /[A-Za-z/]/.test(line[i + 1] || '')) {
      let j = i + 1
      if (line[j] === '/') j++
      while (j < line.length && /[A-Za-z0-9.]/.test(line[j])) j++
      tokens.push({ type: 'tag', text: line.slice(i, j) })
      i = j
      continue
    }
    tokens.push({ type: 'plain', text: line[i] })
    i++
  }

  return tokens
}

const colors = {
  keyword: '#c792ea',
  string: '#c3e88d',
  comment: '#546e7a',
  number: '#f78c6c',
  tag: '#89ddff',
  ident: '#e2e8f0',
  plain: '#e2e8f0',
}

export default function SourceViewerPage() {
  const files = useMemo(() => {
    return Object.entries(rawFiles).map(([path, content]) => {
      const name = path.replace('/src/dashboards/', '')
      const type = path.includes('/geopolitical/') ? 'geopolitical' : path.includes('/stocks/') ? 'stocks' : 'other'
      return { path, name, type, content }
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const [selected, setSelected] = useState(files[0]?.path || '')
  const [copied, setCopied] = useState(false)

  const file = files.find(f => f.path === selected)
  const lines = file ? file.content.split('\n') : []

  const copy = () => {
    if (!file) return
    navigator.clipboard.writeText(file.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e' }}>
      <SiteNavBar />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Code2 size={24} color="#06b6d4" />
          <h1 style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
            Source Viewer
          </h1>
          <span style={{ color: '#64748b', fontSize: '0.82rem' }}>
            Review raw JSX of any analysis dashboard
          </span>
        </div>

        {/* File picker + copy */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '500px' }}>
            <select
              value={selected}
              onChange={e => { setSelected(e.target.value); setCopied(false) }}
              style={{
                width: '100%', appearance: 'none',
                background: '#111827', color: '#f8fafc', border: '1px solid #1e293b',
                borderRadius: '8px', padding: '0.6rem 2.5rem 0.6rem 0.85rem',
                fontSize: '0.85rem', fontFamily: 'monospace', cursor: 'pointer', outline: 'none',
              }}
            >
              {files.map(f => (
                <option key={f.path} value={f.path}>
                  {f.type === 'geopolitical' ? '\uD83C\uDF10 ' : '\uD83D\uDCC8 '}{f.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>

          <button
            onClick={copy}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              background: copied ? 'rgba(16,185,129,0.15)' : '#111827',
              color: copied ? '#10b981' : '#94a3b8',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : '#1e293b'}`,
              borderRadius: '8px', padding: '0.55rem 1rem',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
          </button>

          <span style={{ color: '#475569', fontSize: '0.72rem', fontFamily: 'monospace' }}>
            {lines.length} lines
          </span>
        </div>

        {/* Code block */}
        <div style={{
          background: '#0d1117', border: '1px solid #1e293b', borderRadius: '10px',
          overflow: 'auto', maxHeight: 'calc(100vh - 220px)',
        }}>
          <pre style={{ margin: 0, padding: '1rem 0', fontSize: '0.78rem', lineHeight: 1.65, fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace" }}>
            {lines.map((line, i) => {
              const tokens = highlightLine(line)
              return (
                <div key={i} style={{ display: 'flex', minHeight: '1.65em' }}>
                  <span style={{
                    display: 'inline-block', width: '4rem', textAlign: 'right',
                    paddingRight: '1rem', color: '#3b4252', userSelect: 'none', flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <code style={{ flex: 1, whiteSpace: 'pre', paddingRight: '1rem' }}>
                    {tokens.map((t, j) => (
                      <span key={j} style={{ color: colors[t.type] }}>{t.text}</span>
                    ))}
                  </code>
                </div>
              )
            })}
          </pre>
        </div>
      </div>
    </div>
  )
}
