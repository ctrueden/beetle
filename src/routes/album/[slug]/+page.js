import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

export async function load({ fetch, params }) {
  const base = env.BEETLE_BASE || ''
  const url = base + `/api/album/${params.slug}`
  const res = await fetch(url)

  if (res.status === 404) {
    throw error(404, `Album not found (ID: ${params.slug})`)
  }
  
  if (!res.ok) {
    throw error(res.status, `Failed to load album: ${res.statusText}`)
  }

  try {
    const data = await res.json()
    return { album: data }
  } catch (e) {
    throw error(500, `Failed to parse album data: ${e instanceof Error ? e.message : String(e)}`)
  }
}
