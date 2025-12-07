import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'


export async function load({ fetch, params }) {
  const base = env.BEETLE_BASE || ''
  const url = base + '/api/albums'
  const res = await fetch(url)
  if (res.status !== 200)
    throw error(500, 'fetch failure :/')
  return res.json()
    .then(obj => {
      return {albums: obj.results }
    })
}
