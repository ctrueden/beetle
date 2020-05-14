<script context="module">
 export function preload({ params, query }) {
     return this.fetch('https://k7.buron.coffee/api/album/').then(r => r.json()).then(albums => {
	 return { albums: albums.albums };
     });
 }
</script>

<script>
 export let albums;

 import AlbumList from '../../components/AlbumList.svelte'
 import Search from '../../components/Search.svelte'

 let results = undefined
 
 function search(query) {
     return fetch('https://k7.buron.coffee/api/album/query/' + query)
         .then(r => r.json())
         .then(res => {
	     results = res.results
         });
 }

 function handleSearch(event) {
     const query = event.detail
     if (query) {
         return search(query)
     } else {
         results = undefined
     }
 }
</script>

<svelte:head>
    <title>Albums</title>
</svelte:head>

<h1>Albums</h1>
<nav>
    <Search on:search={handleSearch} />
</nav>

{#if results}
    <AlbumList albumList={results} />
{:else}
    <AlbumList albumList={albums} />
{/if}
