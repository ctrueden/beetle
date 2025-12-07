export async function GET({ params }) {
  const API_URL = process.env.API_SERVER_URL
  
  if (!API_URL) {
    return new Response(JSON.stringify({ error: 'API_SERVER_URL not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  try {
    const [albumRes, itemRes] = await Promise.all([
      fetch(API_URL + '/album/query/' + params.slug),
      fetch(API_URL + '/item/query/' + params.slug)
    ])
    
    if (!albumRes.ok || !itemRes.ok) {
      return new Response(JSON.stringify({ error: 'Search failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const albumData = await albumRes.json()
    const itemData = await itemRes.json()
    
    return new Response(JSON.stringify({
      albums: albumData.results || [],
      items: itemData.results || [],
      query: params.slug
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
