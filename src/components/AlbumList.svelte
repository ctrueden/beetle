<script>
 export let albumList
 export let step = 10

 import {onMount, beforeUpdate} from 'svelte'

 let length = step
 $: displayedAlbums = albumList.slice(0, length)

 let listElt
 let bottomElt
 
 onMount(() => {

     if (IntersectionObserver) {
         //infinite mapping scroll
         const options = {
             root: undefined,
             rootMargin: '300px',
             threshold: 0.5,
         }
         const observer = new IntersectionObserver(handleIntersection, options)

         function handleIntersection(event) {
             length += step
             displayedAlbums = albumList.slice(0, length)
         }

         observer.observe(bottomElt)
     } else {
         displayedAlbums = albumList
         step = Infinity
     }
 })

</script>

<div class="cards" bind:this="{listElt}">
    {#each displayedAlbums as album}
        <!-- we're using the non-standard `rel=prefetch` attribute to
	     tell Sapper to load the data for the page as soon as
	     the user hovers over the link or taps it, instead of
	     waiting for the 'click' event -->
        <div class="card">
            <a href='album/{album.id}'>
                <img class="poster" src="https://k7.buron.coffee/api/album/{album.id}/art" alt="{album.album} cover" />
            </a>
            <p class="album"><a href="/album/{album.id}">{album.album}</a></p>
            <p class="artist"> <a href="/artist/{album.mb_albumartistid}">{album.albumartist}</a></p>
        </div>
    {/each}
    <div class="bottom" bind:this="{bottomElt}"></div>
</div>

<style>
 .cards {
     display: flex;
     align-items: baseline;
     justify-content: center;
     flex-wrap: wrap;
     max-width: 70em;
     margin: auto;
 }

 .cards .card {
     min-width: 14em;
     min-height: 18em;
     margin: 1em;
     width: 15em;
     text-align: center;
 }

 .poster {
     border: 1px rgba(255,255,255,.3) solid;
     width: 100%;
 }

 .card p {
     margin: 0.1em;
 }


 .album {
     font-weight: bold;
 }
 
 .artist {
     font-size: .9em;
 }
</style>
