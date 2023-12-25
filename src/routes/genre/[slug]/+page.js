 import { env } from '$env/dynamic/public'

export async function load({ fetch, params }) {
  // the `slug` parameter is available because
  // this file is called [slug].svelte
  return fetch(env.BEETLE_API + `/album/query/genre:${params.slug}`)
    .then(r => r.json()).then(res => {
      return {
        genre: params.slug,
        albums: res.results
      }
    })
}
