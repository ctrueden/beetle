import { env } from '$env/dynamic/public'
import { error } from '@sveltejs/kit'

export async function load({ fetch, params }) {
  const base = env.BEETLE_BASE || ''
  const url = base + `/api/item/${params.slug}`
  const res = await fetch(url)

  if (res.status === 404) {
    throw error(404, `Item not found (ID: ${params.slug})`)
  }

  if (!res.ok) {
    throw error(res.status, `Failed to load item: ${res.statusText}`)
  }

  try {
    const data = await res.json()
    return { item: data }
  } catch (e) {
    throw error(500, `Failed to parse item data: ${e instanceof Error ? e.message : String(e)}`)
  }
}
