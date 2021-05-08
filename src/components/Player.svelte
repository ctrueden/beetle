<script>
 import {getContext, onMount} from 'svelte'
 import Playlist from './Playlist.svelte'
 import Item from './Item.svelte'
 import PL from '../libs/playlist'
 import fileUrl from '../libs/file-url'
 import Mime from '../libs/audio-mime-type'
 export let playlist


 let currentTime
 let duration
 $: percent = 100* (currentTime/duration)
 let audioElt
 let openedPlaylist = false
 let paused = true
 let playingItem = undefined
 let songid = undefined

 const playStateListener = function (state) {
     if (state.current) {

         playingItem = state.current.item
         setMediaSession(playingItem)

         if (state.current.songid !== songid) {
             audioElt.currentTime = 0
             audioElt.load()
         }
         songid = state.current.songid
     } else {
         audioElt.currentTime = 0
         audioElt.pause()
         currentTime = NaN
         playingItem = undefined
         songid = undefined
     }

     paused = state.paused

     if (paused) {
         audioElt.pause()
     } else {
         audioElt.play()
     }
 } 

 onMount(() => {
     playlist.registerPlayStateListener(playStateListener)
     initMediaSession()
 })

 const togglePlay = function () {
     if (paused) {
         playlist.pause(false)
     } else {
         playlist.pause(true)
     }
 }

 const handlePlay = function(e) {
     togglePlay()
 }
 
 const handlePrevious = function(e) {
     playlist.previous()
 }

 const handleNext = function(e) {
     playlist.next()
 }

 function setMediaSession(item) {
     if ('mediaSession' in navigator) {
         navigator.mediaSession.metadata = new MediaMetadata({
             title: item.title,
             artist: item.artist,
             album: item.album,
             artwork: [
                 { src: process.env.BEETLE_API + '/album/' + item.album_id + '/art',   sizes: '300x300',   type: 'image/jpeg' }
             ]
         });
     }
 }

 function initMediaSession() {
     if ('mediaSession' in navigator) {
         navigator.mediaSession.setActionHandler('play', handlePlay);
         navigator.mediaSession.setActionHandler('pause', handlePlay);
         navigator.mediaSession.setActionHandler('previoustrack', handlePrevious);
         navigator.mediaSession.setActionHandler('nexttrack', handleNext);
     }
 }
</script>

<div id="player" class="{(openedPlaylist) ? 'open' : ''}">
    <div class="playlist">
        <Playlist playlist="{playlist}"  />
    </div>
    <div class="bar-wrapper">
        <div class="bar" style="width: {percent}%">
        </div>
    </div>
    <div class="bottom">
        <div class="current controls">
            {#if playingItem}
                <Item item="{playingItem}" albumDisplayed="true}" durationDisplayed="{false}" />
            {/if}
        </div>
        <div class="controls">
            <div class="control">
                <button on:click="{handlePrevious}">
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                        <title>previous</title>
                        <path d='M400,111V401c0,17.44-17,28.52-31,20.16L121.09,272.79c-12.12-7.25-12.12-26.33,0-33.58L369,90.84C383,82.48,400,93.56,400,111Z' style='fill:none;stroke-miterlimit:10;stroke-width:32px'/><line x1='112' y1='80' x2='112' y2='432' style='fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px'/></svg>
                </button>
            </div>
            <div class="control">
                <button on:click="{handlePlay}">
                    {#if paused}
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                            <title>play</title>
                            <path d='M112,111V401c0,17.44,17,28.52,31,20.16l247.9-148.37c12.12-7.25,12.12-26.33,0-33.58L143,90.84C129,82.48,112,93.56,112,111Z' style='fill:none;stroke-miterlimit:10;stroke-width:32px'/>
                        </svg>
                    {:else}
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                            <title>pause</title>
                            <rect x='176' y='96' width='16' height='320' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/>
                            <rect x='320' y='96' width='16' height='320' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/>
                        </svg>

                    {/if}
                </button>
            </div>
            <div class="control">
                <button on:click="{handleNext}">
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                        <title>next</title>
                        <path d='M112,111V401c0,17.44,17,28.52,31,20.16l247.9-148.37c12.12-7.25,12.12-26.33,0-33.58L143,90.84C129,82.48,112,93.56,112,111Z' style='fill:none;stroke-miterlimit:10;stroke-width:32px'/><line x1='400' y1='80' x2='400' y2='432' style='fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px'/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="toggle-playlist controls">
            <input type="checkbox" id="toggle-playlist-control" bind:checked="{openedPlaylist}" />
            <label for="toggle-playlist-control" class="control">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                    <title>playlist</title>
                    <line x1='160' y1='144' x2='448' y2='144' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/>
                    <line x1='160' y1='256' x2='448' y2='256' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/>
                    <line x1='160' y1='368' x2='448' y2='368' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/>
                    <circle cx='80' cy='144' r='16' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/>
                    <circle cx='80' cy='256' r='16' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/>
                    <circle cx='80' cy='368' r='16' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/>
                </svg>
            </label>
        </div>
    </div>
    <audio on:ended="{handleNext}" bind:this="{audioElt}" bind:currentTime bind:duration>
        {#if playingItem}
            <source src="{fileUrl(playingItem)}" type="{Mime(playingItem.format)}">
        {/if}
    </audio>
</div>

<style>

 
 
 #player {
     display: flex;
     flex-direction: column;
     justify-content: flex-end;
     align-items: center;
     width: 100%;
     position: fixed;
     bottom: 0;
     color: white;
     background-color: black;
 }
 
 #player.open {
     top:0;
 }

 .bar-wrapper {
     width: 100%;
 }
 
 .bar {
     background-color: red;
     height: .2em;
 }

 .bottom {
     display: flex;
     flex-direction: row;
     justify-content: space-around;
     flex-basis: 5em;
     flex-shrink: 0;
     flex-grow: 0;
     width: 100%;
     padding: .3em;
 }
 
 .controls {
     display: flex;
     justify-content: space-around;
     align-items: center;
     flex-basis: 33%;
 }

 .control {
     display: flex;
     align-items: center;
     justify-content: space-between;
     fill: black;
     width: 2.2em;
     cursor: pointer;
 }

 .control button {
     border: none;
     background-color: inherit;
 }
 
 .control svg {
     width: 100%;
     stroke: white;
 }

 .toggle-playlist.controls {
     justify-content: flex-end;
 }
 
 .toggle-playlist input {
     display:none;
 }

 .toggle-playlist input:checked ~ label svg {
     stroke: red;
 }

 
 #player.open .playlist {
     display: block;
 }
 
 .playlist {
     display: none;
     width: 100%;
     max-width: 30em;
     overflow: auto;
 }

</style>
