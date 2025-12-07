export async function GET({ params }) {
  const API_URL = process.env.API_SERVER_URL
  
  if (!API_URL) {
    return new Response(JSON.stringify({ error: 'API_SERVER_URL not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  const url = API_URL + `/album/query/genre:${params.slug}`
  
  try {
    const res = await fetch(url)
    
    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Genre not found: ${params.slug}` }), {
        status: res.status,
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
