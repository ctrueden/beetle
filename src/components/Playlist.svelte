<script>
 import {onMount} from 'svelte'
 import Item from './Item.svelte'
 import RandomItem from '../libs/random-item'
 export let playlist
 let queue = []
 let autoplay = true
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
         randomItem.getOne()
                   .then(item => {
                       playlist.add(item)
                   })
                   .catch(e => console.log(e))
     }
 }
 
 onMount(() => {
     autoplay = (localStorage.getItem('autoplay') != null) ? localStorage.getItem('autoplay') != 'false' : true
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
 
</script>

<div class="playlist-list">
    <div class="controllers">
        <label for="autoplay">
            Autoplay
        </label>
        <input type="checkbox" id="autoplay" value="Autoplay" bind:checked="{autoplay}" on:change="{handleAutoplay}" />
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
</style>
