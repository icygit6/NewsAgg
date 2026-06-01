import { Router, Request, Response } from 'express'

// Uses Node's built-in global fetch (Node 18+). CLAUDE.md imported node-fetch
// v3, but that package is ESM-only and breaks under this CommonJS build.

export const quotesRouter = Router()

quotesRouter.get('/random', async (_req: Request, res: Response) => {
  try {
    const response = await fetch('https://favqs.com/api/qotd', {
      headers: { Authorization: `Token token="${process.env.FAVQS_API_KEY}"` }
    })
    const data = await response.json() as any
    res.json({
      success: true,
      data: {
        quote: data.quote?.body || '',
        author: data.quote?.author || 'Unknown'
      }
    })
  } catch {
    res.json({ success: false, data: { quote: '', author: '' } })
  }
})
