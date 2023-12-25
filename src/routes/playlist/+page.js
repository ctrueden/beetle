import { env } from '$env/dynamic/public'

export async function load({ fetch, params }) {
  return fetch('/playlist')
    .then(r => r.json())
    .then(playlists => {return {playlists: playlists}})
 }
