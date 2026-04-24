import { useEffect, useRef } from 'react'

const STOCKS = [
  { ticker: 'NVDA',  name: 'NVIDIA Corp',     change: '+4.2%', color: '#10b981' },
  { ticker: 'ALPHA', name: 'Alpha Bank',      change: '+1.8%', color: '#10b981' },
  { ticker: 'LMT',   name: 'Lockheed Martin', change: '+0.4%', color: '#10b981' },
  { ticker: 'TSLA',  name: 'Tesla Inc',       change: '-2.1%', color: '#ef4444' },
  { ticker: 'WYNN',  name: 'Wynn Resorts',    change: '-1.2%', color: '#ef4444' },
  { ticker: 'EUROB', name: 'Eurobank',        change: '+2.1%', color: '#10b981' },
  { ticker: 'AAPL',  name: 'Apple Inc',       change: '+0.8%', color: '#10b981' },
  { ticker: 'MGM',   name: 'MGM Resorts',     change: '-0.6%', color: '#ef4444' },
]

const EVENTS = [
  { tag: 'GEOPOLITICAL', title: 'Iran nuclear talks collapse',  body: 'US imposes sweeping new oil sanctions after IAEA inspection framework rejected.' },
  { tag: 'MACRO',        title: 'US–China tariffs hit 145%',    body: 'New duties on semiconductor equipment rattle Asian supply chains.' },
  { tag: 'DEFENSE',      title: 'NATO spending surge',          body: 'Eastern European members commit record €340B over 5 years.' },
  { tag: 'MARKETS',      title: 'ECB holds rates steady',       body: 'Decision fuels Greek banking sector outperformance vs EU peers.' },
  { tag: 'SECTOR',       title: 'Macau VIP revenue falls',      body: 'Cross-border capital flow restrictions bite casino operators for third quarter.' },
  { tag: 'ENERGY',       title: 'Saudi Aramco cuts output',     body: 'OPEC+ coalition trims production by 1.2M barrels per day.' },
  { tag: 'CRYPTO',       title: 'Bitcoin crosses $95k',         body: 'Institutional ETF inflows accelerate as halving cycle matures.' },
  { tag: 'TECH',         title: 'EU AI Act enforcement begins', body: 'Major model providers face compliance deadlines across bloc.' },
]

const TAG_COLORS = {
  GEOPOLITICAL: '#ffaa00', MACRO: '#ff4444', DEFENSE: '#cc88ff',
  MARKETS: '#00ff9f', SECTOR: '#00eeff', ENERGY: '#ffaa00',
  CRYPTO: '#cc88ff', TECH: '#00eeff',
}

function randSparkline(up, len = 28) {
  const pts = [50]
  for (let i = 1; i < len; i++) {
    const drift = up ? 0.3 : -0.3
    pts.push(Math.max(5, Math.min(95, pts[i - 1] + drift + (Math.random() - 0.5) * 8)))
  }
  return pts
}
function sparklinePath(pts, w, h) {
  const xStep = w / (pts.length - 1)
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * xStep).toFixed(1)},${(h - (p / 100) * h).toFixed(1)}`).join(' ')
}

function crtFrame(content, color, width = 240) {
  const c = color
  return `<div class="holo-card" style="
    position:absolute; width:${width}px;
    background: linear-gradient(160deg, rgba(0,8,12,0.97) 0%, rgba(0,4,10,0.99) 100%);
    backdrop-filter: blur(4px);
    border: 1px solid ${c}99;
    border-radius: 3px;
    box-shadow:
      0 0 0 1px ${c}22,
      0 0 20px ${c}44,
      0 0 60px ${c}18,
      inset 0 0 30px ${c}08;
    overflow: hidden;
    font-family: 'JetBrains Mono', monospace;">
    <div class="holo-scan-sweep"></div>
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(
      180deg,
      rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px,
      transparent 1px, transparent 3px
    );pointer-events:none;z-index:15;"></div>
    <div style="position:absolute;top:4px;left:4px;width:10px;height:10px;border-top:1.5px solid ${c};border-left:1.5px solid ${c};"></div>
    <div style="position:absolute;top:4px;right:4px;width:10px;height:10px;border-top:1.5px solid ${c};border-right:1.5px solid ${c};"></div>
    <div style="position:absolute;bottom:4px;left:4px;width:10px;height:10px;border-bottom:1.5px solid ${c};border-left:1.5px solid ${c};"></div>
    <div style="position:absolute;bottom:4px;right:4px;width:10px;height:10px;border-bottom:1.5px solid ${c};border-right:1.5px solid ${c};"></div>
    ${content}
  </div>`
}

function buildStockHolo(d) {
  const isUp = d.change.startsWith('+')
  const clr = isUp ? '#00ff9f' : '#ff4466'
  const pts = d.sparkline
  const path = sparklinePath(pts, 196, 54)
  const fillPath = path + ` L196,54 L0,54 Z`
  const lastY = (54 - (pts[pts.length - 1] / 100) * 54).toFixed(1)
  const id = d.ticker.replace(/[^a-zA-Z0-9]/g, '')
  const content = `
    <div style="padding:14px 14px 6px; position:relative; z-index:5;">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:2px;">
        <span style="color:#00ffee;font-size:17px;font-weight:700;letter-spacing:0.1em;
          text-shadow: 0 0 8px #00ffee, 0 0 20px #00ffee88;">${d.ticker}</span>
        <span style="font-size:13px;font-weight:700;color:${clr};
          text-shadow: 0 0 8px ${clr}88;">${d.change}</span>
      </div>
      <div style="color:#006655;font-size:10px;letter-spacing:0.12em;margin-bottom:10px;">${d.name.toUpperCase()}</div>
      <svg width="196" height="54" viewBox="0 0 196 54" style="display:block;overflow:visible;">
        <defs>
          <linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${clr}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${clr}" stop-opacity="0"/>
          </linearGradient>
          <filter id="bloom${id}">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="${fillPath}" fill="url(#g${id})"/>
        <path d="${path}" fill="none" stroke="${clr}" stroke-width="1.5"
          stroke-linecap="round" filter="url(#bloom${id})"/>
        <circle cx="196" cy="${lastY}" r="3.5" fill="${clr}"
          style="filter:drop-shadow(0 0 4px ${clr})"/>
      </svg>
    </div>
    <div style="padding:4px 14px 12px;display:flex;align-items:center;gap:6px;position:relative;z-index:5;">
      <div style="width:5px;height:5px;border-radius:50%;background:#00ffee;
        box-shadow:0 0 8px #00ffee;animation:pulse 1.5s infinite;"></div>
      <span style="color:#004433;font-size:8px;letter-spacing:0.18em;">PROMETHEIA · LIVE FEED</span>
    </div>
  `
  return crtFrame(content, '#00ddbb')
}

function buildEventHolo(d) {
  const clr = TAG_COLORS[d.tag] || '#00eeff'
  const content = `
    <div style="padding:14px 14px 12px;position:relative;z-index:5;">
      <div style="color:${clr};font-size:9px;font-weight:700;letter-spacing:0.22em;
        text-shadow:0 0 8px ${clr}88;margin-bottom:8px;">${d.tag}</div>
      <div style="color:#e8ffe8;font-size:12px;font-weight:600;line-height:1.4;
        text-shadow:0 0 6px rgba(0,255,200,0.3);margin-bottom:8px;">${d.title}</div>
      <div style="color:#447766;font-size:10px;line-height:1.65;">${d.body}</div>
      <div style="margin-top:10px;border-top:1px solid ${clr}33;padding-top:8px;
        display:flex;align-items:center;gap:6px;">
        <div style="width:5px;height:5px;border-radius:50%;background:${clr};
          box-shadow:0 0 8px ${clr};animation:pulse 2s infinite;"></div>
        <span style="color:#224433;font-size:8px;letter-spacing:0.16em;">INTELLIGENCE · PROMETHEIA</span>
      </div>
    </div>
  `
  return crtFrame(content, clr)
}

const NODE_COUNT = 52
const MAX_DIST = 200
const HOVER_R = 22
const HOLO_W = 240
const HOLO_H = 160
const HOLO_GAP = 58
const VIEWPORT_PAD = 12

export default function ParticleField() {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    if (!canvas || !overlay) return
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0
    let nodes = []
    let mouse = { x: -9999, y: -9999 }
    let hoveredNode = null
    let holoTimer = null
    let holoHideTimer = null
    let rafId = 0
    const t0 = Date.now()

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    const placeNodes = () => {
      nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
        const isStock = Math.random() > 0.45
        const stock = STOCKS[i % STOCKS.length]
        const data = isStock
          ? { ...stock, sparkline: randSparkline(stock.change.startsWith('+')) }
          : EVENTS[i % EVENTS.length]
        return {
          x: 40 + Math.random() * (W - 80),
          y: 40 + Math.random() * (H - 80),
          r: 2.5 + Math.random() * 5,
          phase: Math.random() * Math.PI * 2,
          hoverT: 0,
          beamT: 0,
          isStock,
          data,
        }
      })
    }

    const showHolo = (node) => {
      clearTimeout(holoHideTimer)
      const W2 = window.innerWidth
      const H2 = window.innerHeight
      const spaceAbove = node.y - VIEWPORT_PAD
      const spaceBelow = H2 - node.y - VIEWPORT_PAD
      const placeAbove = spaceAbove >= HOLO_H + HOLO_GAP || spaceAbove > spaceBelow
      let left = node.x - HOLO_W / 2
      let top = placeAbove
        ? node.y - node.r - HOLO_GAP - HOLO_H
        : node.y + node.r + HOLO_GAP
      left = Math.max(VIEWPORT_PAD, Math.min(left, W2 - HOLO_W - VIEWPORT_PAD))
      top = Math.max(VIEWPORT_PAD, Math.min(top, H2 - HOLO_H - VIEWPORT_PAD))
      node.holoLeft = left
      node.holoTop = top
      node.holoW = HOLO_W
      node.holoH = HOLO_H
      node.holoPlacement = placeAbove ? 'above' : 'below'
      node.beamT = 0
      overlay.innerHTML = node.isStock ? buildStockHolo(node.data) : buildEventHolo(node.data)
      const el = overlay.firstChild
      if (el) {
        el.style.left = left + 'px'
        el.style.top = top + 'px'
        el.style.transformOrigin = placeAbove ? 'center bottom' : 'center top'
      }
    }

    const hideHolo = () => {
      for (const n of nodes) { n.beamT = 0; n.holoTop = null }
      const el = overlay.firstChild
      if (!el) return
      el.style.animation = 'none'
      el.style.opacity = '0'
      el.style.transform = 'scaleY(0)'
      el.style.transition = 'opacity 0.25s, transform 0.25s'
      clearTimeout(holoHideTimer)
      holoHideTimer = setTimeout(() => { overlay.innerHTML = '' }, 260)
    }

    const onMove = (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY
      let found = null
      for (const n of nodes) {
        if (Math.hypot(n.x - e.clientX, n.y - e.clientY) < HOVER_R) { found = n; break }
      }
      if (found !== hoveredNode) {
        clearTimeout(holoTimer); holoTimer = null
        if (hoveredNode) {
          hoveredNode.hoverT = 0
          hideHolo()
        }
        hoveredNode = found
        if (!found) { hideHolo(); return }
        holoTimer = setTimeout(() => {
          if (hoveredNode === found) showHolo(found)
        }, 500)
      }
    }
    const onLeave = () => {
      mouse.x = -9999; mouse.y = -9999
      clearTimeout(holoTimer); holoTimer = null
      if (hoveredNode) hoveredNode.hoverT = 0
      hoveredNode = null
      hideHolo()
    }
    const onResize = () => { resize(); placeNodes() }

    resize()
    placeNodes()
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', onResize)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const t = (Date.now() - t0) / 1000

      const connectedSet = new Set()
      if (hoveredNode) {
        for (const n of nodes) {
          if (n !== hoveredNode && Math.hypot(n.x - hoveredNode.x, n.y - hoveredNode.y) < MAX_DIST) {
            connectedSet.add(n)
          }
        }
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < MAX_DIST) {
            const base = (1 - dist / MAX_DIST) * 0.15
            const isDirectHov = hoveredNode === a || hoveredNode === b
            const isNeighbour = connectedSet.has(a) && connectedSet.has(b)
            const h = hoveredNode ? hoveredNode.hoverT : 0
            let alpha, lineW, color
            if (isDirectHov) {
              alpha = base * 5 * h + base * (1 - h)
              lineW = 1 + h * 0.5
              color = `rgba(0,240,200,${Math.min(0.85, alpha)})`
            } else if (isNeighbour) {
              alpha = base + base * 1.5 * h
              lineW = 0.5
              color = `rgba(0,200,180,${Math.min(0.35, alpha)})`
            } else {
              alpha = base * (hoveredNode ? Math.max(0.3, 1 - h * 0.6) : 1)
              lineW = 0.3
              color = `rgba(60,80,180,${alpha})`
            }
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = color
            ctx.lineWidth = lineW
            ctx.stroke()
          }
        }
      }

      // Beam
      if (hoveredNode && hoveredNode.hoverT > 0.1 && hoveredNode.holoTop != null) {
        const n = hoveredNode
        n.beamT = Math.min(1, (n.beamT || 0) + 0.055)
        const beamEase = 1 - Math.pow(1 - n.beamT, 3)
        const h = n.hoverT * beamEase
        const isAbove = n.holoPlacement !== 'below'
        const nodeEdgeY = isAbove ? n.y - n.r : n.y + n.r
        const cardEdgeY = isAbove ? n.holoTop + (n.holoH || HOLO_H) : n.holoTop
        const holoMidX = n.holoLeft + (n.holoW || 240) / 2
        const spreadTop = (n.holoW || 240) * 0.45
        const spreadBot = n.r * 0.8

        const beamGrad = ctx.createLinearGradient(n.x, nodeEdgeY, holoMidX, cardEdgeY)
        beamGrad.addColorStop(0, 'rgba(0,255,200,0)')
        beamGrad.addColorStop(0.18, `rgba(0,255,200,${0.12 * h})`)
        beamGrad.addColorStop(0.62, `rgba(0,255,220,${0.18 * h})`)
        beamGrad.addColorStop(1, `rgba(0,255,220,${0.04 * h})`)
        ctx.beginPath()
        ctx.moveTo(n.x - spreadBot, nodeEdgeY)
        ctx.lineTo(holoMidX - spreadTop, cardEdgeY)
        ctx.lineTo(holoMidX + spreadTop, cardEdgeY)
        ctx.lineTo(n.x + spreadBot, nodeEdgeY)
        ctx.closePath()
        ctx.fillStyle = beamGrad
        ctx.fill()

        const coreGrad = ctx.createLinearGradient(n.x, nodeEdgeY, holoMidX, cardEdgeY)
        coreGrad.addColorStop(0, 'rgba(0,255,220,0)')
        coreGrad.addColorStop(0.45, `rgba(0,255,220,${0.16 * h})`)
        coreGrad.addColorStop(1, `rgba(0,255,220,${0.05 * h})`)
        ctx.beginPath()
        ctx.moveTo(n.x - spreadBot * 0.35, nodeEdgeY)
        ctx.lineTo(holoMidX - spreadTop * 0.22, cardEdgeY)
        ctx.lineTo(holoMidX + spreadTop * 0.22, cardEdgeY)
        ctx.lineTo(n.x + spreadBot * 0.35, nodeEdgeY)
        ctx.closePath()
        ctx.fillStyle = coreGrad
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(n.x, nodeEdgeY)
        ctx.lineTo(holoMidX, cardEdgeY)
        ctx.strokeStyle = `rgba(0,255,220,${0.26 * h})`
        ctx.lineWidth = 0.6 + 0.3 * beamEase
        ctx.stroke()
      }

      // Nodes
      for (const n of nodes) {
        const isHov = hoveredNode === n
        if (isHov && n.hoverT < 1) n.hoverT = Math.min(1, n.hoverT + 0.06)
        else if (!isHov && n.hoverT > 0) n.hoverT = Math.max(0, n.hoverT - 0.04)
        const h = n.hoverT
        const isNeighbour = connectedSet.has(n)
        const neighbourBoost = isNeighbour ? (hoveredNode?.hoverT || 0) * 0.35 : 0
        const breath = 0.6 + 0.4 * Math.sin(t * 1.2 + n.phase)
        const alpha = h > 0 ? 0.5 + 0.5 * h : Math.min(0.95, (n.r > 5 ? 0.75 * breath : 0.45 * breath) + neighbourBoost)
        const r = n.r * (1 + h * 0.7)
        const baseColor = n.isStock
          ? (n.data.change?.startsWith('+') ? '16,185,129' : '239,68,68')
          : '6,182,212'
        const cyanColor = '6,182,212'

        const haloR = r + 4 + h * 16
        const haloAlpha = h > 0 ? (0.08 + h * 0.32) * breath : (n.r > 4 ? 0.1 * breath : 0)
        if (haloAlpha > 0.01) {
          const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, haloR)
          grad.addColorStop(0, `rgba(${h > 0.3 ? cyanColor : baseColor},${haloAlpha})`)
          grad.addColorStop(1, `rgba(${h > 0.3 ? cyanColor : baseColor},0)`)
          ctx.beginPath()
          ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }

        if (n.r > 4 || h > 0.1) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, r + 3.5, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${h > 0.3 ? cyanColor : baseColor},${h > 0.1 ? 0.3 + h * 0.4 : 0.2 * breath})`
          ctx.lineWidth = h > 0.1 ? 1 + h : 0.6
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${h > 0.5 ? cyanColor : baseColor},${alpha})`
        ctx.fill()

        if (h > 0.05) {
          ctx.strokeStyle = `rgba(6,182,212,${h * 0.8})`
          ctx.lineWidth = 0.8
          const tick = r + 5 + h * 6
          const gap = r + 2
          ;[[-tick, 0, -gap, 0], [gap, 0, tick, 0], [0, -tick, 0, -gap], [0, gap, 0, tick]].forEach(([x1, y1, x2, y2]) => {
            ctx.beginPath(); ctx.moveTo(n.x + x1, n.y + y1); ctx.lineTo(n.x + x2, n.y + y2); ctx.stroke()
          })
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    if (!reduceMotion) draw()

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(holoTimer)
      clearTimeout(holoHideTimer)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
      <div
        ref={overlayRef}
        style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none' }}
      />
    </>
  )
}
