console.error('[DEBUG] /api/albums/+server.js loaded at module level')

export async function GET() {
  const API_URL = process.env.API_SERVER_URL
  
  if (!API_URL) {
    return new Response(JSON.stringify({ error: 'API_SERVER_URL not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  const url = API_URL + '/album/query/added-'
  
  try {
    const res = await fetch(url)
    
    if (!res.ok) {
      const text = await res.text()
      return new Response(JSON.stringify({ error: `API returned ${res.status}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

