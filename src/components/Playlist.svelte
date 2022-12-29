<script>
 import {onMount} from 'svelte'
 import Item from './Item.svelte'
 import RandomItem from '../libs/random-item'
 export let playlist
 let queue = []
 let autoplay = true
 let autoplaySimilar = true
 let autoplayRange = 5
 let autoplaySim = 15
 let currentId
 let randomItem

 const playStateListener = function (state) {
     currentId = (state.current) ? state.current.songid : undefined
     checkAutoplayState()
 }

 const playlistListener = function(q) {
     queue = q
     checkAutoplayState()
 }

 const checkAutoplayState = function() {
     // if we are playing the last song of the playlist
     if(autoplay && currentId == queue[queue.length - 1].songid) {
         let promise
         if (autoplaySimilar)
             promise = randomItem.getSimilarOne(queue.map(pos => pos.item), autoplayRange, autoplaySim/100)
         else
             promise = randomItem.getOne()
         promise.then(item => {
             if (item)
                 playlist.add(item)
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
                   playlist.registerPlaylistListener(playlistListener)
                   playlist.registerPlayStateListener(playStateListener)
               })
               .catch(console.log)
 })
 
 const handleRemove = function(event) {
     // prevent to trigger handleClick for playing !
     event.stopPropagation()
     const songid = parseInt(event.currentTarget.dataset.songid)
     playlist.deleteid(songid)
 }

 const handleClick = function(event) {
     const songid = parseInt(event.currentTarget.dataset.songid)
     playlist.playid(songid)
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
</script>

<div class="playlist-list">
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

    </div>
    {#each queue as obj, index}
        <div class="row {(currentId === obj.songid) ? 'playing' : ''}" data-songid="{obj.songid}" on:click="{handleClick}">
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
        </div>
    {/each}
</div>

<style>
 .row {
     display: flex;
     position: relative;
     padding: .5em 1em;
     border-bottom: 1px solid white;
 }

 .row:last-child {
     border-bottom: none;
 }

 .row:hover {
     background-color: gray;
     color: black;
 }

 .row.playing {
     background-color: white;
     color: black;
 }

 .row .state {
     width: .5em;
 }

 .row .remove {
     display: flex;
     justify-content: center;
     width: 2.2em;
     align-items: center;
     margin-left: 1em;
     text-align: right;
 }
 
 .row .item {
     flex-grow: 1;
 }

 svg {
     stroke: white;
 }

 .playing svg {
     stroke: black;
 }
 #autoplay-range {
     width: 3em;
 }
</style>
