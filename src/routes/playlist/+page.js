import { env } from '$env/dynamic/public'

export function load({ fetch, params }) {
     const playlists = (env.BEETLE_PLAYLISTS !== undefined) ? env.BEETLE_PLAYLISTS.split(",").map(s => s.trim()) : ""
     return Promise.resolve({playlists: playlists})
 }
