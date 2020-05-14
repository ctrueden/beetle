<script>
 import { getContext } from 'svelte';

 export let items;
 export let forcePlay = false;

 const playlistUpdater = getContext('playlistUpdater')

 //setTimeout(() => {playlistUpdater.insert(items)}, 100)
 const handleClick = function(e) {
     playlistUpdater.insert(items)
 }
</script>


<button on:click="{handleClick}">
    play
</button>

