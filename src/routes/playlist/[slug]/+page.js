import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

export async function load({ fetch, params }) {
  // the `slug` parameter is available because
  // this file is called [slug].svelte
  const url = env.BEETLE_API + `/item/query/playlist:${params.slug}`
  const res = await fetch(url)

  const data = await res.json()
  if (res.status === 200) {
    return {
      tracklist: data.results,
      name: params.slug
    };
  } else {
    error(res.status, data.message)
  }
}
