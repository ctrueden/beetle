<script>
 
 import ControlerSet from './ControlerSet.svelte'
 import Item from './Item.svelte'

 export let tracklist
</script>

<div class="tracklist">
    {#each tracklist as item}
        <div class="track">
            <div class="first-wrapper">
                <div class="number">
                    {item.track}
                </div>
                <div class="controls-wrapper">
                    <ControlerSet items={[item]} add={false} like={false} after={false} />
                </div>
            </div>
            <div class="item-wrapper">
                <Item item="{item}"/>
            </div>
        </div>
    {/each}
</div>

<style>
 .track {
     display: flex;
     align-content: baseline;
     width: 100%;
     border-bottom: 1px solid gray;
 }

 .track:last-child {
     border-bottom: none;
 }

 .track .first-wrapper {
     display: flex;
     flex-basis: 2.2em;
     flex-grow: 0;
     flex-shrink: 0;
     align-items: stretch;
 }

 .track .controls-wrapper {
    display: flex;
    align-items: center;
 }

.track .number {
     display: flex;
     color: white;
     flex-grow: 1;
     background-color: black;
     font-weight: bold;
     align-items:  center;
     justify-content: center;
 }

 .track .number {
     display: none;
 }

 .track .item-wrapper {
     min-width: 0;
     flex-grow: 1;
 }

 .item-wrapper {
     padding: 0 .5em;
 }

 @media(hover: hover) {
   .track .controls-wrapper {
     display:none;
   }
  .track .number {
     display: flex;
 }
 .track:hover .number {
     display: none;
 }
 .track:hover .controls-wrapper {
     display: flex;
 }
}
</style>
