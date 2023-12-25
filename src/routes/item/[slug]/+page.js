import { env } from '$env/dynamic/public'
import { error } from '@sveltejs/kit'

export async function load({ fetch, params }) {
  // the `slug` parameter is available because
  // this file is called [slug].svelte
  let url = env.BEETLE_API + `/item/${params.slug}`
  const res = await fetch(url)

  const data = await res.json()
  if (res.status === 200) {
    return { item: data }
  } else {
    error(res.status, data.message)
  }
}
