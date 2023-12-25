<script>
 import Nav from '../components/Nav.svelte'
 import Player from '../components/Player.svelte'
 import Playlist from '../libs/playlist'
 import {setContext} from 'svelte'
 import { writable } from 'svelte/store'

 export let playlist = new Playlist()

 setContext('queue', playlist)

 const playlistContext = {
    name: writable('')
 }
 setContext('playlist', playlistContext)
</script>

<style>
 main {
     max-width: 56em;
      padding: 2em;
     margin: 0 auto;
     box-sizing: border-box;
     margin-bottom: 5em;
 }
</style>

<Nav />

<main>
    <slot></slot>
</main>

<Player queue="{playlist}" />
