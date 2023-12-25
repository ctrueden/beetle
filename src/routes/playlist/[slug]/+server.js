import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public'
import fs from 'fs'
import path from 'path'

export async function PUT({request, cookies, params}) {
  if (env.BEETLE_PLAYLISTS_DIR !== undefined){
    const dir = env.BEETLE_PLAYLISTS_DIR;
    const file = params.slug + '.m3u'
    const filePath = path.join(dir, file)
    const itemPaths = await request.json();

    fs.appendFileSync(filePath, itemPaths.map(getItemRelativePath).join('\n') + '\n')
  }
    return json({}, {status: 200})
}

export async function POST({request, cookies, params}) {
  if (env.BEETLE_PLAYLISTS_DIR !== undefined){
    const dir = env.BEETLE_PLAYLISTS_DIR;
    const file = params.slug + '.m3u'
    const filePath = path.join(dir, file)
    const itemPaths = await request.json();

    fs.writeFileSync(filePath, itemPaths.map(getItemRelativePath).join('\n') + '\n')
  }
    return json({}, {status: 200})
}

function getItemRelativePath(p) {
  return p.replace(env.BEETLE_FILES_DIR, "").replace(/^\//, "")
}

export async function GET ({fetch, request}) {

  let playlists = (env.BEETLE_PLAYLISTS !== undefined) ? env.BEETLE_PLAYLISTS.split(",").map(s => s.trim()) : []
  playlists = (env.BEETLE_PLAYLISTS_DIR !== undefined) ? fs.readdirSync(env.BEETLE_PLAYLISTS_DIR).filter(f => f.endsWith('.m3u')).map(f => f.substring(0, f.length - 4)) : playlists
  return json(playlists, {status: 200})
}

