import express from 'express'
import cors from 'cors'
import { handler as analyzeHandler } from './routes/analyze.js'
import { handler as reanalyzeHandler } from './routes/reanalyze.js'
import { handler as reanalyzeStockHandler } from './routes/reanalyze-stock.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// ── In-memory job store ─────────────────────────────────────────────────────
const jobs = new Map()

function createJob(type) {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const job = { id, type, status: 'running', stage: 'Starting...', result: null, error: null, createdAt: Date.now() }
  jobs.set(id, job)
  // Auto-cleanup after 30 minutes
  setTimeout(() => jobs.delete(id), 30 * 60 * 1000)
  return job
}

// ── Job status endpoint ─────────────────────────────────────────────────────
app.get('/api/job/:id', (req, res) => {
  const job = jobs.get(req.params.id)
  if (!job) return res.status(404).json({ error: 'Job not found' })
  // Exclude fetchedData from response (can be very large)
  const { fetchedData, ...safe } = job
  return res.json(safe)
})

// ── Async wrappers — return jobId immediately, process in background ────────

// Fake res object that captures the handler's response
function fakeRes(job) {
  return {
    _statusCode: 200,
    status(code) { this._statusCode = code; return this },
    json(data) {
      if (this._statusCode >= 400) {
        job.status = 'error'
        job.error = data.error || 'Unknown error'
      } else {
        job.status = 'done'
        job.result = data
      }
    },
  }
}

app.post('/api/analyze-async', (req, res) => {
  const job = createJob('analyze')
  res.json({ jobId: job.id })
  // Run in background
  analyzeHandler(req, fakeRes(job)).catch(err => {
    job.status = 'error'
    job.error = err.message
  })
})

app.post('/api/reanalyze-async', (req, res) => {
  const job = createJob('reanalyze')
  res.json({ jobId: job.id })
  // Phase 1: fetch data only
  reanalyzeHandler.fetchData(req.body, job).catch(err => {
    job.status = 'error'
    job.error = err.message
  })
})

// Phase 2: analyze with Claude using fetched data
app.post('/api/reanalyze-analyze', (req, res) => {
  const { jobId } = req.body || {}
  const job = jobs.get(jobId)
  if (!job) return res.status(404).json({ error: 'Job not found' })
  if (job.status !== 'data_ready') return res.status(400).json({ error: `Job not ready for analysis (status: ${job.status})` })
  job.status = 'running'
  job.stage = 'Running deep analysis with Claude...'
  res.json({ ok: true })
  reanalyzeHandler.analyze(job).catch(err => {
    job.status = 'error'
    job.error = err.message
  })
})

app.post('/api/reanalyze-stock-async', (req, res) => {
  const job = createJob('reanalyze-stock')
  res.json({ jobId: job.id })
  // Phase 1: fetch data only
  reanalyzeStockHandler.fetchData(req.body, job).catch(err => {
    job.status = 'error'
    job.error = err.message
  })
})

// Phase 2: analyze stock with Claude using fetched data
app.post('/api/reanalyze-stock-analyze', (req, res) => {
  const { jobId } = req.body || {}
  const job = jobs.get(jobId)
  if (!job) return res.status(404).json({ error: 'Job not found' })
  if (job.status !== 'data_ready') return res.status(400).json({ error: `Job not ready for analysis (status: ${job.status})` })
  job.status = 'running'
  job.stage = 'Running deep analysis with Claude...'
  res.json({ ok: true })
  reanalyzeStockHandler.analyze(job).catch(err => {
    job.status = 'error'
    job.error = err.message
  })
})

// Health check
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'ai-analysis-api', version: '2.1.0' }))
app.get('/health', (_req, res) => res.json({ status: 'ok', version: '2.1.0' }))

// Sync endpoints (kept as fallback)
app.post('/api/analyze', analyzeHandler)
app.post('/api/reanalyze', reanalyzeHandler)
app.post('/api/reanalyze-stock', reanalyzeStockHandler)

const server = app.listen(PORT, () => {
  console.log(`AI Analysis API running on port ${PORT}`)
})

server.keepAliveTimeout = 600000
server.headersTimeout = 610000
server.timeout = 600000
