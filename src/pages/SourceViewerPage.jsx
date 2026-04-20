import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Home, BookOpen, Code2, ChevronDown, Copy, Check, Upload } from 'lucide-react'
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
  const [importedFiles, setImportedFiles] = useState([])

  const allFiles = useMemo(() => [...files, ...importedFiles], [files, importedFiles])

  const file = allFiles.find(f => f.path === selected)
  const lines = file ? file.content.split('\n') : []

  const copy = () => {
    if (!file) return
    navigator.clipboard.writeText(file.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jsx,.js,.tsx,.ts,.json,.css'
    input.multiple = true
    input.onchange = (e) => {
      Array.from(e.target.files).forEach(f => {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const path = `imported/${f.name}`
          setImportedFiles(prev => {
            const filtered = prev.filter(p => p.path !== path)
            return [...filtered, { path, name: f.name, type: 'imported', content: ev.target.result }]
          })
          setSelected(path)
          setCopied(false)
        }
        reader.readAsText(f)
      })
    }
    input.click()
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <SiteNavBar />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.25rem 1.5rem' }}>
        {/* Header */}
        <div className="float-in" style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.28rem 0.7rem', borderRadius: 999,
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.22)',
            color: '#22d3ee',
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.85rem',
          }}>
            <Code2 size={11} /> Source
          </div>
          <h1 className="display-1" style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', margin: '0 0 0.4rem' }}>
            Source <span className="gradient-text-cyan">Viewer</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, lineHeight: 1.55 }}>
            Browse the raw JSX behind every dashboard, or import a local file to inspect it.
          </p>
        </div>

        {/* File picker + copy */}
        <div style={{
          display: 'flex', gap: '0.55rem', marginBottom: '1rem',
          alignItems: 'center', flexWrap: 'wrap',
          padding: '0.7rem',
          background: 'rgba(17,24,39,0.55)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(148,163,184,0.08)',
          borderRadius: 14,
        }}>
          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '500px' }}>
            <select
              value={selected}
              onChange={e => { setSelected(e.target.value); setCopied(false) }}
              className="input"
              style={{
                width: '100%', appearance: 'none',
                padding: '0.55rem 2.5rem 0.55rem 0.95rem',
                fontSize: '0.85rem', fontFamily: 'ui-monospace, monospace',
                cursor: 'pointer',
              }}
            >
              {allFiles.map(f => (
                <option key={f.path} value={f.path}>
                  {f.type === 'imported' ? '\uD83D\uDCC1 ' : f.type === 'geopolitical' ? '\uD83C\uDF10 ' : '\uD83D\uDCC8 '}{f.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>

          <button
            onClick={handleImport}
            className="btn-ghost"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.5rem 0.9rem',
              fontSize: '0.78rem', fontWeight: 700,
              borderRadius: 10, fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            <Upload size={13} /> Import File
          </button>

          <button
            onClick={copy}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              background: copied
                ? 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.08))'
                : 'transparent',
              color: copied ? '#10b981' : '#94a3b8',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.4)' : '#1e293b'}`,
              borderRadius: 10, padding: '0.5rem 0.9rem',
              fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
          </button>

          <span style={{
            marginLeft: 'auto', padding: '0.3rem 0.6rem',
            color: '#64748b', fontSize: '0.72rem',
            fontFamily: 'ui-monospace, monospace',
            background: 'rgba(148,163,184,0.06)',
            borderRadius: 999,
          }}>
            {lines.length} lines
          </span>
        </div>

        {/* Code block */}
        <div style={{
          background: '#0a0e17',
          border: '1px solid rgba(148,163,184,0.08)',
          borderRadius: 14,
          overflow: 'auto',
          maxHeight: 'calc(100vh - 240px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}>
          <pre style={{
            margin: 0, padding: '1.1rem 0',
            fontSize: '0.78rem', lineHeight: 1.7,
            fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',ui-monospace,monospace",
          }}>
            {lines.map((line, i) => {
              const tokens = highlightLine(line)
              return (
                <div key={i} style={{ display: 'flex', minHeight: '1.7em' }}>
                  <span style={{
                    display: 'inline-block', width: '4rem', textAlign: 'right',
                    paddingRight: '1rem', color: '#334155', userSelect: 'none', flexShrink: 0,
                    fontVariantNumeric: 'tabular-nums',
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
