 import { env } from '$env/dynamic/public'

export async function load({ fetch, params }) {
  const base = env.BEETLE_BASE || ''
  const url = base + `/api/genre/${params.slug}`
  const res = await fetch(url)
  
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  
  const data = await res.json()
  return {
    genre: params.slug,
    albums: data.results
  }
}
