import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

export async function load({ fetch, params }) {
  const res = await fetch(env.BEETLE_API + `/album/${params.slug}?expand`)

  const data = await res.json()
  if (res.status === 200) {
    return { album: data }
  } else {
    error(res.status, data.message)
  }
}
