import { env } from '$env/dynamic/public'

export function load({ fetch, params }) {
  const base = env.BEETLE_BASE || ''
  const url = base + `/api/search/${params.slug}`

  return fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    })
    .then(answers => {
      return {
        albums: answers.albums,
        items: answers.items,
        query: params.slug
      }
    })
}
