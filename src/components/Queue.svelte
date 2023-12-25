<script>
 import {onMount} from 'svelte'
 import Item from './Item.svelte'
 import RandomItem from '../libs/random-item'
 import Drag from '../libs/drag-to-reorder'
 import {getContext} from 'svelte'
 export let queue
 const playlist = getContext('playlist')
 let playlistName
 playlist.name.subscribe((value)=>{ playlistName = value})
$: tracklist = []
 let autoplay = true
 let autoplaySimilar = true
 let autoplayRange = 5
 let autoplaySim = 15
 let currentId
 let randomItem
 let listContainer

 const playStateListener = function (state) {
     currentId = (state.current) ? state.current.songid : undefined
     checkAutoplayState()
 }

 const queueListener = function(q) {
   tracklist = q
   checkAutoplayState()
 }

 const checkAutoplayState = function() {
     // if we are playing the last song of the queue
     if(autoplay && currentId == tracklist[tracklist.length - 1].songid) {
         let promise
         if (autoplaySimilar)
             promise = randomItem.getSimilarOne(tracklist.map(pos => pos.item), autoplayRange, autoplaySim/100)
         else
             promise = randomItem.getOne()
         promise.then(item => {
             if (item)
                 queue.add(item)
         }).catch(e => console.log(e))
     }
 }
 
 onMount(() => {
     autoplay = (localStorage.getItem('autoplay') != null) ? localStorage.getItem('autoplay') != 'false' : true
     autoplaySimilar = (localStorage.getItem('autoplaySimilar') != null) ? localStorage.getItem('autoplaySimilar') != 'false' : true
     const parsedAutoplayRange = parseInt(localStorage.getItem('autoplayRange'))
     autoplayRange = (parsedAutoplayRange) ? parsedAutoplayRange : autoplayRange
     const parsedAutoplaySim = parseInt(localStorage.getItem('autoplaySim'))
     autoplaySim = (parsedAutoplaySim) ? parsedAutoplaySim : autoplaySim
     RandomItem.create()
               .then(ri => {
                   randomItem = ri
                   queue.registerPlaylistListener(queueListener)
                   queue.registerPlayStateListener(playStateListener)
               })
     .catch(console.log)
   Drag(listContainer, (oldIndex, newIndex) => {
     console.log(oldIndex, newIndex)
     const obj = queue.delete(oldIndex)
     queue.add(obj.item, newIndex)
   })
 })
 
 const handleRemove = function(event) {
     // prevent to trigger handleClick for playing !
     event.stopPropagation()
     const songid = parseInt(event.currentTarget.dataset.songid)
     queue.deleteid(songid)
 }

 const handleClick = function(event) {
     const songid = parseInt(event.currentTarget.dataset.songid)
     queue.playid(songid)
 }

 const handleAutoplay = function() {
     checkAutoplayState()
     localStorage.setItem('autoplay', autoplay)
 }

 const handleAutoplaySimilar = function() {
     localStorage.setItem('autoplaySimilar', autoplaySimilar)
 }

 const handleAutoplayRange = function() {
     localStorage.setItem('autoplayRange', autoplayRange)
 }

 const handleAutoplaySim = function() {
     localStorage.setItem('autoplaySim', autoplaySim)
 }

async function saveAsPlaylist () {
  if (window.confirm('Are sure to replace the playlist ' + playlistName + ' with the current queue ?')) {
    const res = await fetch('/playlist/' + playlistName, {
      method: 'POST',
      body: JSON.stringify(tracklist.map(o => o.item.path))
    })
    const json = await res.json()
    const result = JSON.stringify(json)
  }
}
</script>

<div class="queue-list js-list list" bind:this={listContainer}>
    <div class="controllers">
        <input type="checkbox" id="autoplay" value="Autoplay" bind:checked="{autoplay}" on:change="{handleAutoplay}" />
        <label for="autoplay">
            Autoplay
        </label>
        <input type="checkbox" id="autoplay-similar" value="Autoplay similar" bind:checked="{autoplaySimilar}" on:change="{handleAutoplaySimilar}" />
        <label for="autoplay-similar">
            tracks with genres similar to the
        </label>
        <input type="number" id="autoplay-range" bind:value="{autoplayRange}" on:change="{handleAutoplayRange}" min="1" />
        <label for="autoplay-similar">
            last played
        </label>
        <input type="range" id="autoplay-sim" bind:value="{autoplaySim}" on:change="{handleAutoplaySim}" min="0" max="40" />
        <label for="autoplay-sim">
            with this similarity (from low to high)
        </label>
        <div class="controls">
          <div class="control">
            <button on:click={saveAsPlaylist} disabled={!playlistName}>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' style="fill: currentColor">
                <title>save as playlist</title>
                <path d="M352.92 64c-48.09 0-80 29.54-96.92 51-16.88-21.49-48.83-51-96.92-51C98.46 64 48.63 114.54 48 176.65c-.54 54.21 18.63 104.27 58.61 153 18.77 22.88 52.8 59.46 131.39 112.81a31.84 31.84 0 0036 0c78.59-53.35 112.62-89.93 131.39-112.81 40-48.74 59.15-98.8 58.61-153C463.37 114.54 413.54 64 352.92 64zM256 416V207.58c0-19.63 5.23-38.76 14.21-56.22a1.19 1.19 0 01.08-.16 123 123 0 0121.77-28.51C310.19 105 330.66 96 352.92 96c43.15 0 78.62 36.32 79.07 81C433 281.61 343.63 356.51 256 416z"></path>
              </svg>
            </button>
          </div>
        </div>
    </div>
  {#each tracklist as obj, index (obj.songid)}
        <div class="list__item is-idle js-item {(currentId === obj.songid) ? 'playing' : ''}" data-songid="{obj.songid}" on:click="{handleClick}">
            <div class="state">
            </div>
            <div class="item">
                <Item item="{obj.item}" disabledLink="{true}"/>
            </div>
            <div class="remove">
                <button on:click="{handleRemove}" data-songid="{obj.songid}" >
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                        <title>ionicons-v5-e</title>
                        <path d='M448,256c0-106-86-192-192-192S64,150,64,256s86,192,192,192S448,362,448,256Z' style='fill:none;stroke-miterlimit:10;stroke-width:32px'/>
                        <line x1='336' y1='256' x2='176' y2='256' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/>
                    </svg>
                </button>
            </div>
            <div class="drag-handle js-drag-handle"></div>
        </div>
    {/each}
</div>

<style>
.controllers {
    position: fixed;
    top: 1px;
    padding: .25em;
    max-width: 30em;
    background-color: black;
    color: white;
    z-index: 1;
    max-height: 7em;
}

 .list__item {
     display: flex;
     cursor: pointer;
     position: relative;
     padding: .5em 1em;
     border-bottom: 1px solid white;
 }

.queue-list .list__item:nth-child(2) {
   margin-top: 7em;
}

 .list__item:last-child {
     border-bottom: none;
 }

 .list__item:hover {
     background-color: gray;
     color: black;
 }

 .list__item.playing {
     background-color: white;
     color: black;
 }

 .list__item .state {
     width: .5em;
 }

 .list__item .remove {
     display: flex;
     justify-content: center;
     width: 2.2em;
     align-items: center;
     margin-left: 1em;
     margin-right: 1em;
     text-align: right;
 }
 
 .list__item .item {
     display: flex;
     flex-grow: 1;
     min-width:0;
 }

 .playing svg {
     stroke: black;
 }

#autoplay-range {
     width: 3em;
}

.drag-handle {
  position: absolute;
  right: 0;
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drag-handle::after {
  content: '⠿';
  font-size: 25px;
}

.list__item.is-idle .drag-handle {
  cursor: grab;
}

.list__item.is-idle {
  transition: 0.25s ease transform;
}

.list__item.is-draggable .drag-handle {
  cursor: grabbing;
}

svg{
 color: white;
}
</style>
