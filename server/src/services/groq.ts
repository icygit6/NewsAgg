import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateSummaryGroq(title: string, content: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    messages: [{
      role: 'user',
      content: `Summarize in 2-3 sentences: ${title}\n\n${content.slice(0, 2000)}`
    }],
    model: 'llama3-8b-8192',
    max_tokens: 150
  })
  return completion.choices[0]?.message?.content?.trim() || ''
}
