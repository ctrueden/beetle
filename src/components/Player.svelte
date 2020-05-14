<script>
 import {getContext, onMount} from 'svelte';
 import Playlist from './Playlist.svelte';
 export let playlist = []

 let playlistUpdater = getContext('playlistUpdater')

 let currentIndex = 0
 let currentTime
 let duration
 $: percent = 100* (currentTime/duration)
 let audioElt
 let openedPlaylist = false

 const insert = function(items) {
     for(let item of items) {
         playlist.push(item)
     }
     // force update
     playlist = playlist
     audioElt.play()
 }


 onMount(() => {
     playlistUpdater.register(insert)
 })
 
 const togglePlay = function (e) {
     if (audioElt.paused) {
         audioElt.play()
     } else {
         audioElt.pause()
     }
 }

 const handlePrevious = function(e) {
     if (currentIndex > 0) {
         audioElt.pause()
         currentIndex --
         audioElt.load()
         audioElt.play()
     }
 }

 const handleNext = function(e) {
     if (currentIndex + 1 < playlist.length) {
         audioElt.pause()
         currentIndex ++
         audioElt.load()
         audioElt.play()

     }
 }
 
</script>

<div id="player" class="{(openedPlaylist) ? 'open' : ''}">
    <div class="playlist">
        <Playlist playlist="{playlist}" currentIndex="{currentIndex}" />
    </div>
    <div class="bar" style="width: {percent}%">
    </div>
    <div class="bottom">
        <div class="current">
        </div>
        <div class="controls">
            <div class="control">
                <input type="button" value="prev" on:click="{handlePrevious}" />
            </div>
            <div class="control">
                <input  type="button" value="play" on:click="{togglePlay}" />
            </div>
            <div class="control">
                <input type="button" value="next" on:click="{handleNext}" />
            </div>
        </div>
        <div class="toggle-playlist">
            <input type="checkbox" bind:checked="{openedPlaylist}" />
        </div>
    </div>
    <audio on:ended="{handleNext}" bind:this="{audioElt}" bind:currentTime bind:duration>
        {#if playlist[currentIndex]}
            <source src="https://k7.buron.coffee/api/item/{playlist[currentIndex].id}/file">
        {/if}
    </audio>
</div>

<style>
 .hidden {
     display: none;
 }
 
 #player {
     display: flex;
     flex-direction: column;
     justify-content: flex-end;
     width: 100%;
     position: fixed;
     bottom: 0;
     color: white;
     background-color: black;
 }

 #player.open {
     top:0;
 }
 
 .bar {
     background-color: red;
     height: .2em;
 }

 .bottom {
     display: flex;
     justify-content: space-around;
     height: 5em;
 }
 
 .controls {
     display: flex;
 }

 #player.open .playlist {
     display: block;
 }
 
 .playlist {
     display: none;
     margin: auto;
     width: 100%;
     max-width: 30em;
     overflow: auto;
 }
</style>
