import express from 'express'
import cors from 'cors'
import { handler as analyzeHandler } from './routes/analyze.js'
import { handler as reanalyzeHandler } from './routes/reanalyze.js'
import { handler as reanalyzeStockHandler } from './routes/reanalyze-stock.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'ai-analysis-api' }))
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Analysis endpoints — no timeout limits
app.post('/api/analyze', analyzeHandler)
app.post('/api/reanalyze', reanalyzeHandler)
app.post('/api/reanalyze-stock', reanalyzeStockHandler)

const server = app.listen(PORT, () => {
  console.log(`AI Analysis API running on port ${PORT}`)
})

// Allow long-running requests (10 minutes) — prevents connection drops
server.keepAliveTimeout = 600000
server.headersTimeout = 610000
server.timeout = 600000
