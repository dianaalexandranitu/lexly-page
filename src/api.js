export async function generateDocuments(answers) {
  const [batch1, batch2] = await Promise.all([
    callAPI(buildPrompt1(answers)),
    callAPI(buildPrompt2(answers)),
  ])

  const docs1 = parseDocuments(batch1)
  const docs2 = parseDocuments(batch2)

  return {
    documents: [...(docs1.documents || []), ...(docs2.documents || [])],
    alerts: [...(docs1.alerts || []), ...(docs2.alerts || [])],
    summary: docs1.summary || docs2.summary || '',
  }
}

async function callAPI(prompt) {
  const response = await fetch('/.netlify/functions/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || ''
}

function profile(a) {
  return `- Company: ${a.company_name || '[Company Name]'} (${a.legal_form || 'BV'}), KVK: ${a.kvk_number || 'TBD'}, ${a.city || 'Amsterdam'}
- Contact: ${a.email || '[email]'}
- Business: ${a.business_type || 'SaaS'}, Customers: ${a.customer_type || 'B2B'}
- Online sales: ${a.sells_online}, Subscription: ${a.subscription}, Reach: ${a.operates_in_eu}
- Personal data: ${a.collects_personal_data}, Types: ${(a.data_types || []).join('; ') || 'none'}
- Legal basis: ${(a.legal_basis || []).join('; ') || 'none'}
- Processors: ${a.processors_list || 'none'}, Data outside EU: ${a.data_outside_eu}
- Cookies: ${a.uses_cookies}
- AI: ${a.uses_ai}, Functions: ${(a.ai_type || []).join('; ') || 'none'}, Automated decisions: ${a.ai_makes_decisions || 'N/A'}
- IP: ${(a.ip_type || []).join('; ') || 'none'}, User content: ${a.user_generated_content}
- Liability cap: ${a.liability_cap}`
}

function buildPrompt1(a) {
  return `You are a Dutch legal expert. Generate TWO legal documents for this Dutch startup. Return ONLY valid JSON, no other text, no markdown.

BUSINESS PROFILE:
${profile(a)}

Return exactly this structure. Use 5-7 sections per document. legal_text must be real usable legal text. why must be 1-2 plain English sentences. No line breaks inside string values. No unescaped apostrophes.

{"documents":[{"id":"terms","title":"General Terms and Conditions","subtitle":"Algemene Voorwaarden","applicable_law":["Dutch Civil Code Art. 6:231","EU Consumer Rights Directive"],"sections":[{"id":"s1","title":"Applicability","legal_text":"...","why":"...","flag":null}]},{"id":"privacy","title":"Privacy Policy","subtitle":"Privacybeleid","applicable_law":["GDPR","Uitvoeringswet AVG"],"sections":[{"id":"p1","title":"Who we are","legal_text":"...","why":"...","flag":null}]}],"alerts":[{"severity":"warning","title":"...","message":"..."}],"summary":"2 sentence summary."}`
}

function buildPrompt2(a) {
  const includeAI = a.uses_ai === 'Yes'
  return `You are a Dutch legal expert. Generate TWO legal documents for this Dutch startup. Return ONLY valid JSON, no other text, no markdown.

BUSINESS PROFILE:
${profile(a)}

Return exactly this structure. Use 4-6 sections per document. legal_text must be real usable legal text. why must be 1-2 plain English sentences. No line breaks inside string values. No unescaped apostrophes.

{"documents":[{"id":"cookies","title":"Cookie Policy","subtitle":"Cookiebeleid","applicable_law":["ePrivacy Directive","GDPR"],"sections":[{"id":"c1","title":"What are cookies","legal_text":"...","why":"...","flag":null}]},{"id":"ai_obligations","title":"AI Compliance Note","subtitle":"EU AI Act obligations","applicable_law":["EU AI Act 2024/1689"],"sections":[{"id":"a1","title":"Risk classification","legal_text":"...","why":"...","flag":${includeAI ? '"ai-act"' : 'null'}}]}],"alerts":[],"summary":""}

Additional rules:
- Cookies: distinguish essential vs non-essential, include Dutch consent requirements
- ${includeAI ? `AI: classify their system under EU AI Act based on: ${(a.ai_type || []).join(', ')}. Include Article 50 transparency obligations if user-facing.` : 'AI section: briefly state no AI Act obligations apply.'}`
}

function parseDocuments(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch (e) {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) } catch (e2) {
        throw new Error('Document generation produced invalid output. Please try again.')
      }
    }
    throw new Error('Could not parse generated documents. Please try again.')
  }
}
