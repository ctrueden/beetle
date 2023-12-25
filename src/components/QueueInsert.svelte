<script>
 import { getContext } from 'svelte';

 export let items;
 export let forcePlay = false;

 const queue = getContext('queue')

 const handleClick = function(e) {
     let firstObj
     for (let item of items) {
         if (!firstObj) {
             firstObj = queue.add(item)
         } else {
             queue.add(item)
         }
     }

     if (forcePlay) {
         queue.playid(firstObj.songid)
     }
 }
</script>

<button on:click="{handleClick}" type="button">
    {#if forcePlay}
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
        <title>play</title>
        <path d='M112,111V401c0,17.44,17,28.52,31,20.16l247.9-148.37c12.12-7.25,12.12-26.33,0-33.58L143,90.84C129,82.48,112,93.56,112,111Z' style='fill:none;stroke-miterlimit:10;stroke-width:32px'/>
    </svg>
    {:else}
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
        <title>add</title>
        <line x1='256' y1='112' x2='256' y2='400' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/>
        <line x1='400' y1='256' x2='112' y2='256' style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/>
    </svg>
    {/if}
</button>

<style>
 button {
     border: none;
     background-color: inherit;
 }
</style>
