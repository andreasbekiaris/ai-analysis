import { isClaudeModel, isOpenAIModel, maxOutputTokensForModel } from './model-config.js'

export class ModelCallError extends Error {
  constructor(message, { provider, status, retryable = false } = {}) {
    super(message)
    this.name = 'ModelCallError'
    this.provider = provider
    this.status = status
    this.retryable = retryable
  }
}

function extractAnthropicText(data) {
  return (data?.content || [])
    .filter(block => block.type === 'text')
    .map(block => block.text || '')
    .join('')
    .trim()
}

function extractOpenAIText(data) {
  if (typeof data?.output_text === 'string') return data.output_text.trim()

  const text = []
  for (const item of data?.output || []) {
    for (const part of item?.content || []) {
      if (part.type === 'output_text' || part.type === 'text') {
        text.push(part.text || '')
      }
    }
  }

  if (text.length) return text.join('').trim()
  return data?.choices?.[0]?.message?.content?.trim?.() || ''
}

async function readErrorText(res) {
  const text = await res.text().catch(() => '')
  if (!text) return `${res.status}`
  try {
    const data = JSON.parse(text)
    return data?.error?.message || data?.message || text
  } catch {
    return text
  }
}

export async function callTextModel({
  model,
  prompt,
  anthropicKey,
  openaiKey,
  maxOutputTokens = 16000,
  webSearch = false,
}) {
  if (isClaudeModel(model)) {
    if (!anthropicKey) {
      throw new ModelCallError(`ANTHROPIC_API_KEY not configured for ${model}`, {
        provider: 'anthropic',
        status: 500,
      })
    }

    const body = {
      model,
      max_tokens: maxOutputTokensForModel(model, maxOutputTokens),
      messages: [{ role: 'user', content: prompt }],
    }
    if (webSearch) {
      body.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 10 }]
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const detail = await readErrorText(res)
      throw new ModelCallError(`Claude API error (${res.status}): ${detail.slice(0, 250)}`, {
        provider: 'anthropic',
        status: res.status,
        retryable: res.status === 529 || res.status === 503 || res.status >= 500,
      })
    }

    return extractAnthropicText(await res.json())
  }

  if (isOpenAIModel(model)) {
    if (!openaiKey) {
      throw new ModelCallError(`OPENAI_API_KEY not configured for ${model}`, {
        provider: 'openai',
        status: 500,
      })
    }

    const body = {
      model,
      input: prompt,
      max_output_tokens: maxOutputTokens,
      reasoning: { effort: 'medium' },
      text: { verbosity: 'medium' },
    }
    if (webSearch) body.tools = [{ type: 'web_search' }]

    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const detail = await readErrorText(res)
      throw new ModelCallError(`OpenAI API error (${res.status}): ${detail.slice(0, 250)}`, {
        provider: 'openai',
        status: res.status,
        retryable: res.status === 429 || res.status === 503 || res.status >= 500,
      })
    }

    return extractOpenAIText(await res.json())
  }

  throw new ModelCallError(`Unsupported generation model: ${model}`, { status: 400 })
}
