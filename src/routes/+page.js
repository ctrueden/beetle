import { env } from '$env/dynamic/public'
import { error } from '@sveltejs/kit'

export function load({ fetch, params }) {
  const res = fetch(env.BEETLE_API + '/album/query/added-')
  return res.then(r => {
    if (r.status !== 200)
      throw error(500, 'fetch failure :/')
    return r.json()
  })
    .then(obj => {
      return {albums: obj.results }
    })
 }
