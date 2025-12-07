import { env } from '$env/dynamic/public'

export function load({ fetch, params }) {
  const base = env.BEETLE_BASE || ''
  const url = base + `/api/artistIndex/${params.slug}`
  
  return fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    })
    .then(albums => {
      return {
        albums: albums.results,
        selectionName: params.slug[0].toUpperCase()
      }
    })
}
