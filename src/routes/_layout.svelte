<script>
 import Nav from '../components/Nav.svelte'
 import Player from '../components/Player.svelte'
 import PlaylistUpdater from '../libs/playlistUpdater'
 import {setContext} from 'svelte';
 
 export let segment;

 setContext('playlistUpdater', new PlaylistUpdater())
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

<Nav {segment}/>

<main>
    <slot></slot>
</main>

<Player />
