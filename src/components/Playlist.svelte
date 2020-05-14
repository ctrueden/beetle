<script>
 import Item from './Item.svelte'
 export let playlist = []
 export let currentIndex

 const handleRemove = function(event) {
     const index = event.currentTarget.dataset.index
     playlist.splice(index, 1)
     playlist = playlist
 }
 
</script>

{#each playlist as item, index}
    <div class="row {(index === currentIndex) ? 'playing' : ''}" >
        <div class="state">
        </div>
        <div class="item">
            <Item item="{item}" />
        </div>
        <div class="remove">
            <input on:click="{handleRemove}" data-index="{index}" type="button" value="x" />
        </div>
    </div>
{/each}

<style>
 .row {
     display: flex;
     position: relative;
     padding: .5em 1em;
     border-bottom: 1px solid 
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
