<script>
  export let items;
  import {getContext} from 'svelte'

const playlist = getContext('playlist')
let playlistName
playlist.name.subscribe((value)=>{ playlistName = value})
$: disabled = !playlistName

async function appendToPlaylist () {
  if (playlist) {
    const res = await fetch('/playlist/' + playlistName, {
      method: 'PUT',
      body: JSON.stringify(items.map(i => i.path))
    })
    if (res.status == 200)
      playlist.handleAppending()
    else
      throw new Error(res.status + " " +res.statusText)
  }
}
</script>

<button on:click="{appendToPlaylist}" disabled={disabled}>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
    <title>add to playlist</title>
    <path d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
</button>

<style>
  button path {
    transition: fill .2s ease;
    fill:white;
  }

  button:active path {
    fill:red;
  }
</style>
