<script context="module">
 export function preload({ params, query }) {
     return this.fetch('https://k7.buron.coffee/api/album/query/added-').then(r => r.json()).then(albums => {
	 return { albums: albums.results };
     });
 }
</script>

<script>
 export let albums;

 import AlbumList from '../components/AlbumList.svelte'

</script>

<svelte:head>
    <title>K7</title>
</svelte:head>

<h2>Albums Récents</h2>

<AlbumList albumList={albums} />
