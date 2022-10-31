<script>
 import Nav from '../components/Nav.svelte'
 import Player from '../components/Player.svelte'
 import Playlist from '../libs/playlist'
 import {setContext} from 'svelte';

 export let playlist = new Playlist()

 setContext('playlist', playlist)
</script>

<style>
 main {
     position: relative;
     max-width: 56em;
     background-color: white;
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

<Player playlist="{playlist}" />
