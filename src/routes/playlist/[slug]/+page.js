import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

export async function load({ fetch, params }) {
  const base = env.BEETLE_BASE || ''
  const url = base + `/api/playlist/${params.slug}`
  const res = await fetch(url)

  if (res.status === 404) {
    throw error(404, `Playlist not found: ${params.slug}`)
  }

  if (!res.ok) {
    throw error(res.status, `Failed to load playlist: ${res.statusText}`)
  }

  try {
    const data = await res.json()
    return {
      tracklist: data.results,
      name: params.slug
    }
  } catch (e) {
    throw error(500, `Failed to parse playlist data: ${e instanceof Error ? e.message : String(e)}`)
  }
}
