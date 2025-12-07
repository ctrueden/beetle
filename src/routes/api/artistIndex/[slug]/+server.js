export async function GET({ params }) {
  const API_URL = process.env.API_SERVER_URL
  
  if (!API_URL) {
    return new Response(JSON.stringify({ error: 'API_SERVER_URL not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  const selectionName = params.slug[0].toUpperCase()
  const selections = {
    "#": "[^A-Z]"
  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")
  for (const letter of alphabet) {
    selections[letter.toUpperCase()] = '(' + letter + '|' + letter.toUpperCase() + ')'
  }
  
  const url = API_URL + '/album/query/albumartist_sort::^' + selections[selectionName]
  
  try {
    const res = await fetch(url)
    
    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Error querying artists: ${res.status}` }), {
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
