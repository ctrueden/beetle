<script>
 import { env } from '$env/dynamic/public'
 import {onMount} from 'svelte'
 import Queue from './Queue.svelte'
 import Item from './Item.svelte'
 import PL from '../libs/playlist'
 import fileUrl from '../libs/file-url'
 import Mime from '../libs/audio-mime-type'
 export let queue


 let currentTime = 1
 let duration = 1
 $: percent = 100* (Math.round(currentTime) / duration) || 0
 let audioElt
 let openedQueue = false
 let isPlayerHidden = true
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

 const queueListener = function (queue) {
     isPlayerHidden = queue.length === 0
 }

 onMount(() => {
     queue.registerPlayStateListener(playStateListener)
     queue.registerPlaylistListener(queueListener)
     document.addEventListener('keydown', (event) => {
         // space
         if (event.keyCode === 32 && event.target.tagName !== 'INPUT') {
             event.preventDefault()
             handlePlay()
         }
     })
     initMediaSession()
     audioElt.ontimeupdate = () => { currentTime = audioElt.currentTime}

 })

 const togglePlay = function () {
     if (paused) {
         queue.pause(false)
     } else {
         queue.pause(true)
     }
 }

 const handlePlay = function(e) {
     togglePlay()
 }
 
 const handlePrevious = function(e) {
     // after playing 5 seconds, previous means go to the beginning
     if (currentTime > 5) {
         seekTo(0)
     } else
         queue.previous()
 }

 const handleNext = function(e) {
     queue.next()
 }

 const handleSeekTo = function(e) {
     seekTo(e.target.valueAsNumber)
 }

 function seekTo(value) {
     const wasPaused = audioElt.paused

     audioElt.pause()
     audioElt.currentTime = value
     if (!wasPaused)
         audioElt.play()
 }
 
 function setMediaSession(item) {
     if ('mediaSession' in navigator) {
         navigator.mediaSession.metadata = new MediaMetadata({
             title: item.title,
             artist: item.artist,
             album: item.album,
             artwork: [
                 { src: env.BEETLE_API_CLIENT + '/album/' + item.album_id + '/art',   sizes: '300x300',   type: 'image/jpeg' }
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

<div id="player" class="{(openedQueue) ? 'open' : ''} {(isPlayerHidden) ? 'hidden' : ''}">
    <div class="queue">
        <Queue queue="{queue}"  />
    </div>
    <div class="bar-wrapper" style="--seek-before-width : {percent}%">
        <input type="range" id="seeker"  value="{currentTime}" max="{duration}" on:input="{handleSeekTo}" />
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
                <button on:click="{handlePlay}" class="play">
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
        <div class="toggle-queue controls">
            <input type="checkbox" id="toggle-queue-control" bind:checked="{openedQueue}" />
            <label for="toggle-queue-control" class="control">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                    <title>queue</title>
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
    <audio on:ended="{handleNext}" bind:this="{audioElt}" bind:duration>
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

 #player.hidden {
     display: none;
 }

 .bar-wrapper {
     width: 100%;
     --seek-before-width: 0%;
 }
 
 #seeker {
     width: 100%;
     height: 1em;
     top: -.52em;
     background: none;
     -webkit-appearance: none;
     margin: 0;
     padding: 0;
     outline: none;
     position: absolute;
     cursor: pointer;
 }

 #seeker::-webkit-slider-runnable-track {
     width: 100%;
     height: .2em;
     cursor: pointer;
 }

 #seeker::before {
     position: absolute;
     content: "";
     left: 0;
     width: var(--seek-before-width);
     height: .2em;
     top: .4em;
     background-color: red;
     cursor: pointer;
 }

 #seeker::-webkit-slider-thumb {
     position: relative;
     -webkit-appearance: none;
     box-sizing: content-box;
     border: 1px solid white;
     height: 15px;
     width: 15px;
     border-radius: 50%;
     background-color: red;
     cursor: pointer;
     margin: -7px 0 0 0;
 }

 #seeker:active::-webkit-slider-thumb {
     transform: scale(1.2);
     background: red;
 }

 #seeker::-moz-range-progress {
     background-color: red;
 }

 #seeker::-moz-focus-outer {
     border: 0;
 }

 #seeker::-moz-range-thumb {
     box-sizing: content-box;
     border: 1px solid white;
     height: 15px;
     width: 15px;
     border-radius: 50%;
     background-color: red;
     cursor: pointer;
 }

 #seeker:active::-moz-range-thumb {
     transform: scale(1.2);
     background: red;
 }


 #seeker::-ms-fill-lower {
     background-color: red;
 }

 #seeker::-ms-thumb {
     box-sizing: content-box;
     border: 1px solid white;
     height: 15px;
     width: 15px;
     border-radius: 50%;
     background-color: red;
     cursor: pointer;
 }

 #seeker:active::-ms-thumb {
     transform: scale(1.2);
     background: red;
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
     min-width:0;
     flex-basis: 33%;
     height: initial;
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

 .toggle-queue.controls {
     justify-content: flex-end;
 }
 
 .toggle-queue input {
     display:none;
 }

 .toggle-queue input:checked ~ label svg {
     stroke: red;
 }

 
 #player.open .queue {
     display: block;
 }
 
 .queue {
     display: none;
     width: 100%;
     max-width: 30em;
     overflow: auto;
 }

</style>
