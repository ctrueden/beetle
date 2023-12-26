<script>
 import { getContext } from 'svelte'

 export let items;
 export let forcePlay = false
 export let addAfter = false

 const queue = getContext('queue')

 const handleClick = function(e) {
     let firstObj
     let addAt = (addAfter) ? queue.playingIndex + 1 : undefined
     for (let item of items) {
       if (!firstObj)
         firstObj = queue.add(item, addAt)
       else
         queue.add(item, addAt)
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
    {:else if addAfter}
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
      <title>add after</title>
      <line x1="328.44559" y1="290.8912" x2="328.44559" y2="434" style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:20px'/>
      <line x1="400" y1="362.44559" x2="256.8912" y2="362.44559" style='fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:20px'/>
      <path d="m 112.70825,139.35224 v 218.79824 c 0,13.15807 12.82611,21.51768 23.38878,15.21025 L 323.13181,261.41902 c 9.14425,-5.46995 9.14425,-19.86537 0,-25.33533 L 136.09703,124.14199 c -10.56267,-6.30743 -23.38878,2.05217 -23.38878,15.21025 z" style='fill:none;stroke-miterlimit:10;stroke-width:32px'/>
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
