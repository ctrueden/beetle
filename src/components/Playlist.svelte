<script>
 import {onMount} from 'svelte'
 import Item from './Item.svelte'
 export let playlist
 let queue = []
 let currentId

 const playStateListener = function (state) {
     currentId = (state.current) ? state.current.songid : undefined
 }

 const playlistListener = function(q) {
     queue = q
 }

 onMount(() => {
     playlist.registerPlaylistListener(playlistListener)
     playlist.registerPlayStateListener(playStateListener)
 })
 
 const handleRemove = function(event) {
     const songid = parseInt(event.currentTarget.dataset.songid)
     playlist.deleteid(songid)
 }

 const handleClick = function(event) {
     const songid = parseInt(event.currentTarget.dataset.songid)
     playlist.playid(songid)
 }
 
</script>

{#each queue as obj, index}
    <div class="row {(currentId === obj.songid) ? 'playing' : ''}" data-songid="{obj.songid}" on:click="{handleClick}">
        <div class="state">
        </div>
        <div class="item">
            <Item item="{obj.item}" itemLink=""/>
        </div>
        <div class="remove">
            <input on:click="{handleRemove}" data-songid="{obj.songid}" type="button" value="x" />
        </div>
    </div>
{/each}

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
     align-items: center;
     margin-left: 1em;
     text-align: right;
 }
 .row .item {
     flex-grow: 1;
 }
</style>
