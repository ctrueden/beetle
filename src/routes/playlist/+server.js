import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public'
import fs from 'fs'

export async function POST({request, cookies}) {
  const item = await request.json();

  return json({}, {status: 201})
}

export async function GET ({fetch, request}) {

  let playlists = (env.BEETLE_PLAYLISTS !== undefined) ? env.BEETLE_PLAYLISTS.split(",").map(s => s.trim()) : []
  playlists = (env.BEETLE_PLAYLISTS_DIR !== undefined) ? fs.readdirSync(env.BEETLE_PLAYLISTS_DIR).filter(f => f.endsWith('.m3u')).map(f => f.substring(0, f.length - 4)) : playlists
  return json(playlists, {status: 200})
}
